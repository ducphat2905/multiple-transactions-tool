import { createAsyncThunk } from "@reduxjs/toolkit"
import Web3js from "../../lib/Web3js"
import { toggleToaster } from "../Toaster"
import { getDataTable, setColumns, setStorageName, storeDataTable } from "../DataTable"
import { DATA_TABLES } from "../storageNames"
import { RESULT_COLUMNS } from "../../constants"

const getBalanceInEthereum = ({ wallets, provider, token }) => {
    try {
        const web3js = new Web3js(provider)

        const result = wallets.map((wallet) => {
            const updateWallet = { ...wallet }

            web3js
                .getBalance(wallet.address, token.address)
                .then((balance) => {
                    updateWallet[token.symbol] = balance
                })
                .catch((error) => {
                    updateWallet.error = error.message
                })

            return updateWallet
        })

        return { result }
    } catch (error) {
        return { error: error.message }
    }
}

export const getBalance = createAsyncThunk(
    "dataTable/getBalance",
    async ({ token, data }, { getState, rejectWithValue, dispatch }) => {
        const { rows } = data
        const { network } = getState()
        let resultRows = []

        switch (network.id) {
            case "bsc": {
                break
            }
            case "ethereum":
            case "ropsten": {
                const { result, error } = getBalanceInEthereum({
                    wallets: rows,
                    provider: network.rpcEndpoint,
                    token
                })
                // Has error
                if (error) {
                    console.log(error)
                } else resultRows = result

                break
            }
            case "tron": {
                break
            }

            default:
                break
        }

        // Display the result
        dispatch(setStorageName(DATA_TABLES.Result))
        dispatch(
            setColumns(RESULT_COLUMNS({ field: token.symbol, header: token.symbol.toUppercase() }))
        )
        dispatch(
            storeDataTable({
                name: "result-get-balance",
                data: resultRows
            })
        )
        dispatch(getDataTable())
    }
)

export default { getBalance }
