import { configureStore } from "@reduxjs/toolkit"
import networkReducer from "./redux/Network"
import dataTableReducer from "./redux/DataTable"
import settingReducer from "./redux/Setting"
import toasterReducer from "./redux/Toaster"
// import web3jsReducer from "./redux/Web3"

export default configureStore({
    reducer: {
        network: networkReducer,
        dataTable: dataTableReducer,
        setting: settingReducer,
        toaster: toasterReducer,
        // web3js: web3jsReducer
    }
})
