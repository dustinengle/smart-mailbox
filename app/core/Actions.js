
import { ACTION, API, STORE } from './Constants'
import { del, get, post, put } from './Fetch'
import Storage from './Storage'

const act = (dispatch, payload, type) => dispatch({ payload, type })
const error = (dispatch, err) => {
  act(dispatch, { id: Date.now(), message: err.message || err, title: 'Error' }, ACTION.ALERT)
  //return Promise.reject(err)
}

//const alert = a => dispatch => Alert.alert(a.title || 'Alert', a.message || a)
export const alert = a => dispatch => act(dispatch, { ...a, id: Date.now() }, ACTION.ALERT)
export const dismiss = a => dispatch => act(dispatch, a, ACTION.DISMISS)

// Account

export const getAccount = () => dispatch => {
  return get(API.GET_ACCOUNT)
    .then(res => {
      act(dispatch, res.result, ACTION.ACCOUNT)
      Storage.set(STORE.ACCOUNT, JSON.stringify(res.result))
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postAccount = data => dispatch => {
  return post(API.POST_ACCOUNT, data)
    .then(res => {
      act(dispatch, res.result, ACTION.ACCOUNT)
      return res
    })
    .catch(err => error(dispatch, err))
}

// Gateway

export const delGateway = data => dispatch => {
  return del(API.DEL_GATEWAY, data)
    .then(res => {
      act(dispatch, res.result, ACTION.GATEWAY)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const getGatewayMessages = data => dispatch => {
  return post(API.GET_GATEWAY_MESSAGES, data)
    .then(res => {
      act(dispatch, res.result, ACTION.MESSAGES)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const getGateways = () => dispatch => {
  return post(API.GET_GATEWAYS)
    .then(res => {
      act(dispatch, res.result, ACTION.GATEWAYS)
      Storage.set(STORE.GATEWAYS, JSON.stringify(res.result))
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postGateway = data => dispatch => {
  return post(API.POST_GATEWAY, data)
    .then(res => {
      act(dispatch, res.result, ACTION.GATEWAY)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postGatewayMessage = data => dispatch => {
  return post(API.POST_GATEWAY_MESSAGE, data)
    .then(res => {
      act(dispatch, res.result, ACTION.GATEWAY)
      return res
    })
    .catch(err => error(dispatch, err))
}

// Log(in/out)

export const postLogin = data => dispatch => {
  return post(API.POST_LOGIN, data)
    .then(res => {
      act(dispatch, { email: data.email }, ACTION.ME)
      act(dispatch, res.result, ACTION.TOKEN)
      Storage.set(STORE.TOKEN, res.result)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postLogout = () => dispatch => {
  return post(API.POST_LOGOUT)
    .then(res => {
      act(dispatch, {}, ACTION.ME)
      act(dispatch, '', ACTION.TOKEN)
      return res
    })
    .catch(err => error(dispatch, err))
}

// Mailbox

export const delMailbox = data => dispatch => {
  return del(API.DEL_MAILBOX, data)
    .then(res => {
      act(dispatch, res.result, ACTION.MAILBOX)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const delMailboxPIN = data => dispatch => {
  return del(API.DEL_MAILBOX_PIN, data)
    .then(res => {
      act(dispatch, res.result, ACTION.MAILBOX_PIN)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const getMailboxes = () => dispatch => {
  return post(API.GET_MAILBOXES)
    .then(res => {
      act(dispatch, res.result, ACTION.MAILBOXES)
      Storage.set(STORE.MAILBOXES, JSON.stringify(res.result))
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postMailbox = data => dispatch => {
  return post(API.POST_MAILBOX, data)
    .then(res => {
      act(dispatch, res.result, ACTION.MAILBOX)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postMailboxPIN = data => dispatch => {
  return post(API.POST_MAILBOX_PIN, data)
    .then(res => {
      act(dispatch, res.result, ACTION.MAILBOX_PIN)
      return res
    })
    .catch(err => error(dispatch, err))
}

// User

export const delUser = data => dispatch => {
  return del(API.DEL_USER, data)
    .then(res => {
      act(dispatch, res.result, ACTION.USER)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const getUsers = () => dispatch => {
  return get(API.GET_USERS)
    .then(res => {
      act(dispatch, res.result, ACTION.USERS)
      Storage.set(STORE.USERS, JSON.stringify(res.result))
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postUser = data => dispatch => {
  return post(API.POST_USER, data)
    .then(res => {
      act(dispatch, res.result, ACTION.USER)
      return res
    })
    .catch(err => error(dispatch, err))
}

export default {
  alert,
  dismiss,

  getAccount,
  postAccount,

  delGateway,
  getGatewayMessages,
  getGateways,
  postGateway,
  postGatewayMessage,

  postLogin,
  postLogout,

  delMailbox,
  delMailboxPIN,
  getMailboxes,
  postMailbox,
  postMailboxPIN,

  delUser,
  getUsers,
  postUser,
}
