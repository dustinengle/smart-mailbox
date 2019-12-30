
import { ACTION } from './Constants'
import { DELETE, GET, POST, PUT } from './Fetch'
import { KEY, removeItem, setItem } from './Storage'
import { URL } from './API'

const action = (payload, type) => ({ payload, type })

export const data = v => dispatch => dispatch(action(v, ACTION.DATA))

export const deleteGateway = v => dispatch => {
  return DELETE(URL.GATEWAY, v)
}

export const deleteMailbox = v => dispatch => {
  return DELETE(URL.MAILBOX, v)
}

export const deletePIN = v => dispatch => {
  return DELETE(URL.PIN, v)
}

export const deleteUser = v => dispatch => {
  return DELETE(URL.USER, v)
}

export const getBalance = () => dispatch => {
  return GET(URL.BALANCE)
    .then(res => {
      return res.result
    })
}

export const getDetails = () => dispatch => {
  return GET(URL.DETAILS)
    .then(res => {
      setItem(KEY.USER, res.result.user)

      dispatch(action(res.result.account, ACTION.ACCOUNT))
      dispatch(action(res.result.gateways, ACTION.GATEWAYS))
      dispatch(action(res.result.mailboxes, ACTION.MAILBOXES))
      dispatch(action(res.result.pins, ACTION.PINS))
      dispatch(action(res.result.user, ACTION.USER))
      dispatch(action(res.result.users, ACTION.USERS))
      return res.result
    })
}

export const getTotals = () => dispatch => {
  return GET(URL.TOTALS)
    .then(res => {
      return res.result
    })
}

export const getUserLogout = () => dispatch => {
  return GET(URL.LOGOUT)
    .then(() => {
      removeItem(KEY.TOKEN)

      dispatch(action({}, ACTION.ACCOUNT))
      dispatch(action([], ACTION.GATEWAYS))
      dispatch(action([], ACTION.MAILBOXES))
      dispatch(action([], ACTION.PINS))
      dispatch(action({}, ACTION.USER))
      dispatch(action([], ACTION.USERS))
    })
}

export const postGateway = v => dispatch => {
  return POST(URL.GATEWAY, v)
}

export const postLogin = v => dispatch => {
  return POST(URL.LOGIN, v)
    .then(res => {
      setItem(KEY.TOKEN, res.result.token)
      return res.result
    })
}

export const postMailbox = v => dispatch => {
  return POST(URL.MAILBOX, v)
}

export const postMessage = v => dispatch => {
  return POST(URL.MESSAGE, v)
}

export const postPIN = v => dispatch => {
  return POST(URL.PIN, v)
}

export const postRegister = v => dispatch => {
  return POST(URL.REGISTER, v)
    .then(res => {
      return res.result
    })
}

export const postUser = v => dispatch => {
  return POST(URL.USER, v)
}

export const putUser = v => dispatch => {
  return PUT(URL.USER, v)
}

export default {
  data,
  deleteGateway,
  deleteMailbox,
  deletePIN,
  deleteUser,
  getBalance,
  getDetails,
  getTotals,
  getUserLogout,
  postGateway,
  postLogin,
  postMailbox,
  postMessage,
  postPIN,
  postRegister,
  postUser,
  putUser,
}
