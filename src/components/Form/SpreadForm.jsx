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
    const [spreaderAddress, setSpreaderAddress] = useState("")
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

        if (!spreaderAddress) {
            toggleErrorMsg(true, "Please provide the recipient's address")
            return
        }

        const web3js = new Web3js(chosenNetwork.rpcEndpoint)
        const isValidFormat = web3js.checkAddressFormat(spreaderAddress)

        if (!isValidFormat) {
            toggleErrorMsg(true, "Invalid format")
            return
        }

        toggleErrorMsg(false)
        dispatch(setStage(STAGES.Logger))
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
                <Card.Header as="h5">Spread ({token.symbol})</Card.Header>
                <Card.Body>
                    <div className="my-2 py-2">
                        <Form onSubmit={handleSubmit} noValidate>
                            <Form.Group className="mb-3">
                                <Form.Label>Spreader&apos;s address</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={spreaderAddress}
                                    onChange={(e) => setSpreaderAddress(e.target.value)}
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
export default SpreadForm
