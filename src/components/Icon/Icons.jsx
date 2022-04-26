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

function Icons({ iconName }) {
    const [icon, setIcon] = useState("")

    useEffect(() => {
        switch (iconName) {
            case IconNames.BsStackOverflow: {
                setIcon(<BsStackOverflow />)
                break
            }
            case IconNames.BsFillDiagram3Fill: {
                setIcon(<BsFillDiagram3Fill />)
                break
            }
            case IconNames.BsPatchCheckFill: {
                setIcon(<BsPatchCheckFill />)
                break
            }
            case IconNames.FaCogs: {
                setIcon(<FaCogs />)
                break
            }
            case IconNames.FaEthereum: {
                setIcon(<FaEthereum />)
                break
            }
            case IconNames.FaTimes: {
                setIcon(<FaTimes />)
                break
            }
            case IconNames.GiWallet: {
                setIcon(<GiWallet />)
                break
            }
            default:
                break
        }
    }, [])

    return icon
}

export default Icons
