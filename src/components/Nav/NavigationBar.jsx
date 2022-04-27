import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"
import Dropdown from "react-bootstrap/Dropdown"

import { useLocation, useSearchParams } from "react-router-dom"
import { useEffect, useRef, useMemo, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"

import { setNetwork, getChosenNetwork } from "../../redux/Network"

import logo from "../../logo.svg"
import Icons from "../Icon/Icons"
import BscIcon from "../Icon/bsc-icon.png"
import TronIcon from "../Icon/tron-icon.png"
import { NETWORKS } from "../../constants"

const { Ethereum, Bsc, Tron, Ropsten } = NETWORKS

function NavigationBar() {
    const location = useLocation()
    const [, setSearchParams] = useSearchParams()
    const network = useSelector((state) => state.network)
    const dispatch = useDispatch()
    const selectedNetworkRef = useRef()

    useEffect(() => {
        // Get chosen network from local storage
        dispatch(getChosenNetwork())
        // Set search params from selected network in the local storage
        if (network.id) setSearchParams({ networkId: network.id })
    }, [network])

    const selectNetwork = (networkId) => {
        dispatch(setNetwork(networkId))
        setSearchParams({ networkId })
    }

    const displaySelectedNetwork = useCallback(
        (networkId) => {
            switch (networkId) {
                case Bsc.id:
                    return <img src={BscIcon} alt="bsc-icon" width="15" height="15" />
                case Ethereum.id:
                case Ropsten.id:
                    return <Icons iconName="FaEthereum" />
                case Tron.id:
                    return <img src={TronIcon} alt="bsc-icon" width="15" height="15" />
                default:
                    return ""
            }
        },
        [network]
    )

    const networks = useMemo(() => {
        return [Bsc, Ethereum, Tron, Ropsten].map(({ id, name }) => (
            <Dropdown.Item key={id} onClick={() => selectNetwork(id)}>
                {[Ropsten.id, Ethereum.id].includes(id) && (
                    <Icons iconName="FaEthereum" className="mx-1" />
                )}

                {[Bsc.id].includes(id) && (
                    <img src={BscIcon} alt="bsc-icon" width="15" height="15" className="mx-1" />
                )}
                {[Tron.id].includes(id) && (
                    <img src={TronIcon} alt="tron-icon" width="15" height="15" className="mx-1" />
                )}
                {name}
            </Dropdown.Item>
        ))
    }, [])

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{" "}
                </Navbar.Brand>
                <Nav className="me-auto" defaultActiveKey="/" activeKey={location.pathname}>
                    <Nav.Link eventKey="/" href="/">
                        Home
                    </Nav.Link>
                    <Nav.Link eventKey="/collect" href="/collect">
                        Collect
                    </Nav.Link>
                    <Nav.Link eventKey="/spread" href="/spread">
                        Spread
                    </Nav.Link>
                    <Nav.Link eventKey="/wallet" href="/wallet">
                        Wallet
                    </Nav.Link>
                    <Nav.Link eventKey="/setting" href="/setting">
                        Setting
                    </Nav.Link>
                </Nav>

                <Nav>
                    <Nav.Item>
                        <Dropdown as={ButtonGroup}>
                            <Button
                                ref={selectedNetworkRef}
                                variant={network.id ? "info" : "danger"}>
                                {network.id && displaySelectedNetwork(network.id)}

                                <span className="mx-2">
                                    {network.id ? `${network.name}` : "Choose a network"}
                                </span>
                            </Button>

                            <Dropdown.Toggle
                                split
                                variant={network.id ? "info" : "danger"}
                                id="dropdown-split-basic"
                            />

                            <Dropdown.Menu>{networks}</Dropdown.Menu>
                        </Dropdown>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavigationBar
