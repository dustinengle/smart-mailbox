
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
  PIN: '@action.pin',
  PINS: '@action.pins',
  TOKEN: '@action.token',
  USER: '@action.user',
  USERS: '@action.users',
}

export const API = {
  HOST: 'http://192.168.0.164:10000',

  GET_ACCOUNT: '/account',
  GET_ACCOUNT_BALANCE: '/account/balance',
  POST_ACCOUNT: '/register',

  POST_LOGIN: '/login',
  POST_LOGOUT: '/user/logout',

  DEL_MAILBOX: '/mailbox',
  DEL_MAILBOX_PIN: '/mailbox/{mid}/pin/{pid}',
  GET_MAILBOXES: '/mailbox',
  GET_MAILBOX_MESSAGES: '/mailbox/{mid}/message',
  POST_MAILBOX: '/mailbox',
  POST_MAILBOX_MESSAGE: '/mailbox/message',
  POST_MAILBOX_PIN: '/mailbox/pin',
  PUT_MAILBOX: '/mailbox/{mid}',

  DEL_USER: '/user',
  GET_USERS: '/user',
  POST_USER: '/user',
}

export const ICON = {
  ADD: 'add',
  BATTERY_100: 'battery',
  BATTERY_90: 'battery-90',
  BATTERY_80: 'battery-80',
  BATTERY_70: 'battery-70',
  BATTERY_60: 'battery-60',
  BATTERY_50: 'battery-50',
  BATTERY_40: 'battery-40',
  BATTERY_30: 'battery-30',
  BATTERY_20: 'battery-20',
  BATTERY_10: 'battery-10',
  CLOSE: 'close',
  DASHBOARD: 'view-dashboard',
  DELETE: 'delete',
  DETAIL: 'eye',
  DOWN: 'flag-outline',
  EDIT: 'pencil',
  EMAIL: 'email',
  EMPTY: 'package-variant',
  GATEWAY: 'console-network',
  MAILBOX: 'mailbox',
  MESSAGES: 'android-messages',
  LOCKED: 'lock',
  PACKAGE: 'package-variant-closed',
  PHONE: 'phone',
  PIN: 'numeric',
  SAVE: 'content-save',
  SETTINGS: 'settings',
  UNLOCKED: 'lock-open',
  UP: 'flag',
  USER: 'account-group',
  WALLET: 'wallet',
}

export const DEMO = false

export const STORE = {
  ACCOUNT: '@safebox.account',
  GATEWAYS: '@safebox.gateways',
  MAILBOXES: '@safebox.mailboxes',
  PINS: '@safebox.pins',
  TOKEN: '@safebox.token',
  USER: '@safebox.user',
  USERS: '@safebox.users',
}

export default {
  ACTION,
  API,
  DEMO,
  ICON,
  STORE,
}
