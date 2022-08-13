import Icon from "../components/Icon/Icon"
import IconNames from "../components/Icon/IconNames"
import BscIcon from "../assets/icons/bsc-icon.png"
import TronIcon from "../assets/icons/tron-icon.png"
import Web3js from "../lib/Web3js"
import Tronweb from "../lib/Tronweb"

class Network {
    constructor({ id, name, blockExplorer, rpcEndpoint, hasValidProvider, tokens, type }) {
        this.id = id
        this.name = name
        this.blockExplorer = blockExplorer
        this.rpcEndpoint = rpcEndpoint
        this.hasValidProvider = hasValidProvider
        this.tokens = tokens
        this.type = type
    }

    checkProvider() {
        switch (this.id) {
            case "bsc":
            case "bsc-testnet":
            case "ropsten":
            case "ethereum": {
                if (!this.rpcEndpoint) {
                    this.hasValidProvider = false
                    break
                }

                try {
                    const web3js = new Web3js(this.rpcEndpoint)

                    this.hasValidProvider = true
                } catch (error) {
                    if (error.message.includes("Can't autodetect provider"))
                        this.hasValidProvider = false
                    else this.hasValidProvider = true
                }
                break
            }
            case "tron": {
                if (!this.rpcEndpoint) {
                    this.hasValidProvider = false
                    break
                }

                this.hasValidProvider = true
                break
            }
            default:
                break
        }

        return this
    }

    getIconComponent() {
        let iconComponent

        switch (this.id) {
            case "bsc":
            case "bsc-testnet": {
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

    async getTokenDataByAddress(_tokenAddress) {
        switch (this.id) {
            case "bsc":
            case "bsc-testnet":
            case "ethereum":
            case "ropsten": {
                const web3js = new Web3js(this.rpcEndpoint)
                return web3js.getERC20Data(_tokenAddress, this.id)
            }
            case "tron":
            case "shasta": {
                const tronweb = new Tronweb(this.rpcEndpoint)
                return tronweb.getTRC20Data(_tokenAddress, this.id)
            }
            default:
                break
        }

        return { error: `Invalid contract address provided` }
    }
}

export default Network
