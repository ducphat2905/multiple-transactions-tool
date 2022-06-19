import FormControl from "react-bootstrap/FormControl"
import { useState } from "react"
import PropTypes from "prop-types"

function RpcInput({ network, saveRpcEndpoint }) {
    console.log(network)
    const [rpcEndpoint, setRpcEndpoint] = useState(network.rpcEndpoint)

    const onRpcChange = (e) => {
        setRpcEndpoint(e.target.value)

        if (e.target.value) {
            saveRpcEndpoint(network.id, network.type, e.target.value)
        }
    }

    return (
        <FormControl
            value={rpcEndpoint}
            onChange={onRpcChange}
            placeholder="Input RPC's endpoint (URL) here."
        />
    )
}

RpcInput.propTypes = {
    network: PropTypes.object.isRequired,
    saveRpcEndpoint: PropTypes.func.isRequired
}

export default RpcInput
