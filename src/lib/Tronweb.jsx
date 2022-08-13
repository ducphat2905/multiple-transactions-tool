import TronWeb from "tronweb"

class Tronweb {
    constructor(_APIKey) {
        try {
            const { HttpProvider } = TronWeb.providers
            const fullNode = new HttpProvider("https://api.shasta.trongrid.io")
            const solidityNode = new HttpProvider("https://api.shasta.trongrid.io")
            const eventServer = new HttpProvider("https://api.shasta.trongrid.io")
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
}

export default Tronweb
