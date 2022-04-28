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
            const { Ethereum, Ropsten, Bsc, Tron } = NETWORKS
            switch (state.id) {
                case Bsc.id: {
                    state.tokens = [...BscTokens]
                    break
                }
                case Ropsten.id:
                case Ethereum.id: {
                    state.tokens = [...EthereumTokens]
                    break
                }
                case Tron.id: {
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
export const { setNetwork, getChosenNetwork, getTokens } = networkSlice.actions

export default networkSlice.reducer
