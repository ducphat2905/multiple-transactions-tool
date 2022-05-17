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
}

export default Token
