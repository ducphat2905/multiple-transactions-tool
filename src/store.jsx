import { configureStore } from "@reduxjs/toolkit"
import networkReducer from "./redux/Network"
import dataTableReducer from "./redux/DataTable"

export default configureStore({
    reducer: {
        network: networkReducer,
        dataTable: dataTableReducer
    }
})
