export const DATA_TABLES = Object.freeze({
    Collect: "collect-data-table",
    Spread: "spread-data-table",
    Wallet: "wallet-data-table"
})

export const NETWORKS = Object.freeze({
    Ethereum: { id: "ethereum", name: "Ethereum", blockExplorer: "" },
    Bsc: { id: "bsc", name: "Binance Smart Chain", blockExplorer: "" },
    Tron: { id: "tron", name: "Tron Network", blockExplorer: "" },
    Ropsten: { id: "ropsten", name: "Ropsten (Testnet)", blockExplorer: "" }
})

export default { DATA_TABLES, NETWORKS }
