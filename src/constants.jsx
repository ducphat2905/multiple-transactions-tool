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

export const TOOL_STAGES = Object.freeze({
    DropFile: "0",
    DataTable: "1",
    CollectForm: "2.1",
    SpreadForm: "2.2",
    Logging: "3"
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
        flex: 1.5,
        headerClassName: "bg-light"
    },
    {
        field: "transferringAmount",
        headerName: "Transferring Amount",
        flex: 0.5,
        headerClassName: "bg-light"
    }
]

// Columns for table that displays the result
export const RESULT_COLUMNS = (newColumn) => {
    return [
        {
            field: "address",
            headerName: "Address",
            flex: 1,
            headerClassName: "bg-light"
        },
        {
            field: "privateKey",
            headerName: "Private Key",
            flex: 1.5,
            headerClassName: "bg-light"
        },
        {
            field: "transferringAmount",
            headerName: "Transferring Amount",
            flex: 0.5,
            headerClassName: "bg-light"
        },
        {
            field: newColumn.field,
            headerName: newColumn.header,
            flex: newColumn.flex,
            headerClassName: "bg-light"
        }
    ]
}

export default { TOOL_STAGES, NETWORKS, BSC_PROVIDERS, INPUT_COLUMNS, RESULT_COLUMNS }
