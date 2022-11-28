import * as React from 'react'
import { useAuth } from '../context/auth-provider'
import api from '../api'
import {
  AiOutlineEyeInvisible as Invisible,
  AiOutlineSearch
} from 'react-icons/ai'
import { MdOutlineVisibility as Visible } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

type TransactionType = {
  createdAt: string
  creditedAccountId: string
  debitedAccountId: string
  id: string
  value: string
}

type ActionType =
  | { type: 'SET_TRANSACTIONS'; transactions: TransactionType[] }
  | { type: 'ALL' }
  | { type: 'CASH_IN'; accountId: string }
  | { type: 'CASH_OUT'; accountId: string }
  | { type: 'DATA'; date: string }

interface ReducerTransactions {
  transactions: TransactionType[]
  currentTransactions: TransactionType[]
}

function reducer(state: ReducerTransactions, action: ActionType) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        transactions: action.transactions,
        currentTransactions: action.transactions
      }
    case 'ALL':
      return {
        transactions: state.transactions,
        currentTransactions: state.transactions
      }
    case 'CASH_IN':
      return {
        transactions: state.transactions,
        currentTransactions: state.transactions.filter(
          el => el.creditedAccountId === action.accountId
        )
      }
    case 'CASH_OUT':
      return {
        transactions: state.transactions,
        currentTransactions: state.transactions.filter(
          el => el.debitedAccountId === action.accountId
        )
      }
    case 'DATA':
      return {
        transactions: state.transactions,
        currentTransactions: state.transactions.filter(
          el => el.createdAt.slice(0, 10).toString() == action.date
        )
      }
    default:
      throw new Error('how it is possible?')
  }
}

const callAll =
  (...fns: any[]) =>
  (...args: any[]) =>
    fns.forEach(fn => fn(...args))

function orderTransactions(transactions: TransactionType[]): TransactionType[] {
  return transactions.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
}

export default function Authenticated() {
  const navigate = useNavigate()
  //user and userInfo
  const { user, logoff } = useAuth()
  const [balance, setBalance] = React.useState<string>('')
  //states to be used do to a transaction
  const [usernameToTransfer, setUsernameToTransfer] = React.useState('')
  const [value, setValue] = React.useState('')
  const [transactionError, setTransactionError] = React.useState('')
  //state that is be used to filter the data
  const [dateFilter, setDateFilter] = React.useState('')

  const [balanceVisibility, setBalanceVisibility] = React.useState(false)
  //
  React.useEffect(() => {
    ;(async () => {
      const { data } = await api.get('/information')
      if (data.error) {
        logoff()
      }
      dispatch({ type: 'SET_TRANSACTIONS', transactions: data.transactions })

      setBalance(data.balance)
    })()
  }, [])

  const [{ transactions, currentTransactions }, dispatch] = React.useReducer(
    reducer,
    {} as ReducerTransactions
  )
  function brasilianDateFormater(data: string) {
    const newDate = new Date(data)
    return `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`
  }

  async function handleTransaction(event: React.FormEvent) {
    event.preventDefault()

    if (!value || !usernameToTransfer) {
      setTransactionError('user and value are required' as any)
      return
    }

    const { data } = await api.post('/transaction', {
      requestCreditedUser: usernameToTransfer,
      value
    })

    if (data.status == 'Error') {
      setTransactionError(data.message)
      return
    }

    setTransactionError('')
  }

  function dataSearch(event: React.FormEvent) {
    event.preventDefault()

    dispatch({
      type: 'DATA',
      date: dateFilter
    }),
      setDateFilter('')
  }

  return (
    <div className="bg-blackCustom-700 h-screen text-white text-lg">
      <div className="py-4 flex-row flex items-center justify-between bg-custom px-20 bg-blackCustom-500 ">
        <div className="bg-blackCustom-400 p-3 rounded gap-2 flex w-56 justify-between flex-row">
          <span>
            Balance R$:{' '}
            {balanceVisibility ? parseFloat(balance).toFixed(2) : '***'}
          </span>
          <button onClick={e => setBalanceVisibility(!balanceVisibility)}>
            {balanceVisibility ? (
              <Visible width={24} />
            ) : (
              <Invisible width={24} />
            )}
          </button>
        </div>
        <button className="p-3 bg-blackCustom-400 rounded" onClick={logoff}>
          Logoff
        </button>
      </div>

      <div className="flex flex-col pt-5 justify-between mx-20 h-[70%] ">
        <div className="flex flex-row w-full items-center justify-center mb-10">
          <div className="bg-blackCustom-500 flex-col p-4 w-full justify-between flex  h-auto">
            <h2 className=" text-sm mb-2 self-center ">Make transaction</h2>
            <form
              className="flex flex-row gap-5 items-bottom"
              onSubmit={handleTransaction}
            >
              <div className="flex flex-row gap-3">
                <div className="flex flex-col gap-3 items-start">
                  <label>User to transfer:</label>
                  <input
                    className="rounded bg-blackCustom-400 p-1"
                    type="text"
                    value={usernameToTransfer}
                    onChange={e => setUsernameToTransfer(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3 items-start">
                  <label>Value:</label>
                  <input
                    className="rounded bg-blackCustom-400 p-1"
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3 justify-end ml-2 ">
                  <button
                    className="bg-blackCustom-400 p-1 px-2 rounded justify-self-start"
                    type="submit"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </form>
            {transactionError ? (
              <span role="alert" className="text-red-900 mt-2">
                Error: {transactionError}
              </span>
            ) : null}
          </div>
        </div>
        <div className="w-full  h-4/5">
          <div className=" mb-3 bg-blackCustom-400 flex justify-between p-3 rounded">
            <span className="self-center ">Transactions</span>
            <div className="flex justify-end gap-10">
              <button
                onClick={() =>
                  dispatch({
                    type: 'ALL'
                  })
                }
                className="bg-white text-black px-3 rounded-full"
              >
                All Transactions
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: 'CASH_IN',
                    accountId: user?.accountId ?? ''
                  })
                }
                className="bg-blackCustom-500 px-3 rounded-full"
              >
                Cash-In
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: 'CASH_OUT',
                    accountId: user?.accountId ?? ''
                  })
                }
                className="bg-blackCustom-500 px-3 rounded-full"
              >
                Cash-Out
              </button>
              <form
                onSubmit={dataSearch}
                className="flex  border rounded-full overflow-hidden justify-end"
              >
                <input
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  type="date"
                  className="bg-blackCustom-600 p-2 border-none"
                />
                <button
                  type="submit"
                  className="w-10 flex items-center justify-center"
                >
                  <AiOutlineSearch />
                </button>
              </form>
            </div>
          </div>
          <ul className=" overflow-auto h-[90%]">
            {currentTransactions && currentTransactions.length > 0 ? (
              orderTransactions(currentTransactions).map(item => (
                <li key={item.id} className="mb-3">
                  <div className=" bg-blackCustom-500 px-10 py-3 flex justify-between">
                    <span className="w-28">
                      {item.creditedAccountId === user?.accountId
                        ? 'Cash-in'
                        : 'Cash-out'}
                    </span>
                    <span className="w-28">
                      {brasilianDateFormater(item.createdAt)}
                    </span>
                    <span className="w-28">
                      R$: {parseFloat(item.value).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <div>Nothing found</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
