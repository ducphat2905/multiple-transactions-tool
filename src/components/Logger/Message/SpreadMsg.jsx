import ListGroup from "react-bootstrap/ListGroup"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"

import Icon from "../../Icon/Icon"
import IconNames from "../../Icon/IconNames"

function SpreadMsg({ wallet }) {
    const chosenNetwork = useSelector((state) => state.network)
    const { token } = useSelector((state) => state.stage)
    const [amount] = useState(() =>
        wallet.transferredAmount !== null ? wallet.transferredAmount : "0"
    )
    const [walletLink] = useState(`${chosenNetwork.blockExplorer}address/${wallet.toAddress}`)
    const [transactionLink, setTransactionLink] = useState("")

    useEffect(() => {
        switch (chosenNetwork.id) {
            case "bsc":
            case "bsc-testnet":
            case "ethereum":
            case "ropsten":
                setTransactionLink(`${chosenNetwork.blockExplorer}tx/${wallet.transactionHash}`)
                break
            case "tron":
            case "shasta":
                setTransactionLink(
                    `${chosenNetwork.blockExplorer}transaction/${wallet.transactionHash}`
                )
                break
            default:
                break
        }
    }, [])

    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between">
                {!wallet.error ? (
                    <>
                        <p className="my-1 d-inline">
                            Spread <b>{amount}</b> {token.symbol} to{" "}
                            <a href={walletLink} target="_blank" rel="noreferrer">
                                {wallet.toAddress}
                            </a>
                            <span className="text-success m-1 p-1 d-block">
                                Transaction hash:{" "}
                                <a href={transactionLink} target="_blank" rel="noreferrer">
                                    {wallet.transactionHash}
                                </a>
                            </span>
                        </p>
                        <span>
                            <Icon name={IconNames.FaCheck} className="text-success" />
                        </span>
                    </>
                ) : (
                    <>
                        <p className="my-1 d-inline">
                            Failed to spread <b>{amount}</b> {token.symbol} to{" "}
                            <a href={walletLink} target="_blank" rel="noreferrer">
                                {wallet.toAddress}
                            </a>
                            <span className="text-danger m-1 p-1 d-block">{wallet.error}</span>
                        </p>
                        <span>
                            <Icon name={IconNames.FaTimes} className="text-danger" />
                        </span>
                    </>
                )}
            </div>
        </ListGroup.Item>
    )
}
SpreadMsg.propTypes = {
    wallet: PropTypes.object.isRequired
}

export default SpreadMsg
