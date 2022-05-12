import { configureStore } from "@reduxjs/toolkit"
import networkReducer from "./redux/Network"
import dataTableReducer from "./redux/DataTable"
import settingReducer from "./redux/Setting"
import toasterReducer from "./redux/Toaster"
import abiReducer from "./redux/ABI"

export default configureStore({
    reducer: {
        network: networkReducer,
        dataTable: dataTableReducer,
        setting: settingReducer,
        abi: abiReducer,
        toaster: toasterReducer
    }
})
