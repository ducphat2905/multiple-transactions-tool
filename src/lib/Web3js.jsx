import Web3 from "web3"

class Web3js {
    provider = null

    web3 = null
    
    constructor(_provider) {
        this.provider = _provider

        this.web3 = new Web3(_provider)
    }

    async getBalance(_address) {
        const balance = await this.web3.eth.getBalance(_address)
        this.balance = balance
        return this
    }
}

export default Web3js
