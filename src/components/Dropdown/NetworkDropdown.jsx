import Dropdown from "react-bootstrap/Dropdown"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"
import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import Network from "../../objects/Network"

function NetworkDropdown({ selectHandler }) {
    const setting = useSelector((state) => state.setting)
    const selectedNetwork = useSelector((state) => state.network)
    const [network, setNetwork] = useState(() => new Network({ ...selectedNetwork }))
    const [networks] = useState(() =>
        setting.networks.map((_network) => new Network({ ..._network }))
    )

    useEffect(() => {
        // Set chosen network for navbar
        if (selectedNetwork.id && selectedNetwork.id !== network.id) {
            setNetwork(new Network({ ...selectedNetwork }))
        }
    }, [selectedNetwork.id])

    const selectNetwork = (_network) => {
        setNetwork(_network)
        selectHandler(_network)
    }

    return (
        <Dropdown as={ButtonGroup}>
            <Button variant={network.id ? "info" : "danger"}>
                {network.id && network.getIconComponent()}

                <span className="mx-2">{network.id ? `${network.name}` : "Choose a network"}</span>
            </Button>

            <Dropdown.Toggle
                split
                variant={network.id ? "info" : "danger"}
                id="dropdown-split-basic"
            />

            <Dropdown.Menu>
                {networks.map((_network) => (
                    <Dropdown.Item key={_network.id} onClick={() => selectNetwork(_network)}>
                        <span className="mx-1">{_network.getIconComponent()}</span>
                        {_network.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}

NetworkDropdown.propTypes = {
    selectHandler: PropTypes.func.isRequired
}

export default NetworkDropdown
