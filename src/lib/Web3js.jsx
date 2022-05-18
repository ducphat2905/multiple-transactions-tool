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

    async getTransferGasFee(
        { fromAddress, toAddress, amountOfEth, amountOfToken, token },
        _parseToEth = false
    ) {
        try {
            let gasFee = 0
            const gasPrice = await this.web3.eth.getGasPrice()
            let estimateGas = amountOfEth
                ? await this.web3.eth.estimateGas({
                      from: fromAddress,
                      to: toAddress,
                      value: this.web3.utils.toWei(amountOfEth, "ether")
                  })
                : "0"

            if (token) {
                const tokenObject = new Token({ ...token })
                const contract = new this.web3.eth.Contract(tokenObject.ABI, tokenObject.address)
                const amountToTransfer = NumberHelper.parseFromDecimalVal(
                    parseFloat(amountOfToken),
                    token.decimal
                )
                estimateGas = await contract.methods
                    .transfer(toAddress, amountToTransfer.toString())
                    .estimateGas({
                        from: fromAddress,
                        value: "0"
                    })
            }

            gasFee = parseInt(gasPrice, 10) * parseInt(estimateGas, 10)
            gasFee = _parseToEth ? this.web3.utils.fromWei(gasFee.toString(), "ether") : gasFee

            return { data: gasFee }
        } catch (error) {
            return { error: error.message }
        }
    }

    async checkBalanceEth(_fromAddress, _toAddress, _amountOfEth) {
        try {
            const { data: ethBalance, error: ethBalanceError } = await this.getEthBalance(
                _fromAddress
            )

            if (ethBalanceError) return { error: ethBalanceError }

            if (parseInt(ethBalance, 10) === 0) return { error: "Wallet has 0 ETH." }

            if (_amountOfEth === "0") return { error: "Cannot proceed to transfer 0 ETH." }

            const weiToTransfer = this.web3.utils.toWei(_amountOfEth, "ether")
            if (parseInt(ethBalance, 10) < parseInt(weiToTransfer, 10))
                return {
                    error: `Insufficient balance. Require: ${_amountOfEth} || Balance: ${this.web3.utils.fromWei(
                        ethBalance,
                        "ether"
                    )}`
                }

            const { data: gasFee, error: gasFeeError } = await this.getTransferGasFee({
                fromAddress: _fromAddress,
                toAddress: _toAddress,
                amountOfEth: _amountOfEth
            })

            if (gasFeeError) return { error: gasFeeError }

            const totalWeiToTransfer = parseInt(weiToTransfer, 10) + parseInt(gasFee, 10)
            if (parseInt(ethBalance, 10) < totalWeiToTransfer)
                return {
                    error: `Insufficient balance. Require: ${this.web3.utils.fromWei(
                        gasFee,
                        "ether"
                    )} (gas) + ${_amountOfEth} || Balance: ${this.web3.utils.fromWei(
                        ethBalance,
                        "ether"
                    )}`
                }

            return {
                data: true
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async sendEth({ from, toAddress, amountOfEth }) {
        try {
            // Check sufficiency
            const { error: ethBalanceError } = await this.checkBalanceEth(
                from.address,
                toAddress,
                amountOfEth
            )

            if (ethBalanceError) return { error: ethBalanceError }

            // Transaction Object
            const transactionObject = {
                from: from.address,
                to: toAddress,
                value: this.web3.utils.toWei(amountOfEth, "ether"),
                gas: 21000,
                data: "0x"
            }

            // Sign
            const signedTransaction = await this.web3.eth.accounts.signTransaction(
                transactionObject,
                from.privateKey
            )

            // Send
            const receipt = await this.web3.eth.sendSignedTransaction(
                signedTransaction.rawTransaction
            )

            return { data: receipt }
        } catch (error) {
            return { error: error.message }
        }
    }
}

export default Web3js
