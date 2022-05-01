import { createSlice } from "@reduxjs/toolkit"
import { getBalance } from "./thunk/DataTableThunk"

const initialState = {}

export const ethereumSlice = createSlice({
    name: "ethereum",
    initialState,
    reducers: {},
    extraReducers: {
        [getBalance.pending]: (state) => {
            state.isLoading = true
        },
        [getBalance.fulfilled]: (state, action) => {
            state.isLoading = false
            state.web3 = action.payload
            console.log(action.payload, 1)
            console.log(state.web3, 1)
        },
        [getBalance.rejected]: (state, action) => {
            state.isLoading = false
            console.log(action.payload, 2)
        }
    }
})

// export const {} = ethereumSlice.actions

export default ethereumSlice.reducer
