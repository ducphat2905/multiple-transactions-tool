import ListGroup from "react-bootstrap/ListGroup"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import { useState } from "react"

import Icon from "../../Icon/Icon"
import IconNames from "../../Icon/IconNames"

function GetBalanceMsg({ wallet }) {
    const chosenNetwork = useSelector((state) => state.network)
    const { token } = useSelector((state) => state.stage)
    const [balance] = useState(wallet[token.symbol] != null ? wallet[token.symbol] : "unknown")
    const [walletLink] = useState(`${chosenNetwork.blockExplorer}address/${wallet.fromAddress}`)

    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between">
                {!wallet.error ? (
                    <>
                        <p className="my-1 d-inline">
                            <a href={walletLink} target="_blank" rel="noreferrer">
                                {wallet.address}
                            </a>{" "}
                            has <b>{balance}</b> {token.symbol}
                        </p>
                        <Icon name={IconNames.FaCheck} className="text-success" />
                    </>
                ) : (
                    <>
                        <p className="my-1 d-inline">
                            Failed to get balance of {token.symbol} from{" "}
                            <a href={walletLink} target="_blank" rel="noreferrer">
                                {wallet.address}
                            </a>
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

GetBalanceMsg.propTypes = {
    wallet: PropTypes.object.isRequired
}
export default GetBalanceMsg
