<template>
  <div class="min-h-screen p-8 bg-stonks-pattern overflow-hidden max-h-2 relative">
    <div class="bg-gray-100 h-[4000px] m-[-300px] -mt-[500px] w-[2000px] absolute rotate-45 z-0 right-0">
    </div>

    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 relative z-10">
      <img src="/src/assets/hehe.png" class="w-48 mx-auto mb-16" />
      <small class="text-gray-500">STNKS</small>
      <h1 class="text-2xl font-bold mb-6">Solana STNK Token Account Creator</h1>

      <!-- Wallet Connection -->
      <div v-if="!walletConnected" class="mb-6">
        <button @click="connectWallet" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Connect Wallet
        </button>
      </div>

      <!-- Connected Wallet Info -->
      <div v-else class="space-y-4">
        <div class="p-4 bg-gray-50 rounded">
          <p class="font-medium">Connected Wallet:</p>
          <p class="text-sm text-gray-600 break-all">{{ walletAddress }}</p>
        </div>

        <!-- Token Account Creation -->
        <div class="border-t pt-4">
          <h2 class="text-xl font-semibold mb-4">Create Token Account</h2>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Token Mint Address</label>
            </div>
            <button @click="createTokenAccount"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full" :disabled="!tokenMintAddress">
              Create Token Account
            </button>
          </div>

          <!-- Status Messages -->
          <div v-if="status" class="mt-4 p-4 block break-words" :class="statusClass">
            <small class="text-sm">{{ status }}</small>

            <p v-if="tokenAccountAddress" class="text-sm mt-2 flex items-center gap-2">
              <span>Token Account Address:</span>
              <input type="text" :value="tokenAccountAddress" readonly
                class="flex-1 bg-gray-50 px-3 py-1 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                onClick="this.select()" />
            </p>
            <div v-if="tokenAccountAddress" class="text-sm mt-2">
              <p>Solscan Token Account:</p>
              <a :href="`https://solscan.io/account/${tokenAccountAddress}`" target="_blank"
                class="text-blue-600 hover:text-blue-800 hover:underline">
                {{ `https://solscan.io/account/${tokenAccountAddress}` }}
              </a>
            </div>
          </div>
        </div>

        <button @click="disconnectWallet" class="text-red-600 hover:text-red-700">
          Disconnect Wallet
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js'
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token'

export default {
  name: 'TheWelcome',
  setup() {
    const connection = new Connection('https://solana-api.instantnodes.io/token-82pfsmVUJyEusiKqXL76Bxmp2mFxbobm')
    let recentBlockhash;

    const walletConnected = ref(false)
    const walletAddress = ref('')
    const tokenMintAddress = ref('43VWkd99HjqkhFTZbWBpMpRhjG469nWa7x7uEsgSH7We')
    const status = ref('')
    const tokenAccountAddress = ref('')
    const isError = ref(false)


    const statusClass = computed(() => ({
      'bg-red-100 text-red-700': isError.value,
      'bg-green-100 text-green-700': !isError.value && status.value
    }))

    const connectWallet = async () => {
      recentBlockhash = await connection.getLatestBlockhash('finalized').blockhash;
      try {
        const { solana } = window
        if (!solana?.isPhantom) {
          throw new Error('Please install Phantom wallet!')
        }

        const response = await solana.connect()
        walletAddress.value = response.publicKey.toString()
        walletConnected.value = true
        status.value = ''
        isError.value = false
      } catch (error) {
        console.error('Connection error:', error)
        status.value = `Error: ${error.message}`
        isError.value = true
      }
    }

    const createTokenAccount = async () => {
      try {
        if (!tokenMintAddress.value) {
          throw new Error('Please enter a token mint address')
        }

        status.value = 'Creating token account...'
        isError.value = false
        tokenAccountAddress.value = ''

        const mintPubkey = new PublicKey(tokenMintAddress.value)
        const owner = new PublicKey(walletAddress.value)

        // Calculate ATA
        const ata = await getAssociatedTokenAddress(
          mintPubkey,
          owner
        )

        // Create the transaction
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            owner,
            ata,
            owner,
            mintPubkey
          )
        )

        const { blockhash } = await connection.getLatestBlockhash()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = owner

        const { solana } = window
        const signedTransaction = await solana.signTransaction(transaction)

        const signature = await connection.sendRawTransaction(signedTransaction.serialize())
        const latestBlockHash = await connection.getLatestBlockhash()
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature
        })

        tokenAccountAddress.value = ata.toString()
        status.value = `🥳 Token account created successfully! Txhash: ${signature}`
        isError.value = false
      } catch (error) {
        console.error('Error creating token account:', error)
        // status.value = `Error: ${error.message}`
        status.value = `Error: could not create STNK token account`
        isError.value = true
      }
    }

    const disconnectWallet = async () => {
      try {
        await window.solana.disconnect()
        walletConnected.value = false
        walletAddress.value = ''
        status.value = ''
        tokenAccountAddress.value = ''
        isError.value = false
      } catch (error) {
        console.error('Disconnect error:', error)
        status.value = `Error: could not disconnect`
        // status.value = `Error: ${error.message}`
        isError.value = true
      }
    }

    return {
      walletConnected,
      walletAddress,
      tokenMintAddress,
      status,
      tokenAccountAddress,
      statusClass,
      connectWallet,
      createTokenAccount,
      disconnectWallet
    }
  }
}
</script>
