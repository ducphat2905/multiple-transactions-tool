import Web3 from "web3"
import axios from "axios"
import NumberHelper from "../helpers/Number"
import Token from "../objects/Token"

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
                        const tokenABIString = response.data.result
                        const tokenInstance = new this.web3.eth.Contract(
                            JSON.parse(tokenABIString),
                            _tokenAddress
                        )

                        // Get decimal
                        const decimal = await tokenInstance.methods.decimals().call()

                        // Get symbol
                        const symbol = await tokenInstance.methods.symbol().call()

                        const token = {
                            address: _tokenAddress,
                            symbol,
                            decimal,
                            ABI: tokenABIString
                        }

                        resolve({ data: token })
                    } else reject(response.data.result)
                })
                .catch((e) => reject(e))
        })
    }

    checkAddressFormat(_address) {
        return this.web3.utils.isAddress(_address)
    }

    async getEthBalance(_address, _parseToEth = false) {
        try {
            const balance = await this.web3.eth.getBalance(_address)
            const data = _parseToEth ? this.web3.utils.fromWei(balance, "ether") : balance

            return { data }
        } catch (error) {
            return { error: error.message }
        }
    }

    async getErc20Balance(_address, _token, _parseToDecimalValue = false) {
        try {
            const token = new Token({ ..._token })
            const contract = new this.web3.eth.Contract(token.ABI, token.address)
            const balance = await contract.methods.balanceOf(_address).call()
            const data = _parseToDecimalValue
                ? NumberHelper.parseToDecimalVal(balance, token.decimal)
                : balance

            return { data }
        } catch (error) {
            return { error: error.message }
        }
    }

    async sendEth({ from, toAddress, amount }) {
        try {
            // Check sufficiency
            const { data: ethBalance, error: ethBalanceError } = await this.getEthBalance(
                from.address
            )

            if (ethBalanceError) return { error: ethBalanceError }

            console.log(ethBalance)

            // Transaction Object

            //
            const gasFee = await this.web3.eth.getGasPrice()
            return { data: null }
        } catch (error) {
            return { error: error.message }
        }
    }
}

export default Web3js
