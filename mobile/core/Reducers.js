
import { ACTION } from './Constants'
import { combineReducers } from 'redux'

const account = (state = {}, { payload, type }) => {
  if (type === ACTION.ACCOUNT) return { ...payload }
  return state
}

const gateways = (state = [], { payload, type }) => {
  if (type === ACTION.GATEWAYS) return [ ...payload ]
  return state
}

const loading = (state = true, { payload, type }) => {
  if (type === ACTION.LOADING) return payload
  return state
}

const mailboxes = (state = [], { payload, type }) => {
  if (type === ACTION.MAILBOXES) return [ ...payload ]
  return state
}

const pins = (state = [], { payload, type }) => {
  if (type === ACTION.PINS) return [ ...payload ]
  return state
}

const user = (state = {}, { payload, type }) => {
  if (type === ACTION.USER) return { ...payload }
  return state
}

const users = (state = [], { payload, type }) => {
  if (type === ACTION.USERS) return [ ...payload ]
  return state
}

export default combineReducers({
  account,
  gateways,
  loading,
  mailboxes,
  pins,
  user,
  users,
})
