import TronWeb from "tronweb"
import NumberHelper from "../helpers/Number"

// 1 TRX = 1_000_000 SUN
// Rate limit: 10k per 5min
class Tronweb {
    constructor(_provider, _APIKey) {
        try {
            const { HttpProvider } = TronWeb.providers
            const fullNode = new HttpProvider(_provider)
            const solidityNode = new HttpProvider(_provider)
            const eventServer = new HttpProvider(_provider)
            const tronweb = new TronWeb(fullNode, solidityNode, eventServer)

            // Set a random owner address to be able to query to Trongrid.
            tronweb.setAddress("TVJ6njG5EpUwJt4N9xjTrqU5za78cgadS2")

            this.API_KEY = _APIKey

            this.tronweb = tronweb
            this.error = null
        } catch (error) {
            this.error = error.message
            this.tronweb = null
        }
    }

    checkAddressFormat(_address) {
        return this.tronweb.isAddress(_address)
    }

    getWalletByPk(_privateKey) {
        try {
            const address = this.tronweb.address.fromPrivateKey(_privateKey)

            return { data: { address, privateKey: _privateKey } }
        } catch (error) {
            return { error: error.message }
        }
    }

    async getTRC20Data(_tokenAddress) {
        try {
            const tokenInstance = await this.tronweb.contract().at(_tokenAddress)

            // Get decimal
            const decimal = await tokenInstance.decimals().call()

            // Get symbol
            const symbol = await tokenInstance.symbol().call()

            const token = {
                address: _tokenAddress,
                symbol,
                decimal
            }

            return { data: token }
        } catch (error) {
            return { error }
        }
    }

    async getTrxBalance(_address, _parseToTrx = false) {
        try {
            const balance = await this.tronweb.trx.getBalance(_address)
            const data = _parseToTrx ? this.tronweb.fromSun(balance) : balance

            return { data }
        } catch (error) {
            return { error: error.message }
        }
    }

    async getTrc20Balance(_address, _token, _parseToDecimalValue = false) {
        try {
            const instance = await this.tronweb.contract().at(_token.address)
            const balance = await instance.balanceOf(_address.toString()).call()
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
            return { error: `Invalid value of amountToTransfer.` }

        // Transfer all the current balance when the amount is "all"
        try {
            if (_token) {
                const { data: trc20Balance, error: trc20BalanceError } = await this.getTrc20Balance(
                    _fromAddress,
                    _token,
                    true
                )

                if (trc20BalanceError) return { error: trc20BalanceError }

                amountToTransfer = trc20Balance
            } else {
                const { data: trxBalance, error: trxBalanceError } = await this.getTrxBalance(
                    _fromAddress,
                    true
                )

                if (trxBalanceError) return { error: trxBalanceError }

                amountToTransfer = trxBalance
            }

            return { data: amountToTransfer }
        } catch (error) {
            return { error: error.message }
        }
    }

    async checkTrxBeforeTransfer({ fromAddress, trxToTransfer }) {
        try {
            const { data: sunBalance, error: sunBalanceError } = await this.getTrxBalance(
                fromAddress
            )
            if (sunBalanceError) return { error: sunBalanceError }

            if (sunBalance === "0") return { error: "Wallet has 0 TRX." }

            const sunToTransfer = this.tronweb.toSun(trxToTransfer)
            if (parseInt(sunBalance, 10) < parseInt(sunToTransfer, 10))
                return {
                    error: `Insufficient TRX. 
                    Require: [${sunToTransfer}] 
                    ~ Balance: [${this.tronweb.toSun(trxToTransfer)}]`
                }

            return {
                sunToTransfer,
                sunBalance
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

    async sendTrx({ from, toAddress, amountOfTrx, nonce }, _includeGasFee = true) {
        try {
            // // Check can pay for gas or not
            // const { data: transferGas, error: cannotPayGas } = await this.canPayGas({
            //     from,
            //     toAddress
            // })

            // if (cannotPayGas) return { error: cannotPayGas }

            const amountOfSun = parseInt(this.tronweb.toSun(amountOfTrx), 10)
            // const { gasPrice, estimateGas } = transferGas

            // const newGasPrice = Math.floor(parseInt(gasPrice, 10) * this.gasPriceRate)
            // const maxPriorityFeePerGas = this.ONE_GWEI * this.priorityFee
            // const maxFeePerGas = newGasPrice + maxPriorityFeePerGas
            // const gasFee = newGasPrice * estimateGas
            // const sunTransfer = _includeGasFee ? amountOfSun - gasFee : amountOfSun
            const sunTransfer = amountOfSun

            const transactionObject = await this.tronweb.transactionBuilder.sendTrx(
                toAddress,
                sunTransfer.toString(),
                from.address
            )

            const signedTransaction = await this.tronweb.trx.sign(
                transactionObject,
                from.privateKey
            )

            const receipt = await this.tronweb.trx.sendRawTransaction(signedTransaction)

            return {
                data: {
                    receipt,
                    transferGas: 0
                }
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async collectTrx({ from, toAddress, amountOfTrx }) {
        try {
            const result = { ...from }

            // Get eth to transfer
            const { data: trxToTransfer, error: amountError } = await this.getAmountToTransfer(
                undefined,
                from.address,
                amountOfTrx
            )

            if (amountError) return { error: amountError }

            // Check sufficiency for the current balance
            const {
                sunToTransfer,
                sunBalance,
                error: notSufficient
            } = await this.checkTrxBeforeTransfer({ fromAddress: from.address, trxToTransfer })

            if (notSufficient) return { error: notSufficient }

            result.sunToTransfer = sunToTransfer
            result.sunBalance = sunBalance

            // Send Trx
            const { data: txResult, error: sendTrxError } = await this.sendTrx({
                from: result,
                toAddress,
                amountOfTrx: trxToTransfer
            })

            result.fromAddress = from.address
            result.toAddress = toAddress
            if (sendTrxError) {
                result.error = sendTrxError
            } else {
                result.transactionHash = txResult?.receipt.txid
                result.status = txResult?.receipt.result
                result.transferredAmount = trxToTransfer
                result.gasFee = txResult.transferGas
                    ? this.tronweb.fromSun(txResult.transferGas.gasFee)
                    : ""
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }

    async spreadTrx({ from, toAddress, amountOfTrx, nonce }) {
        try {
            const result = { ...from }

            // Get TRX to transfer
            const { data: trxToTransfer, error: amountError } = await this.getAmountToTransfer(
                undefined,
                from.address,
                amountOfTrx
            )

            if (amountError) return { error: amountError }

            // Check sufficiency for the current balance
            const {
                sunToTransfer,
                sunBalance,
                error: notSufficient
            } = await this.checkTrxBeforeTransfer({ fromAddress: from.address, trxToTransfer })

            if (notSufficient) return { error: notSufficient }

            result.sunToTransfer = sunToTransfer
            result.sunBalance = sunBalance

            // Send TRX
            const { data: txResult, error: sendTrxError } = await this.sendTrx(
                {
                    from: result,
                    toAddress,
                    amountOfTrx: trxToTransfer,
                    nonce
                },
                false
            )

            result.fromAddress = from.address
            result.toAddress = toAddress
            if (sendTrxError) {
                result.error = sendTrxError
            } else {
                result.transactionHash = txResult?.receipt.txid
                result.status = txResult?.receipt.result
                result.transferredAmount = trxToTransfer
                result.gasFee = txResult.transferGas
                    ? this.tronweb.fromSun(txResult.transferGas.gasFee)
                    : ""
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }
}

export default Tronweb
