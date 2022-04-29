import { createSlice } from "@reduxjs/toolkit"
import EthereumTokens from "../tokens/ethereum"
import BscTokens from "../tokens/bsc"
import TronTokens from "../tokens/tron"
import { NETWORKS } from "../constants"
import { networkStorage } from "./storageNames"

const initialState = () => {
    // Default state
    let state = {
        storageName: networkStorage,
        id: "",
        name: "",
        blockExplorer: "",
        rpcEndpoint: "",
        tokens: []
    }

    // Get from local storage
    const networkData = localStorage.getItem(networkStorage)
    if (networkData) {
        const storageData = JSON.parse(networkData)
        state = storageData
    }

    return state
}

export const networkSlice = createSlice({
    name: "network",
    initialState: initialState(),
    reducers: {
        setNetwork: (state, action) => {
            const { id } = action.payload

            const selectedNetwork = NETWORKS.find((_network) => _network.id === id)
            if (selectedNetwork) {
                // Update state
                state = { ...state, ...selectedNetwork }
                // Store in localStorage
                localStorage.setItem(state.storageName, JSON.stringify(state))
            }
        },
        getTokens: (state) => {
            switch (state.id) {
                case "bsc": {
                    state.tokens = [...BscTokens]
                    break
                }
                case "ropsten":
                case "ethereum": {
                    state.tokens = [...EthereumTokens]
                    break
                }
                case "tron": {
                    state.tokens = [...TronTokens]
                    break
                }
                default:
                    state.tokens = []
                    break
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { setNetwork, getTokens } = networkSlice.actions

export default networkSlice.reducer
