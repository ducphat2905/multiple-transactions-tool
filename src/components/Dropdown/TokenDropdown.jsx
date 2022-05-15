import Dropdown from "react-bootstrap/Dropdown"
import SplitButton from "react-bootstrap/SplitButton"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import Token from "../../objects/Token"
import { setToken } from "../../redux/Stage"

function TokenDropdown({ title, handleClick, buttonVariant }) {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.stage)
    const chosenNetwork = useSelector((state) => state.network)

    // Handle token selection
    const selectToken = (_token) => {
        dispatch(setToken(_token))
    }

    const showTokenIcon = () => {
        const tokenObject = new Token(token.address, token.symbol, token.decimal)
        return (
            <>
                {title}:{" "}
                <span className="text-danger">
                    {tokenObject.getTokenIcon()}
                    {tokenObject.symbol}
                </span>
            </>
        )
    }

    return (
        <SplitButton
            className="mx-2"
            variant={buttonVariant}
            title={token ? showTokenIcon() : title}
            onClick={handleClick}>
            {chosenNetwork.tokens.map((_token) => {
                const tokenObj = new Token(_token.address, _token.symbol, _token.decimal)
                return (
                    <Dropdown.Item key={_token.symbol} onClick={() => selectToken(_token)}>
                        {tokenObj.getTokenIcon()} {_token.symbol}
                    </Dropdown.Item>
                )
            })}
        </SplitButton>
    )
}

TokenDropdown.propTypes = {
    title: PropTypes.string.isRequired,
    buttonVariant: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired
}

export default TokenDropdown
