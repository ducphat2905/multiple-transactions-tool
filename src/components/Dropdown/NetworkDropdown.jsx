import Dropdown from "react-bootstrap/Dropdown"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"
import { useEffect, useState, useMemo } from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import Network from "../../objects/Network"

function NetworkDropdown({ selectHandler }) {
    const setting = useSelector((state) => state.setting)
    const selectedNetwork = useSelector((state) => state.network)
    const [network, setNetwork] = useState(() => new Network({ ...selectedNetwork }))
    const [, setNetworks] = useState(() =>
        setting.networks.map((_network) => new Network({ ..._network }))
    )

    useEffect(() => {
        setNetworks(setting.networks.map((_network) => new Network({ ..._network })))
    }, [setting.networks])

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

    const Networks = useMemo(() => {
        const mainNetworks = []
        const testNetworks = []

        setting.networks.forEach((_network) => {
            const newNetwork = new Network({ ..._network })
            if (_network.type === "mainnet") {
                mainNetworks.push(newNetwork)
            } else {
                testNetworks.push(newNetwork)
            }
        })

        return (
            <Dropdown.Menu>
                <p className="mx-2 mb-1 text-danger">Mainnet</p>
                {mainNetworks.map((_network) => (
                    <Dropdown.Item key={_network.id} onClick={() => selectNetwork(_network)}>
                        <span className="mx-1">{_network.getIconComponent()}</span>
                        {_network.name}
                    </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <p className="mx-2 mb-1 text-danger">Testnet</p>
                {testNetworks.map((_network) => (
                    <Dropdown.Item key={_network.id} onClick={() => selectNetwork(_network)}>
                        <span className="mx-1">{_network.getIconComponent()}</span>
                        {_network.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        )
    }, [setting.networks])

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

            {Networks}
        </Dropdown>
    )
}

NetworkDropdown.propTypes = {
    selectHandler: PropTypes.func.isRequired
}

export default NetworkDropdown
