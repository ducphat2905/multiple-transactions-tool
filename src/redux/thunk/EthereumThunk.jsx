import { createAsyncThunk } from "@reduxjs/toolkit"
import Web3js from "../../lib/Web3js"
import Token from "../../objects/Token"
import { addResultWallet, setTableType, storeDataTable, TABLE_TYPES } from "../DataTable"
import { RESULT_COLUMNS } from "../../constants"
import Number from "../../helpers/Number"

// TO-DO: Sending request with a specific rate limit
const storeResultInTable = (dispatch, data) => {
    const { file, rows, token } = data
    // Store and display the result
    dispatch(
        storeDataTable({
            name: TABLE_TYPES.Result,
            tableType: TABLE_TYPES.Result,
            type: file.type,
            size: 0,
            rows,
            columns: RESULT_COLUMNS({
                field: token.symbol,
                flex: 0.5,
                header: token.symbol.toUpperCase()
            })
        })
    )
    dispatch(setTableType(TABLE_TYPES.Result))
}

const handleResultAsync = (
    { results, wallet, error, balance },
    { dispatch, token, file, totalLength }
) => {
    const resultWallet = { ...wallet }
    resultWallet.error = error
    resultWallet[token.symbol] = Number.parseToDecimalVal(balance, token.decimal)
    results.push(resultWallet)
    // // Halt when the result reached 50%
    // if (results.length >= totalLength / 2) {
    //     setTimeout(() => {
    //         dispatch(addResultWallet(resultWallet))
    //     }, 0.1)
    // } else {
    dispatch(addResultWallet(resultWallet))
    // }

    if (results.length === totalLength) {
        storeResultInTable(dispatch, { rows: results, file, token })
    }
}

const getBalance = createAsyncThunk(
    "ethereum/getBalance",
    async ({ token }, { getState, dispatch }) => {
        const { network, dataTable } = getState()
        const wallets = dataTable.rows

        const totalLength = wallets.length
        const results = []
        const web3js = new Web3js(network.rpcEndpoint)

        const batch = new web3js.web3.BatchRequest()
        wallets.forEach((_wallet) => {
            if (token.address) {
                const tokenObject = new Token({ ...token })
                const contract = new web3js.web3.eth.Contract(tokenObject.ABI, token.address)
                batch.add(
                    contract.methods
                        .balanceOf(_wallet.address)
                        .call.request("latest", (err, balance) => {
                            handleResultAsync(
                                {
                                    results,
                                    wallet: _wallet,
                                    error: err,
                                    balance
                                },
                                {
                                    dispatch,
                                    token,
                                    file: dataTable.file,
                                    totalLength
                                }
                            )
                        })
                )
            } else {
                batch.add(
                    web3js.web3.eth.getBalance.request(
                        _wallet.address,
                        "latest",
                        (err, balance) => {
                            handleResultAsync(
                                {
                                    results,
                                    wallet: _wallet,
                                    error: err,
                                    balance
                                },
                                {
                                    dispatch,
                                    token,
                                    file: dataTable.file,
                                    totalLength
                                }
                            )
                        }
                    )
                )
            }
        })

        batch.execute()
    }
)

const collect = createAsyncThunk(
    "ethereum/collect",
    async ({ token, recipient }, { getState, dispatch }) => {
        const { network, abi, dataTable } = getState()
        const wallets = dataTable.rows
        const totalLength = wallets.length
        const results = []
        const web3js = new Web3js(network.rpcEndpoint)

        wallets.forEach(async (_wallet) => {
            try {
                if (!token.address) {
                    // Check balance
                    const { data: ethBalance, error: ethBalanceError } = await web3js.getEthBalance(
                        _wallet.address
                    )
                    console.log(ethBalance, ethBalanceError)
                    // const transactionObject = {
                    //     from: _wallet.address,
                    //     to: recipient.address,
                    //     value: "1000000000000000",
                    //     gas: 21000,
                    //     data: "0x"
                    // }

                    // // Sign
                    // const signedTransaction = await web3js.web3.eth.accounts.signTransaction(
                    //     transactionObject,
                    //     _wallet.privateKey
                    // )

                    // // Send
                    // const response = web3js.web3.eth.sendSignedTransaction(
                    //     signedTransaction.rawTransaction
                    // )

                    // handleResultAsync(
                    //     {
                    //         results,
                    //         wallet: _wallet,
                    //         error: "",
                    //         balance: transactionObject.value,
                    //         txHash: response.transactionHash
                    //     },
                    //     {
                    //         dispatch,
                    //         token,
                    //         file: dataTable.file,
                    //         totalLength
                    //     }
                    // )
                } else {
                    const { data: erc20Balance, error: erc20BalanceError } =
                        await web3js.getErc20Balance(_wallet.address, token)
                    console.log(erc20Balance, erc20BalanceError)
                    // let tokenAbi = abi.listOfAbi.find((_abi) => _abi.address === token.address)?.abi
                    // tokenAbi = tokenAbi && JSON.stringify(tokenAbi) // Avoid redux to handle json
                    // const contract = new web3js.web3.eth.Contract(
                    //     JSON.parse(tokenAbi),
                    //     token.address
                    // )

                    // const transferData = await contract.methods
                    //     .transfer(_wallet.address, "1000000000000000")
                    //     .encodeABI()

                    // const estimateGas = await contract.methods
                    //     .transfer(recipient.address, "1000000000000000")
                    //     .estimateGas({ from: _wallet.address })

                    // // Create transaction
                    // const transactionObject = {
                    //     from: _wallet.address,
                    //     gas: web3js.web3.utils.toHex(estimateGas.toString()), // Gas limit
                    //     to: token.address,
                    //     value: "0", // in wei
                    //     data: web3js.web3.utils.toHex(transferData)
                    // }

                    // const signedTransaction = web3js.web3.eth.accounts.signTransaction(
                    //     transactionObject,
                    //     _wallet.privateKey
                    // )

                    // // Send
                    // const response = web3js.web3.eth.sendSignedTransaction(
                    //     signedTransaction.rawTransaction
                    // )

                    // handleResultAsync(
                    //     {
                    //         results,
                    //         wallet: _wallet,
                    //         error: "",
                    //         balance: transactionObject.value,
                    //         txHash: response.transactionHash
                    //     },
                    //     {
                    //         dispatch,
                    //         token,
                    //         file: dataTable.file,
                    //         totalLength
                    //     }
                    // )
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
)

export default { getBalance, collect }
