import { createSlice } from "@reduxjs/toolkit"

export const TABLE_TYPES = Object.freeze({
    Empty: "empty-table",
    Input: "input-table",
    Result: "result-table"
})

const initialState = {
    tableType: localStorage.getItem(TABLE_TYPES.Input) ? TABLE_TYPES.Input : TABLE_TYPES.Empty,
    file: { name: "", type: "", size: 0 },
    columns: [],
    rows: []
}

export const dataTableSlice = createSlice({
    name: "dataTable",
    initialState,
    reducers: {
        setTableType: (state, action) => {
            state.tableType = action.payload
        },
        storeDataTable: (state, action) => {
            const { name, type, size, rows, tableType, columns } = action.payload

            const storageData = JSON.stringify({
                file: { name, type, size },
                rows,
                columns,
                tableType
            })

            if (tableType !== TABLE_TYPES.Empty) localStorage.setItem(tableType, storageData)

            // Update state
            state.file = {
                name,
                type,
                size
            }
            state.columns = columns
            state.rows = rows
            state.tableType = tableType
        },
        removeTable: (state, action) => {
            const { table } = action.payload
            if (table !== TABLE_TYPES.Empty) {
                localStorage.removeItem(table)
            }

            // Reset state
            return initialState
        },
        getDataTable: (state, action) => {
            const { table } = action.payload
            const storageData = localStorage.getItem(table)

            if (storageData) {
                const { file, rows, columns, tableType } = JSON.parse(storageData)

                state.file = file
                state.columns = columns
                state.rows = rows
                state.tableType = tableType
            } else {
                state.tableType = table
                state.rows = initialState.rows
            }
        }
    }
})

export const { setTableType, getDataTable, storeDataTable, removeTable } = dataTableSlice.actions

export default dataTableSlice.reducer
