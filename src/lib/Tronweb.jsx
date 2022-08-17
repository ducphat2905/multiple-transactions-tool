import TronWeb from "tronweb"
import NumberHelper from "../helpers/Number"

// 1 TRX = 1_000_000 SUN
// Rate limit: 10k per 5min
class Tronweb {
    MaxFeeLimit = 15 // Maximum TRX consumed by sending a transaction

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

    async sendTrx({ from, toAddress, amountOfTrx }) {
        try {
            const sunTransfer = parseInt(this.tronweb.toSun(amountOfTrx), 10)

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
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }

    async spreadTrx({ from, toAddress, amountOfTrx }) {
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
                    amountOfTrx: trxToTransfer
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
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }

    async checkTrc20BeforeTransfer({ fromAddress, trc20ToTransfer, token }) {
        // In here, "sun20" represents the smallest unit of the given TRC20 Token.
        try {
            const { data: sun20Balance, error: sun20BalanceError } = await this.getTrc20Balance(
                fromAddress,
                token
            )

            if (sun20BalanceError) return { error: sun20BalanceError }

            if (sun20Balance === "0") return { error: `Wallet has 0 ${token.symbol}.` }

            const sun20ToTransfer = NumberHelper.parseFromDecimalVal(trc20ToTransfer, token.decimal)
            if (parseInt(sun20Balance, 10) < sun20ToTransfer)
                return {
                    error: `
                    Insufficient ${token.symbol}. 
                    Require: [${sun20ToTransfer}] 
                    ~ Balance: [${NumberHelper.parseToDecimalVal(sun20Balance, token.decimal)}]`
                }

            return {
                sun20Balance,
                sun20ToTransfer: sun20ToTransfer.toString()
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async sendTrc20({ from, toAddress, amountOfToken, token }) {
        try {
            const sun20ToTransfer = NumberHelper.parseFromDecimalVal(amountOfToken, token.decimal)

            const parameter = [
                { type: "address", value: toAddress },
                { type: "uint256", value: NumberHelper.convertNumToFullString(sun20ToTransfer) }
            ]

            const options = {
                feeLimit: this.tronweb.toSun(this.MaxFeeLimit),
                callValue: 0
                // shouldPollResponse: true // wait until the transaction is confirmed
            }

            const transaction = await this.tronweb.transactionBuilder.triggerSmartContract(
                token.address,
                "transfer(address,uint256)",
                options,
                parameter,
                from.address
            )

            const signTx = await this.tronweb.trx.sign(transaction.transaction, from.privateKey)

            const receipt = await this.tronweb.trx.sendRawTransaction(signTx)

            // Not enough bandwidth
            if (receipt.code === "BANDWITH_ERROR") {
                return { error: "Do not have enough bandwidth" }
            }

            return {
                data: {
                    receipt
                }
            }
        } catch (error) {
            return { error: error.message }
        }
    }

    async collectTrc20({ from, toAddress, amountOfToken, token }) {
        // In here, "wei20" represents the smallest unit of the given TRC20 Token.
        try {
            const result = { ...from }
            const { data: sunBalance, error: sunBalanceError } = await this.getTrxBalance(
                result.address
            )
            if (sunBalanceError) return { error: sunBalanceError }

            result.sunBalance = sunBalance
            result.sunToTransfer = "0"

            // Get Trc20 to transfer
            const { data: trc20ToTransfer, error: amountError } = await this.getAmountToTransfer(
                token,
                from.address,
                amountOfToken
            )

            if (amountError) return { error: amountError }

            // Check sufficiency for the current balance
            const {
                sun20Balance,
                sun20ToTransfer,
                error: notSufficient
            } = await this.checkTrc20BeforeTransfer({
                fromAddress: from.address,
                trc20ToTransfer,
                token
            })

            if (notSufficient) return { error: notSufficient }

            result.sun20Balance = sun20Balance.toString()
            result.sun20ToTransfer = sun20ToTransfer.toString()

            // Send Trc20
            const { data: txResult, error: sendTrc20Error } = await this.sendTrc20({
                from: result,
                toAddress,
                amountOfToken: trc20ToTransfer,
                token
            })

            result.fromAddress = from.address
            result.toAddress = toAddress
            if (sendTrc20Error) {
                result.error = sendTrc20Error
            } else {
                result.transactionHash = txResult?.receipt.txid
                result.status = txResult?.receipt.result
                result.transferredAmount = trc20ToTransfer
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }

    async spreadTrc20({ from, toAddress, amountOfToken, token, nonce }) {
        // In here, "sun20" represents the smallest unit of the given TRC20 Token.
        try {
            const result = { ...from }
            const { data: sunBalance, error: sunBalanceError } = await this.getTrxBalance(
                result.address
            )
            if (sunBalanceError) return { error: sunBalanceError }

            result.sunBalance = sunBalance
            result.sunToTransfer = "0"

            // Get trc20 to transfer
            const { data: trc20ToTransfer, error: amountError } = await this.getAmountToTransfer(
                token,
                from.address,
                amountOfToken
            )

            if (amountError) return { error: amountError }

            // Check sufficiency for the current balance
            const {
                sun20Balance,
                sun20ToTransfer,
                error: notSufficient
            } = await this.checkTrc20BeforeTransfer({
                fromAddress: from.address,
                trc20ToTransfer,
                token
            })

            if (notSufficient) return { error: notSufficient }

            result.sun20Balance = sun20Balance.toString()
            result.sun20ToTransfer = sun20ToTransfer.toString()

            // Send Trc20
            const { data: txResult, error: sendTrc20Error } = await this.sendTrc20({
                from: result,
                toAddress,
                amountOfToken: trc20ToTransfer,
                token,
                nonce
            })

            result.fromAddress = from.address
            result.toAddress = toAddress
            if (sendTrc20Error) {
                result.error = sendTrc20Error
            } else {
                result.transactionHash = txResult?.receipt.txid
                result.status = txResult?.receipt.result
                result.transferredAmount = trc20ToTransfer
            }

            return { data: result }
        } catch (error) {
            return { error: error.message }
        }
    }
}

export default Tronweb
