import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import DataTable from "../components/DataTable/DataTable"
import DropFileComponent from "../components/DropFile/DropFile"
import { getDataTable, TABLE_TYPES } from "../redux/DataTable"
import { TOOL_STAGES } from "../constants"

function DropFile() {
    return <DropFileComponent />
}

function Table() {
    return <DataTable />
}

function CollectForm() {
    return <h1>Collect Form</h1>
}

function SpreadForm() {
    return <h1>Spread Form</h1>
}

function Logging() {
    return <h1>Logging</h1>
}

function Collect() {
    const [stage, setStage] = useState()
    const { tableType } = useSelector((state) => state.dataTable)
    const dispatch = useDispatch()

    useEffect(() => {
        switch (tableType) {
            case TABLE_TYPES.Empty:
                setStage(TOOL_STAGES.DropFile)
                break
            case TABLE_TYPES.Input:
                dispatch(getDataTable({ table: TABLE_TYPES.Input }))
                setStage(TOOL_STAGES.DataTable)
                break
            case TABLE_TYPES.Result:
                dispatch(getDataTable({ table: TABLE_TYPES.Result }))
                setStage(TOOL_STAGES.DataTable)
                break
            default:
                break
        }
    }, [tableType])

    return (
        <Row>
            <Col className="pb-5 px-4">
                {stage === TOOL_STAGES.DropFile && <DropFile />}
                {stage === TOOL_STAGES.DataTable && <Table />}
                {stage === TOOL_STAGES.CollectForm && <CollectForm />}
                {stage === TOOL_STAGES.SpreadForm && <SpreadForm />}
                {stage === TOOL_STAGES.Logging && <Logging />}
            </Col>
        </Row>
    )
}
export default Collect
