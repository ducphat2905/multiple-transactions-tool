import Network from "./objects/Network"

export const NETWORKS = [
    new Network({
        id: "ethereum",
        name: "Ethereum",
        blockExplorer: "https://etherscan.io/",
        rpcEndpoint: ""
    }),
    new Network({
        id: "bsc",
        name: "Binance Smart Chain",
        blockExplorer: "https://ropsten.etherscan.io/",
        rpcEndpoint: ""
    }),
    new Network({
        id: "tron",
        name: "Tron Network",
        blockExplorer: "https://tronscan.org/#/",
        rpcEndpoint: ""
    }),
    new Network({
        id: "ropsten",
        name: "Ropsten (Testnet)",
        blockExplorer: "https://www.bscscan.com/",
        rpcEndpoint: ""
    })
]

// Rate limit: 10k per 5min
export const RPC_ENDPOINTS = Object.freeze({
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

export default { NETWORKS, RPC_ENDPOINTS }
