import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    storageName: "",
    file: { name: "", type: "", size: 0 },
    columns: [],
    rows: []
}

const jsonToDataTable = (arrayOfData) => {
    const [headers, ...values] = arrayOfData
    // Create columns with styles
    const columns = headers.map((name) => {
        return {
            field: name,
            headerName: name.toUpperCase(),
            flex: 1,
            headerClassName: "bg-light",
            headerAlign: "center"
        }
    })

    // Create rows according to column's values
    const rows = values.map((value, index) => {
        const newRow = { id: index }

        for (let i = 0; i < headers.length; i++) {
            newRow[headers[i]] = value[i]
        }
        return newRow
    })

    return { rows, columns }
}

export const dataTableSlice = createSlice({
    name: "dataTable",
    initialState,
    reducers: {
        setStorageName: (state, action) => {
            state.storageName = action.payload
        },
        storeDataTable: (state, action) => {
            const { name, type, size, data } = action.payload
            const { rows, columns } = jsonToDataTable(data)

            const storageData = JSON.stringify({
                file: { name, type, size },
                rows,
                columns
            })
            localStorage.setItem(state.storageName, storageData)

            // Update state
            state.file.name = name
            state.file.type = type
            state.file.size = size
            // state.data = data
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
                state.file.name = file.name
                state.file.type = file.type
                state.file.size = file.size
                // state.data = data
                state.columns = columns
                state.rows = rows
            }
        }
    }
})

export const { getDataTable, storeDataTable, setStorageName, removeDataTable } =
    dataTableSlice.actions

export default dataTableSlice.reducer
