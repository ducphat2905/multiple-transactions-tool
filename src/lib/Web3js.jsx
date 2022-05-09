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

    async getBalance(_address, _token) {
        try {
            let data = 0
            if (!_token.address && !_token.ABI) {
                data = await this.web3.eth.getBalance(_address)
            } else {
                const tokenContract = new this.web3.eth.Contract(_token.ABI, _token.address)
                data = await tokenContract.methods.balanceOf(_address).call()
            }

            return { data }
        } catch (error) {
            return { error: error.message }
        }
    }
}

export default Web3js
