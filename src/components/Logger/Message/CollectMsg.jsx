import ListGroup from "react-bootstrap/ListGroup"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"

import Icon from "../../Icon/Icon"
import IconNames from "../../Icon/IconNames"

function CollectMsg({ wallet }) {
    const chosenNetwork = useSelector((state) => state.network)
    const { token } = useSelector((state) => state.stage)

    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between">
                {!wallet.error ? (
                    <>
                        <p className="my-1 d-inline">
                            Collected{" "}
                            <b>
                                {wallet.transferringAmount !== null
                                    ? wallet.transferringAmount
                                    : "0"}
                            </b>{" "}
                            {token.symbol} from{" "}
                            <a href={`${chosenNetwork.blockExplorer}/address/${wallet.address}`}>
                                {wallet.address}
                            </a>
                            <span className="text-success m-1 p-1 d-block">
                                Transaction hash:{" "}
                                <a href={`${chosenNetwork.blockExplorer}/tx/${wallet.txHash}`}>
                                    {wallet.txHash}
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
                            Failed to collect{" "}
                            <b>
                                {wallet.transferringAmount !== null
                                    ? wallet.transferringAmount
                                    : "0"}
                            </b>{" "}
                            {token.symbol} from{" "}
                            <a href={`${chosenNetwork.blockExplorer}/address/${wallet.address}`}>
                                {wallet.address}
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
CollectMsg.propTypes = {
    wallet: PropTypes.object.isRequired
}

export default CollectMsg
