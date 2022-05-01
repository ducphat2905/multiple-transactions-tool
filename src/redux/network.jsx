import { createSlice } from "@reduxjs/toolkit"
import { networkStorage, settingStorage } from "./storageNames"

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
        selectNetwork: (state, action) => {
            const { id } = action.payload

            // Get networks from local storage
            const settingData = localStorage.getItem(settingStorage)
            if (settingData) {
                const data = JSON.parse(settingData)
                const selectedNetwork = data.networks.find((_network) => _network.id === id)

                if (selectedNetwork) {
                    // Update state
                    state = { ...state, ...selectedNetwork }
                    // Store in localStorage
                    localStorage.setItem(state.storageName, JSON.stringify(state))
                }
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { selectNetwork } = networkSlice.actions

export default networkSlice.reducer
