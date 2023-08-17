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
        currentTransactions: state.transactions?.filter(
          el => el.creditedAccountId === action.accountId
        )
      }

    case 'CASH_OUT':
      return {
        transactions: state.transactions,
        currentTransactions: state.transactions?.filter(
          el => el.debitedAccountId === action.accountId
        )
      }
    case 'DATA':
      return {
        transactions: state.transactions,
        currentTransactions: state.transactions?.filter(
          el => el.createdAt.slice(0, 10).toString() == action.date
        )
      }
    default:
      throw new Error('how it is possible?')
  }
}

function orderTransactions(transactions: TransactionType[]): TransactionType[] {
  return transactions.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
}

export default function Authenticated() {
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

  // const navigate = useNavigate()

  const [{ transactions, currentTransactions }, dispatch] = React.useReducer(
    reducer,
    {} as ReducerTransactions
  )
  function brasilianDateFormater(data: string) {
    function addZero(number: string) {
      if (parseInt(number) <= 9) {
        return '0' + number
      }
      return number
    }
    const newDate = new Date(data)
    return `${addZero(newDate.getDate().toString())}/${addZero(
      (newDate.getMonth() + 1).toString()
    )}/${newDate.getFullYear()}`
  }

  async function updateInfo() {
    const { data } = await api.get('/information')
    //it should throw if the user token is expired so the user have to logon again
    if (data.error) {
      logoff()
    }
    dispatch({ type: 'SET_TRANSACTIONS', transactions: data.transactions })
    setBalance(data.balance)
  }

  async function handleTransaction(event: React.FormEvent) {
    event.preventDefault()

    if (!value || !usernameToTransfer) {
      setTransactionError('user and value are required')
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
    setUsernameToTransfer('')
    setValue('')
    updateInfo()
  }

  function dataSearch(event: React.FormEvent) {
    event.preventDefault()

    dispatch({
      type: 'DATA',
      date: dateFilter
    }),
      setDateFilter('')
  }

  React.useEffect(() => {
    ;(async () => {
      await updateInfo()
    })()
  }, [])
  // className="bg-blackCustom-700 h-screen text-white "
  return (
    <>
      <nav 
        className="bg-blackCustom-500 max-h-16 fixed top-0 right-0 left-0"
      >
        <div 
          className='max-w-[1024px] m-auto flex justify-between w-full px-4 py-2 gap-2'
        >
          <div className="bg-blackCustom-400 p-2 rounded gap-2 flex w-56 justify-between flex-row">
            <span>
              saldo {" "}
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
          
          <button
            className="p-2 bg-blackCustom-400 rounded"
            onClick={() => logoff()}
          >
            logout
          </button>
        </div>
      </nav>

      <main 
        className="flex max-w-[1024px] flex-col pt-[72px]  m-auto p-4 h-screen"
      >
        <div 
          className="flex w-full items-center justify-center mb-5"
        >
          <div 
            className="bg-blackCustom-500 flex-col p-2 w-full justify-between flex h-auto rounded-md"
          >
            <h2 className=" text-sm mb-2">
              Transacao
            </h2>
            <form
              onSubmit={handleTransaction}
            >
              <div 
                className="flex md:flex-row flex-col gap-3 w-full md:max-w-full  "
              >
                <div className="flex flex-col gap-3 items-start">
                  <label className='text-base'>Para</label>
                  <input
                    className="rounded bg-blackCustom-400 p-1 w-full"
                    type="text"
                    value={usernameToTransfer}
                    onChange={e => setUsernameToTransfer(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3 items-start ">
                  <label>Valor</label>
                  <input
                    className="rounded bg-blackCustom-400 p-1 w-full"
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-3 justify-end ">
                  <button
                    className="bg-blackCustom-400 p-1 px-2 rounded justify-self-start text-base" 
                    type="submit"
                  >
                    Transferir
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

          <div 
            className=" mb-3 bg-blackCustom-400 flex flex-col p-3 rounded"
          >
            <span 
              className="mb-3"
            >
              Transações
            </span>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
              <button
                onClick={() =>
                  dispatch({
                    type: 'ALL'
                  })
                }
                className="bg-white text-black p-2 rounded text-base"
              >
                todas
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: 'CASH_IN',
                    accountId: user?.accountId ?? ''
                  })
                }
                className="bg-blackCustom-500 p-2 rounded"
              >
                creditados
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: 'CASH_OUT',
                    accountId: user?.accountId ?? ''
                  })
                }
                className="bg-blackCustom-500 p-2 rounded"
              >
                debitados
              </button>
              <form
                onSubmit={dataSearch}
                className="flex  border rounded-full overflow-hidden justify-end"
              >
                <input
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  type="date"
                  className="bg-blackCustom-600 p-2 border-none text-white w-full"
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

          <ul className="overflow-auto max-h-full">
            {currentTransactions && currentTransactions.length > 0 ? (
              orderTransactions(currentTransactions)?.map(item => (
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
        
      </main>
    </>
  )
}
