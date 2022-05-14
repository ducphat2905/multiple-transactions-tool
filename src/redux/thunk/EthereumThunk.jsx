import { createAsyncThunk } from "@reduxjs/toolkit"
import Web3js from "../../lib/Web3js"
import Token from "../../objects/Token"
import { addResultWallet, setTableType, storeDataTable, TABLE_TYPES } from "../DataTable"
import { FEATURES, RESULT_COLUMNS } from "../../constants"
import Number from "../../helpers/Number"

// TO-DO: Sending request with a specific rate limit
const storeResultInTable = (dispatch, data) => {
    const { file, rows, token } = data
    // Store and display the result
    dispatch(
        storeDataTable({
            name: TABLE_TYPES.Result,
            tableType: TABLE_TYPES.Result,
            type: file.type,
            size: 0,
            rows,
            columns: RESULT_COLUMNS({
                field: token.symbol,
                flex: 0.5,
                header: token.symbol.toUpperCase()
            })
        })
    )
    dispatch(setTableType(TABLE_TYPES.Result))
}

const handleResultAsync = (
    { results, wallet, error, balance },
    { dispatch, token, file, totalLength }
) => {
    const resultWallet = { ...wallet }
    resultWallet.error = error
    resultWallet[token.symbol] = Number.parseToDecimalVal(balance, token.decimal)
    results.push(resultWallet)

    // setTimeout(() => {
    dispatch(addResultWallet(resultWallet))
    // }, 0.1 * index)

    if (results.length === totalLength) {
        storeResultInTable(dispatch, { rows: results, file, token })
    }
}

const getBalance = createAsyncThunk(
    "ethereum/getBalance",
    async ({ token, wallets }, { getState, dispatch }) => {
        const { network, abi, dataTable } = getState()

        const totalLength = wallets.length
        const results = []
        const web3js = new Web3js(network.rpcEndpoint)
        console.log(network.rpcEndpoint)
        const batch = new web3js.web3.BatchRequest()
        wallets.forEach(async (_wallet) => {
            if (token.address) {
                let tokenAbi = abi.listOfAbi.find((_abi) => _abi.address === token.address)?.abi
                tokenAbi = tokenAbi && JSON.stringify(tokenAbi) // Avoid redux to handle json
                const contract = new web3js.web3.eth.Contract(JSON.parse(tokenAbi), token.address)
                batch.add(
                    contract.methods
                        .balanceOf(_wallet.address)
                        .call.request("latest", (err, balance) => {
                            handleResultAsync(
                                {
                                    results,
                                    wallet: _wallet,
                                    error: err,
                                    balance
                                },
                                {
                                    dispatch,
                                    token,
                                    file: dataTable.file,
                                    totalLength
                                }
                            )
                        })
                )
            } else {
                batch.add(
                    web3js.web3.eth.getBalance.request(_wallet.address, "latest", (err, balance) =>
                        handleResultAsync(
                            {
                                results,
                                wallet: _wallet,
                                error: err,
                                balance
                            },
                            {
                                dispatch,
                                token,
                                file: dataTable.file,
                                totalLength
                            }
                        )
                    )
                )
            }
        })

        batch.execute()

        // storeResult(dispatch, { rows, file: dataTable.file, token })
    }
)

export default { getBalance }
