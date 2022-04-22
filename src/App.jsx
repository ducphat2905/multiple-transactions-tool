import "bootstrap/dist/css/bootstrap.min.css"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"

import NavigationBar from "./components/Nav/NavigationBar"
import Footer from "./components/Footer/Footer"

import Home from "./pages/Home"

function App() {
    return (
        <div className="App">
            <Container fluid>
                <Row>
                    <NavigationBar />
                </Row>
                <Row>
                    <Home />
                </Row>
                <Row className="bg-dark fixed-bottom">
                    <Footer />
                </Row>
            </Container>
        </div>
    )
}

export default App
