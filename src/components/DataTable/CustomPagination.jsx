import Pagination from "@mui/material/Pagination"
import PaginationItem from "@mui/material/PaginationItem"
import {
    gridPageCountSelector,
    gridPageSelector,
    gridPageSizeSelector,
    gridRowCountSelector,
    useGridApiContext,
    useGridSelector
} from "@mui/x-data-grid"
import { useEffect, useState } from "react"

function CustomPagination() {
    const apiRef = useGridApiContext()
    const page = useGridSelector(apiRef, gridPageSelector)
    const pageCount = useGridSelector(apiRef, gridPageCountSelector)
    const pageSize = useGridSelector(apiRef, gridPageSizeSelector)
    const rowCount = useGridSelector(apiRef, gridRowCountSelector)
    const [fromRow, setFromRow] = useState(0)
    const [toRow, setToRow] = useState(0)

    useEffect(() => {
        setFromRow(page * pageSize + 1)
        if (page === pageCount - 1) {
            setToRow(rowCount)
            return
        }
        setToRow((page + 1) * pageSize)
    }, [page])

    return (
        <>
            <div>
                <span className="mx-2">
                    Show {fromRow} - {toRow} of {rowCount}
                </span>
            </div>
            <Pagination
                color="primary"
                variant="outlined"
                shape="rounded"
                page={page + 1}
                count={pageCount}
                // @ts-expect-error
                renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
                onChange={(event, value) => apiRef.current.setPage(value - 1)}
            />
        </>
    )
}
export default CustomPagination
