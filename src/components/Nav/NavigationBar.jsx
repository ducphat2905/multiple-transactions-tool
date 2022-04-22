import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

import { useEffect, useRef } from "react"

import logo from "../../logo.svg"

function NavigationBar() {
    const homeLink = useRef()

    useEffect(() => {
        homeLink.current.click()
    }, [])

    const setActive = (e) => {
        e.target.active = true
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{" "}
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link ref={homeLink} href="#home" onClick={setActive}>
                        Home
                    </Nav.Link>
                    <Nav.Link href="#collect" onClick={setActive}>
                        Collect
                    </Nav.Link>
                    <Nav.Link href="#spread" onClick={setActive}>
                        Spread
                    </Nav.Link>
                    <Nav.Link href="#Wallet" onClick={setActive}>
                        Wallet
                    </Nav.Link>
                    <Nav.Link href="#setting" onClick={setActive}>
                        Setting
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavigationBar
