import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import Icon from "../Icon/Icon"
import IconNames from "../Icon/IconNames"
import Web3js from "../../lib/Web3js"
import { setFeature, setStage, STAGES } from "../../redux/Stage"
import EthereumThunk from "../../redux/thunk/EthereumThunk"
import { setResultWallets } from "../../redux/DataTable"

function CollectForm() {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.stage)
    const chosenNetwork = useSelector((state) => state.network)
    const [recipientAddress, setRecipientAddress] = useState(
        "0xa6dd3736841f1A1f3f7C27349867D46285c39f58"
    )
    const [error, setError] = useState("")
    const [isValid, setIsValid] = useState()

    const toggleErrorMsg = (hasError, errorMsg) => {
        if (hasError) {
            setError(errorMsg)
            setIsValid(false)
        } else {
            setError("")
            setIsValid(true)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!recipientAddress) {
            toggleErrorMsg(true, "Please provide the recipient's address")
            return
        }

        const web3js = new Web3js(chosenNetwork.rpcEndpoint)
        const isValidFormat = web3js.checkAddressFormat(recipientAddress)

        if (!isValidFormat) {
            toggleErrorMsg(true, "Invalid format")
            return
        }

        toggleErrorMsg(false)
        dispatch(setStage(STAGES.Logger))
        dispatch(setResultWallets([]))
        dispatch(EthereumThunk.collect({ token, recipient: { address: recipientAddress } }))
    }

    const onBack = () => {
        dispatch(setStage(STAGES.DataTable))
        dispatch(setFeature(""))
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
                    Collect ({token.symbol})
                </Card.Header>
                <Card.Body>
                    <div className="m-2 p-2">
                        <Form onSubmit={handleSubmit} noValidate>
                            <Form.Group className="mb-3">
                                <Form.Label>Recipient&apos;s address</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={recipientAddress}
                                    onChange={(e) => setRecipientAddress(e.target.value)}
                                    isInvalid={isValid === false}
                                    isValid={isValid === true}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error}
                                </Form.Control.Feedback>
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
export default CollectForm
