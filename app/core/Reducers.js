
import { ACTION } from './Constants'
import { combineReducers } from 'redux'

const account = (state = {}, { payload, type }) => {
  if (type === ACTION.ACCOUNT) return { ...state, ...payload }
  return state
}

const alerts = (state = [], { payload, type }) => {
  if (type === ACTION.ALERT) {
    return [ ...state, { ...payload }]
  } else if (type === ACTION.DISMISS) {
    return state.filter(a => a.id !== payload)
  }
  return state
}

const connected = (state = false, { payload, type }) => {
  if (type === ACTION.CONNECTED) return payload
  return state
}

const gateways = (state = [], { payload, type }) => {
  if (type === ACTION.GATEWAY) {
    return [ ...state, { ...payload }]
  } else if (type === ACTION.GATEWAYS) {
    return [ ...payload ]
  }
  return state
}

const loading = (state = true, { payload, type }) => {
  if (type === ACTION.LOADING) return payload
  return state
}

const mailboxes = (state = [], { payload, type }) => {
  if (type === ACTION.MAILBOX) {
    return [ ...state, { ...payload }]
  } else if (type === ACTION.MAILBOXES) {
    return [ ...payload ]
  }
  return state
}

const me = (state = {}, { payload, type }) => {
  if (type === ACTION.ME) return { ...payload }
  return state
}

const messages = (state = [], { payload, type }) => {
  if (type === ACTION.MESSAGE) {
    return [ ...state, { ...payload }]
  } else if (type === ACTION.MESSAGES) {
    return [ ...payload ]
  }
  return state
}

const token = (state = '', { payload, type }) => {
  if (type === ACTION.TOKEN) return payload
  return state
}

const users = (state = [], { payload, type }) => {
  if (type === ACTION.USER) {
    return [ ...state, { ...payload }]
  } else if (type === ACTION.USERS) {
    return [ ...payload ]
  }
  return state
}

export default combineReducers({
  account,
  alerts,
  connected,
  gateways,
  loading,
  mailboxes,
  me,
  messages,
  token,
  users,
})
