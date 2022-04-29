import { configureStore } from "@reduxjs/toolkit"
import networkReducer from "./redux/Network"
import dataTableReducer from "./redux/DataTable"
import settingReducer from "./redux/Setting"

export default configureStore({
    reducer: {
        network: networkReducer,
        dataTable: dataTableReducer,
        setting: settingReducer
    }
})
