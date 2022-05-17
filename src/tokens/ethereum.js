import Token from "../objects/Token"

export const ETH = new Token({ address: null, symbol: "ETH", decimal: 18 })

export const USDT = new Token({
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    decimal: 6
})

export default [ETH, USDT]
