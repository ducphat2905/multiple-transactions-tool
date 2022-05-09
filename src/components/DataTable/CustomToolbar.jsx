import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import SplitButton from "react-bootstrap/SplitButton"
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import Nav from "react-bootstrap/Nav"
import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Icon from "../Icon/Icon"
import IconNames from "../Icon/IconNames"
import { removeTable, setTableType, TABLE_TYPES } from "../../redux/DataTable"
import EthereumThunk from "../../redux/thunk/EthereumThunk"

function CustomToolbar() {
    const { tokens } = useSelector((state) => state.network)
    const network = useSelector((state) => state.network)
    const { rows, tableType, feature } = useSelector((state) => state.dataTable)
    const dispatch = useDispatch()
    const [token, setToken] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        setToken(null)
    }, [network])

    // Remove the dropped file
    const dropTable = () => {
        dispatch(removeTable({ table: tableType }))
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
            EthereumThunk.getBalance({
                token,
                wallets: rows
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
            {/* Get balance / Collect / Spread */}
            <Row>
                <Col>
                    <SplitButton
                        className="mx-2"
                        variant="outline-dark"
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
                        className="mx-2"
                        variant="outline-success"
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

                    <SplitButton
                        className="mx-2"
                        variant="outline-primary"
                        title={token ? `Spread: (${token.symbol})` : "Spread"}
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

            {/* Input / Result table */}
            <Row>
                <Col>
                    <Nav variant="tabs" defaultActiveKey="input-table">
                        <Nav.Item>
                            <Nav.Link
                                className={
                                    tableType === TABLE_TYPES.Input
                                        ? "btn bg-warning text-white"
                                        : "btn border"
                                }
                                eventKey="input-table"
                                onClick={() => dispatch(setTableType(TABLE_TYPES.Input))}>
                                Input
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                className={
                                    tableType === TABLE_TYPES.Result
                                        ? "btn bg-warning text-white"
                                        : "btn border"
                                }
                                eventKey="result-table"
                                onClick={() => dispatch(setTableType(TABLE_TYPES.Result))}>
                                Result {feature && `(${feature})`}
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
            </Row>

            {/* Export / Remove file */}
            <Row>
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

export default CustomToolbar
