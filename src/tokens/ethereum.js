import Token from "../objects/Token"

export const ETH = new Token(null, "ETH", 18, null)

export const USDT = new Token("0xdAC17F958D2ee523a2206206994597C13D831ec7", "USDT", 6, "ERC20/USDT")

export default [ETH, USDT]
