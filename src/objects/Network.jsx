import Icon from "../components/Icon/Icon"
import IconNames from "../components/Icon/IconNames"
import BscIcon from "../assets/icons/bsc-icon.png"
import TronIcon from "../assets/icons/tron-icon.png"

class Network {
    constructor({ id, name, blockExplorer, rpcEndpoint, tokens }) {
        this.id = id
        this.name = name
        this.blockExplorer = blockExplorer
        this.rpcEndpoint = rpcEndpoint
        this.tokens = tokens
    }

    getIconComponent() {
        let iconComponent

        switch (this.id) {
            case "bsc": {
                iconComponent = <img src={BscIcon} alt="bsc-icon" width="15" height="15" />
                break
            }
            case "ropsten":
            case "ethereum": {
                iconComponent = <Icon name={IconNames.FaEthereum} />
                break
            }
            case "tron": {
                iconComponent = <img src={TronIcon} alt="tron-icon" width="15" height="15" />
                break
            }
            default:
                iconComponent = ""
                break
        }

        return iconComponent
    }
}

export default Network
