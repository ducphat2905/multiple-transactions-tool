import Network from "./objects/Network"
import EthereumTokens from "./tokens/ethereum"
import BscTokens from "./tokens/bsc"
import TronTokens from "./tokens/tron"
import RopstenTokens from "./tokens/ropsten"

export const FEATURES = Object.freeze({
    GetBalance: "Get Balance",
    Collect: "Collect",
    Spread: "Spread"
})

export const NETWORKS = [
    new Network({
        id: "ethereum",
        name: "Ethereum",
        blockExplorer: "https://etherscan.io/",
        rpcEndpoint: "",
        hasValidProvider: false,
        tokens: EthereumTokens
    }),
    new Network({
        id: "bsc",
        name: "Binance Smart Chain",
        blockExplorer: "https://www.bscscan.com/",
        rpcEndpoint: "",
        hasValidProvider: false,
        tokens: BscTokens
    }),
    new Network({
        id: "tron",
        name: "Tron Network",
        blockExplorer: "https://tronscan.org/#/",
        rpcEndpoint: "",
        hasValidProvider: false,
        tokens: TronTokens
    }),
    new Network({
        id: "ropsten",
        name: "Ropsten (Testnet)",
        blockExplorer: "https://ropsten.etherscan.io/",
        rpcEndpoint: "",
        hasValidProvider: false,
        tokens: RopstenTokens
    })
]

// Rate limit: 10k per 5min
export const BSC_PROVIDERS = Object.freeze({
    Bsc: [
        "https://bsc-dataseed.binance.org/",
        "https://bsc-dataseed1.defibit.io/",
        "https://bsc-dataseed1.ninicoin.io/"
    ],
    BscTestnet: [
        "https://data-seed-prebsc-1-s1.binance.org:8545/",
        "https://data-seed-prebsc-2-s1.binance.org:8545/"
    ]
})

// Table's columns of the input file
export const INPUT_COLUMNS = [
    {
        field: "address",
        headerName: "Address",
        flex: 1,
        headerClassName: "bg-light"
    },
    {
        field: "privateKey",
        headerName: "Private Key",
        flex: 1,
        headerClassName: "bg-light"
    },
    {
        field: "amountToTransfer",
        headerName: "Amount To Transfer",
        flex: 0.3,
        headerClassName: "bg-light"
    }
]

export const getBalanceColumns = (tokenSymbol) => [
    {
        field: "address",
        headerName: "Address",
        flex: 0.7,
        headerClassName: "bg-light"
    },
    {
        field: "status",
        flex: 0.1,
        headerName: "Status",
        headerClassName: "bg-light"
    },
    {
        field: tokenSymbol.toUpperCase(),
        flex: 0.3,
        headerName: tokenSymbol.toUpperCase(),
        headerClassName: "bg-light"
    },
    {
        field: "error",
        flex: 0.7,
        headerName: "Error",
        headerClassName: "bg-light"
    }
]

export const TX_COLUMNS = [
    {
        field: "transactionHash",
        headerName: "Transaction Hash",
        flex: 1,
        headerClassName: "bg-light"
    },
    {
        field: "fromAddress",
        headerName: "From",
        flex: 0.7,
        headerClassName: "bg-light"
    },
    {
        field: "toAddress",
        headerName: "To",
        flex: 0.7,
        headerClassName: "bg-light"
    },
    {
        field: "transferredAmount",
        flex: 0.3,
        headerName: "Transferred Amount",
        headerClassName: "bg-light"
    },
    {
        field: "status",
        flex: 0.1,
        headerName: "Status",
        headerClassName: "bg-light"
    },
    {
        field: "gasFee",
        flex: 0.3,
        headerName: "Gas fee (ETH)",
        headerClassName: "bg-light"
    },
    {
        field: "error",
        flex: 0.7,
        headerName: "Error",
        headerClassName: "bg-light"
    }
]

export default { NETWORKS, BSC_PROVIDERS, INPUT_COLUMNS, getBalanceColumns, TX_COLUMNS }
