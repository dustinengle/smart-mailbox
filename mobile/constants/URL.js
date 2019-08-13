
const API_URL = 'https://streamiot.dev' // 165.22.158.157

export const ACCOUNT_BALANCE = '/api/returnbalance' // POST
export const ACCOUNT_CHANNELS = '/channels' // GET
export const ACCOUNT_LOGIN = '/tokens' // POST
export const ACCOUNT_MESSAGES = 'reader/channels/%CHANNEL_ID%/messages' // GET
export const ACCOUNT_THING = '/thing/' // GET
export const ACCOUNT_THINGS = '/things' // GET, POST
export const ACCOUNT_TOTALS = '/api/devicetotal' // POST

export const CHECK_EMAIL = '/api/emailcheck' // POST
export const CREATE_ACCOUNT = '/api/trigxaccount' // POST

export const getURL = route => `${API_URL}${route}`

export default {
    ACCOUNT_BALANCE,
    ACCOUNT_CHANNELS,
    ACCOUNT_LOGIN,
    ACCOUNT_THING,
    ACCOUNT_THINGS,
    ACCOUNT_TOTALS,

    CHECK_EMAIL,
    CREATE_ACCOUNT,

    getURL,
}