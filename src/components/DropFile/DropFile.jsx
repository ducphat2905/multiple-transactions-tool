import { useDropzone } from "react-dropzone"
import { useCallback, useMemo, useState } from "react"
import { read, utils } from "xlsx"
import Alert from "react-bootstrap/Alert"
import { useDispatch } from "react-redux"
import { acceptStyle, baseStyle, focusedStyle, rejectStyle } from "./Style"
import { storeDataTable } from "../../redux/DataTable"
import { INPUT_COLUMNS } from "../../constants"

function DropFile() {
    const [fileName, setFileName] = useState("")
    const [size, setSize] = useState(0)
    const [errorMsg, setErrorMsg] = useState("")
    const dispatch = useDispatch()

    const clearErrorMessage = () => {
        setFileName("")
        setSize(0)
        setErrorMsg("")
    }

    // Handle the dropped file
    const onDropAccepted = useCallback((acceptedFiles) => {
        // Clear error message
        clearErrorMessage()

        // Read file and store in local storage
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onload = () => {
                const { Sheets, SheetNames } = read(reader.result, { type: "array" })

                // Get the first sheet
                const worksheet = Sheets[SheetNames[0]]
                const worksheetJSON = utils.sheet_to_json(worksheet, {
                    raw: false,
                    defval: null
                })

                // Check required columns
                const requiredColumns = INPUT_COLUMNS.map((column) => column.field)
                // Check the first row if it contains required columns
                const hasEnoughColumns = requiredColumns.filter((column) => {
                    const keys = Object.keys(worksheetJSON[0])

                    return !keys.includes(column)
                })

                // Not enough
                if (hasEnoughColumns.length > 0) {
                    setFileName(file.name)
                    setSize(file.size)
                    setErrorMsg(
                        `Please provide your file with ${requiredColumns.length} column${
                            requiredColumns.length > 1 && "s"
                        }: (${requiredColumns.toString()})`
                    )
                } else {
                    // Store in local storage
                    dispatch(
                        storeDataTable({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            data: worksheetJSON
                        })
                    )
                }
            }

            reader.readAsArrayBuffer(file)
        })
    }, [])

    // Handle incorrect format files
    const onDropRejected = useCallback((rejectedFiles) => {
        rejectedFiles.forEach((rejectedFile) => {
            const { file, errors } = rejectedFile

            // Display error
            setFileName(file.name)
            setSize(file.size)
            setErrorMsg(errors[0].message)
        })
    })

    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel", // Only allow ".csv" and ".xlsx, .xls"
        maxFiles: 1,
        onDropAccepted,
        onDropRejected
    })

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {})
        }),
        [isFocused, isDragAccept, isDragReject]
    )

    return (
        <section>
            <div {...getRootProps({ className: "dropzone", style })}>
                <input {...getInputProps()} />
                <p>Drop your file here</p>
                <em>
                    (Only accept <b>.csv, .xlsx, .xls</b> files)
                </em>
            </div>

            {errorMsg && (
                <Alert variant="danger" className="mt-3">
                    <p>
                        File : <b>{fileName}</b>
                    </p>
                    <p>
                        Size: <b>{size}</b>
                    </p>
                    <p>
                        Error: <b>{errorMsg}</b>
                    </p>
                </Alert>
            )}
        </section>
    )
}
export default DropFile
