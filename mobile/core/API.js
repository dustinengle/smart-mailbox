
export const HOST = 'http://165.22.183.203:10000/v1'

export const URL = {
  BALANCE: '/user/balance',
  DETAILS: '/user/details',
  GATEWAY: '/gateway',
  LOGIN: '/login',
  LOGOUT: '/user/logout',
  MAILBOX: '/mailbox',
  MESSAGE: '/mailbox/message',
  PIN: '/mailbox/pin',
  REGISTER: '/register',
  TOTALS: '/user/totals',
  USER: '/user'
}

export const getURL = url => `${ HOST }${ url }/`

export default {
  HOST,
  URL,

  getURL,
}
