import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"
import Dropdown from "react-bootstrap/Dropdown"

import { useLocation } from "react-router-dom"
import { useRef, useEffect, useState } from "react"

import logo from "../../logo.svg"
import Icons from "../Icon/Icons"
import BscIcon from "../Icon/bsc-icon.png"
import TronIcon from "../Icon/tron-icon.png"

function NavigationBar() {
    const [network, setNetwork] = useState("")
    const location = useLocation()
    const selectedNetworkRef = useRef()

    const getNetworkName = (_network) => {
        let name = ""
        switch (_network) {
            case "ethereum": {
                name = "Ethereum"
                break
            }
            case "bsc": {
                name = "Binance Smart Chain"
                break
            }
            case "tron": {
                name = "Tron network"
                break
            }
            default:
                break
        }

        return name
    }

    useEffect(() => {
        if (location.search) {
            const params = new URLSearchParams(location.search)
            const selectedNetwork = params.get("network")
            setNetwork(selectedNetwork)
            selectedNetworkRef.current.textContent = getNetworkName(selectedNetwork)
        }
    }, [location])

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
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/collect">Collect</Nav.Link>
                    <Nav.Link href="/spread">Spread</Nav.Link>
                    <Nav.Link href="/wallet">Wallet</Nav.Link>
                    <Nav.Link href="/setting">Setting</Nav.Link>
                </Nav>

                <Nav>
                    <Nav.Item>
                        <Dropdown as={ButtonGroup}>
                            <Button variant={network ? "info" : "danger"}>
                                {network === "ethereum" && <Icons iconName="FaEthereum" />}
                                {network === "bsc" && (
                                    <img src={BscIcon} alt="bsc-icon" width="15" height="15" />
                                )}
                                {network === "tron" && (
                                    <img src={TronIcon} alt="tron-icon" width="15" height="15" />
                                )}
                                <span className="m-1" ref={selectedNetworkRef}>
                                    Choose a network
                                </span>
                            </Button>

                            <Dropdown.Toggle
                                split
                                variant={network ? "info" : "danger"}
                                id="dropdown-split-basic"
                            />

                            <Dropdown.Menu>
                                <Dropdown.Item href="?network=ethereum">
                                    <Icons iconName="FaEthereum" /> Ethereum
                                </Dropdown.Item>
                                <Dropdown.Item href="?network=bsc">
                                    <img src={BscIcon} alt="bsc-icon" width="15" height="15" />{" "}
                                    Binance Smart Chain
                                </Dropdown.Item>
                                <Dropdown.Item href="?network=tron">
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
