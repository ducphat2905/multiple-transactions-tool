import { createSlice } from "@reduxjs/toolkit"
import EthereumTokens from "../tokens/ethereum"
import BscTokens from "../tokens/bsc"
import TronTokens from "../tokens/tron"
import { NETWORKS } from "../constants"

const initialState = {
    storageName: "network",
    id: "",
    name: "",
    blockExplorer: "",
    tokens: []
}

export const networkSlice = createSlice({
    name: "network",
    initialState,
    reducers: {
        setNetwork: (state, action) => {
            const networkId = action.payload
            const network = Object.entries(NETWORKS).find(
                ([key, value]) => value.id === networkId
            )[1]
            const { id, name, blockExplorer } = network
            // Update state
            state.id = id
            state.name = name
            state.blockExplorer = blockExplorer
            // Store in localStorage
            localStorage.setItem(
                state.storageName,
                JSON.stringify({
                    id,
                    name,
                    blockExplorer
                })
            )
        },
        getChosenNetwork: (state) => {
            const network = localStorage.getItem(state.storageName)
            // Set network if existed
            if (network) {
                const { id, name, blockExplorer } = JSON.parse(network)
                state.id = id
                state.name = name
                state.blockExplorer = blockExplorer
            }
        },
        getTokens: (state) => {
            switch (state.id) {
                case "bsc": {
                    state.tokens = [...BscTokens]
                    break
                }
                case "ethereum": {
                    state.tokens = [...EthereumTokens]
                    break
                }
                case "tron": {
                    state.tokens = [...TronTokens]
                    break
                }
                default:
                    break
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { setNetwork, getChosenNetwork, getTokens } = networkSlice.actions

export default networkSlice.reducer
