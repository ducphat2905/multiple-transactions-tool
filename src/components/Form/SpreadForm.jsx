import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { setFeature, setStage, STAGES } from "../../redux/Stage"
import Icon from "../Icon/Icon"
import IconNames from "../Icon/IconNames"
import EthereumThunk from "../../redux/thunk/EthereumThunk"
import TronThunk from "../../redux/thunk/TronThunk"
import BscThunk from "../../redux/thunk/BscThunk"
import { getDataTable, setResultMessages, TABLE_TYPES } from "../../redux/DataTable"
import Token from "../../objects/Token"
import Network from "../../objects/Network"

function SpreadForm() {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.stage)
    const chosenNetwork = useSelector((state) => state.network)
    const [spreaderPk, setSpreaderPk] = useState("")
    const [spreaderAddress, setSpreaderAddress] = useState("")
    const [spreaderBalance, setSpreaderBalance] = useState("")
    const [amountToSpread, setAmountToSpread] = useState(0)
    const [error, setError] = useState("")
    const [isValidPk, setIsValidPk] = useState()
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
        setIsValidAmount(undefined)
        setSpreaderAddress("...")
        setSpreaderBalance("...")
        setSpreaderPk(privateKey)

        if (!privateKey) {
            toggleErrorMsg(true, "Invalid key", setIsValidPk)
            return
        }

        // Check private key
        const network = new Network({ ...chosenNetwork })
        const { data: wallet, error: walletError } = network.getWalletByPrivateKey(privateKey)
        if (walletError) {
            toggleErrorMsg(true, walletError, setIsValidPk)
            return
        }

        // Get balance
        const { data: balance, error: balanceError } = await network.getBalance(
            wallet.address,
            new Token({ ...token })
        )

        if (balanceError) {
            setSpreaderBalance(balanceError)
            return
        }

        setSpreaderAddress(wallet.address)
        setSpreaderBalance(balance)
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
            case "bsc":
            case "bsc-testnet": {
                dispatch(
                    BscThunk.spread({
                        token,
                        spreader,
                        amountToSpread: parseFloat(amountToSpread).toString() // Prevent cases like: "012"
                    })
                )
                break
            }
            case "tron":
            case "shasta": {
                dispatch(
                    TronThunk.spread({
                        token,
                        spreader,
                        amountToSpread: parseFloat(amountToSpread).toString() // Prevent cases like: "012"
                    })
                )
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

        if (parseFloat(amountToSpread) > parseFloat(spreaderBalance)) {
            toggleErrorMsg(true, "Amount exceeds the current balance", setIsValidAmount)
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
                                <p className="mb-0 py-2 px-3 bg-info rounded">{spreaderAddress}</p>
                            </InputGroup>
                            {/* Balance */}
                            <InputGroup className="my-3">
                                <InputGroup.Text id="balance-label">{token.symbol}</InputGroup.Text>
                                <p className="mb-0 py-2 px-3 bg-info rounded">{spreaderBalance}</p>
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
