import { useEffect, useRef, useState } from "react"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import ListGroup from "react-bootstrap/ListGroup"
import ProgressBar from "react-bootstrap/ProgressBar"
import Spinner from "react-bootstrap/Spinner"
import { useSelector, useDispatch } from "react-redux"

import { FEATURES } from "../../constants"
import Icon from "../Icon/Icon"
import IconNames from "../Icon/IconNames"
import { setStage, STAGES } from "../../redux/Stage"
import GetBalanceMsg from "./Message/GetBalanceMsg"
import CollectMsg from "./Message/CollectMsg"
import SpreadMsg from "./Message/SpreadMsg"

function Logger() {
    const { feature, token } = useSelector((state) => state.stage)
    const { resultMessages, rows } = useSelector((state) => state.dataTable)
    const dispatch = useDispatch()
    const [title, setTitle] = useState("")
    const cardContainer = useRef()
    const [isLoading, setIsLoading] = useState(true)
    const [fails, setFails] = useState(undefined)
    const [successes, setSuccesses] = useState(undefined)

    useEffect(() => {
        switch (feature) {
            case FEATURES.GetBalance: {
                setTitle("Getting balance")
                break
            }
            case FEATURES.Collect: {
                setTitle("Collecting")
                break
            }
            case FEATURES.Spread: {
                setTitle("Spreading")
                break
            }
            default:
                break
        }
    }, [feature])

    useEffect(() => {
        const element = cardContainer.current
        element.scrollTop = element.scrollHeight

        if (resultMessages.length === rows.length) {
            setIsLoading(false)
        }

        setFails(resultMessages.filter((_result) => _result.error).length)
        setSuccesses(resultMessages.filter((_result) => !_result.error).length)
    }, [resultMessages])

    const showTableResult = () => {
        dispatch(setStage(STAGES.DataTable))
    }

    return (
        <Card className="m-2 p-3" border="dark">
            <Card.Body>
                <Card.Title>
                    {title} ({token.symbol})
                    <span className="mx-3">
                        {isLoading && (
                            <>
                                <Spinner
                                    animation="grow"
                                    role="status"
                                    size="sm"
                                    className="mx-1"
                                />
                                <Spinner
                                    animation="grow"
                                    role="status"
                                    size="sm"
                                    className="mx-1"
                                />
                                <Spinner
                                    animation="grow"
                                    role="status"
                                    size="sm"
                                    className="mx-1"
                                />
                            </>
                        )}
                        {!isLoading && (
                            <Icon name={IconNames.BsPatchCheckFill} className="text-success" />
                        )}
                    </span>
                </Card.Title>

                <ProgressBar
                    striped
                    variant="success"
                    now={resultMessages.length}
                    className="my-3"
                    max={rows.length}
                    min={0}
                    label={`${Math.floor((resultMessages.length / rows.length) * 100)}%`}
                />

                <div
                    ref={cardContainer}
                    className="py-2 my-2"
                    style={{ overflowY: "scroll", maxHeight: "80vh" }}>
                    <ListGroup className="my-2">
                        {resultMessages.map((wallet) => (
                            <div key={wallet.id}>
                                {feature === FEATURES.GetBalance && (
                                    <GetBalanceMsg wallet={wallet} />
                                )}
                                {feature === FEATURES.Collect && <CollectMsg wallet={wallet} />}
                                {feature === FEATURES.Spread && <SpreadMsg wallet={wallet} />}
                            </div>
                        ))}
                    </ListGroup>
                </div>
            </Card.Body>
            <Card.Footer>
                <div className="d-flex justify-content-end">
                    <p className="mb-0 mx-2 d-flex justify-content-between align-items-center">
                        Total: <span className="d-block m-1 p-1 text-primary">{rows.length}</span>
                        Fail: <span className="d-block m-1 p-1 text-danger">{fails}</span>
                        Success: <span className="d-block m-1 p-1 text-success">{successes}</span>
                    </p>
                    <Button onClick={showTableResult} disabled={isLoading}>
                        Done
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    )
}

export default Logger
