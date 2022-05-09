import { createAsyncThunk } from "@reduxjs/toolkit"
import Web3js from "../../lib/Web3js"
import Token from "../../objects/Token"
import { toggleToaster } from "../Toaster"
import { setTableType, storeDataTable, TABLE_TYPES } from "../DataTable"
import { FEATURES, RESULT_COLUMNS } from "../../constants"

// TO-DO: Sending request with a specific rate limit
const storeResult = (dispatch, data) => {
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
            }),
            feature: FEATURES.GetBalance
        })
    )
    dispatch(setTableType(TABLE_TYPES.Result))
}

const getBalance = createAsyncThunk(
    "ethereum/getBalance",
    async ({ token, wallets }, { getState, dispatch }) => {
        const { network } = getState()
        const { dataTable } = getState()

        const web3js = new Web3js(network.rpcEndpoint)

        const tokenObj = new Token(token.address, token.symbol, token.decimal, token.AbiType)
        tokenObj.setAbiJson()

        const rows = await Promise.all(
            wallets.map(async (_wallet) => {
                const { data, error } = await web3js.getBalance(_wallet.address, tokenObj)

                return {
                    ..._wallet,
                    [token.symbol]: data,
                    error
                }
            })
        )

        storeResult(dispatch, { rows, file: dataTable.file, token })
    }
)

export default { getBalance }
