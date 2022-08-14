import TronWeb from "tronweb"
import NumberHelper from "../helpers/Number"

// 1 TRX = 1_000_000 SUN
// Rate limit: 10k per 5min
class Tronweb {
    constructor(_provider, _APIKey) {
        try {
            const { HttpProvider } = TronWeb.providers
            const fullNode = new HttpProvider(_provider)
            const solidityNode = new HttpProvider(_provider)
            const eventServer = new HttpProvider(_provider)
            const tronweb = new TronWeb(fullNode, solidityNode, eventServer)

            // Required to set owner address
            tronweb.setAddress("TVJ6njG5EpUwJt4N9xjTrqU5za78cgadS2")

            this.API_KEY = _APIKey

            this.tronweb = tronweb
            this.error = null
        } catch (error) {
            this.error = error.message
            this.tronweb = null
        }
    }

    async getTRC20Data(_tokenAddress) {
        try {
            const tokenInstance = await this.tronweb.contract().at(_tokenAddress)

            // Get decimal
            const decimal = await tokenInstance.decimals().call()

            // Get symbol
            const symbol = await tokenInstance.symbol().call()

            const token = {
                address: _tokenAddress,
                symbol,
                decimal
            }

            return { data: token }
        } catch (error) {
            return { error }
        }
    }

    async getTrxBalance(_address, _parseToTrx = false) {
        try {
            const balance = await this.tronweb.trx.getBalance(_address)
            const data = _parseToTrx ? this.tronweb.fromSun(balance) : balance

            return { data }
        } catch (error) {
            return { error: error.message }
        }
    }

    async getTrc20Balance(_address, _token, _parseToDecimalValue = false) {
        try {
            const instance = await this.tronweb.contract().at(_token.address)
            const balance = await instance.balanceOf(_address.toString()).call()
            const data = _parseToDecimalValue
                ? NumberHelper.parseToDecimalVal(balance, _token.decimal)
                : balance

            return { data }
        } catch (error) {
            return { error: error.message }
        }
    }
}

export default Tronweb
