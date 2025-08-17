export class WalletAnalysisAPI {
  constructor() {
    this.requestQueue = new Map();
  }

  async analyzeAddress(address, range = '30days', options = {}) {
    const cacheKey = `${address}_${JSON.stringify(range)}`;
    
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    const queryParams = typeof range === 'string'
      ? { timeRange: range, ...options }
      : { ...range, ...options };

    const params = new URLSearchParams(queryParams);

    const requestPromise = fetch(
      `/api/forensics/${address}?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(async (response) => {
        const data = await response.json();
        console.log('API Response api.js:', data);
        return data;
      })
      .catch((error) => {
        console.error('API Error:', error);
        return { transactions: [] };
      });

    this.requestQueue.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      setTimeout(() => {
        this.requestQueue.delete(cacheKey);
      }, 1000);
    }
  }

  categorizeAddress(transactions) {
    if (!transactions?.length) return 'wallet';

    const cexExchanges = [
      'Binance', 'Coinbase', 'Kraken', 'Huobi', 'OKX', 'Bitfinex', 'Gemini',
      'KuCoin', 'Gate.io', 'Bybit', 'Crypto.com', 'FTX', 'Bitstamp', 'Bithumb',
      'Upbit', 'Bittrex', 'Poloniex', 'HitBTC', 'MEXC'
    ];
    const dexExchanges = [
      'Uniswap', 'SushiSwap', '1inch', 'PancakeSwap', 'Curve', 'Balancer',
      'Kyber', 'ParaSwap', 'dYdX', '0x', 'Matcha', 'CowSwap', 'Bancor'
    ];

    const cexCount = transactions.filter(tx => 
      cexExchanges.includes(tx.from_exchange_name) || cexExchanges.includes(tx.to_exchange_name)
    ).length;
    
    const dexCount = transactions.filter(tx => 
      dexExchanges.includes(tx.from_exchange_name) || dexExchanges.includes(tx.to_exchange_name)
    ).length;
    
    const contractCount = transactions.filter(tx => 
      tx.is_contract_interaction
    ).length;

    if (contractCount > transactions.length * 0.6) return 'contract';
    if (cexCount > transactions.length * 0.4) return 'exchange';
    if (dexCount > transactions.length * 0.3) return 'defi';
    
    return 'wallet';
  }

  generateActivityStats(transactions) {
    if (!transactions?.length) {
      return {
        totalTransactions: 0,
        totalValue: 0,
        firstActivity: null,
        lastActivity: null,
        averageValue: 0,
        maxValue: 0,
        totalGasSpent: 0,
        activeDays: 0,
        incomingTxs: 0,
        outgoingTxs: 0,
      };
    }

    const values = transactions.map(tx => parseFloat(tx.value_eth) || 0);
    const gasSpent = transactions.reduce((sum, tx) => 
      sum + (parseFloat(tx.gas_cost_eth) || 0), 0
    );

    const dates = transactions
      .map(tx => new Date(tx.block_timestamp))
      .sort((a, b) => a - b);

    const uniqueDays = new Set(
      dates.map(date => date.toDateString())
    ).size;

    const walletAddress = transactions[0]?.from_address;
    const incomingTxs = transactions.filter(tx => 
      tx.to_address?.toLowerCase() === walletAddress?.toLowerCase()
    ).length;

    return {
      totalTransactions: transactions.length,
      totalValue: values.reduce((sum, val) => sum + val, 0),
      firstActivity: dates[0]?.toISOString(),
      lastActivity: dates[dates.length - 1]?.toISOString(),
      averageValue: values.reduce((sum, val) => sum + val, 0) / values.length,
      maxValue: Math.max(...values),
      totalGasSpent: gasSpent,
      activeDays: uniqueDays,
      incomingTxs,
      outgoingTxs: transactions.length - incomingTxs
    };
  }

  formatTransactionForUI(tx, walletAddress) {
    const isIncoming = tx.to_address?.toLowerCase() === walletAddress?.toLowerCase();

    const getEntityType = (name) => {
      if (!name || name.includes('...') || name === 'Unknown') return 'self-custody wallet';
      const cexList = ['Binance', 'Coinbase', 'Kraken', 'Huobi', 'OKX', 'Bitfinex', 'Gemini', 'KuCoin', 'Gate.io', 'Bybit', 'Crypto.com', 'FTX', 'Bitstamp', 'Bithumb', 'Upbit', 'Bittrex', 'Poloniex', 'HitBTC', 'MEXC'];
      const dexList = ['Uniswap', 'SushiSwap', '1inch', 'PancakeSwap', 'Curve', 'Balancer', 'Kyber', 'ParaSwap', 'dYdX', '0x', 'Matcha', 'CowSwap', 'Bancor'];
      if (cexList.some(cex => name.includes(cex))) return 'cex';
      if (dexList.some(dex => name.includes(dex))) return 'dex';
      return 'self-custody wallet';
    };
    
    return {
      id: tx.hash || `tx-${Math.random().toString(36).slice(2)}`,
      type: isIncoming ? 'in' : 'out',
      amount: tx.value_eth ? Number(tx.value_eth).toFixed(4) : '0',
      currency: tx.currency || 'ETH',
      timestamp: tx.block_timestamp
        ? new Date(tx.block_timestamp).toLocaleString()
        : 'N/A',
      status: tx.is_successful ? 'confirmed' : 'failed',
      gasUsed: tx.gas_used ? Number(tx.gas_used).toLocaleString() : '0',
      gasPrice: tx.gas_price_gwei ? Number(tx.gas_price_gwei).toFixed(1) : '0',
      blockNumber: tx.block_number ? String(tx.block_number) : '0',
      category: tx.transaction_category || 'transfer',
      from_label: tx.from_exchange_name || (tx.from_address
        ? `${tx.from_address.slice(0, 8)}...${tx.from_address.slice(-6)}`
        : 'Unknown'),
      to_label: tx.to_exchange_name || (tx.to_address
        ? `${tx.to_address.slice(0, 8)}...${tx.to_address.slice(-6)}`
        : 'Unknown'),
      from_type: getEntityType(tx.from_exchange_name),
      to_type: getEntityType(tx.to_exchange_name),
      confidence_level: tx.confidence_score || 'none',
    };
  }
}

export const walletAPI = new WalletAnalysisAPI();