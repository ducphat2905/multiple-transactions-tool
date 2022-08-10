import Accordion from "react-bootstrap/Accordion"
import { Link } from "react-router-dom"

import { useSelector } from "react-redux"

import InfuraExampleImg from "../assets/images/infura-rpc-endpoint-example.png"

function Guide() {
    const selectedNetwork = useSelector((state) => state.network)

    return (
        <div className="p-4 m-2">
            <h2 className="text-primary text-left">Frequently Asked Questions (FAQ)</h2>
            <Accordion className="p-0 my-4" defaultActiveKey="1">
                {/* How to get a Provider */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        How to get the Provider for <b className="px-2">Ethereum</b> or{" "}
                        <b className="px-2">Ropsten</b> ?
                    </Accordion.Header>
                    <Accordion.Body>
                        <ol>
                            <li>
                                Sign up{" "}
                                <a
                                    className="mx-2"
                                    href="https://infura.io/"
                                    target="_blank"
                                    rel="noreferrer">
                                    Infura
                                </a>{" "}
                                account
                            </li>
                            <li>Create a project</li>
                            <li>
                                Go to setting and copy the URL
                                <div className="m-3">
                                    <img src={InfuraExampleImg} alt="Infura's endpoint" />
                                </div>
                            </li>
                            <li>
                                Go to{" "}
                                <Link to={`/setting?networkId=${selectedNetwork.id}`}>Setting</Link>{" "}
                                and paste it to the correct network.
                            </li>
                        </ol>
                    </Accordion.Body>
                </Accordion.Item>

                {/* How to use Bulk */}
            </Accordion>
        </div>
    )
}
export default Guide
