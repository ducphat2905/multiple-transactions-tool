import Web3 from "web3"

class Web3js {
    web3 = null

    constructor(_provider) {
        try {
            this.web3 = new Web3(_provider)
        } catch (error) {
            this.error = error.message
        }
    }

    async getBalance(_address, _tokenAddress) {
        try {
            let data = 0
            if (!_tokenAddress || _tokenAddress === "ETH" || _tokenAddress === "BNB") {
                data = await this.web3.eth.getBalance(_address)
            }

            return { data }
        } catch (error) {
            return { error: error.message }
        }
    }
}

export default Web3js
