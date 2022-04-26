import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import DataTable from "../components/DataTable/DataTable"
import DropFile from "../components/DropFile/DropFile"
import { getDataTable, setStorageName } from "../redux/DataTable"
import { DATA_TABLES } from "../constants"

function Collect() {
    const [hasData, setHasData] = useState(false)
    const { rows, columns } = useSelector((state) => state.dataTable)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setStorageName(DATA_TABLES.Collect))
    })

    useEffect(() => {
        dispatch(getDataTable())
    }, [])

    useEffect(() => {
        if (rows.length > 0) setHasData(true)
        else setHasData(false)
    }, [rows, columns])

    return (
        <Row>
            <Col className="my-4 mx-3">
                {hasData && <DataTable />}
                {!hasData && <DropFile />}
            </Col>
        </Row>
    )
}
export default Collect
