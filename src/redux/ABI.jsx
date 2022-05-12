import { createSlice } from "@reduxjs/toolkit"
import ERC20_USDT from "../ABI/ERC20/USDT.json"
import { USDT } from "../tokens/ethereum"

export const abiStorage = "abi"

const getDefaultAbiList = () => {
    let listOfAbi = [
        {
            address: USDT.address,
            abi: ERC20_USDT
        }
    ]

    const storageData = localStorage.getItem(abiStorage)
    if (storageData) {
        const data = JSON.parse(storageData)
        listOfAbi = data.listOfAbi
    } else {
        // Save to local storage with default abi
        localStorage.setItem(abiStorage, JSON.stringify({ storageName: abiStorage, listOfAbi }))
    }

    return listOfAbi
}

const initialState = {
    storageName: abiStorage,
    listOfAbi: getDefaultAbiList()
}

const abiSlice = createSlice({
    name: "abi",
    initialState,
    reducers: {
        addAbi(state, action) {
            const { tokenAddress, abi } = action.payload

            const newAbi = { address: tokenAddress, abi }

            const existed = state.listOfAbi.findIndex((_abi) => _abi.address === tokenAddress)
            if (existed === -1) {
                state.listOfAbi.push(newAbi)
                // Save to local storage
                localStorage.setItem(
                    state.storageName,
                    JSON.stringify({
                        storageName: state.storageName,
                        listOfAbi: state.listOfAbi
                    })
                )
            }
        },
        removeAbiByAddress(state, action) {
            const { tokenAddress } = action.payload

            const storageData = localStorage.getItem(state.storageName)
            if (storageData) {
                const data = JSON.parse(storageData)

                const newAbiList = data.listOfAbi.filter((_abi) => _abi.address !== tokenAddress)
console.log(newAbiList)
                // Update current state
                state.listOfAbi = [...newAbiList]

                // Save to localStorage
                localStorage.setItem(
                    state.storageName,
                    JSON.stringify({
                        storageName: state.storageName,
                        listOfAbi: [...newAbiList]
                    })
                )
            }
        }
    }
})

export const { addAbi, removeAbiByAddress } = abiSlice.actions

export default abiSlice.reducer
