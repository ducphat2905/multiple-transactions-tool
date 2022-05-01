import { createAsyncThunk } from "@reduxjs/toolkit"
import Ethereum from "../../lib/Ethereum"

export const getBalance = createAsyncThunk(
    "dataTable/getBalance",
    async ({ networkId, rpcEndpoint, wallets }, { getState }) => {
        let result
        try {
            const ethereum = new Ethereum(rpcEndpoint)
            const { web3 } = getState().dataTable
            console.log(getState())
            console.log(ethereum)
            result = ethereum
        } catch ({ error }) {
            console.log(error, "error")
            throw new Error(error)
        }
        // switch (networkId) {
        //     case Ropsten.id: {
        //         const ethereum = new Ethereum(provider)
        //         result = await ethereum.getBalance("0xa6dd3736841f1A1f3f7C27349867D46285c39f58")

        //         break
        //     }
        //     default:
        //         result = []
        //         break
        // }

        return result
    }
)

// export { getBalance }

export default { getBalance }
