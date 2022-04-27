import { configureStore } from "@reduxjs/toolkit"
import networkReducer from "./redux/Network"
import dataTableReducer from "./redux/DataTable"
import ethereumReducer from "./redux/Ethereum"

export default configureStore({
    reducer: {
        network: networkReducer,
        dataTable: dataTableReducer,
        ethereum: ethereumReducer
    }
})
