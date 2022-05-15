import { useEffect, useState } from "react"
import { BsStackOverflow, BsFillDiagram3Fill, BsPatchCheckFill } from "react-icons/bs"
import { GiWallet } from "react-icons/gi"
import { FaCogs, FaEthereum, FaTimes, FaCheck } from "react-icons/fa"
import { IoMdArrowBack, IoMdAlert } from "react-icons/io"
import { AiOutlineCheckCircle, AiFillCloseCircle } from "react-icons/ai"
import IconNames from "./IconNames"

function Icon({ name, className }) {
    const [icon, setIcon] = useState("")

    useEffect(() => {
        switch (name) {
            case IconNames.AiOutlineCheckCircle: {
                setIcon(<AiOutlineCheckCircle className={className} />)
                break
            }
            case IconNames.AiFillCloseCircle: {
                setIcon(<AiFillCloseCircle className={className} />)
                break
            }
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
            case IconNames.FaCheck: {
                setIcon(<FaCheck className={className} />)
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
            case IconNames.IoMdArrowBack: {
                setIcon(<IoMdArrowBack className={className} />)
                break
            }
            case IconNames.IoMdAlert: {
                setIcon(<IoMdAlert className={className} />)
                break
            }
            default:
                break
        }
    }, [])

    return icon
}

export default Icon
