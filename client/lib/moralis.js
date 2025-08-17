import Moralis from 'moralis';

let isInitialized = false;

const EXCHANGE_DATABASE = {
  // === CENTRALIZED EXCHANGES ===
  centralized: {
    // Binance - Multiple wallets and hot/cold storage
    '0x28c6c06298d514db089934071355e5743bf21d60': { name: 'Binance', type: 'cex' },
    '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be': { name: 'Binance', type: 'cex' },
    '0xd551234ae421e3bcba99a0da6d736074f22192ff': { name: 'Binance', type: 'cex' },
    '0x564286362092d8e7936f0549571a803b203aaced': { name: 'Binance', type: 'cex' },
    '0x0681d8db095565fe8a346fa0277bffde9c0edbbf': { name: 'Binance', type: 'cex' },
    '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8': { name: 'Binance', type: 'cex' },
    '0xf977814e90da44bfa03b6295a0616a897441acec': { name: 'Binance', type: 'cex' },
    '0x001866ae5b3de6caa5a51543fd9fb64f524f5478': { name: 'Binance', type: 'cex' },
    
    // Coinbase - Pro and retail wallets
    '0x503828976d22510aad0201ac7ec88293211d23da': { name: 'Coinbase', type: 'cex' },
    '0xddfabcdc4d8ffc6d5beaf154f18b778f892a0740': { name: 'Coinbase', type: 'cex' },
    '0x3cd751e6b0078be393132286c442345e5dc49699': { name: 'Coinbase', type: 'cex' },
    '0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511': { name: 'Coinbase', type: 'cex' },
    '0xeb2629a2734e272bcc07bda959863f316f4bd4cf': { name: 'Coinbase', type: 'cex' },
    '0x02466e547bfdab679fc49e5041ff6af2765ba683': { name: 'Coinbase', type: 'cex' },
    '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43': { name: 'Coinbase', type: 'cex' },
    
    // Kraken
    '0x2910543af39aba0cd09dbb2d50200b3e800a63d2': { name: 'Kraken', type: 'cex' },
    '0x0a869d79a7052c7f1b55a8ebabbea3420f0d1e13': { name: 'Kraken', type: 'cex' },
    '0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0': { name: 'Kraken', type: 'cex' },
    '0x43984d578803891dfa9706bdeee6078d80cfc79e': { name: 'Kraken', type: 'cex' },
    
    // Huobi Global
    '0x5041ed759dd4afc3a72b8192c143f72f4724081a': { name: 'Huobi', type: 'cex' },
    '0xeee28d484628d41a82d01e21d12e2e78d69920da': { name: 'Huobi', type: 'cex' },
    '0x18916e1a2933cb349145a280473a5de8eb6630cb': { name: 'Huobi', type: 'cex' },
    
    // OKX (formerly OKEx)
    '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b': { name: 'OKX', type: 'cex' },
    '0x236f9f97e0e62388479bf9e5ba4889e46b0273c3': { name: 'OKX', type: 'cex' },
    '0xa7efae728d2936e78bda97dc267687568dd593f3': { name: 'OKX', type: 'cex' },
    
    // Bitfinex
    '0x1151314c646ce4e0efd76d1af4760ae66a9fe30f': { name: 'Bitfinex', type: 'cex' },
    '0x7727e5113d1d161373623e5f49fd568b4f543a9e': { name: 'Bitfinex', type: 'cex' },
    '0x4fdd92bd67b45e2b1545f9d43e7677b6d5d45ca0': { name: 'Bitfinex', type: 'cex' },
    
    // Gemini
    '0x5f65f7b609678448494de4c87521cdf6cef1e932': { name: 'Gemini', type: 'cex' },
    '0xd24400ae8bfebb18ca49be86258a3c749cf46853': { name: 'Gemini', type: 'cex' },
    
    // KuCoin
    '0x2b5634c42055806a59e9107ed44d43c426e58258': { name: 'KuCoin', type: 'cex' },
    '0x689c56aef474df92d44a1b70850f808488f9769c': { name: 'KuCoin', type: 'cex' },
    
    // Gate.io
    '0x1c4b70a3968436b9a0a9cf5205c787eb81bb558c': { name: 'Gate.io', type: 'cex' },
    '0xd793281182a0e3e023116004778f45c29fc14f19': { name: 'Gate.io', type: 'cex' },
    
    // Bybit
    '0xf89d7b9c864f589bbf53a82105107622b35eaa40': { name: 'Bybit', type: 'cex' },
    '0x2d8b421da57a10e3b50ae8cd17be33e98abeccd4': { name: 'Bybit', type: 'cex' },
    
    // Crypto.com
    '0x72a53cdbbcc1b9efa39c834a540550e23463aacb': { name: 'Crypto.com', type: 'cex' },
    '0xcffad3200574698b78f32232aa9d63eabd290703': { name: 'Crypto.com', type: 'cex' },
    
    // FTX (Historical)
    '0xc098b2cd3049c81dd91e8eca7c4a5d9b5833e7b0': { name: 'FTX', type: 'cex' },
    '0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2': { name: 'FTX', type: 'cex' },
  },
  
  // === DECENTRALIZED EXCHANGES ===
  decentralized: {
    // Uniswap V2 & V3
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': { name: 'Uniswap', type: 'dex' },
    '0xe592427a0aece92de3edee1f18e0157c05861564': { name: 'Uniswap', type: 'dex' },
    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': { name: 'Uniswap', type: 'dex' },
    '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b': { name: 'Uniswap', type: 'dex' },
    
    // SushiSwap
    '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f': { name: 'SushiSwap', type: 'dex' },
    '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506': { name: 'SushiSwap', type: 'dex' },
    
    // 1inch
    '0x1111111254fb6c44bac0bed2854e76f90643097d': { name: '1inch', type: 'dex' },
    '0x11111112542d85b3ef69ae05771c2dccff4faa26': { name: '1inch', type: 'dex' },
    '0x111111125434b319222cdbf8c261674adb56f3ae': { name: '1inch', type: 'dex' },
    
    // PancakeSwap (Ethereum)
    '0xef0881ec094552b2e128cf945ef17a6752b4ec5d': { name: 'PancakeSwap', type: 'dex' },
    '0x13f4ea83d0bd40e75c8222255bc855a974568dd4': { name: 'PancakeSwap', type: 'dex' },
    
    // Curve Finance
    '0xd51a44d3fae010294c616388b506acda1bfaae46': { name: 'Curve', type: 'dex' },
    '0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5': { name: 'Curve', type: 'dex' },
    '0x8f942c20d02befc377d41445793068908e2250d0': { name: 'Curve', type: 'dex' },
    
    // Balancer
    '0xba12222222228d8ba445958a75a0704d566bf2c8': { name: 'Balancer', type: 'dex' },
    '0x3e66b66fd1d0b02fda6c811da9e0547970db2f21': { name: 'Balancer', type: 'dex' },
    
    // 0x Protocol
    '0xdef1c0ded9bec7f1a1670819833240f027b25eff': { name: '0x Protocol', type: 'dex' },
    '0x61935cbdd02287b511119ddb11aeb42f1593b7ef': { name: '0x Protocol', type: 'dex' },
    
    // Kyber Network
    '0x9aab3f75489902f3a48495025729a0af77d4b11e': { name: 'Kyber', type: 'dex' },
    '0x6131b5fae19ea4f9d964eac0408e4408b66337b5': { name: 'Kyber', type: 'dex' },
    
    // ParaSwap
    '0xdef171fe48cf0115b1d80b88dc8eab59176fee57': { name: 'ParaSwap', type: 'dex' },
    '0x216b4b4ba9f3e719726886d34a177484278bfcae': { name: 'ParaSwap', type: 'dex' },
    
    // dYdX
    '0x1e0447b19bb6ecfdae1e4ae1694b0c3659614e4e': { name: 'dYdX', type: 'dex' },
    
    // CoW Protocol
    '0x9008d19f58aabd9ed0d60971565aa8510560ab41': { name: 'CoW Protocol', type: 'dex' },
  },
};

const WALLET_PATTERNS = [
  'metamask', 'trust wallet', 'ledger', 'trezor', 'coinbase wallet',
  'rainbow', 'argent', 'gnosis safe', 'safe wallet', 'exodus', 'atomic'
];

const CEX_PATTERNS = [
  'binance', 'coinbase', 'kraken', 'huobi', 'okx', 'okex', 'bitfinex', 
  'gemini', 'kucoin', 'gate.io', 'bybit', 'crypto.com', 'ftx', 'bitstamp',
  'bithumb', 'upbit', 'bittrex', 'poloniex', 'hitbtc', 'mexc'
];

const DEX_PATTERNS = [
  'uniswap', 'sushiswap', 'pancakeswap', '1inch', 'curve', 'balancer', 
  'kyber', 'paraswap', 'dydx', '0x', 'matcha', 'cowswap', 'bancor'
];

export async function initMoralis() {
  if (!isInitialized) {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
    isInitialized = true;
  }
}

/**
 * Simple exchange detection: Moralis first, then custom DB, then undetected
 */
function getExchangeInfo(address, moralisLabel) {
  if (!address) {
    return { name: 'Undetected', type: 'unknown' };
  }

  // 1. Check Moralis label first
  if (moralisLabel && moralisLabel.trim()) {
    const cleanLabel = moralisLabel.trim();
    const entityType = detectEntityTypeFromLabel(cleanLabel);
    return {
      name: cleanLabel,
      type: entityType
    };
  }

  // 2. Check custom database
  const lowerAddress = address.toLowerCase();
  
  if (EXCHANGE_DATABASE.centralized[lowerAddress]) {
    return EXCHANGE_DATABASE.centralized[lowerAddress];
  }
  
  if (EXCHANGE_DATABASE.decentralized[lowerAddress]) {
    return EXCHANGE_DATABASE.decentralized[lowerAddress];
  }

  // 3. Not found anywhere
  return { 
    name: 'Undetected', 
    type: 'unknown' 
  };
}

/**
 * Detect entity type from Moralis label
 */
function detectEntityTypeFromLabel(label) {
  const lowerLabel = label.toLowerCase();
  
  // Check for wallet patterns
  for (const pattern of WALLET_PATTERNS) {
    if (lowerLabel.includes(pattern)) {
      return 'wallet';
    }
  }
  
  // Check for CEX patterns
  for (const pattern of CEX_PATTERNS) {
    if (lowerLabel.includes(pattern)) {
      return 'cex';
    }
  }
  
  // Check for DEX patterns  
  for (const pattern of DEX_PATTERNS) {
    if (lowerLabel.includes(pattern)) {
      return 'dex';
    }
  }

  // Additional heuristics
  if (lowerLabel.includes('wallet') || lowerLabel.includes('multisig')) {
    return 'wallet';
  }
  
  if (lowerLabel.includes('exchange') || lowerLabel.includes('trading')) {
    return 'cex';
  }
  
  if (lowerLabel.includes('router') || lowerLabel.includes('swap') || 
      lowerLabel.includes('pool') || lowerLabel.includes('liquidity')) {
    return 'dex';
  }

  return 'unknown';
}

/**
 * Simple transaction categorization
 */
function getTransactionCategory(fromInfo, toInfo) {
  const fromType = fromInfo.type;
  const toType = toInfo.type;
  
  // CEX patterns
  if (fromType === 'cex' && toType !== 'cex') {
    return 'cex_withdrawal';
  }
  if (fromType !== 'cex' && toType === 'cex') {
    return 'cex_deposit';
  }
  if (fromType === 'cex' && toType === 'cex') {
    return 'cex_to_cex';
  }

  // DEX patterns
  if (fromType === 'dex' || toType === 'dex') {
    return 'dex_interaction';
  }

  // Wallet patterns
  if (fromType === 'wallet' || toType === 'wallet') {
    return 'wallet_interaction';
  }

  // Default
  return 'wallet_to_wallet';
}

export async function getWalletTransactions(address, fromDate, toDate) {
  await initMoralis();

  try {
    const requestParams = {
      address,
      chain: '0x1',
      include: 'internal_transactions'
    };

    if (fromDate) requestParams.fromDate = fromDate;
    if (toDate) requestParams.toDate = toDate;

    console.log('Moralis API Request Params:', requestParams);

    const response = await Moralis.EvmApi.transaction.getWalletTransactions(requestParams);
    const data = response.toJSON();
    console.log('Moralis API Response:', data);
    
    const processedTransactions = data.result.map(tx => {
      const fromExchangeInfo = getExchangeInfo(tx.from_address, tx.from_address_label);
      const toExchangeInfo = getExchangeInfo(tx.to_address, tx.to_address_label);
      
      const valueEth = parseFloat(tx.value) / 1e18;
      const gasUsed = tx.receipt_gas_used ? parseInt(tx.receipt_gas_used) : 0;
      const gasPrice = tx.gas_price ? parseFloat(tx.gas_price) / 1e9 : 0;
      const gasCostEth = gasUsed * gasPrice / 1e9;
      
      return {
        ...tx,
        // Simple exchange info
        from_exchange_name: fromExchangeInfo.name,
        from_exchange_type: fromExchangeInfo.type,
        to_exchange_name: toExchangeInfo.name,
        to_exchange_type: toExchangeInfo.type,
        
        // Value calculations
        value_eth: valueEth,
        is_high_value: valueEth > 10,
        
        // Gas calculations
        gas_used: gasUsed,
        gas_price_gwei: gasPrice,
        gas_cost_eth: gasCostEth,
        
        // Additional metadata
        formatted_date: new Date(tx.block_timestamp).toLocaleString(),
        is_successful: tx.receipt_status === '1',
        is_contract_interaction: tx.to_address && tx.input && tx.input !== '0x',
      };
    });

    return {
      transactions: processedTransactions,
      total: data.total || data.result.length,
      cursor: data.cursor || null,
      hasMore: !!data.cursor,
      metadata: {
        chain: 'ethereum',
        from_date: fromDate,
        to_date: toDate,
        processed_at: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Moralis API Error:', {
      message: error.message,
      code: error.code,
      details: error.details
    });
    
    throw new Error(`Moralis API Error: ${error.message}`);
  }
}
