import { createSlice } from "@reduxjs/toolkit"

export const STAGES = Object.freeze({
    DropFile: "0",
    DataTable: "1",
    CollectForm: "2.1",
    SpreadForm: "2.2",
    Logger: "3"
})

const initialState = {
    current: STAGES.DropFile,
    feature: "",
    token: null
}

const stageSlice = createSlice({
    name: "stage",
    initialState,
    reducers: {
        setStage(state, action) {
            state.current = action.payload
        },
        setFeature(state, action) {
            const { feature, token } = action.payload
            state.feature = feature
            state.token = token
        }
    }
})

export const { setStage, setFeature } = stageSlice.actions

export default stageSlice.reducer
