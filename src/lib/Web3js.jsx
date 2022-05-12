import Web3 from "web3"
import axios from "axios"
import NumberHelper from "../helpers/Number"

class Web3js {
    web3 = null

    constructor(_provider) {
        try {
            this.web3 = new Web3(_provider)
        } catch (error) {
            this.error = error.message
        }
    }

    getTokenData(_tokenAddress, _networkId) {
        let apiFullUrl = "https://api.etherscan.io/api?module=contract&action=getabi&address="

        if (_networkId === "bsc") {
            apiFullUrl = "https://api.bscscan.com"
        }

        if (_networkId === "ropsten") {
            apiFullUrl =
                "https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address="
        }

        return new Promise((resolve, reject) => {
            axios
                .get(`${apiFullUrl}${_tokenAddress}`)
                .then(async (response) => {
                    if (response.data.status === "1") {
                        const tokenABI = JSON.parse(response.data.result)
                        const tokenInstance = new this.web3.eth.Contract(tokenABI, _tokenAddress)

                        // Get decimal
                        const decimal = await tokenInstance.methods.decimals().call()

                        // Get symbol
                        const symbol = await tokenInstance.methods.symbol().call()

                        const token = {
                            address: _tokenAddress,
                            symbol,
                            decimal,
                            ABI: tokenABI,
                            AbiType: `ERC20/${symbol.toUpperCase()}`
                        }

                        resolve({ data: token })
                    } else reject(response.data.result)
                })
                .catch((e) => reject(e))
        })
    }

    async getBalance(_address, _token) {
        try {
            let balance = 0
            if (!_token.address && !_token.ABI) {
                balance = await this.web3.eth.getBalance(_address)
            } else {
                const tokenContract = new this.web3.eth.Contract(_token.ABI, _token.address)
                balance = await tokenContract.methods.balanceOf(_address).call()
            }

            return { data: NumberHelper.parseToDecimalVal(balance, _token.decimal) }
        } catch (error) {
            return { error: error.message }
        }
    }
}

export default Web3js
