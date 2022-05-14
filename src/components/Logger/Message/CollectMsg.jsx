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
                <span>
                    Collected <b>{wallet[token.symbol] ? wallet[token.symbol] : undefined}</b>{" "}
                    {token.symbol} from
                    <a href={`${chosenNetwork.blockExplorer}/address/${wallet.address}`}>
                        {wallet.address}
                    </a>
                </span>
                <span>
                    {!wallet.error ? (
                        <Icon name={IconNames.FaCheck} className="text-success" />
                    ) : (
                        <Icon name={IconNames.FaTimes} className="text-danger" />
                    )}
                </span>
            </div>
        </ListGroup.Item>
    )
}
CollectMsg.propTypes = {
    wallet: PropTypes.object.isRequired
}

export default CollectMsg
