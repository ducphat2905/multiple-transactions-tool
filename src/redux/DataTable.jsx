import { createSlice } from "@reduxjs/toolkit"
import { INPUT_COLUMNS } from "../constants"

const initialState = {
    storageName: "",
    file: { name: "", type: "", size: 0 },
    columns: [],
    rows: []
}

export const dataTableSlice = createSlice({
    name: "dataTable",
    initialState,
    reducers: {
        setStorageName: (state, action) => {
            state.storageName = action.payload
        },
        setColumns: (state, action) => {
            state.columns = action.payload
        },
        storeDataTable: (state, action) => {
            const { name, type, size, data } = action.payload
            const columns = INPUT_COLUMNS
            const rows = data.map((value, index) => ({
                id: index,
                ...value
            }))

            const storageData = JSON.stringify({
                file: { name, type, size },
                rows,
                columns
            })
            localStorage.setItem(state.storageName, storageData)

            // Update state
            state.file = {
                name,
                type,
                size
            }
            state.columns = columns
            state.rows = rows
        },
        removeDataTable: (state) => {
            if (state.storageName) {
                localStorage.removeItem(state.storageName)
            }
            // Reset state
            return initialState
        },
        getDataTable: (state) => {
            const storageData = localStorage.getItem(state.storageName)

            if (storageData) {
                const { file, rows, columns } = JSON.parse(storageData)

                state.file = file
                state.columns = columns
                state.rows = rows
            }
        }
    }
})

export const { getDataTable, storeDataTable, setStorageName, setColumns, removeDataTable } =
    dataTableSlice.actions

export default dataTableSlice.reducer
