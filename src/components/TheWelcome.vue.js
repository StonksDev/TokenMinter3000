import { ref, computed } from 'vue';
import { Connection, PublicKey, Transaction, } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
export default (await import('vue')).defineComponent({
    name: 'TheWelcome',
    setup() {
        const connection = new Connection('https://solana-api.instantnodes.io/token-82pfsmVUJyEusiKqXL76Bxmp2mFxbobm');
        let recentBlockhash;
        const walletConnected = ref(false);
        const walletAddress = ref('');
        const tokenMintAddress = ref('43VWkd99HjqkhFTZbWBpMpRhjG469nWa7x7uEsgSH7We');
        const status = ref('');
        const tokenAccountAddress = ref('');
        const isError = ref(false);
        const statusClass = computed(() => ({
            'bg-red-100 text-red-700': isError.value,
            'bg-green-100 text-green-700': !isError.value && status.value
        }));
        const connectWallet = async () => {
            recentBlockhash = await connection.getLatestBlockhash('finalized').blockhash;
            try {
                const { solana } = window;
                if (!solana?.isPhantom) {
                    throw new Error('Please install Phantom wallet!');
                }
                const response = await solana.connect();
                walletAddress.value = response.publicKey.toString();
                walletConnected.value = true;
                status.value = '';
                isError.value = false;
            }
            catch (error) {
                console.error('Connection error:', error);
                status.value = `Error: ${error.message}`;
                isError.value = true;
            }
        };
        const createTokenAccount = async () => {
            try {
                if (!tokenMintAddress.value) {
                    throw new Error('Please enter a token mint address');
                }
                status.value = 'Creating token account...';
                isError.value = false;
                tokenAccountAddress.value = '';
                const mintPubkey = new PublicKey(tokenMintAddress.value);
                const owner = new PublicKey(walletAddress.value);
                // Calculate ATA
                const ata = await getAssociatedTokenAddress(mintPubkey, owner);
                // Create the transaction
                const transaction = new Transaction().add(createAssociatedTokenAccountInstruction(owner, ata, owner, mintPubkey));
                const { blockhash } = await connection.getLatestBlockhash();
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = owner;
                const { solana } = window;
                const signedTransaction = await solana.signTransaction(transaction);
                const signature = await connection.sendRawTransaction(signedTransaction.serialize());
                const latestBlockHash = await connection.getLatestBlockhash();
                await connection.confirmTransaction({
                    blockhash: latestBlockHash.blockhash,
                    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    signature: signature
                });
                tokenAccountAddress.value = ata.toString();
                status.value = `🥳 Token account created successfully! Txhash: ${signature}`;
                isError.value = false;
            }
            catch (error) {
                console.error('Error creating token account:', error);
                // status.value = `Error: ${error.message}`
                status.value = `Error: could not create STNK token account`;
                isError.value = true;
            }
        };
        const disconnectWallet = async () => {
            try {
                await window.solana.disconnect();
                walletConnected.value = false;
                walletAddress.value = '';
                status.value = '';
                tokenAccountAddress.value = '';
                isError.value = false;
            }
            catch (error) {
                console.error('Disconnect error:', error);
                status.value = `Error: could not disconnect`;
                // status.value = `Error: ${error.message}`
                isError.value = true;
            }
        };
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
        };
    }
});
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("min-h-screen p-8 bg-stonks-pattern overflow-hidden max-h-2 relative") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("bg-gray-100 h-[4000px] m-[-300px] -mt-[500px] w-[2000px] absolute rotate-45 z-0 right-0") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("max-w-2xl mx-auto bg-white rounded-lg shadow p-6 relative z-10") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ("/src/assets/hehe.png"), ...{ class: ("w-48 mx-auto mb-16") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({ ...{ class: ("text-gray-500") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({ ...{ class: ("text-2xl font-bold mb-6") }, });
    if (!__VLS_ctx.walletConnected) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("mb-6") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.connectWallet) }, ...{ class: ("bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700") }, });
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("space-y-4") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("p-4 bg-gray-50 rounded") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("font-medium") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("text-sm text-gray-600 break-all") }, });
        (__VLS_ctx.walletAddress);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("border-t pt-4") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({ ...{ class: ("text-xl font-semibold mb-4") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("space-y-3") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("block text-sm font-medium mb-1") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.createTokenAccount) }, ...{ class: ("bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full") }, disabled: ((!__VLS_ctx.tokenMintAddress)), });
        if (__VLS_ctx.status) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("mt-4 p-4 block break-words") }, ...{ class: ((__VLS_ctx.statusClass)) }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({ ...{ class: ("text-sm") }, });
            (__VLS_ctx.status);
            if (__VLS_ctx.tokenAccountAddress) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("text-sm mt-2 flex items-center gap-2") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ type: ("text"), value: ((__VLS_ctx.tokenAccountAddress)), readonly: (true), ...{ class: ("flex-1 bg-gray-50 px-3 py-1 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer") }, onClick: ("this.select()"), });
            }
            if (__VLS_ctx.tokenAccountAddress) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("text-sm mt-2") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
                __VLS_elementAsFunction(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({ href: ((`https://solscan.io/account/${__VLS_ctx.tokenAccountAddress}`)), target: ("_blank"), ...{ class: ("text-blue-600 hover:text-blue-800 hover:underline") }, });
                (`https://solscan.io/account/${__VLS_ctx.tokenAccountAddress}`);
            }
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.disconnectWallet) }, ...{ class: ("text-red-600 hover:text-red-700") }, });
    }
    __VLS_styleScopedClasses['min-h-screen'];
    __VLS_styleScopedClasses['p-8'];
    __VLS_styleScopedClasses['bg-stonks-pattern'];
    __VLS_styleScopedClasses['overflow-hidden'];
    __VLS_styleScopedClasses['max-h-2'];
    __VLS_styleScopedClasses['relative'];
    __VLS_styleScopedClasses['bg-gray-100'];
    __VLS_styleScopedClasses['h-[4000px]'];
    __VLS_styleScopedClasses['m-[-300px]'];
    __VLS_styleScopedClasses['-mt-[500px]'];
    __VLS_styleScopedClasses['w-[2000px]'];
    __VLS_styleScopedClasses['absolute'];
    __VLS_styleScopedClasses['rotate-45'];
    __VLS_styleScopedClasses['z-0'];
    __VLS_styleScopedClasses['right-0'];
    __VLS_styleScopedClasses['max-w-2xl'];
    __VLS_styleScopedClasses['mx-auto'];
    __VLS_styleScopedClasses['bg-white'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['shadow'];
    __VLS_styleScopedClasses['p-6'];
    __VLS_styleScopedClasses['relative'];
    __VLS_styleScopedClasses['z-10'];
    __VLS_styleScopedClasses['w-48'];
    __VLS_styleScopedClasses['mx-auto'];
    __VLS_styleScopedClasses['mb-16'];
    __VLS_styleScopedClasses['text-gray-500'];
    __VLS_styleScopedClasses['text-2xl'];
    __VLS_styleScopedClasses['font-bold'];
    __VLS_styleScopedClasses['mb-6'];
    __VLS_styleScopedClasses['mb-6'];
    __VLS_styleScopedClasses['bg-purple-600'];
    __VLS_styleScopedClasses['text-white'];
    __VLS_styleScopedClasses['px-4'];
    __VLS_styleScopedClasses['py-2'];
    __VLS_styleScopedClasses['rounded'];
    __VLS_styleScopedClasses['hover:bg-purple-700'];
    __VLS_styleScopedClasses['space-y-4'];
    __VLS_styleScopedClasses['p-4'];
    __VLS_styleScopedClasses['bg-gray-50'];
    __VLS_styleScopedClasses['rounded'];
    __VLS_styleScopedClasses['font-medium'];
    __VLS_styleScopedClasses['text-sm'];
    __VLS_styleScopedClasses['text-gray-600'];
    __VLS_styleScopedClasses['break-all'];
    __VLS_styleScopedClasses['border-t'];
    __VLS_styleScopedClasses['pt-4'];
    __VLS_styleScopedClasses['text-xl'];
    __VLS_styleScopedClasses['font-semibold'];
    __VLS_styleScopedClasses['mb-4'];
    __VLS_styleScopedClasses['space-y-3'];
    __VLS_styleScopedClasses['block'];
    __VLS_styleScopedClasses['text-sm'];
    __VLS_styleScopedClasses['font-medium'];
    __VLS_styleScopedClasses['mb-1'];
    __VLS_styleScopedClasses['bg-green-600'];
    __VLS_styleScopedClasses['text-white'];
    __VLS_styleScopedClasses['px-4'];
    __VLS_styleScopedClasses['py-2'];
    __VLS_styleScopedClasses['rounded'];
    __VLS_styleScopedClasses['hover:bg-green-700'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['mt-4'];
    __VLS_styleScopedClasses['p-4'];
    __VLS_styleScopedClasses['block'];
    __VLS_styleScopedClasses['break-words'];
    __VLS_styleScopedClasses['text-sm'];
    __VLS_styleScopedClasses['text-sm'];
    __VLS_styleScopedClasses['mt-2'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['items-center'];
    __VLS_styleScopedClasses['gap-2'];
    __VLS_styleScopedClasses['flex-1'];
    __VLS_styleScopedClasses['bg-gray-50'];
    __VLS_styleScopedClasses['px-3'];
    __VLS_styleScopedClasses['py-1'];
    __VLS_styleScopedClasses['rounded'];
    __VLS_styleScopedClasses['border'];
    __VLS_styleScopedClasses['border-gray-200'];
    __VLS_styleScopedClasses['focus:outline-none'];
    __VLS_styleScopedClasses['focus:ring-1'];
    __VLS_styleScopedClasses['focus:ring-purple-500'];
    __VLS_styleScopedClasses['cursor-pointer'];
    __VLS_styleScopedClasses['text-sm'];
    __VLS_styleScopedClasses['mt-2'];
    __VLS_styleScopedClasses['text-blue-600'];
    __VLS_styleScopedClasses['hover:text-blue-800'];
    __VLS_styleScopedClasses['hover:underline'];
    __VLS_styleScopedClasses['text-red-600'];
    __VLS_styleScopedClasses['hover:text-red-700'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    return {
        slots: __VLS_slots,
        refs: $refs,
        attrs: {},
    };
}
;
let __VLS_self;
//# sourceMappingURL=TheWelcome.vue.js.map