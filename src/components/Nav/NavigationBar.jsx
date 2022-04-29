import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

import { useLocation, useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import { setNetwork } from "../../redux/Network"

import logo from "../../logo.svg"
import Networks from "../Dropdown/Networks"

function NavigationBar() {
    const location = useLocation()
    const [, setSearchParams] = useSearchParams()
    const network = useSelector((state) => state.network)
    const dispatch = useDispatch()

    useEffect(() => {
        if (network.id) {
            // Add chosen network to URL
            setSearchParams({ networkId: network.id })
        }
    }, [network])

    const selectNetwork = (_network) => {
        dispatch(setNetwork({ ..._network }))
        setSearchParams({ networkId: _network.id })
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
                        <Networks selectHandler={selectNetwork} />
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavigationBar
