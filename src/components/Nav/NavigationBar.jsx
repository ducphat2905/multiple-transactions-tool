import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

import { useLocation } from "react-router-dom"

import logo from "../../logo.svg"

function NavigationBar() {
    const location = useLocation()

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
            </Container>
        </Navbar>
    )
}

export default NavigationBar
