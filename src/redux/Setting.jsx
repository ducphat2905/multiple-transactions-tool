import { createSlice } from "@reduxjs/toolkit"
import { NETWORKS } from "../constants"
import { settingStorage } from "./storageNames"

const initialNetworks = () => {
    // Get from "constant.jsx" by default
    let networks = NETWORKS.map((network) => ({ ...network }))

    // Get from local storage
    const settingData = localStorage.getItem(settingStorage)
    if (settingData) {
        const storageData = JSON.parse(settingData)
        networks = storageData.networks
    } else {
        // Save to local storage
        localStorage.setItem(
            settingStorage,
            JSON.stringify({
                storageName: settingStorage,
                networks
            })
        )
    }

    return networks
}

const initialState = {
    storageName: settingStorage,
    networks: initialNetworks()
}

const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {
        updateNetworks(state, action) {
            const { networks } = action.payload
            state.networks = networks

            // Save to local storage
            localStorage.setItem(state.storageName, JSON.stringify(state))
        },
        addToken(state, action) {
            const { networkId, token } = action.payload

            const newNetworks = state.networks.map((_network) => {
                if (_network.id === networkId) {
                    _network.tokens.push(token)
                }
                return _network
            })

            state.networks = newNetworks

            // Save to local storage
            localStorage.setItem(state.storageName, JSON.stringify(state))
        }
    }
})

export const { updateNetworks, addToken } = settingSlice.actions

export default settingSlice.reducer
