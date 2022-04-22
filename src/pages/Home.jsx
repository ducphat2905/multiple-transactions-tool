import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
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
    return (
        <>
            <h1 className="px-4 py-3 text-primary text-center">
                <u>Features</u>
            </h1>
            <Row className="p-4 justify-content-center">
                <Col md={8} className="align-items-center row">
                    {features.map((_) => (
                        <Col md={3} key={_.title} className="my-2 p-2">
                            <Button variant="light" style={{ width: "100%" }} className="p-3">
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
                </Col>
            </Row>
        </>
    )
}

export default Home
