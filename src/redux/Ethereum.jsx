import { createSlice } from "@reduxjs/toolkit"
import Web3 from "web3"

let web3 = null
const initialState = {
    provider: "",
    web3: null
}

const ethereumSlice = createSlice({
    name: "ethereum",
    initialState,
    reducers: {
        setProvider: (state, action) => {
            const provider = action.payload
            state.provider = provider
            // state.web3 = new Web3(provider)
            if (!state.web3) {
               web3 = new Web3(provider)
               state.web3 = JSON.stringify(web3.toString())
            }
        },
        getBalance: async (state) => {
            // await state.web3.getBalance("asd")
            console.log("get balance")
        }
    }
})

export const { setProvider } = ethereumSlice.actions

export default ethereumSlice.reducer
