import { createAsyncThunk } from "@reduxjs/toolkit"
import Web3js from "../../lib/Web3js"
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
    "ethereum/getBalance",
    async ({ token }, { getState, dispatch }) => {
        const { network, dataTable, stage } = getState()
        const web3js = new Web3js(network.rpcEndpoint)
        const wallets = dataTable.rows

        const rowsOfResult = await Promise.all(
            wallets.map(async (_wallet) => {
                const result = {
                    id: _wallet.id,
                    address: _wallet.address,
                    error: "",
                    status: false
                }

                // ETH
                if (!token.address) {
                    const { data: ethBalance, error: ethBalanceError } = await web3js.getEthBalance(
                        _wallet.address,
                        true
                    )

                    if (ethBalanceError) {
                        result.error = ethBalanceError
                        dispatch(addResultMessage(result))
                        return result
                    }

                    result.status = true
                    result.ETH = ethBalance
                }
                // ERC20
                else {
                    const { data: erc20Balance, error: erc20BalanceError } =
                        await web3js.getErc20Balance(_wallet.address, new Token({ ...token }), true)

                    if (erc20BalanceError) {
                        result.error = erc20BalanceError
                        dispatch(addResultMessage(result))
                        return result
                    }

                    result.status = true
                    result[`${token.symbol.toUpperCase()}`] = erc20Balance
                }

                dispatch(addResultMessage(result))
                return result
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
    "ethereum/collect",
    async ({ token, recipient }, { getState, dispatch }) => {
        const { network, dataTable, stage } = getState()
        const web3js = new Web3js(network.rpcEndpoint)
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

                        // Collect ETH
                        if (!token.address) {
                            const collectEthResult = await web3js.collectEth({
                                from: _wallet,
                                toAddress: recipient.address,
                                amountOfEth: _wallet.amountToTransfer
                            })

                            if (collectEthResult.error) {
                                collectResult.error = collectEthResult.error
                                dispatch(addResultMessage(collectResult))
                                return collectResult
                            }

                            collectResult = { ...collectResult, ...collectEthResult.data }
                        }

                        // Collect ERC20
                        else {
                            const collectErc20Result = await web3js.collectErc20({
                                from: _wallet,
                                toAddress: recipient.address,
                                amountOfToken: _wallet.amountToTransfer,
                                token: new Token({ ...token })
                            })

                            if (collectErc20Result.error) {
                                collectResult.error = collectErc20Result.error
                                dispatch(addResultMessage(collectResult))
                                return collectResult
                            }

                            collectResult = { ...collectResult, ...collectErc20Result.data }
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
    "ethereum/spread",
    async ({ token, spreader, amountToSpread }, { dispatch, getState }) => {
        const { network, dataTable, stage } = getState()
        const web3js = new Web3js(network.rpcEndpoint)
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

                        // Spread ETH
                        if (!token.address) {
                            const spreadEthResult = await web3js.spreadEth({
                                from: spreader,
                                toAddress: _wallet.address,
                                amountOfEth: amountToSpread,
                                nonce: _index
                            })

                            if (spreadEthResult.error) {
                                spreadResult.error = spreadEthResult.error
                                dispatch(addResultMessage(spreadResult))
                                return spreadResult
                            }

                            spreadResult = { ...spreadResult, ...spreadEthResult.data }
                        }

                        // Collect ERC20
                        else {
                            const spreadErc20Result = await web3js.spreadErc20({
                                from: spreader,
                                toAddress: _wallet.address,
                                amountOfToken: amountToSpread,
                                token: new Token({ ...token }),
                                nonce: _index
                            })

                            if (spreadErc20Result.error) {
                                spreadResult.error = spreadErc20Result.error
                                dispatch(addResultMessage(spreadResult))
                                return spreadResult
                            }

                            spreadResult = { ...spreadResult, ...spreadErc20Result.data }
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
