import ListGroup from "react-bootstrap/ListGroup"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"

import Icon from "../../Icon/Icon"
import IconNames from "../../Icon/IconNames"

function GetBalanceMsg({ wallet }) {
    const chosenNetwork = useSelector((state) => state.network)
    const { token } = useSelector((state) => state.stage)

    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between">
                {!wallet.error ? (
                    <>
                        <p className="my-1 d-inline">
                            <a
                                href={`${chosenNetwork.blockExplorer}address/${wallet.address}`}
                                target="_blank"
                                rel="noreferrer">
                                {wallet.address}
                            </a>{" "}
                            has <b>{wallet[token.symbol] ? wallet[token.symbol] : "0"}</b>{" "}
                            {token.symbol}
                        </p>
                        <Icon name={IconNames.FaCheck} className="text-success" />
                    </>
                ) : (
                    <>
                        <p className="my-1 d-inline">
                            Failed to get balance of {token.symbol} from{" "}
                            <a
                                href={`${chosenNetwork.blockExplorer}address/${wallet.address}`}
                                target="_blank"
                                rel="noreferrer">
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
