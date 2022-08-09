import Form from "react-bootstrap/Form"
import { useState } from "react"
import PropTypes from "prop-types"
import { BSC_PROVIDERS } from "../../../constants"

const { Bsc: BscEndpoints, BscTestnet: BscTestnetEndpoints } = BSC_PROVIDERS

function RpcSelect({ network, saveRpcEndpoint }) {
    const [rpcEndpoint, setRpcEndpoint] = useState(network.rpcEndpoint)

    const onRpcChange = (e) => {
        setRpcEndpoint(e.target.value)

        if (e.target.value) {
            saveRpcEndpoint(network.id, network.type, e.target.value)
        }
    }

    return (
        <Form.Select value={rpcEndpoint} onChange={onRpcChange}>
            <option value="">Choose a RPC endpoint</option>
            {network.type === "mainnet" && BscEndpoints.map((endpoint) => (
                <option key={endpoint} value={endpoint}>
                    {endpoint}
                </option>
            ))}
            {network.type === "testnet" && BscTestnetEndpoints.map((endpoint) => (
                <option key={endpoint} value={endpoint}>
                    {endpoint}
                </option>
            ))}
        </Form.Select>
    )
}

RpcSelect.propTypes = {
    network: PropTypes.object.isRequired,
    saveRpcEndpoint: PropTypes.func.isRequired
}
export default RpcSelect
