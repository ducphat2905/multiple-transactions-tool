import { configureStore } from "@reduxjs/toolkit"
import networkReducer from "./redux/network"

export default configureStore({
    reducer: {
        network: networkReducer
    }
})
