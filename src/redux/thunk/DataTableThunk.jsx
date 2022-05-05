import { createAsyncThunk } from "@reduxjs/toolkit"
import Web3js from "../../lib/Web3js"
import { toggleToaster } from "../Toaster"

export const getBalance = createAsyncThunk(
    "dataTable/getBalance",
    async ({ token, data }, { getState, rejectWithValue, dispatch }) => {
        const { network } = getState()

        switch (network.id) {
            case "bsc": {
                break
            }
            case "ethereum":
            case "ropsten": {
                console.log(token)
                console.log(data)
                break
            }
            case "tron": {
                break
            }

            default:
                break
        }
    }
)

export default { getBalance }
