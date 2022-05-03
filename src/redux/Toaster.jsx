import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    show: false,
    message: ""
}

const toasterSlice = createSlice({
    name: "toaster",
    initialState,
    reducers: {
        toggleToaster(state, action) {
            const { show, message } = action.payload
            console.log(state)
            if (show) {
                state.show = true
                state.message = message
            } else {
                state.show = false
                state.message = ""
            }
        }
    }
})

export const { toggleToaster } = toasterSlice.actions

export default toasterSlice.reducer
