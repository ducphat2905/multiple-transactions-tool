import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useLocation } from "react-router-dom"

function Footer() {
    const location = useLocation()

    return (
        <Row
            className={`bg-dark ${
                ["/", "/setting"].includes(location.pathname) && "fixed-bottom"
            }`}>
            <Col className="text-white text-center p-2">&copy; 2022 Copyright: phatductran</Col>
        </Row>
    )
}
export default Footer
