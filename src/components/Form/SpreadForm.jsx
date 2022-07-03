import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import Web3js from "../../lib/Web3js"
import { setFeature, setStage, STAGES } from "../../redux/Stage"
import Icon from "../Icon/Icon"
import IconNames from "../Icon/IconNames"
import EthereumThunk from "../../redux/thunk/EthereumThunk"
import { getDataTable, setResultMessages, TABLE_TYPES } from "../../redux/DataTable"
import Token from "../../objects/Token"

function SpreadForm() {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.stage)
    const chosenNetwork = useSelector((state) => state.network)
    const [spreaderPk, setSpreaderPk] = useState("")
    const [spreaderAddress, setSpreaderAddress] = useState("")
    const [spreaderBalance, setSpreaderBalance] = useState(0)
    const [amountToSpread, setAmountToSpread] = useState(0)
    const [error, setError] = useState("")
    const [isValidPk, setIsValidPk] = useState()
    const [isEnoughBalance, setIsEnoughBalance] = useState()
    const [isValidAmount, setIsValidAmount] = useState()

    const toggleErrorMsg = (hasError, errorMsg, setValid) => {
        if (hasError) {
            setError(errorMsg)
            setValid(false)
        } else {
            setError("")
            setValid(true)
        }
    }

    const onBack = () => {
        dispatch(setStage(STAGES.DataTable))
        dispatch(setFeature(""))
    }

    const onPkChange = async (e) => {
        const privateKey = e.target.value
        toggleErrorMsg(false, "", setIsValidPk)
        setIsEnoughBalance(undefined)
        setIsValidAmount(undefined)
        setSpreaderAddress("")
        setSpreaderBalance("")
        setSpreaderPk(privateKey)

        if (privateKey) {
            // Check private key
            const web3js = new Web3js(chosenNetwork.rpcEndpoint)
            const { data: wallet, error: walletError } = await web3js.getWalletByPk(privateKey)
            if (walletError) {
                toggleErrorMsg(true, walletError, setIsValidPk)
                return
            }

            const { data: balance, error: balanceError } = token.address
                ? await web3js.getErc20Balance(wallet.address, new Token({ ...token }), true)
                : await web3js.getEthBalance(wallet.address, true)

            if (balanceError) {
                toggleErrorMsg(true, balanceError, setIsEnoughBalance)
                return
            }

            setSpreaderAddress(wallet.address)
            setSpreaderBalance(balance)
        }
    }

    const spread = (spreader) => {
        switch (chosenNetwork.id) {
            case "ethereum":
            case "ropsten": {
                dispatch(
                    EthereumThunk.spread({
                        token,
                        spreader,
                        amountToSpread: parseFloat(amountToSpread).toString() // Prevent cases like: "012"
                    })
                )
                break
            }
            case "bsc": {
                break
            }
            case "tron": {
                break
            }

            default:
                break
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsValidAmount(undefined)
        toggleErrorMsg(false, "", setIsValidAmount)

        if (parseFloat(amountToSpread) <= 0) {
            toggleErrorMsg(true, "Amount must be larger than 0", setIsValidAmount)
            return
        }

        if (spreaderAddress && spreaderAddress && spreaderBalance && amountToSpread) {
            const spreader = {
                address: spreaderAddress,
                privateKey: spreaderPk,
                [`${token.symbol}`]: spreaderBalance
            }

            dispatch(setStage(STAGES.Logger))
            dispatch(setResultMessages([]))
            dispatch(getDataTable({ table: TABLE_TYPES.Input }))
            spread(spreader)
        }
    }

    return (
        <>
            <div>
                <Button variant="secondary" size="sm" onClick={onBack}>
                    <Icon name={IconNames.IoMdArrowBack} />
                </Button>
            </div>
            <Card className="mt-3">
                <Card.Header className="text-center" as="h5">
                    Spread ({token.symbol})
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <h6 className="text-primary">Spreader wallet</h6>
                    </Card.Title>
                    <div className="my-2 py-2">
                        <Form onSubmit={handleSubmit} noValidate>
                            {/* Private key */}
                            <InputGroup className="my-3">
                                <InputGroup.Text id="private-key-label">
                                    Private key
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    aria-label="private-key"
                                    aria-describedby="private-key-label"
                                    required
                                    value={spreaderPk}
                                    onChange={onPkChange}
                                    isInvalid={isValidPk === false}
                                    isValid={isValidPk === true}
                                />
                                <Form.Control.Feedback className="p-1" type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </InputGroup>
                            {/* Address */}
                            <InputGroup className="my-3">
                                <InputGroup.Text id="address-label">Address</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    aria-label="address"
                                    aria-describedby="address-label"
                                    disabled
                                    value={spreaderAddress}
                                />
                            </InputGroup>
                            {/* Balance */}
                            <InputGroup className="my-3">
                                <InputGroup.Text id="balance-label">
                                    Balance of {token.symbol}
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    aria-label="balance"
                                    aria-describedby="balance-label"
                                    disabled
                                    value={spreaderBalance}
                                    isInvalid={isEnoughBalance === false}
                                    isValid={isEnoughBalance === true}
                                />
                                <Form.Control.Feedback className="p-1" type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </InputGroup>

                            <Card.Title className="my-3">
                                <h6 className="text-primary">Amount</h6>
                            </Card.Title>
                            {/* Amount to spread */}
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="spread-amount-label">
                                    {token.symbol} for each wallet
                                </InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    aria-label="spread-amount"
                                    aria-describedby="spread-amount-label"
                                    min={0}
                                    step={0.0001}
                                    value={amountToSpread}
                                    onChange={(e) => setAmountToSpread(e.target.value)}
                                    isInvalid={isValidAmount === false}
                                    isValid={isValidAmount === true}
                                />
                                <Form.Control.Feedback className="p-1" type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Button className="my-3" type="submit" variant="primary w-100">
                                Start spreading
                            </Button>
                        </Form>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
export default SpreadForm
