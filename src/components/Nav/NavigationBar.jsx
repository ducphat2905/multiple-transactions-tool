import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"
import Dropdown from "react-bootstrap/Dropdown"

import { useLocation, useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import { setNetwork } from "../../redux/network"

import logo from "../../logo.svg"
import Icons from "../Icon/Icons"
import BscIcon from "../Icon/bsc-icon.png"
import TronIcon from "../Icon/tron-icon.png"

function NavigationBar() {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const network = useSelector((state) => state.network)
    const dispatch = useDispatch()

    useEffect(() => {
        // Handle switching between networks
        const networkId = searchParams.get("networkId")
        if (networkId && networkId !== network.id) {
            dispatch(setNetwork(networkId))
        }
    }, [location])

    // Attach search params to the URL
    const attachSearchParams = (destination) => {
        let destinationRoute = destination

        // Include the param of network if existed
        if (searchParams.get("networkId")) {
            destinationRoute = `${destination}?networkId=${searchParams.get("networkId")}`
        }

        return destinationRoute
    }

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
                    <Nav.Link eventKey="/collect" href={attachSearchParams("/collect")}>
                        Collect
                    </Nav.Link>
                    <Nav.Link eventKey="/spread" href={attachSearchParams("/spread")}>
                        Spread
                    </Nav.Link>
                    <Nav.Link eventKey="/wallet" href={attachSearchParams("/wallet")}>
                        Wallet
                    </Nav.Link>
                    <Nav.Link eventKey="/setting" href={attachSearchParams("/setting")}>
                        Setting
                    </Nav.Link>
                </Nav>

                <Nav>
                    <Nav.Item>
                        <Dropdown as={ButtonGroup}>
                            <Button variant={network.id ? "info" : "danger"}>
                                {network.id === "ethereum" && <Icons iconName="FaEthereum" />}
                                {network.id === "bsc" && (
                                    <img src={BscIcon} alt="bsc-icon" width="15" height="15" />
                                )}
                                {network.id === "tron" && (
                                    <img src={TronIcon} alt="tron-icon" width="15" height="15" />
                                )}
                                <span className="m-1">
                                    {network.name ? `${network.name}` : "Choose a network"}
                                </span>
                            </Button>

                            <Dropdown.Toggle
                                split
                                variant={network.id ? "info" : "danger"}
                                id="dropdown-split-basic"
                            />

                            <Dropdown.Menu>
                                <Dropdown.Item href="?networkId=ethereum">
                                    <Icons iconName="FaEthereum" /> Ethereum
                                </Dropdown.Item>
                                <Dropdown.Item href="?networkId=bsc">
                                    <img src={BscIcon} alt="bsc-icon" width="15" height="15" />{" "}
                                    Binance Smart Chain
                                </Dropdown.Item>
                                <Dropdown.Item href="?networkId=tron">
                                    <img src={TronIcon} alt="tron-icon" width="15" height="15" />{" "}
                                    Tron Network
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavigationBar
