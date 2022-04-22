import { useEffect, useState } from "react"
import { BsStackOverflow, BsFillDiagram3Fill } from "react-icons/bs"
import { GiWallet } from "react-icons/gi"
import { FaCogs } from "react-icons/fa"

const IconNames = Object.freeze({
    BsStackOverflow: "BsStackOverflow",
    BsFillDiagram3Fill: "BsFillDiagram3Fill",
    GiWallet: "GiWallet",
    FaCogs: "FaCogs"
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
            case IconNames.GiWallet: {
                setIcon(<GiWallet />)
                break
            }
            case IconNames.FaCogs: {
                setIcon(<FaCogs />)
                break
            }
            default:
                break
        }
    }, [])

    return icon
}
export default Icons
