
import { ACTION, DEMO } from './Constants'
import { combineReducers } from 'redux'

const accountInit = {
  id: 1,
  email: 'john.doe@email.com',
  password: 'password!1',
  publicKey: 'GCXK725BUFTN6MBAKW7RJHUUEETL2ZT55WDSNHE6TOT5O4S3XNGYHVIJ',
}
const account = (state = DEMO ? accountInit : {}, { payload, type }) => {
  if (type === ACTION.ACCOUNT) return { ...state, ...payload }
  return state
}

const alerts = (state = [], { payload, type }) => {
  if (type === ACTION.ALERT) {
    return [ ...state, { ...payload }]
  } else if (type === ACTION.DISMISS) {
    return state.filter(a => a.id !== payload.id)
  }
  return state
}

const connected = (state = false, { payload, type }) => {
  if (type === ACTION.CONNECTED) return payload
  return state
}

const gatewaysInit = [
  {
    accountId: 1,
    channelId: '5003c2dd-fb41-4ab1-85cf-351c2ace5c20',
    deviceId: '8317ade1-1171-45db-a4b1-90294434d7c1',
    deviceKey: '98624184-5853-4a2e-b76f-2186270c50ee',
    id: 1,
    mailboxId: 1,
    publicKey: 'GCXK725BUFTN6MBAKW7RJHUUEETL2ZT55WDSNHE6TOT5O4S3XNGYHVIJ',
    sn: '123456',
    status: 'COMPLETED_SETUP',
  },
  {
    accountId: 1,
    channelId: '3445347b-e07a-4a3e-8cb0-ff75f8c95bda',
    deviceId: '1664eb7f-d402-4803-beed-51c0bd7d9620',
    deviceKey: 'e8a0f0a0-7890-4dac-b97d-8aacdc257cbd',
    id: 2,
    mailboxId: 2,
    publicKey: 'GCXK725BUFTN6MBAKW7RJHUUEETL2ZT55WDSNHE6TOT5O4S3XNGYHVIJ',
    sn: '098765',
    status: 'AWAITING_SETUP',
  },
]
const gateways = (state = DEMO ? gatewaysInit : [], { payload, type }) => {
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

const mailboxesInit = [
  {
    accountId: 1,
    gateway: '456789',
    id: 1,
    name: 'Home',
    sn: '456789',
    state: {
      flag: false,
      lock: true,
      package: true,
      power: 48,
    },
    status: 'COMPLETED_SETUP',
    pins: [
      {
        accountId: 1,
        email: null,
        id: 1,
        mailboxId: 1,
        name: 'Scott Cook',
        number: 3344,
        phone: '1234567890',
        single: false,
        timeout: null,
      },
    ],
  },
  {
    accountId: 1,
    gateway: '563423',
    id: 2,
    name: 'AirBnB',
    sn: '563423',
    state: {
      flag: false,
      lock: false,
      package: false,
      power: 98,
    },
    status: 'AWAITING_SETUP',
    pins: [
      {
        accountId: 1,
        email: null,
        id: 2,
        mailboxId: 2,
        name: 'David Ringer',
        number: 3344,
        phone: null,
        single: true,
        timeout: null,
      },
      {
        accountId: 1,
        email: 'jimmy.doe@email.com',
        id: 3,
        mailboxId: 2,
        name: 'Jimmy Doe',
        number: 1234,
        phone: null,
        single: false,
        timeout: null,
      },
      {
        accountId: 1,
        email: null,
        id: 4,
        mailboxId: 2,
        name: 'April O\'Neal',
        number: 99887,
        phone: '4455556789',
        single: false,
        timeout: null,
      },
      {
        accountId: 1,
        email: 'robert.robertson@email.com',
        id: 5,
        mailboxId: 2,
        name: 'Robert Robertson',
        number: 6767,
        phone: null,
        single: false,
        timeout: null,
      },
    ],
  },
]
const mailboxes = (state = DEMO ? mailboxesInit : [], { payload, type }) => {
  if (type === ACTION.MAILBOX) {
    return [ ...state, { ...payload }]
  } else if (type === ACTION.MAILBOXES) {
    return [ ...payload ]
  }
  return state
}

const meInit = {
  accountId: 1,
  email: 'john.doe@email.com',
  google: false,
  id: 1,
  name: 'John Doe',
  phone: '5555553434',
  pushToken: '10926f415fc6',
  token: '17dc28f9-26a4-44f2-9695-10926f415fc6',
}
const me = (state = DEMO ? meInit : { email: '', name: '' }, { payload, type }) => {
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

const pins = (state = [], { payload, type }) => {
  if (type === ACTION.PIN) {
    return [ ...state, { ...payload }]
  } else if (type === ACTION.PINS) {
    return [ ...payload ]
  }
  return state
}

const tokenInit = '17dc28f9-26a4-44f2-9695-10926f415fc6'
const token = (state = tokenInit, { payload, type }) => {
  if (type === ACTION.TOKEN) return payload
  return state
}

const usersInit = [
  {
    accountId: 1,
    email: 'dustin.engle@pagarba.io',
    google: false,
    id: 2,
    name: 'Dustin Engle',
    phone: '7025305738',
    pushToken: '6e3494aaad49',
    token: 'A4079f7a-9a80-4c6f-aa54-6e3494aaad49',
  },
  {
    accountId: 1,
    email: 'jane.doe@email.com',
    google: false,
    id: 3,
    name: 'Jane Doe',
    phone: '5555553434',
    pushToken: '6e3594aaad49',
    token: '94079f7a-9a80-4c6f-aa54-6e3594aaad49',
  },
  {
    accountId: 1,
    email: 'bob.doe@email.com',
    google: false,
    id: 4,
    name: 'Bob Doe',
    phone: '5553331236',
    pushToken: '8a79c8782b96',
    token: 'fc49ed8a-ec62-4e6a-9bd6-8a79c8782b96',
  },
  {
    accountId: 1,
    email: 'butch.cassidy@email.com',
    google: true,
    id: 5,
    name: 'Butch Cassidy',
    phone: '1112223333',
    pushToken: 'beb923d185e3',
    token: 'bd1f6ad1-ef2f-4628-b5bb-beb923d185e3',
  },
]
const users = (state = DEMO ? usersInit : [], { payload, type }) => {
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
  pins,
  token,
  users,
})
