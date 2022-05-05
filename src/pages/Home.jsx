import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Alert from "react-bootstrap/Alert"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import Icon from "../components/Icon/Icon"
import IconNames from "../components/Icon/IconNames"

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
                                        <Icon name={_.iconName} />
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
                </Col>
            </Row>
        </Row>
    )
}

export default Home
