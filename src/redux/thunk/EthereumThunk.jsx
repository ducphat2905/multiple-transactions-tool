import { createAsyncThunk } from "@reduxjs/toolkit"
import Web3js from "../../lib/Web3js"
import Token from "../../objects/Token"
import {
    addResultWallet,
    setResultWallets,
    setTableType,
    storeDataTable,
    TABLE_TYPES
} from "../DataTable"
import { FEATURES, INPUT_COLUMNS } from "../../constants"
import Number from "../../helpers/Number"

const resultColumns = [
    {
        field: "address",
        headerName: "Address",
        flex: 1,
        headerClassName: "bg-light"
    },
    {
        field: "privateKey",
        headerName: "Private Key",
        flex: 1,
        headerClassName: "bg-light"
    },
    {
        field: "status",
        flex: 0.2,
        headerName: "Status",
        headerClassName: "bg-light"
    }
]

// TO-DO: Sending request with a specific rate limit
const storeResultInTable = (dispatch, data) => {
    const { file, rows, token, feature } = data

    if (feature === FEATURES.GetBalance) {
        resultColumns.push({
            field: token.symbol,
            flex: 0.3,
            headerName: token.symbol.toUpperCase(),
            headerClassName: "bg-light"
        })
    }

    if (feature === FEATURES.Collect || feature === FEATURES.Spread) {
        resultColumns.push(
            {
                field: `transferred${token.symbol.toUpperCase()}`,
                flex: 0.3,
                headerName: `Transferred ${token.symbol.toUpperCase()}`,
                headerClassName: "bg-light"
            },
            {
                field: "txHash",
                flex: 1,
                headerName: "Transaction Hash",
                headerClassName: "bg-light"
            }
        )
    }

    resultColumns.push({
        field: "error",
        flex: 0.7,
        headerName: "Error",
        headerClassName: "bg-light"
    })

    // Store and display the result
    dispatch(
        storeDataTable({
            name: TABLE_TYPES.Result,
            tableType: TABLE_TYPES.Result,
            type: file.type,
            size: 0,
            rows,
            columns: resultColumns
        })
    )
    dispatch(setTableType(TABLE_TYPES.Result))
}

const handleResultAsync = (
    { results, wallet, error, balance },
    { dispatch, token, file, totalLength, feature }
) => {
    const resultWallet = { ...wallet }
    resultWallet.error = error
    resultWallet[token.symbol] = Number.parseToDecimalVal(balance, token.decimal)
    resultWallet.status = !error
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
        storeResultInTable(dispatch, { rows: results, file, token, feature })
    }
}

const getBalance = createAsyncThunk(
    "ethereum/getBalance",
    async ({ token }, { getState, dispatch }) => {
        const { network, dataTable, stage } = getState()
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
                                    totalLength,
                                    feature: stage.feature
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
                                    totalLength,
                                    feature: stage.feature
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
        const { network, dataTable, stage } = getState()
        const wallets = dataTable.rows
        const web3js = new Web3js(network.rpcEndpoint)

        const resultWallets = await Promise.all(
            wallets.map(async (_wallet) => {
                const resultWallet = { ..._wallet }
                try {
                    const transferredAmount = _wallet.transferringAmount
                        ? _wallet.transferringAmount
                        : "0"

                    if (!token.address) {
                        // Check balance
                        const { data: receipt, error: receiptError } = await web3js.sendEth({
                            from: _wallet,
                            toAddress: recipient.address,
                            amountOfEth: transferredAmount
                        })

                        resultWallet.error = receiptError
                        resultWallet.txHash = receipt?.transactionHash
                        resultWallet.status = !receiptError
                        resultWallet[`transferred${token.symbol.toUpperCase()}`] = transferredAmount

                        dispatch(addResultWallet(resultWallet))
                    } else {
                        const { data: erc20Balance, error: erc20BalanceError } =
                            await web3js.getTransferGasFee(
                                {
                                    fromAddress: _wallet.address,
                                    toAddress: recipient.address,
                                    amountOfToken: _wallet.transferringAmount
                                        ? _wallet.transferringAmount
                                        : "0",
                                    token
                                },
                                true
                            )
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
                return resultWallet
            })
        )

        storeResultInTable(dispatch, {
            file: dataTable.file,
            rows: resultWallets,
            token,
            feature: stage.feature
        })
    }
)

export default { getBalance, collect }
