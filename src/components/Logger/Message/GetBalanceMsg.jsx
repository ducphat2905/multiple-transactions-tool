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
                <span>
                    <a href={`${chosenNetwork.blockExplorer}/address/${wallet.address}`}>
                        {wallet.address}
                    </a>{" "}
                    has <b>{wallet[token.symbol] ? wallet[token.symbol] : undefined}</b>{" "}
                    {token.symbol}
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

GetBalanceMsg.propTypes = {
    wallet: PropTypes.object.isRequired
}
export default GetBalanceMsg
