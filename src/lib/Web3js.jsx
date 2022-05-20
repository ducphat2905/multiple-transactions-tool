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

    getWalletByPk(_privateKey) {
        try {
            const wallet = this.web3.eth.accounts.privateKeyToAccount(_privateKey)

            return { data: { address: wallet.address, privateKey: wallet.privateKey } }
        } catch (error) {
            return { error: error.message }
        }
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
            const contract = new this.web3.eth.Contract(_token.ABI, _token.address)
            const balance = await contract.methods.balanceOf(_address).call()
            const data = _parseToDecimalValue
                ? NumberHelper.parseToDecimalVal(balance, _token.decimal)
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
                const contract = new this.web3.eth.Contract(token.ABI, token.address)
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

            return {
                data: {
                    gasFee,
                    estimateGas,
                    gasPrice
                }
            }
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

            const weiToTransfer = this.web3.utils.toWei(_amountOfEth, "ether")
            if (parseInt(ethBalance, 10) < parseInt(weiToTransfer, 10))
                return {
                    error: `Insufficient balance. Require: ${_amountOfEth} || Balance: ${this.web3.utils.fromWei(
                        ethBalance,
                        "ether"
                    )}`
                }

            const { data: transferGas, error: transferGasError } = await this.getTransferGasFee({
                fromAddress: _fromAddress,
                toAddress: _toAddress,
                amountOfEth: _amountOfEth
            })

            if (transferGasError) return { error: transferGasError }

            const totalWeiToTransfer =
                parseInt(weiToTransfer, 10) + parseInt(transferGas.gasFee, 10)
            if (parseInt(ethBalance, 10) < totalWeiToTransfer)
                return {
                    error: `Insufficient balance. Require: ${this.web3.utils.fromWei(
                        transferGas.gasFee,
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

    async sendEth({ from, toAddress, amountOfEth, nonce }) {
        try {
            if (amountOfEth === "0") return { error: "Cannot proceed to transfer 0 ETH." }

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

            if (nonce) {
                const numOfTx = await this.web3.eth.getTransactionCount(from.address, "pending")
                transactionObject.nonce = this.web3.utils.toHex(parseInt(numOfTx, 10) + nonce)
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

    async checkBalanceErc20(_fromAddress, _toAddress, _amountOfToken, _token) {
        try {
            const { data: erc20Balance, error: erc20BalanceError } = await this.getErc20Balance(
                _fromAddress,
                new Token({ ..._token })
            )

            if (erc20BalanceError) return { error: erc20BalanceError }

            if (parseInt(erc20Balance, 10) === 0) return { error: `Wallet has 0 ${_token.symbol}.` }

            if (_amountOfToken === "0")
                return { error: `Cannot proceed to transfer 0 ${_token.symbol}.` }

            const tokenToTransfer = NumberHelper.parseFromDecimalVal(_amountOfToken, _token.decimal)
            if (parseInt(erc20Balance, 10) < tokenToTransfer)
                return {
                    error: `Insufficient balance. Require: ${_amountOfToken} || Balance: ${NumberHelper.parseToDecimalVal(
                        erc20Balance,
                        _token.decimal
                    )}`
                }

            // Check sufficiency
            const { error: ethBalanceError } = await this.checkBalanceEth(
                _fromAddress,
                _toAddress,
                "0"
            )

            if (ethBalanceError) return { error: ethBalanceError }

            return {
                data: true
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async getTransferData(toAddress, amountOfToken, token) {
        try {
            const contract = new this.web3.eth.Contract(token.ABI, token.address)
            const tokenToTransfer = NumberHelper.parseFromDecimalVal(amountOfToken, token.decimal)
            const transferData = await contract.methods
                .transfer(toAddress, tokenToTransfer.toString())
                .encodeABI()

            return { data: transferData }
        } catch (error) {
            return { error: error.message }
        }
    }

    async sendErc20({ from, toAddress, amountOfToken, token, nonce }) {
        try {
            if (amountOfToken === "0") return { error: "Cannot proceed to transfer 0 ETH." }

            // Check sufficiency
            const { error: erc20BalanceError } = await this.checkBalanceErc20(
                from.address,
                toAddress,
                amountOfToken,
                token
            )

            if (erc20BalanceError) return { error: erc20BalanceError }

            const { data: transferGas, error: transferGasError } = await this.getTransferGasFee({
                fromAddress: from.address,
                toAddress,
                amountOfToken,
                token: new Token({ ...token })
            })

            if (transferGasError) return { error: transferGasError }

            const { data: transferData, error: transferDataErr } = await this.getTransferData(
                toAddress,
                amountOfToken,
                new Token({ ...token })
            )

            if (transferDataErr) return { error: transferDataErr }

            // Transaction Object
            const transactionObject = {
                from: from.address,
                to: token.address,
                value: "0",
                gas: transferGas.estimateGas,
                gasPrice: transferGas.gasPrice,
                data: transferData
            }

            if (nonce) {
                const numOfTx = await this.web3.eth.getTransactionCount(from.address, "pending")
                transactionObject.nonce = this.web3.utils.toHex(parseInt(numOfTx, 10) + nonce)
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
