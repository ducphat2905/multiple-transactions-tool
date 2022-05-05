import "./style.css"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import SplitButton from "react-bootstrap/SplitButton"
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Icon from "../Icon/Icon"
import IconNames from "../Icon/IconNames"
import { getDataTable, removeDataTable } from "../../redux/DataTable"
import { getBalance } from "../../redux/thunk/DataTableThunk"

function Toolbar() {
    const { tokens } = useSelector((state) => state.network)
    const network = useSelector((state) => state.network)
    const { rows, columns } = useSelector((state) => state.dataTable)
    const dispatch = useDispatch()
    const [token, setToken] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        setToken(null)
    }, [network])

    // Remove the dropped file
    const dropTable = () => {
        dispatch(removeDataTable())
    }

    // Display error
    const displayTokenError = (_status) => {
        if (_status) setError("Please select a token.")
        else setError("")
    }

    // Handle token selection
    const selectToken = (e) => {
        displayTokenError(false)
        const { address, decimal, symbol } = e.target.dataset
        setToken({ address, decimal, symbol })
    }

    // Get balance
    const getBalanceHandler = () => {
        displayTokenError(false)

        if (!token) {
            displayTokenError(true)
            return
        }

        dispatch(
            getBalance({
                token,
                data: { rows, columns }
            })
        )
    }

    // Collect
    const collectHandler = () => {
        if (!token) return displayTokenError(true)

        return console.log("Get collectHandler")
    }

    return (
        <GridToolbarContainer className="mb-4 justify-content-between">
            <Row>
                <Col>
                    <SplitButton
                        className="mx-2"
                        variant="outline-success"
                        title={token ? `Get Balance: (${token.symbol})` : "Get Balance"}
                        onClick={getBalanceHandler}>
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
                    <SplitButton
                        variant="outline-primary"
                        title={token ? `Collect: (${token.symbol})` : "Collect"}
                        onClick={collectHandler}>
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

                    {error && (
                        <Alert className="mx-2 d-inline p-2" variant="danger">
                            Please select a token
                        </Alert>
                    )}
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
                        <Icon name={IconNames.FaTimes} />
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
            sx={{
                boxShadow: 2,
                border: 2,
                borderColor: "primary.dark",
                "& .MuiDataGrid-cell:hover": {
                    color: "primary.main"
                }
            }}
            initialState={{
                pagination: {
                    pageSize: 25
                }
            }}
            components={{ Toolbar }}
            className="m-2 p-3"
        />
    )
}

export default DataTable
