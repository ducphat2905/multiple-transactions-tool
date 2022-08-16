import Icon from "../components/Icon/Icon"
import IconNames from "../components/Icon/IconNames"
import BscIcon from "../assets/icons/bsc-icon.png"
import TronIcon from "../assets/icons/tron-icon.png"
import Web3js from "../lib/Web3js"
import TronWeb from "../lib/Tronweb"

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
            case "tron":
            case "shasta": {
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
            case "tron":
            case "shasta": {
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
                const tronweb = new TronWeb(this.rpcEndpoint)
                return tronweb.getTRC20Data(_tokenAddress, this.id)
            }
            default:
                break
        }

        return { error: `Invalid contract address provided` }
    }

    checkAddress(_address) {
        let isValid = false

        switch (this.id) {
            case "bsc":
            case "bsc-testnet":
            case "ethereum":
            case "ropsten": {
                const web3js = new Web3js(this.rpcEndpoint)
                isValid = web3js.checkAddressFormat(_address)
                break
            }
            case "tron":
            case "shasta": {
                const tronweb = new TronWeb(this.rpcEndpoint)
                isValid = tronweb.checkAddressFormat(_address)
                break
            }
            default:
                break
        }

        return isValid
    }

    getWalletByPrivateKey(_privateKey) {
        let walletFromPK = {}
        switch (this.id) {
            case "bsc":
            case "bsc-testnet":
            case "ethereum":
            case "ropsten": {
                const web3js = new Web3js(this.rpcEndpoint)
                walletFromPK = web3js.getWalletByPk(_privateKey)
                break
            }
            case "tron":
            case "shasta": {
                const tronweb = new TronWeb(this.rpcEndpoint)
                walletFromPK = tronweb.getWalletByPk(_privateKey)
                break
            }
            default:
                break
        }

        return walletFromPK
    }

    /**
     *
     * @param {string} _address
     * @param {Token} _token
     * @returns
     */
    async getBalance(_address, _token) {
        let balance = {}

        switch (this.id) {
            case "bsc":
            case "bsc-testnet":
            case "ethereum":
            case "ropsten": {
                const web3js = new Web3js(this.rpcEndpoint)
                balance = _token.address
                    ? await web3js.getErc20Balance(_address, _token, true)
                    : await web3js.getEthBalance(_address, true)
                break
            }
            case "tron":
            case "shasta": {
                const tronweb = new TronWeb(this.rpcEndpoint)
                balance = _token.address
                    ? await tronweb.getTrc20Balance(_address, _token, true)
                    : await tronweb.getTrxBalance(_address, true)
                break
            }
            default:
                break
        }

        return balance
    }
}

export default Network
