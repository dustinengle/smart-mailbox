
export const ACTION = {
  ALERT: '@action.alert',
  ACCOUNT: '@action.account',
  CONNECTED: '@action.connected',
  DISMISS: '@action.dismiss',
  GATEWAY: '@action.gateway',
  GATEWAYS: '@action.gateways',
  LOADING: '@action.loading',
  MAILBOX: '@action.mailbox',
  MAILBOX_PIN: '@action.mailbox.pin',
  MAILBOXES: '@action.mailboxes',
  ME: '@action.me',
  MESSAGE: '@action.message',
  MESSAGES: '@action.messages',
  TOKEN: '@action.token',
  USER: '@action.user',
  USERS: '@action.users',
}

export const API = {
  HOST: 'http://localhost:10000',

  GET_ACCOUNT: '/account',
  GET_ACCOUNT_BALANCE: '/account/balance',
  POST_ACCOUNT: '/register',

  DEL_GATEWAY: '/gateway',
  GET_GATEWAY_MESSAGES: '/gateway/message',
  GET_GATEWAYS: '/gateway/all',
  POST_GATEWAY: '/gateway',
  POST_GATEWAY_MESSAGE: '/gateway/message',

  POST_LOGIN: '/login',
  POST_LOGOUT: '/logout',

  DEL_MAILBOX: '/mailbox',
  DEL_MAILBOX_PIN: '/mailbox/pin',
  GET_MAILBOXES: '/mailbox/all',
  POST_MAILBOX: '/mailbox',
  POST_MAILBOX_PIN: '/mailbox/pin',

  DEL_USER: '/user',
  GET_USERS: '/user/all',
  POST_USER: '/user',
}

export const STORE = {
  ACCOUNT: '@safebox.account',
  GATEWAYS: '@safebox.gateways',
  MAILBOXES: '@safebox.mailboxes',
  TOKEN: '@safebox.token',
  USER: '@safebox.user',
  USERS: '@safebox.users',
}

export default {
  ACTION,
  API,
  STORE,
}
