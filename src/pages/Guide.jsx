import Accordion from "react-bootstrap/Accordion"
import { Link } from "react-router-dom"

import { useSelector } from "react-redux"

import InfuraExampleImg from "../assets/images/infura-rpc-endpoint-example.png"
import NoProviderErrorImg from "../assets/images/no-provider-error.png"
import InputTableImg from "../assets/images/input-table.png"
import SelectTokenImg from "../assets/images/select-token.png"
import BulkProcessImg from "../assets/images/bulk-process.png"
import ResultTableImg from "../assets/images/result-table.png"
import AddTokenInputImg from "../assets/images/add-token-input.png"
import AddTokenResultImg from "../assets/images/add-token-result.png"

function Guide() {
    const selectedNetwork = useSelector((state) => state.network)

    return (
        <div className="p-4 m-2">
            <h2 className="text-primary text-left">Frequently Asked Questions (FAQ)</h2>
            <Accordion className="p-0 my-4" defaultActiveKey="1">
                {/* Why I can not input my spreadsheet or csv file?  */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        1. Why I can not input my spreadsheet or csv file?
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>
                            Your spreadsheet/csv file need to include 3 columns below (with exact
                            name):
                        </p>
                        <ol>
                            <li>
                                <b>address</b>
                            </li>
                            <li>
                                <b>privateKey</b>
                            </li>
                            <li>
                                <b>amountToTransfer</b>
                            </li>
                        </ol>
                        <p>
                            <u>Note:</u> <b>amountToTransfer</b> can not be blank. It must be a
                            number or <b>&quot;all&quot;</b> to use the <i>Bulk</i> feature.
                        </p>
                    </Accordion.Body>
                </Accordion.Item>

                {/* How to use Bulk? */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        2. How to use <b className="mx-2">Bulk</b>?
                    </Accordion.Header>
                    <Accordion.Body>
                        <ol>
                            <li>
                                <p className="m-1 p-2">
                                    If you see this error, you need to go to{" "}
                                    <b>
                                        <Link to={`/setting?networkId=${selectedNetwork.id}`}>
                                            Setting
                                        </Link>
                                    </b>{" "}
                                    set up a provider for the network.
                                </p>
                                <img width="70%" src={NoProviderErrorImg} alt="No provider" />
                            </li>
                            <li>
                                <p className="m-1 p-2">
                                    An input table will show up after receiving your input file.
                                </p>
                                <img width="70%" src={InputTableImg} alt="Input table" />
                            </li>
                            <li>
                                <p className="m-1 p-2">Select a token you want to process.</p>
                                <img src={SelectTokenImg} alt="Select token" />
                            </li>
                            <li>
                                <p className="m-1 p-2">
                                    The <b>Bulk</b> feature will run and show the result during the
                                    process. Click Done to return the result table.
                                </p>
                                <img width="70%" src={BulkProcessImg} alt="Bulk is processing" />
                            </li>
                            <li>
                                <p className="m-1 p-2">
                                    The result table will show up and you can toggle between the
                                    <i>input</i> and <i>result</i> table.
                                </p>
                                <img width="70%" src={ResultTableImg} alt="Result table" />
                            </li>
                        </ol>
                    </Accordion.Body>
                </Accordion.Item>

                {/* How to add a token? */}
                <Accordion.Item eventKey="3">
                    <Accordion.Header>3. How to add a token?</Accordion.Header>
                    <Accordion.Body>
                        <ol>
                            <li>
                                <p className="m-1 p-2">
                                    Go to
                                    <b>
                                        <Link to={`/setting?networkId=${selectedNetwork.id}`}>
                                            Setting
                                        </Link>
                                    </b>{" "}
                                </p>
                            </li>
                            <li>
                                <p className="m-1 p-2">
                                    Paste the address of the token (contract) and click <b>Add</b>.
                                </p>
                                <img width="70%" src={AddTokenInputImg} alt="Add token's address" />
                            </li>
                            <li>
                                <p className="m-1 p-2">
                                    It will find information about the token and save it.
                                </p>
                                <img src={AddTokenResultImg} alt="Result of adding token" />
                            </li>
                        </ol>
                    </Accordion.Body>
                </Accordion.Item>

                {/* How to get a Provider? */}
                <Accordion.Item eventKey="4">
                    <Accordion.Header>
                        4. How to get the Provider for <b className="px-2">Ethereum</b> or{" "}
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
            </Accordion>
        </div>
    )
}
export default Guide
