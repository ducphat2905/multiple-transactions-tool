import "./app.css"
import "bootstrap/dist/css/bootstrap.min.css"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import { Routes, Route } from "react-router-dom"

import NavigationBar from "./components/Nav/NavigationBar"
import Footer from "./components/Footer/Footer"

import Home from "./pages/Home"
import Guide from "./pages/Guide"
import BulkTx from "./pages/BulkTx"
import Setting from "./pages/Setting"

function App() {
    return (
        <Container
            fluid
            style={{
                height: "100%",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
            <div>
                <NavigationBar />

                <Row style={{ padding: 0, margin: 0, justifyContent: "center" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/guide" element={<Guide />} />
                        <Route path="/bulk-tx" element={<BulkTx />} />
                        <Route path="/setting" element={<Setting />} />
                    </Routes>
                </Row>
            </div>

            <Footer />
        </Container>
    )
}

export default App
