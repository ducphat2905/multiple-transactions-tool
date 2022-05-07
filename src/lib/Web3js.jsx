import Web3 from "web3"

class Web3js {
    provider = null

    web3 = null

    constructor(_provider) {
        this.provider = _provider

        this.web3 = new Web3(_provider)
    }

    getBalance(_address, _tokenAddress) {
        if (_tokenAddress === "ETH" || _tokenAddress === "BNB") {
            return this.web3.eth.getBalance(_address)
        }

        return 0
    }
}

export default Web3js
