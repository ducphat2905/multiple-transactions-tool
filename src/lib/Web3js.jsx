import Web3 from "web3"
import axios from "axios"
import NumberHelper from "../helpers/Number"

class Web3js {
    ONE_GWEI = 1_000_000_000

    priorityFee = 3

    web3 = null

    constructor(_provider) {
        try {
            this.web3 = new Web3(_provider)
            // this.web3.eth.transactionPollingTimeout = 300
            this.gasPriceRate = 1.1
        } catch (error) {
            this.error = error.message
        }
    }

    async getERC20Data(_tokenAddress, _networkId) {
        let apiFullUrl = ""

        switch (_networkId) {
            case "ethereum": {
                apiFullUrl = "https://api.etherscan.io/api?module=contract&action=getabi&address="
                break
            }
            case "ropsten": {
                apiFullUrl =
                    "https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address="
                break
            }
            case "bsc": {
                apiFullUrl = "https://api.bscscan.com/api?module=contract&action=getabi&address="
                break
            }
            case "bsc-testnet": {
                apiFullUrl =
                    "https://api-testnet.bscscan.com/api?module=contract&action=getabi&address="
                break
            }
            default:
                apiFullUrl = "https://"
        }

        try {
            const response = await axios.get(`${apiFullUrl}${_tokenAddress}`)

            if (response.status !== 200 || response.data.status !== "1") {
                return { error: `Invalid contract address provided` }
            }

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

            return { data: token }
        } catch (error) {
            return { error: error.message }
        }
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

    async getAmountToTransfer(_token, _fromAddress, _amountToTransfer) {
        let amountToTransfer = parseFloat(_amountToTransfer)

        // Already a number
        if (!Number.isNaN(amountToTransfer)) return { data: _amountToTransfer }

        // The string amount is not "all"
        if (_amountToTransfer.toLowerCase() !== "all")
            return { error: `Cannot get the amount with ${_amountToTransfer}` }

        // Transfer all the current balance when the amount is "all"
        try {
            if (_token) {
                const { data: erc20Balance, error: erc20BalanceError } = await this.getErc20Balance(
                    _fromAddress,
                    _token,
                    true
                )

                if (erc20BalanceError) return { error: erc20BalanceError }

                amountToTransfer = erc20Balance
            } else {
                const { data: ethBalance, error: ethBalanceError } = await this.getEthBalance(
                    _fromAddress,
                    true
                )

                if (ethBalanceError) return { error: ethBalanceError }

                amountToTransfer = ethBalance
            }

            return { data: amountToTransfer }
        } catch (error) {
            return { error: error.message }
        }
    }

    async getTransferGasFee({ fromAddress, toAddress, amountOfToken, token }, _parseToEth = false) {
        try {
            let gasFee = 0
            const gasPrice = await this.web3.eth.getGasPrice()
            // Increase gas fee in case the gasPrice raises
            // gasPrice = Math.floor(parseInt(gasPrice, 10) * this.gasPriceRate)
            let estimateGas = "21000" // default gas for transferring between wallets

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

            gasFee = gasPrice * parseInt(estimateGas, 10)
            gasFee = _parseToEth
                ? this.web3.utils.fromWei(gasFee.toString(), "ether")
                : gasFee.toString()

            return {
                data: {
                    gasFee,
                    estimateGas: estimateGas.toString(),
                    gasPrice: gasPrice.toString()
                }
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async canPayGas({ from, toAddress, amountOfToken, token }) {
        try {
            const weiBalance = parseInt(from.weiBalance, 10)
            const weiToTransfer = parseInt(from.weiToTransfer, 10)
            const { data: transferGas, error: transferGasError } = await this.getTransferGasFee({
                fromAddress: from.address,
                toAddress,
                amountOfToken,
                token
            })
            if (transferGasError) return { error: transferGasError }

            const gasFee = parseInt(transferGas.gasFee, 10)

            if (weiBalance < gasFee) {
                return {
                    error: `
                Insufficient ETH for gas fee.
                Require: [${this.web3.utils.fromWei(gasFee.toString(), "ether")}]
                ~ Balance: [${this.web3.utils.fromWei(weiBalance.toString(), "ether")}]`
                }
            }

            if (weiBalance === gasFee) {
                return {
                    error: `
                The balance of ETH is only enough for gas fee.
                Gas fee: [${this.web3.utils.fromWei(gasFee.toString(), "ether")}]
                ~ Balance: [${this.web3.utils.fromWei(weiBalance.toString(), "ether")}]`
                }
            }

            if (weiToTransfer !== weiBalance && weiBalance < weiToTransfer + gasFee) {
                const totalOfWei = weiToTransfer + gasFee
                return {
                    error: `
                    Insufficient ETH.
                    Require: [${this.web3.utils.fromWei(totalOfWei.toString(), "ether")}]
                    ~ Balance: [${this.web3.utils.fromWei(weiBalance.toString(), "ether")}]`
                }
            }

            return { data: transferGas }
        } catch (error) {
            return { error: error.message }
        }
    }

    async checkEthBeforeTransfer({ fromAddress, ethToTransfer }) {
        try {
            const { data: weiBalance, error: weiBalanceError } = await this.getEthBalance(
                fromAddress
            )
            if (weiBalanceError) return { error: weiBalanceError }

            if (weiBalance === "0") return { error: "Wallet has 0 ETH." }

            const weiToTransfer = this.web3.utils.toWei(ethToTransfer, "ether")
            if (parseInt(weiBalance, 10) < parseInt(weiToTransfer, 10))
                return {
                    error: `Insufficient ETH. 
                    Require: [${ethToTransfer}] 
                    ~ Balance: [${this.web3.utils.fromWei(weiBalance, "ether")}]`
                }

            return {
                weiToTransfer,
                weiBalance
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async sendEth({ from, toAddress, amountOfEth, nonce }, _includeGasFee = true) {
        try {
            // Check can pay for gas or not
            const { data: transferGas, error: cannotPayGas } = await this.canPayGas({
                from,
                toAddress
            })

            if (cannotPayGas) return { error: cannotPayGas }

            const amountOfWei = parseInt(this.web3.utils.toWei(amountOfEth, "ether"), 10)
            const { gasPrice, estimateGas } = transferGas

            const newGasPrice = Math.floor(parseInt(gasPrice, 10) * this.gasPriceRate)
            // const maxPriorityFeePerGas = this.ONE_GWEI * this.priorityFee
            // const maxFeePerGas = newGasPrice + maxPriorityFeePerGas
            const gasFee = newGasPrice * estimateGas
            const weiToTransfer = _includeGasFee ? amountOfWei - gasFee : amountOfWei

            // Transaction Object
            const transactionObject = {
                from: from.address,
                to: toAddress,
                value: this.web3.utils.toHex(weiToTransfer.toString()),
                // gasPrice: newGasPrice.toString(),
                // maxFeePerGas: newGasPrice.toString(),
                // maxPriorityFeePerGas: gasPrice.toString()
                gas: estimateGas.toString()
            }

            if (nonce) {
                let numOfTx = await this.web3.eth.getTransactionCount(from.address, "latest")
                numOfTx = parseInt(numOfTx, 10) + parseInt(nonce, 10)
                transactionObject.nonce = this.web3.utils.toHex(numOfTx)
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

            return {
                data: {
                    receipt,
                    transferGas
                }
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async collectEth({ from, toAddress, amountOfEth }) {
        try {
            const result = { ...from }

            // Get eth to transfer
            const { data: ethToTransfer, error: amountError } = await this.getAmountToTransfer(
                undefined,
                from.address,
                amountOfEth
            )

            if (amountError) return { error: amountError }

            // Check sufficiency for the current balance
            const {
                weiToTransfer,
                weiBalance,
                error: notSufficient
            } = await this.checkEthBeforeTransfer({ fromAddress: from.address, ethToTransfer })

            if (notSufficient) return { error: notSufficient }

            result.weiToTransfer = weiToTransfer
            result.weiBalance = weiBalance

            // Send Eth
            const { data: txResult, error: sendEthError } = await this.sendEth({
                from: result,
                toAddress,
                amountOfEth: ethToTransfer
            })

            result.fromAddress = from.address
            result.toAddress = toAddress
            if (sendEthError) {
                result.error = sendEthError
            } else {
                result.transactionHash = txResult?.receipt.transactionHash
                result.status = txResult?.receipt.status
                result.transferredAmount = ethToTransfer
                result.gasFee = txResult.transferGas
                    ? this.web3.utils.fromWei(txResult.transferGas.gasFee, "ether")
                    : ""
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }

    // If the spread does not happen, use the main wallet sends a transaction (by MetaMask extension)
    async spreadEth({ from, toAddress, amountOfEth, nonce }) {
        try {
            const result = { ...from }

            // Get eth to transfer
            const { data: ethToTransfer, error: amountError } = await this.getAmountToTransfer(
                undefined,
                from.address,
                amountOfEth
            )

            if (amountError) return { error: amountError }

            // Check sufficiency for the current balance
            const {
                weiToTransfer,
                weiBalance,
                error: notSufficient
            } = await this.checkEthBeforeTransfer({ fromAddress: from.address, ethToTransfer })

            if (notSufficient) return { error: notSufficient }

            result.weiToTransfer = weiToTransfer
            result.weiBalance = weiBalance

            // Send Eth
            const { data: txResult, error: sendEthError } = await this.sendEth(
                {
                    from: result,
                    toAddress,
                    amountOfEth: ethToTransfer,
                    nonce
                },
                false
            )

            result.fromAddress = from.address
            result.toAddress = toAddress
            if (sendEthError) {
                result.error = sendEthError
            } else {
                result.transactionHash = txResult?.receipt.transactionHash
                result.status = txResult?.receipt.status
                result.transferredAmount = ethToTransfer
                result.gasFee = txResult.transferGas
                    ? this.web3.utils.fromWei(txResult.transferGas.gasFee, "ether")
                    : ""
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }

    async checkErc20BeforeTransfer({ fromAddress, erc20ToTransfer, token }) {
        // In here, "wei20" represents the smallest unit of the given ERC20 Token.
        try {
            const { data: wei20Balance, error: wei20BalanceError } = await this.getErc20Balance(
                fromAddress,
                token
            )

            if (wei20BalanceError) return { error: wei20BalanceError }

            if (wei20Balance === "0") return { error: `Wallet has 0 ${token.symbol}.` }

            const wei20ToTransfer = NumberHelper.parseFromDecimalVal(erc20ToTransfer, token.decimal)
            if (parseInt(wei20Balance, 10) < wei20ToTransfer)
                return {
                    error: `
                    Insufficient ${token.symbol}. 
                    Require: [${erc20ToTransfer}] 
                    ~ Balance: [${NumberHelper.parseToDecimalVal(wei20Balance, token.decimal)}]`
                }

            return {
                wei20Balance,
                wei20ToTransfer: wei20ToTransfer.toString()
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async getTransferData({ toAddress, amountOfToken, token }) {
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
            // Check can pay for gas or not
            const { data: transferGas, error: cannotPayGas } = await this.canPayGas({
                from,
                toAddress,
                amountOfToken,
                token
            })

            if (cannotPayGas) return { error: cannotPayGas }

            const { data: transferData, error: transferDataErr } = await this.getTransferData({
                toAddress,
                amountOfToken,
                token
            })

            if (transferDataErr) return { error: transferDataErr }

            // Transaction Object
            const transactionObject = {
                from: from.address,
                to: token.address,
                value: "0",
                gas: transferGas.estimateGas,
                // gasPrice: transferGas.gasPrice,
                data: transferData
            }

            if (nonce) {
                let numOfTx = await this.web3.eth.getTransactionCount(from.address, "latest")
                numOfTx = parseInt(numOfTx, 10) + parseInt(nonce, 10)
                transactionObject.nonce = this.web3.utils.toHex(numOfTx)
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

            return {
                data: {
                    receipt,
                    transferGas
                }
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async collectErc20({ from, toAddress, amountOfToken, token }) {
        // In here, "wei20" represents the smallest unit of the given ERC20 Token.
        try {
            const result = { ...from }
            const { data: weiBalance, error: weiBalanceError } = await this.getEthBalance(
                result.address
            )
            if (weiBalanceError) return { error: weiBalanceError }

            result.weiBalance = weiBalance
            result.weiToTransfer = "0"

            // Get erc20 to transfer
            const { data: erc20ToTransfer, error: amountError } = await this.getAmountToTransfer(
                token,
                from.address,
                amountOfToken
            )

            if (amountError) return { error: amountError }

            // Check sufficiency for the current balance
            const {
                wei20Balance,
                wei20ToTransfer,
                error: notSufficient
            } = await this.checkErc20BeforeTransfer({
                fromAddress: from.address,
                erc20ToTransfer,
                token
            })

            if (notSufficient) return { error: notSufficient }

            result.wei20Balance = wei20Balance
            result.wei20ToTransfer = wei20ToTransfer

            // Send Erc20
            const { data: txResult, error: sendErc20Error } = await this.sendErc20({
                from: result,
                toAddress,
                amountOfToken: erc20ToTransfer,
                token
            })

            result.fromAddress = from.address
            result.toAddress = toAddress
            if (sendErc20Error) {
                result.error = sendErc20Error
            } else {
                result.transactionHash = txResult?.receipt.transactionHash
                result.status = txResult?.receipt.status
                result.transferredAmount = erc20ToTransfer
                result.gasFee = txResult.transferGas
                    ? this.web3.utils.fromWei(txResult.transferGas.gasFee, "ether")
                    : ""
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }

    // If the spread does not happen, use the main wallet sends a transaction (by MetaMask extension)
    async spreadErc20({ from, toAddress, amountOfToken, token, nonce }) {
        // In here, "wei20" represents the smallest unit of the given ERC20 Token.
        try {
            const result = { ...from }
            const { data: weiBalance, error: weiBalanceError } = await this.getEthBalance(
                result.address
            )
            if (weiBalanceError) return { error: weiBalanceError }

            result.weiBalance = weiBalance
            result.weiToTransfer = "0"

            // Get erc20 to transfer
            const { data: erc20ToTransfer, error: amountError } = await this.getAmountToTransfer(
                token,
                from.address,
                amountOfToken
            )

            if (amountError) return { error: amountError }

            // Check sufficiency for the current balance
            const {
                wei20Balance,
                wei20ToTransfer,
                error: notSufficient
            } = await this.checkErc20BeforeTransfer({
                fromAddress: from.address,
                erc20ToTransfer,
                token
            })

            if (notSufficient) return { error: notSufficient }

            result.wei20Balance = wei20Balance
            result.wei20ToTransfer = wei20ToTransfer

            // Send Erc20
            const { data: txResult, error: sendErc20Error } = await this.sendErc20({
                from: result,
                toAddress,
                amountOfToken: erc20ToTransfer,
                token,
                nonce
            })

            result.fromAddress = from.address
            result.toAddress = toAddress
            if (sendErc20Error) {
                result.error = sendErc20Error
            } else {
                result.transactionHash = txResult?.receipt.transactionHash
                result.status = txResult?.receipt.status
                result.transferredAmount = erc20ToTransfer
                result.gasFee = txResult.transferGas
                    ? this.web3.utils.fromWei(txResult.transferGas.gasFee, "ether")
                    : ""
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }
}

export default Web3js
