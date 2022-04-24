import { createSlice } from "@reduxjs/toolkit"

/**
 *  Get network's name by Id
 * @param {string} _networkId
 * @returns string
 */
const getNetworkNameById = (_networkId) => {
    let name = ""
    switch (_networkId) {
        case "ethereum": {
            name = "Ethereum"
            break
        }
        case "bsc": {
            name = "Binance Smart Chain"
            break
        }
        case "tron": {
            name = "Tron network"
            break
        }
        default:
            break
    }

    return name
}

export const networkSlice = createSlice({
    name: "network",
    initialState: {
        id: "",
        name: ""
    },
    reducers: {
        setNetwork: (state, action) => {
            state.id = action.payload
            state.name = getNetworkNameById(action.payload)
        }
    }
})

// Action creators are generated for each case reducer function
export const { setNetwork } = networkSlice.actions

export default networkSlice.reducer
