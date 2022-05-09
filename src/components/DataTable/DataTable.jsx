import { DataGrid } from "@mui/x-data-grid"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

import CustomToolbar from "./CustomToolbar"
import CustomPagination from "./CustomPagination"
import { getDataTable } from "../../redux/DataTable"

function Pagination() {
    return <CustomPagination />
}

function Toolbar() {
    return <CustomToolbar />
}

function DataTable() {
    const { rows, columns, tableType } = useSelector((state) => state.dataTable)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getDataTable({ table: tableType }))
    }, [tableType])

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            sx={{
                boxShadow: 4
            }}
            initialState={{
                pagination: {
                    pageSize: 25
                }
            }}
            components={{ Toolbar, Pagination }}
            className="m-2 p-3"
        />
    )
}

export default DataTable
