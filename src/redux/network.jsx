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
        storageName: "network",
        id: "",
        name: ""
    },
    reducers: {
        setNetwork: (state, action) => {
            const networkId = action.payload
            const name = getNetworkNameById(action.payload)
            // Update state
            state.id = networkId
            state.name = name
            // Store in localStorage
            localStorage.setItem(
                state.storageName,
                JSON.stringify({
                    id: networkId,
                    name
                })
            )
        },
        getNetwork: (state) => {
            const network = localStorage.getItem(state.storageName)
            // Set network if existed
            if (network) {
                const { id, name } = JSON.parse(network)
                state.id = id
                state.name = name
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { setNetwork, getNetwork } = networkSlice.actions

export default networkSlice.reducer
