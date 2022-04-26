import { createSlice } from "@reduxjs/toolkit"

export const dataTableSlice = createSlice({
    name: "dataTable",
    initialState: {
        storageName: "",
        file: { name: "", type: "", size: 0 },
        data: []
    },
    reducers: {
        setStorageName: (state, action) => {
            state.storageName = action.payload
        },
        storeDataTable: (state, action) => {
            const { name, type, size, data } = action.payload
            const storageData = JSON.stringify({
                file: { name, type, size },
                data
            })
            localStorage.setItem(state.storageName, storageData)

            // Update state
            state.file.name = name
            state.file.type = type
            state.file.size = size
            state.data = data
        },
        getDataTable: (state) => {
            const storageData = localStorage.getItem(state.storageName)

            if (storageData) {
                state.file.name = storageData.file.name
                state.file.type = storageData.file.type
                state.file.size = storageData.file.size
                state.data = storageData.data
            }
        }
    }
})

export const { getDataTable, storeDataTable, setStorageName } = dataTableSlice.actions

export default dataTableSlice.reducer
