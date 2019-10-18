
export const auth = (deviceId, pin) => ([
  { bn: `${ deviceId }_`, n: 'AUTH', u: 'PIN', vs: `${ pin }` },
])

export const check = () => ([
  { bn: `SAFEBOX_`, n: 'TEST', u: 'CHECK', vb: true },
])

export const connect = deviceId => ([
  { bn: `${ deviceId }_`, n: 'CONNECT', u: 'Requested', vb: true },
])

export const lock = deviceId => ([
  { bn: `${ deviceId }_`, n: 'LOCK', u: 'Lock', v: 1 },
])

export const register = deviceId => ([
  { bn: `${ deviceId }_`, n: 'REGISTER', u: 'Requested', vb: true },
])

export const status = deviceId => ([
  { bn: `${ deviceId }_`, n: 'STATUS', u: 'CHECK', vb: true },
])

export const unauth = (deviceId, pin) => ([
  { bn: `${ deviceId }_`, n: 'UNAUTH', u: 'PIN', vs: `${ pin }` },
])

export const unlock = deviceId => ([
  { bn: `${ deviceId }_`, n: 'UNLOCK', u: 'Lock', v: 0 },
])

export default {
  auth,
  check,
  connect,
  lock,
  register,
  status,
  unauth,
  unlock,
}
