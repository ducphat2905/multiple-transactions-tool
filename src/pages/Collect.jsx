import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import DataTable from "../components/DataTable/DataTable"
import DropFileComponent from "../components/DropFile/DropFile"
import Logger from "../components/Logger/Logger"
import { getDataTable, TABLE_TYPES } from "../redux/DataTable"
import { toggleToaster } from "../redux/Toaster"
import { setStage, STAGES } from "../redux/Stage"

function CollectForm() {
    return <h1>Collect Form</h1>
}

function SpreadForm() {
    return <h1>Spread Form</h1>
}

function Collect() {
    const stage = useSelector((state) => state.stage)
    const { tableType } = useSelector((state) => state.dataTable)
    const chosenNetwork = useSelector((state) => state.network)
    const dispatch = useDispatch()

    // Display error when provider is not set
    useEffect(() => {
        if (!chosenNetwork.id) {
            dispatch(
                toggleToaster({
                    show: true,
                    title: "Error",
                    message: `No network is selected.`
                })
            )

            return
        }

        if (!chosenNetwork.hasValidProvider) {
            dispatch(
                toggleToaster({
                    show: true,
                    message: `The ${chosenNetwork.name} is not configured with a Provider. Please go to Setting and set up a provider for it.`
                })
            )

            return
        }

        dispatch(
            toggleToaster({
                show: false
            })
        )
    }, [chosenNetwork])

    useEffect(() => {
        if (stage.current !== STAGES.Logger) {
            switch (tableType) {
                case TABLE_TYPES.Empty:
                    dispatch(setStage(STAGES.DropFile))
                    break
                case TABLE_TYPES.Input:
                    dispatch(getDataTable({ table: TABLE_TYPES.Input }))
                    dispatch(setStage(STAGES.DataTable))
                    break
                case TABLE_TYPES.Result:
                    dispatch(getDataTable({ table: TABLE_TYPES.Result }))
                    dispatch(setStage(STAGES.DataTable))
                    break
                default:
                    break
            }
        }
    }, [tableType])

    return (
        <Row>
            {chosenNetwork.hasValidProvider && (
                <Col className="pb-5 px-4">
                    {stage.current === STAGES.DropFile && <DropFileComponent />}
                    {stage.current === STAGES.DataTable && <DataTable />}
                    {stage.current === STAGES.CollectForm && <CollectForm />}
                    {stage.current === STAGES.SpreadForm && <SpreadForm />}
                    {stage.current === STAGES.Logger && <Logger />}
                </Col>
            )}
        </Row>
    )
}
export default Collect
