import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Alert from "react-bootstrap/Alert"
import { useNavigate } from "react-router-dom"

import Icons from "../components/Icon/Icons"

const features = [
    {
        title: "Collect",
        description:
            "Collect crytocurrencies from multiple wallets and return to the given address.",
        iconName: "BsStackOverflow"
    },
    {
        title: "Spread",
        description: "Spread crytocurrencies from a given wallet to multiple wallets.",
        iconName: "BsFillDiagram3Fill"
    },
    {
        title: "Wallet",
        description: "Create and activate wallets from different blockchain networks.",
        iconName: "GiWallet"
    },
    {
        title: "Setting",
        description: "Set up addresses, API key in order to send transactions.",
        iconName: "FaCogs"
    }
]

function Home() {
    const navigate = useNavigate()

    return (
        <Row>
            <h1 className="px-4 py-3 text-primary text-center">
                <u>Features</u>
            </h1>
            <Row className="p-4 justify-content-center">
                <Col md={8} className="align-items-center row">
                    {features.map((_) => (
                        <Col md={3} key={_.title} className="my-2 p-2">
                            <Button
                                variant="light"
                                style={{ width: "100%" }}
                                className="p-3"
                                onClick={() => navigate(`/${_.title.toLowerCase()}`)}>
                                <h2 className="mb-4">
                                    <span className="m-2">
                                        <Icons iconName={_.iconName} />
                                    </span>
                                    {_.title}
                                </h2>
                                <p>{_.description}</p>
                            </Button>
                        </Col>
                    ))}

                    <Card className="p-0 mt-4">
                        <Card.Header className="text-center">Configuration Status</Card.Header>
                        <Card.Body>
                            <Alert variant="success">
                                <p className="mb-0">
                                    <span className="m-2">
                                        <Icons iconName="BsPatchCheckFill" />
                                    </span>
                                    Network API Key is configured.
                                </p>
                            </Alert>
                            <Alert variant="danger">
                                <p className="mb-0">
                                    <span className="m-2">
                                        <Icons iconName="BsPatchCheckFill" />
                                    </span>
                                    Network API Key is NOT configured.
                                </p>
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Row>
    )
}

export default Home
