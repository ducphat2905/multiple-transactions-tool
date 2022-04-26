import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import DataTable from "../components/DataTable/DataTable"
import DropFile from "../components/DropFile/DropFile"
import { setStorageName } from "../redux/DataTable"
import { DATA_TABLES } from "../constants"

function Collect() {
    const [hasData, setHasData] = useState(false)
    const { data } = useSelector((state) => state.dataTable)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(data)
        dispatch(setStorageName(DATA_TABLES.Collect))

        // if (data.length === 0) {
        //     dispatch(getDataTable())
        // }
    }, [])

    useEffect(() => {
        if (data.length > 0) setHasData(true)
    }, [data])

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
