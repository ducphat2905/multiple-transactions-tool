import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"
import Card from "react-bootstrap/Card"
import Accordion from "react-bootstrap/Accordion"
import ListGroup from "react-bootstrap/ListGroup"
import Alert from "react-bootstrap/Alert"
import Table from "react-bootstrap/Table"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { RPC_ENDPOINTS } from "../constants"
import { addToken, updateNetworks } from "../redux/Setting"
import Network from "../objects/Network"
import Icon from "../components/Icon/Icon"
import IconNames from "../components/Icon/IconNames"
import InfuraExampleImg from "../assets/images/infura-rpc-endpoint-example.png"
import NetworkDropdown from "../components/Dropdown/NetworkDropdown"
import { selectNetwork } from "../redux/Network"

const { Bsc: BscEndpoints, BscTestnet: BscTestnetEndpoints } = RPC_ENDPOINTS

function Setting() {
    const setting = useSelector((state) => state.setting)
    const selectedNetwork = useSelector((state) => state.network)
    const dispatch = useDispatch()
    const [networks, setNetworks] = useState(() =>
        setting.networks.map((_network) => new Network({ ..._network }))
    )
    const [network, setNetwork] = useState(new Network({ ...selectedNetwork }))
    const [tokenAddress, setTokenAddress] = useState("")
    const [tokenError, setTokenError] = useState("")
    const [tokenSuccess, setTokenSuccess] = useState("")
    const [endpointSuccess, setEndpointSuccess] = useState("")

    const onChangeEndpoint = (networkId, rpcEndpoint) => {
        setNetworks((prevItems) =>
            prevItems.map((item) => {
                if (item.id === networkId) {
                    item.rpcEndpoint = rpcEndpoint
                }

                return item
            })
        )
    }

    const onSaveEndpoints = (e) => {
        e.preventDefault()
        // Parse from an array of Network to an array of Object
        const newNetworks = networks.map((_network) => ({ ..._network }))
        // Save to local storage
        dispatch(updateNetworks({ networks: newNetworks }))

        setEndpointSuccess("Successful!")
        setTimeout(() => {
            setEndpointSuccess("")
        }, 1800)
    }

    const showTokens = (_network) => {
        if (_network.id !== network.id) {
            setNetwork(_network)
        }
    }

    const addTokenHandler = () => {
        if (network.id) {
            const newToken = {
                address: tokenAddress,
                symbol: "symbol",
                decimal: 18
            }
            dispatch(
                addToken({
                    networkId: network.id,
                    token: newToken
                })
            )

            dispatch(selectNetwork({ id: network.id }))
            setNetwork((prev) => ({ ...prev, tokens: [...prev.tokens, newToken] }))
            setTokenSuccess("Successful!")
            setTokenError("")
        } else {
            setTokenSuccess("")
            setTokenError("Please select a network")
        }
    }

    return (
        <Row className="pb-5 px-4">
            <Col className="m-3 p-2">
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Set RPC Endpoints</Accordion.Header>
                        <Accordion.Body>
                            <Form onSubmit={onSaveEndpoints}>
                                <Col className="m-2 p-1">
                                    {networks.map((_network) => (
                                        <InputGroup key={_network.id} className="mb-3">
                                            <InputGroup.Text id="basic-addon1">
                                                <span className="mx-1">
                                                    {_network.getIconComponent()}
                                                </span>
                                                {_network.name}
                                            </InputGroup.Text>

                                            {_network.id === "bsc" ? (
                                                <Form.Select
                                                    value={_network.rpcEndpoint}
                                                    onChange={(e) =>
                                                        onChangeEndpoint(
                                                            _network.id,
                                                            e.target.value
                                                        )
                                                    }>
                                                    <option value="">Choose a RPC endpoint</option>
                                                    {BscEndpoints.map((endpoint) => (
                                                        <option key={endpoint} value={endpoint}>
                                                            {endpoint}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            ) : (
                                                <FormControl
                                                    value={_network.rpcEndpoint}
                                                    onChange={(e) =>
                                                        onChangeEndpoint(
                                                            _network.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter the RPC's endpoint here."
                                                />
                                            )}

                                            <Button
                                                className="row"
                                                variant={
                                                    _network.rpcEndpoint ? "success" : "danger"
                                                }>
                                                {_network.rpcEndpoint ? (
                                                    <Icon name={IconNames.AiOutlineCheckCircle} />
                                                ) : (
                                                    <Icon name={IconNames.AiFillCloseCircle} />
                                                )}
                                            </Button>
                                        </InputGroup>
                                    ))}
                                </Col>

                                <Col className="row">
                                    {endpointSuccess && (
                                        <Alert varian="success">{endpointSuccess}</Alert>
                                    )}
                                    <Button
                                        size="md"
                                        type="submit"
                                        className="mb-2"
                                        style={{ width: "100%" }}>
                                        Save
                                    </Button>
                                </Col>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                        <Accordion.Header>How to get the RPC Endpoint ?</Accordion.Header>
                        <Accordion.Body>
                            <Card>
                                <Card.Body className="p-0">
                                    <Card.Header className="fw-bold">
                                        Ethereum and its testnets - by
                                        <Link className="mx-2" to="https://infura.io/">
                                            Infura
                                        </Link>
                                    </Card.Header>
                                    <div className="card-text">
                                        <ListGroup as="ol" numbered varian="flush">
                                            <ListGroup.Item as="li">Sign up</ListGroup.Item>
                                            <ListGroup.Item as="li">
                                                Create a project
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li">
                                                Go to setting and copy the URL
                                                <img
                                                    src={InfuraExampleImg}
                                                    alt="Infura's endpoint"
                                                />
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li">
                                                Paste above to set up your RPC endpoint
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>

            <Col className="m-3 p-2">
                <Accordion defaultActiveKey="2">
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Tokens</Accordion.Header>
                        <Accordion.Body className="row">
                            <Col md={3} className="pr-0">
                                <NetworkDropdown selectHandler={showTokens} />
                            </Col>
                            <Col md={9} className="pl-0">
                                <InputGroup className="mb-3">
                                    <FormControl
                                        value={tokenAddress}
                                        onChange={(e) => setTokenAddress(e.target.value)}
                                        placeholder="Token's address"
                                        aria-label="Token's address"
                                    />
                                    <Button
                                        variant="outline-primary"
                                        id="add-token-button"
                                        onClick={addTokenHandler}>
                                        Add
                                    </Button>
                                </InputGroup>
                            </Col>
                            <Col md={12}>
                                {tokenError && <Alert variant="danger">{tokenError}</Alert>}
                                {tokenSuccess && <Alert variant="success">{tokenSuccess}</Alert>}
                            </Col>

                            <Col md={12} className="mt-3">
                                <Table bordered hover size="md">
                                    <thead className="bg-dark text-white">
                                        <tr className="text-center">
                                            <td colSpan={4} className="p-2">
                                                <h5 className="m-0">Token List (Ethereum)</h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>#</th>
                                            <th>Symbol</th>
                                            <th>Address</th>
                                            <th>Decimal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {network.tokens.map((_token, index) => (
                                            <tr key={`${_token.symbol}-${_token.address}`}>
                                                <td>{index + 1}</td>
                                                <td>{_token.symbol}</td>
                                                <td>{_token.address}</td>
                                                <td>{_token.decimal}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
    )
}
export default Setting
