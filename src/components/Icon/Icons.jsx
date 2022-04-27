import { useEffect, useState } from "react"
import { BsStackOverflow, BsFillDiagram3Fill, BsPatchCheckFill } from "react-icons/bs"
import { GiWallet } from "react-icons/gi"
import { FaCogs, FaEthereum, FaTimes } from "react-icons/fa"

export const IconNames = Object.freeze({
    BsStackOverflow: "BsStackOverflow",
    BsFillDiagram3Fill: "BsFillDiagram3Fill",
    BsPatchCheckFill: "BsPatchCheckFill",
    FaCogs: "FaCogs",
    FaEthereum: "FaEthereum",
    FaTimes: "FaTimes",
    GiWallet: "GiWallet"
})

function Icons({ iconName, className }) {
    const [icon, setIcon] = useState("")

    useEffect(() => {
        switch (iconName) {
            case IconNames.BsStackOverflow: {
                setIcon(<BsStackOverflow className={className} />)
                break
            }
            case IconNames.BsFillDiagram3Fill: {
                setIcon(<BsFillDiagram3Fill className={className} />)
                break
            }
            case IconNames.BsPatchCheckFill: {
                setIcon(<BsPatchCheckFill className={className} />)
                break
            }
            case IconNames.FaCogs: {
                setIcon(<FaCogs className={className} />)
                break
            }
            case IconNames.FaEthereum: {
                setIcon(<FaEthereum className={className} />)
                break
            }
            case IconNames.FaTimes: {
                setIcon(<FaTimes className={className} />)
                break
            }
            case IconNames.GiWallet: {
                setIcon(<GiWallet className={className} />)
                break
            }
            default:
                break
        }
    }, [])

    return icon
}

export default Icons
