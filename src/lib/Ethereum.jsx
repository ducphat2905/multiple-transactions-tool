import Web3 from "web3"

class Ethereum {
    constructor(_provider) {
        this.provider = _provider
        if (!this.web3) {
            try {
                this.web3 = new Web3(_provider)
            } catch (error) {
                this.error = error
            }
        }
    }

    async getBalance(_address) {
        const balance = await this.web3.eth.getBalance(_address)
        return balance
    }
}

export default Ethereum
