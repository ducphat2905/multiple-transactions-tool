import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import DataTable from "../components/DataTable/DataTable"
import DropFileComponent from "../components/DropFile/DropFile"
import Logger from "../components/Logger/Logger"
import CollectForm from "../components/Form/CollectForm"
import SpreadForm from "../components/Form/SpreadForm"
import Toaster from "../components/Toaster/Toaster"
import { getDataTable, TABLE_TYPES } from "../redux/DataTable"
import { toggleToaster } from "../redux/Toaster"
import { setFeature, setStage, STAGES } from "../redux/Stage"

function BulkTx() {
    const stage = useSelector((state) => state.stage)
    const { tableType, rows } = useSelector((state) => state.dataTable)
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
        dispatch(setFeature(""))

        if (rows.length > 0) {
            dispatch(setStage(STAGES.DataTable))
        } else {
            dispatch(setStage(STAGES.DropFile))
        }
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
            {chosenNetwork.hasValidProvider ? (
                <Col className="p-4">
                    {stage.current === STAGES.DropFile && <DropFileComponent />}
                    {stage.current === STAGES.DataTable && <DataTable />}
                    {stage.current === STAGES.CollectForm && <CollectForm />}
                    {stage.current === STAGES.SpreadForm && <SpreadForm />}
                    {stage.current === STAGES.Logger && <Logger />}
                </Col>
            ) : (
                <div className="p-2">
                    <Toaster />
                </div>
            )}
        </Row>
    )
}
export default BulkTx
