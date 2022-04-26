import "./style.css"

// import PropTypes from "prop-types"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import SplitButton from "react-bootstrap/SplitButton"
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid"
import Icons, { IconNames } from "../Icon/Icons"
import { headerAlign, headerClassName } from "./ColumnStyle"

function CustomToolbar() {
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
                    <Button variant="outline-danger">
                        <Icons iconName={IconNames.FaTimes} />
                    </Button>
                </Col>
            </Row>
        </GridToolbarContainer>
    )
}

const rows = [
    { id: 1, col1: "Hello", col2: "World" },
    { id: 2, col1: "DataGridPro", col2: "is Awesome" },
    { id: 3, col1: "MUI", col2: "is Amazing" }
]

const columns = [
    {
        field: "col1",
        headerName: "Column 1",
        // width: 150,
        flex: 1,
        headerClassName,
        headerAlign,
        variant: "danger"
    },
    {
        field: "col2",
        headerName: "Column 2",
        // width: 150,
        flex: 1,
        headerClassName,
        headerAlign
    }
]

function DataTable() {
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

// DataTable.propTypes = {
//     rows: PropTypes.arrayOf(PropTypes.object).isRequired,
//     columns: PropTypes.arrayOf(PropTypes.object).isRequired
// }

export default DataTable
