import "./style.css"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import SplitButton from "react-bootstrap/SplitButton"
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import Icons, { IconNames } from "../Icon/Icons"
import { getDataTable, removeDataTable } from "../../redux/DataTable"

function CustomToolbar() {
    const dispatch = useDispatch()

    const dropTable = () => {
        dispatch(removeDataTable())
    }

    return (
        <GridToolbarContainer className="mb-4 justify-content-between">
            <Row>
                <Col>
                    <SplitButton variant="outline-primary" title="Token">
                        <Dropdown.Item eventKey="1">BNB</Dropdown.Item>
                        <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                        <Dropdown.Item eventKey="3" active>
                            Active Item
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </SplitButton>
                </Col>
            </Row>

            <Row className="align-items-center">
                <Col>
                    <div className="p-0 btn btn-outline-secondary">
                        <GridToolbarExport variant="outline-secondary" />
                    </div>
                </Col>
                <Col>
                    <Button variant="outline-danger" onClick={dropTable}>
                        <Icons iconName={IconNames.FaTimes} />
                    </Button>
                </Col>
            </Row>
        </GridToolbarContainer>
    )
}

function DataTable() {
    const { rows, columns } = useSelector((state) => state.dataTable)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getDataTable())
    }, [])

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            components={{ Toolbar: CustomToolbar }}
            className="p-3"
        />
    )
}

export default DataTable
