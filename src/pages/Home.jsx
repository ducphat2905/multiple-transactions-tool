import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Alert from "react-bootstrap/Alert"
import Accordion from "react-bootstrap/Accordion"
import ListGroup from "react-bootstrap/ListGroup"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import Icon from "../components/Icon/Icon"
import IconNames from "../components/Icon/IconNames"
import InfuraExampleImg from "../assets/images/infura-rpc-endpoint-example.png"

const features = [
    {
        title: "Collect",
        description:
            "Collect crytocurrencies from multiple wallets and return to the given address.",
        iconName: "BsStackOverflow"
    },
    {
        title: "Spread",
        description: "Spread cryptocurrencies from a given wallet to multiple wallets.",
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
    const setting = useSelector((state) => state.setting)
    const selectedNetwork = useSelector((state) => state.network)
    const [errors, setErrors] = useState([])

    useEffect(() => {
        const totalErrors = setting.networks.filter((_network) => !_network.hasValidProvider)
        setErrors(totalErrors)
    }, [setting.networks])

    return (
        <Row className="my-2 mx-1">
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
                                        <Icon name={_.iconName} />
                                    </span>
                                    {_.title}
                                </h2>
                                <p>{_.description}</p>
                            </Button>
                        </Col>
                    ))}

                    {/* Configuration Status */}
                    <Card className="p-0 mt-4">
                        <Card.Header className="text-center">Configuration Status</Card.Header>
                        <Card.Body>
                            {errors.length === 0 && (
                                <Alert variant="success">
                                    <p className="mb-0">
                                        <span className="m-2">
                                            <Icon name={IconNames.BsPatchCheckFill} />
                                        </span>
                                        All networks are ready for you!
                                    </p>
                                </Alert>
                            )}

                            {errors.length > 0 &&
                                errors.map((_network) => (
                                    <Alert key={_network.id} variant="danger">
                                        <p className="mb-0">
                                            <span className="m-2">
                                                <Icon name={IconNames.IoMdAlert} />
                                            </span>
                                            [{_network.name}] have not set up the provider. Go to{" "}
                                            <Link to={`/setting?networkId=${selectedNetwork.id}`}>
                                                Setting
                                            </Link>{" "}
                                            to configure it.
                                        </p>
                                    </Alert>
                                ))}
                        </Card.Body>
                    </Card>

                    {/* FAQ */}
                    <div>
                        <h2 className="p-3 my-2 text-primary text-center">
                            Frequently Asked Questions (FAQ)
                        </h2>
                        <Accordion className="p-0 my-4" defaultActiveKey="1">
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>How to get the RPC Endpoint ?</Accordion.Header>
                                <Accordion.Body>
                                    <Card>
                                        <Card.Body className="p-0">
                                            <Card.Header className="fw-bold">
                                                Ethereum and its testnets - by
                                                <Link className="mx-2" to="https://infura.io/">
                                                    Infura
                                                </Link>
                                            </Card.Header>
                                            <div className="card-text">
                                                <ListGroup as="ol" numbered varian="flush">
                                                    <ListGroup.Item as="li">Sign up</ListGroup.Item>
                                                    <ListGroup.Item as="li">
                                                        Create a project
                                                    </ListGroup.Item>
                                                    <ListGroup.Item as="li">
                                                        Go to setting and copy the URL
                                                        <img
                                                            src={InfuraExampleImg}
                                                            alt="Infura's endpoint"
                                                        />
                                                    </ListGroup.Item>
                                                    <ListGroup.Item as="li">
                                                        Paste above to set up your provider
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </Col>
            </Row>
        </Row>
    )
}

export default Home
