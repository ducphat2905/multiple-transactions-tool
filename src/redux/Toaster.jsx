import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    show: false,
    title: "",
    message: ""
}

const toasterSlice = createSlice({
    name: "toaster",
    initialState,
    reducers: {
        toggleToaster(state, action) {
            const { show, message, title } = action.payload

            state.show = show
            state.title = title || ""
            state.message = message || ""
        }
    }
})

export const { toggleToaster } = toasterSlice.actions

export default toasterSlice.reducer
