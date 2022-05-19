import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import Web3js from "../../lib/Web3js"
import { setFeature, setStage, STAGES } from "../../redux/Stage"
import Icon from "../Icon/Icon"
import IconNames from "../Icon/IconNames"

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

    const toggleErrorMsg = (hasError, errorMsg, setValid) => {
        if (hasError) {
            setError(errorMsg)
            setValid(false)
        } else {
            setError("")
            setValid(true)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log(amountToSpread)

        // dispatch(setStage(STAGES.Logger))
    }

    const onBack = () => {
        dispatch(setStage(STAGES.DataTable))
        dispatch(setFeature(""))
    }

    const onPkChange = async (e) => {
        const privateKey = e.target.value
        toggleErrorMsg(false, "", setIsValidPk)
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
                ? await web3js.getErc20Balance(wallet.address, token.address, true)
                : await web3js.getEthBalance(wallet.address, true)

            if (balanceError) {
                toggleErrorMsg(true, balanceError, setIsEnoughBalance)
                return
            }

            setSpreaderAddress(wallet.address)
            setSpreaderBalance(balance)
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
                <Card.Header as="h5">Spread ({token.symbol})</Card.Header>
                <Card.Body>
                    <div className="my-2 py-2">
                        <Form onSubmit={handleSubmit} noValidate>
                            <Form.Group className="mb-3">
                                <Form.Label>Spreader&apos;s private key</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={spreaderPk}
                                    onChange={onPkChange}
                                    isInvalid={isValidPk === false}
                                    isValid={isValidPk === true}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Spreader&apos;s address</Form.Label>
                                <Form.Control type="text" disabled value={spreaderAddress} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Balance of {token.symbol}</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled
                                    value={spreaderBalance}
                                    isInvalid={isEnoughBalance === false}
                                    isValid={isEnoughBalance === true}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>{token.symbol} for each wallet</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    step={0.0001}
                                    value={amountToSpread}
                                    onChange={(e) => setAmountToSpread(e.target.value)}
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary w-100">
                                Start collecting
                            </Button>
                        </Form>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
export default SpreadForm
