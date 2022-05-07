import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import DataTable from "../components/DataTable/DataTable"
import DropFileComponent from "../components/DropFile/DropFile"
import { getDataTable, setStorageName } from "../redux/DataTable"
import { DATA_TABLES } from "../redux/storageNames"
import { TOOL_STAGES } from "../constants"

function DropFile() {
    return <DropFileComponent />
}

function InputTable() {
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

function ResultTable() {
    return <DataTable />
}

function Collect() {
    const [stage, setStage] = useState(TOOL_STAGES.DropFile)
    const { rows, columns } = useSelector((state) => state.dataTable)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setStorageName(DATA_TABLES.Collect))
    })

    useEffect(() => {
        dispatch(getDataTable())
    }, [])

    useEffect(() => {
        if (rows.length > 0) setStage(TOOL_STAGES.InputTable)
        else setStage(TOOL_STAGES.DropFile)
    }, [rows, columns])

    return (
        <Row>
            <Col className="pb-5 px-4">
                {stage === TOOL_STAGES.DropFile && <DropFile />}
                {stage === TOOL_STAGES.InputTable && <InputTable />}
                {stage === TOOL_STAGES.CollectForm && <CollectForm />}
                {stage === TOOL_STAGES.SpreadForm && <SpreadForm />}
                {stage === TOOL_STAGES.Logging && <Logging />}
                {stage === TOOL_STAGES.ResultTable && <ResultTable />}
            </Col>
        </Row>
    )
}
export default Collect
