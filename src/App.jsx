import "bootstrap/dist/css/bootstrap.min.css"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import { Routes, Route } from "react-router-dom"

import NavigationBar from "./components/Nav/NavigationBar"
import Footer from "./components/Footer/Footer"

import Home from "./pages/Home"
import Collect from "./pages/Collect"
import Spread from "./pages/Spread"
import Setting from "./pages/Setting"
import Wallet from "./pages/Wallet"

function App() {
    return (
        <Container fluid>
            <Row>
                <NavigationBar />
            </Row>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collect" element={<Collect />} />
                <Route path="/spread" element={<Spread />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/setting" element={<Setting />} />
            </Routes>

            <Footer />
        </Container>
    )
}

export default App
