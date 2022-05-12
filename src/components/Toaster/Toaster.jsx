import Alert from "react-bootstrap/Alert"
import { useDispatch, useSelector } from "react-redux"
import { toggleToaster } from "../../redux/Toaster"

function Toaster() {
    const { show, message, title } = useSelector((state) => state.toaster)
    const dispatch = useDispatch()

    return (
        show && (
            <Alert
                variant="danger"
                onClose={() => dispatch(toggleToaster({ show: false }))}
                dismissible>
                <Alert.Heading>{title || "Oh snap! You got an error!"}</Alert.Heading>
                <p>{message}</p>
            </Alert>
        )
    )
}
export default Toaster
