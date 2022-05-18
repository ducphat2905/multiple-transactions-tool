import { createAsyncThunk } from "@reduxjs/toolkit"
import Web3js from "../../lib/Web3js"
import Token from "../../objects/Token"
import { addResultWallet, setTableType, storeDataTable, TABLE_TYPES } from "../DataTable"
import { FEATURES } from "../../constants"
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
            columns: resultColumns,
            feature
        })
    )
    dispatch(setTableType(TABLE_TYPES.Result))
}

const getBalance = createAsyncThunk(
    "ethereum/getBalance",
    async ({ token }, { getState, dispatch }) => {
        const { network, dataTable, stage } = getState()
        const wallets = dataTable.rows
        const web3js = new Web3js(network.rpcEndpoint)

        const resultWallets = await Promise.all(
            wallets.map(async (_wallet) => {
                const resultWallet = { ..._wallet }
                if (!token.address) {
                    const { data: ethBalance, error: ethBalanceError } = await web3js.getEthBalance(
                        _wallet.address,
                        true
                    )

                    resultWallet.error = ethBalanceError
                    resultWallet.status = !ethBalanceError
                    resultWallet.ETH = ethBalance

                    dispatch(addResultWallet(resultWallet))
                } else {
                    const { data: erc20Balance, error: erc20BalanceError } =
                        await web3js.getErc20Balance(_wallet.address, new Token({ ...token }), true)

                    resultWallet.error = erc20BalanceError
                    resultWallet.status = !erc20BalanceError
                    resultWallet[`${token.symbol.toUpperCase()}`] = erc20Balance

                    dispatch(addResultWallet(resultWallet))
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

const collect = createAsyncThunk(
    "ethereum/collect",
    async ({ token, recipient }, { getState, dispatch }) => {
        const { network, dataTable, stage } = getState()
        const wallets = dataTable.rows
        const web3js = new Web3js(network.rpcEndpoint)

        const resultWallets = await Promise.all(
            wallets.map(async (_wallet) => {
                const resultWallet = { ..._wallet }
                const transferredAmount = _wallet.transferringAmount
                    ? _wallet.transferringAmount
                    : "0"

                if (!token.address) {
                    const { data: receipt, error: receiptError } = await web3js.sendEth({
                        from: _wallet,
                        toAddress: recipient.address,
                        amountOfEth: transferredAmount
                    })

                    resultWallet.error = receiptError
                    resultWallet.txHash = receipt?.transactionHash
                    resultWallet.status = !receiptError
                    resultWallet.transferredETH = transferredAmount

                    dispatch(addResultWallet(resultWallet))
                } else {
                    const { data: receipt, error: receiptError } = await web3js.sendErc20({
                        from: _wallet,
                        toAddress: recipient.address,
                        amountOfToken: transferredAmount,
                        token
                    })

                    resultWallet.error = receiptError
                    resultWallet.txHash = receipt?.transactionHash
                    resultWallet.status = !receiptError
                    resultWallet[`transferred${token.symbol.toUpperCase()}`] = transferredAmount

                    dispatch(addResultWallet(resultWallet))
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
