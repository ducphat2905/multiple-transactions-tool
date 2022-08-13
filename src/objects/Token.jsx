import axios from "axios"
import Icon from "../components/Icon/Icon"
import IconNames from "../components/Icon/IconNames"
import BnbIcon from "../assets/icons/bsc-icon.png"
import TrxIcon from "../assets/icons/tron-icon.png"
import UsdtIcon from "../assets/icons/usdt-icon.png"

class Token {
    constructor({ address, symbol, decimal, ABI }) {
        this.address = address
        this.symbol = symbol
        this.decimal = decimal
        this.ABI = ABI && JSON.parse(ABI)
    }

    getTokenIcon() {
        let iconComponent

        switch (this.symbol) {
            case "BNB":
                iconComponent = <img src={BnbIcon} alt="bsc-icon" width="15" height="15" />
                break
            case "ETH":
                iconComponent = <Icon name={IconNames.FaEthereum} />
                break
            case "TRX":
                iconComponent = <img src={TrxIcon} alt="tron-icon" width="15" height="15" />
                break
            case "USDT":
                iconComponent = <img src={UsdtIcon} alt="tron-icon" width="15" height="15" />
                break
            default:
                iconComponent = ""
                break
        }

        return iconComponent
    }

    getTokenData(_tokenAddress, _networkId) {
        let apiFullUrl = ""

        switch (_networkId) {
            case "ethereum": {
                apiFullUrl = "https://api.etherscan.io/api?module=contract&action=getabi&address="
                break
            }
            case "ropsten": {
                apiFullUrl =
                    "https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address="
                break
            }
            case "bsc": {
                apiFullUrl = "https://api.bscscan.com/api?module=contract&action=getabi&address="
                break
            }
            case "bsc-testnet": {
                apiFullUrl =
                    "https://api-testnet.bscscan.com/api?module=contract&action=getabi&address="
                break
            }
            case "tron": {
                apiFullUrl = "https://api.trongrid.com"
                break
            }
            default:
                apiFullUrl = "https://"
        }

        return new Promise((resolve, reject) => {
            axios
                .get(`${apiFullUrl}${_tokenAddress}`)
                .then(async (response) => {
                    if (response.data.status === "1") {
                        const tokenABIString = response.data.result
                        const tokenInstance = new this.web3.eth.Contract(
                            JSON.parse(tokenABIString),
                            _tokenAddress
                        )

                        // Get decimal
                        const decimal = await tokenInstance.methods.decimals().call()

                        // Get symbol
                        const symbol = await tokenInstance.methods.symbol().call()

                        const token = {
                            address: _tokenAddress,
                            symbol,
                            decimal,
                            ABI: tokenABIString
                        }

                        resolve({ data: token })
                    } else reject(response.data.result)
                })
                .catch((e) => reject(e))
        })
    }
}

export default Token
