import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai"

import Icon from "../components/Icon/Icon"
import Network from "../objects/Network"

const features = [
    {
        title: "Collect",
        description:
            "Collect cryptocurrencies from multiple wallets and return to the given address.",
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
    const [mainNetworks, setMainNetworks] = useState([])
    const [testNetworks, setTestNetworks] = useState([])

    useEffect(() => {
        const newMainNetworks = []
        const newTestNetworks = []

        setting.networks.forEach((_network) => {
            const newNetwork = new Network({ ..._network })
            if (_network.type === "mainnet") {
                newMainNetworks.push(newNetwork)
            } else {
                newTestNetworks.push(newNetwork)
            }
        })

        setMainNetworks(newMainNetworks)
        setTestNetworks(newTestNetworks)
    }, [setting.networks])

    return (
        <Row className="m-3 px-4">
            <Col className="p-4 justify-content-center">
                <Card className="p-0 mt-4">
                    <Card.Header className="text-center">
                        <h3>Network Status</h3>
                    </Card.Header>
                    <Card.Body>
                        <Row className="p-2 justify-content-center">
                            <Col className="col-5 mx-2">
                                <div className="inline-block">
                                    <h4 className="mx-2 mb-4">
                                        <Badge bg="primary">Mainnet</Badge>
                                    </h4>
                                    <div className="mt-3">
                                        {mainNetworks.map((_network) => (
                                            <>
                                                <Row className="my-2" key={_network.id}>
                                                    <Col className="col-3">
                                                        <div>
                                                            <span className="mx-1">
                                                                {_network.getIconComponent()}
                                                            </span>
                                                            <b>{_network.name}</b>
                                                        </div>
                                                        {/* Ready */}
                                                    </Col>
                                                    <Col>
                                                        <div className="mx-4">
                                                            {_network.hasValidProvider ? (
                                                                <>
                                                                    <span className="text-success">
                                                                        <AiFillCheckCircle />
                                                                    </span>
                                                                    <i className="mx-2">Ready</i>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-danger">
                                                                        <AiFillCloseCircle />
                                                                    </span>
                                                                    <i className="mx-2 text-danger">
                                                                        Not configured
                                                                    </i>
                                                                </>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <hr />
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                            <Col className="col-5 mx-2">
                                <div className="inline-block">
                                    <h4 className="mx-2 mb-4">
                                        <Badge size="lg" bg="secondary">
                                            Testnet
                                        </Badge>
                                    </h4>

                                    <div className="mt-3">
                                        {testNetworks.map((_network) => (
                                            <>
                                                <Row className="my-2 p-1" key={_network.id}>
                                                    <Col className="col-3">
                                                        <div>
                                                            <span className="mx-1">
                                                                {_network.getIconComponent()}
                                                            </span>
                                                            <b>{_network.name}</b>
                                                        </div>
                                                        {/* Ready */}
                                                    </Col>
                                                    <Col>
                                                        <div className="mx-4">
                                                            {_network.hasValidProvider ? (
                                                                <>
                                                                    <span className="text-success">
                                                                        <AiFillCheckCircle />
                                                                    </span>
                                                                    <i className="mx-2">Ready</i>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-danger">
                                                                        <AiFillCloseCircle />
                                                                    </span>
                                                                    <i className="mx-2 text-danger">
                                                                        Not configured
                                                                    </i>
                                                                </>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <hr />
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <i>
                            Please go to
                            <span className="mx-2">
                                <Link to={`/setting?networkId=${selectedNetwork.id}`}>Setting</Link>
                            </span>
                            to configure
                        </i>
                    </Card.Footer>
                </Card>

                <div className="my-3 align-items-center row">
                    <h2 className="text-center m-2 p-2 text-info">
                        <u>Guides</u>
                    </h2>
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
                </div>
            </Col>
        </Row>
    )
}

export default Home
