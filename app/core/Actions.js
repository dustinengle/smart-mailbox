
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

export const postAccount = data => dispatch => {
  return post(API.POST_ACCOUNT, data)
    .then(res => {
      act(dispatch, res.result.account, ACTION.ACCOUNT)
      act(dispatch, res.result.token, ACTION.TOKEN)
      act(dispatch, res.result.user, ACTION.ME)
      Storage.set(STORE.ACCOUNT, res.result)
      Storage.set(STORE.TOKEN, res.result.token)
      return res
    })
    .catch(err => error(dispatch, err))
}

// Log(in/out)

export const postLogin = data => dispatch => {
  return post(API.POST_LOGIN, data)
    .then(res => {
      act(dispatch, res.result.account, ACTION.ACCOUNT)
      act(dispatch, res.result.token, ACTION.TOKEN)
      act(dispatch, res.result.user, ACTION.ME)
      Storage.set(STORE.ACCOUNT, res.result.account)
      Storage.set(STORE.TOKEN, res.result.token)
      Storage.set(STORE.USER, res.result.user)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postLogout = () => dispatch => {
  return post(API.POST_LOGOUT)
    .then(res => {
      act(dispatch, {}, ACTION.ACCOUNT)
      act(dispatch, [], ACTION.MAILBOXES)
      act(dispatch, { email: '', name: '' }, ACTION.ME)
      act(dispatch, [], ACTION.PINS)
      act(dispatch, '', ACTION.TOKEN)
      Storage.set(STORE.ACCOUNT, '')
      Storage.set(STORE.MAILBOXES, '')
      Storage.set(STORE.PINS, '')
      Storage.set(STORE.TOKEN, '')
      Storage.set(STORE.USER, '')
      Storage.set(STORE.USERS, '')
      return res
    })
    .catch(err => error(dispatch, err))
}

// Mailbox

export const delMailbox = data => dispatch => {
  return del(API.DEL_MAILBOX, data)
    .then(res => {
      //act(dispatch, res.result, ACTION.MAILBOX)
      dispatch(getMailboxes())
      return res
    })
    .catch(err => error(dispatch, err))
}

export const delMailboxPIN = data => dispatch => {
  const url = API.DEL_MAILBOX_PIN
    .replace('{mid}', data.mailboxId)
    .replace('{pid}', data.id)
  return del(url, data)
    .then(res => {
      //act(dispatch, res.result, ACTION.MAILBOX_PIN)
      dispatch(getMailboxes())
      return res
    })
    .catch(err => error(dispatch, err))
}

export const getMailboxes = () => dispatch => {
  return get(API.GET_MAILBOXES)
    .then(res => {
      act(dispatch, res.result.mailboxes, ACTION.MAILBOXES)
      act(dispatch, res.result.pins, ACTION.PINS)
      Storage.set(STORE.MAILBOXES, res.result.mailboxes)
      Storage.set(STORE.PINS, res.result.pins)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postMailbox = data => dispatch => {
  return post(API.POST_MAILBOX, data)
    .then(res => {
      //act(dispatch, res.result, ACTION.MAILBOX)
      dispatch(getMailboxes())
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postMailboxPIN = data => dispatch => {
  return post(API.POST_MAILBOX_PIN, data)
    .then(res => {
      //act(dispatch, res.result, ACTION.MAILBOX_PIN)
      dispatch(getMailboxes())
      return res
    })
    .catch(err => error(dispatch, err))
}

export const putMailbox = data => dispatch => {
  const url = API.PUT_MAILBOX.replace('{mid}', data.id)
  return put(url, data)
    .then(res => {
      //act(dispatch, res.result, ACTION.MAILBOX)
      dispatch(getMailboxes())
      return res
    })
    .catch(err => error(dispatch, err))
}

// User

export const delUser = data => dispatch => {
  return del(API.DEL_USER, data)
    .then(res => {
      //act(dispatch, res.result, ACTION.USER)
      dispatch(getUsers())
      return res
    })
    .catch(err => error(dispatch, err))
}

export const getUsers = () => dispatch => {
  return get(API.GET_USERS)
    .then(res => {
      act(dispatch, res.result, ACTION.USERS)
      Storage.set(STORE.USERS, res.result)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postMe = data => dispatch => {
  const url = `${ API.POST_USER }/${ data.id }`
  return put(url, data)
    .then(res => {
      act(dispatch, res.result, ACTION.ME)
      Storage.set(STORE.USER, res.result)
      return res
    })
    .catch(err => error(dispatch, err))
}

export const postUser = data => dispatch => {
  const fn = !!data.id ? put : post
  const url = !!data.id ? `${ API.POST_USER }/${ data.id }` : API.POST_USER
  return fn(url, data)
    .then(res => {
      //act(dispatch, res.result, ACTION.USER)
      dispatch(getUsers())
      return res
    })
    .catch(err => error(dispatch, err))
}

export default {
  alert,
  dismiss,

  postAccount,

  postLogin,
  postLogout,

  delMailbox,
  delMailboxPIN,
  getMailboxes,
  postMailbox,
  postMailboxPIN,
  putMailbox,

  delUser,
  getUsers,
  postMe,
  postUser,
}
