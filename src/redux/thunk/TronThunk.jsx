import { createAsyncThunk } from "@reduxjs/toolkit"

import TronWeb from "../../lib/Tronweb"
import Token from "../../objects/Token"
import { addResultMessage, setTableType, storeDataTable, TABLE_TYPES } from "../DataTable"
import { FEATURES, TX_COLUMNS, getBalanceColumns } from "../../constants"

const storeResultInTable = (dispatch, data) => {
    const { file, rows, feature, token } = data

    const columns = feature === FEATURES.GetBalance ? getBalanceColumns(token.symbol) : TX_COLUMNS
    // Store and display the result
    dispatch(
        storeDataTable({
            name: TABLE_TYPES.Result,
            tableType: TABLE_TYPES.Result,
            type: file.type,
            size: 0,
            rows,
            columns,
            feature
        })
    )
    dispatch(setTableType(TABLE_TYPES.Result))
}

const checkInputAmount = (_amountToTransfer, _allowZeroValue = false) => {
    if (_amountToTransfer == null) {
        return { error: `amountToTransfer was not provided.` }
    }

    if (typeof _amountToTransfer !== "string")
        return { error: `amountToTransfer should have a string type.` }

    const valueToTransfer = parseFloat(_amountToTransfer)
    if (Number.isNaN(valueToTransfer) && _amountToTransfer.toLowerCase() !== "all")
        return { error: `amountToTransfer is not valid: ${_amountToTransfer}` }

    if (!_allowZeroValue && valueToTransfer === 0)
        return { error: `Cannot proceed to transfer the amount of 0.` }

    return { data: true }
}

const getBalance = createAsyncThunk(
    "tron/getBalance",
    async ({ token }, { getState, dispatch }) => {
        const { network, dataTable, stage } = getState()
        const tronweb = new TronWeb(network.rpcEndpoint)
        const wallets = dataTable.rows

        const rowsOfResult = await Promise.all(
            wallets.map((_wallet, index) => {
                return new Promise((resolve) => {
                    setTimeout(async () => {
                        const result = {
                            id: _wallet.id,
                            address: _wallet.address,
                            error: "",
                            status: false
                        }

                        // TRX
                        if (!token.address) {
                            const { data: trxBalance, error: trxBalanceError } =
                                await tronweb.getTrxBalance(_wallet.address, true)

                            if (trxBalanceError) {
                                result.error = trxBalanceError
                                dispatch(addResultMessage(result))
                                return result
                            }

                            result.status = true
                            result.TRX = trxBalance
                        }
                        // TRC20
                        else {
                            const { data: trc20Balance, error: trc20BalanceError } =
                                await tronweb.getTrc20Balance(
                                    _wallet.address,
                                    new Token({ ...token }),
                                    true
                                )

                            if (trc20BalanceError) {
                                result.error = trc20BalanceError
                                dispatch(addResultMessage(result))
                                return result
                            }

                            result.status = true
                            result[`${token.symbol.toUpperCase()}`] = trc20Balance
                        }

                        dispatch(addResultMessage(result))
                        return resolve(result)
                    }, 150 * index)
                })
            })
        )

        storeResultInTable(dispatch, {
            file: dataTable.file,
            rows: rowsOfResult,
            token,
            feature: stage.feature
        })
    }
)

const collect = createAsyncThunk(
    "tron/collect",
    async ({ token, recipient }, { getState, dispatch }) => {
        const { network, dataTable, stage } = getState()
        const tronweb = new TronWeb(network.rpcEndpoint)
        const wallets = dataTable.rows

        const rowsOfResult = await Promise.all(
            wallets.map(async (_wallet, _index) => {
                return new Promise((resolve) => {
                    setTimeout(async () => {
                        let collectResult = {
                            id: _wallet.id,
                            amountToTransfer: _wallet.amountToTransfer,
                            fromAddress: _wallet.address,
                            toAddress: recipient.address,
                            status: false,
                            transactionHash: "",
                            error: "",
                            transferredAmount: ""
                        }

                        // Check same address
                        if (collectResult.fromAddress === collectResult.toAddress) {
                            const sameAddressError = "From and To address are the same."
                            collectResult.error = sameAddressError
                            dispatch(addResultMessage(collectResult))
                            return collectResult
                        }

                        // Check input amount
                        const { error: invalidAmount } = checkInputAmount(_wallet.amountToTransfer)
                        if (invalidAmount) {
                            collectResult.error = invalidAmount
                            dispatch(addResultMessage(collectResult))
                            return collectResult
                        }

                        // Collect TRX
                        if (!token.address) {
                            const collectTrxResult = await tronweb.collectTrx({
                                from: _wallet,
                                toAddress: recipient.address,
                                amountOfTrx: _wallet.amountToTransfer
                            })

                            if (collectTrxResult.error) {
                                collectResult.error = collectTrxResult.error
                                dispatch(addResultMessage(collectResult))
                                return collectResult
                            }

                            collectResult = { ...collectResult, ...collectTrxResult.data }
                        }

                        // Collect TRC20
                        else {
                            const collectTrc20Result = await tronweb.collectTrc20({
                                from: _wallet,
                                toAddress: recipient.address,
                                amountOfToken: _wallet.amountToTransfer,
                                token: new Token({ ...token })
                            })

                            if (collectTrc20Result.error) {
                                collectResult.error = collectTrc20Result.error
                                dispatch(addResultMessage(collectResult))
                                return collectResult
                            }

                            collectResult = { ...collectResult, ...collectTrc20Result.data }
                        }

                        dispatch(addResultMessage(collectResult))

                        return resolve(collectResult)
                    }, 100 * _index)
                })
            })
        )

        storeResultInTable(dispatch, {
            file: dataTable.file,
            rows: rowsOfResult,
            feature: stage.feature
        })
    }
)

const spread = createAsyncThunk(
    "tron/spread",
    async ({ token, spreader, amountToSpread }, { dispatch, getState }) => {
        const { network, dataTable, stage } = getState()
        const tronweb = new TronWeb(network.rpcEndpoint)
        const wallets = dataTable.rows

        const rowsOfResult = await Promise.all(
            wallets.map(async (_wallet, _index) => {
                return new Promise((resolve) => {
                    setTimeout(async () => {
                        let spreadResult = {
                            id: _index,
                            amountToTransfer: _wallet.amountToTransfer,
                            fromAddress: spreader.address,
                            toAddress: _wallet.address,
                            status: false,
                            transactionHash: "",
                            error: "",
                            transferredAmount: ""
                        }

                        // Check same address
                        if (spreadResult.fromAddress === spreadResult.toAddress) {
                            const sameAddressError = "From and To address are the same."
                            spreadResult.error = sameAddressError
                            dispatch(addResultMessage(spreadResult))
                            return spreadResult
                        }

                        // Check input amount
                        const { error: invalidAmount } = checkInputAmount(amountToSpread)
                        if (invalidAmount) {
                            spreadResult.error = invalidAmount
                            dispatch(addResultMessage(spreadResult))
                            return spreadResult
                        }

                        // Spread TRX
                        if (!token.address) {
                            const spreadTrxResult = await tronweb.spreadTrx({
                                from: spreader,
                                toAddress: _wallet.address,
                                amountOfTrx: amountToSpread,
                                nonce: _index
                            })

                            if (spreadTrxResult.error) {
                                spreadResult.error = spreadTrxResult.error
                                dispatch(addResultMessage(spreadResult))
                                return spreadResult
                            }

                            spreadResult = { ...spreadResult, ...spreadTrxResult.data }
                        }

                        // Collect TRC20
                        else {
                            const spreadTrc20Result = await tronweb.spreadTrc20({
                                from: spreader,
                                toAddress: _wallet.address,
                                amountOfToken: amountToSpread,
                                token: new Token({ ...token }),
                                nonce: _index
                            })

                            if (spreadTrc20Result.error) {
                                spreadResult.error = spreadTrc20Result.error
                                dispatch(addResultMessage(spreadResult))
                                return spreadResult
                            }

                            spreadResult = { ...spreadResult, ...spreadTrc20Result.data }
                        }

                        dispatch(addResultMessage(spreadResult))
                        return resolve(spreadResult)
                    }, 100 * _index)
                })
            })
        )

        storeResultInTable(dispatch, {
            file: dataTable.file,
            rows: rowsOfResult,
            feature: stage.feature
        })
    }
)

export default { getBalance, collect, spread }
