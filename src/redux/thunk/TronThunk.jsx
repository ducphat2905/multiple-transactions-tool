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
    if (typeof _amountToTransfer !== "string")
        return { error: `Amount to transfer should have a string type.` }

    const valueToTransfer = parseFloat(_amountToTransfer)
    if (Number.isNaN(valueToTransfer) && _amountToTransfer.toLowerCase() !== "all")
        return { error: `Amount to transfer is not valid: ${_amountToTransfer}` }

    if (!_allowZeroValue && valueToTransfer === 0)
        return { error: `Cannot proceed to transfer the amount of  0.` }

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

const collect = {}

const spread = {}

export default { getBalance, collect, spread }
