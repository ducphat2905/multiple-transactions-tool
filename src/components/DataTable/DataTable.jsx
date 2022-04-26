import "./style.css"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import SplitButton from "react-bootstrap/SplitButton"
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Icons, { IconNames } from "../Icon/Icons"
import { getDataTable, removeDataTable } from "../../redux/DataTable"
import { getTokens } from "../../redux/Network"

function CustomToolbar() {
    const location = useLocation()
    const { tokens } = useSelector((state) => state.network)
    const dispatch = useDispatch()
    const [token, setToken] = useState(null)

    useEffect(() => {
        dispatch(getTokens())
    }, [location.search])

    // Remove the dropped file
    const dropTable = () => {
        dispatch(removeDataTable())
    }

    // Handle token selection
    const selectToken = (e) => {
        const { address, decimal, symbol } = e.target.dataset
        setToken({ address, decimal, symbol })
    }

    return (
        <GridToolbarContainer className="mb-4 justify-content-between">
            <Row>
                <Col>
                    <SplitButton
                        variant="outline-primary"
                        title={token ? `Token: (${token.symbol})` : "Token"}>
                        {tokens.map(({ address, symbol, decimal }) => (
                            <Dropdown.Item
                                key={symbol}
                                data-symbol={symbol}
                                data-address={address}
                                data-decimal={decimal}
                                onClick={selectToken}>
                                {symbol}
                            </Dropdown.Item>
                        ))}
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
