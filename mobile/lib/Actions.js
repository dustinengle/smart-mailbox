
import Errors from '../constants/Errors'
import Reducers from '../constants/Reducers'
import Storage from '../constants/Storage'
import URL from '../constants/URL'

import { Delete, Get, Post, PostNoAuth } from './Fetch'
import { getURL } from './URL'
import { setItem } from './Storage'

export const fetchChannels = () => {
    return dispatch => {
        const opts = {}

        return Get(getURL(URL.ACCOUNT_CHANNELS), opts)
            .then(res => {
                dispatch({ payload: res.channels, type: Reducers.CHANNELS })
                return res
            })
    }
}

export const fetchCheckEmail = email => {
    return dispatch => {
        if (!email) return Promise.reject(Errors.MISSING_EMAIL)

        return PostNoAuth(getURL(URL.CHECK_EMAIL), { email })
            .then(res => {
                dispatch({ payload: email, type: Reducers.EMAIL })
                setItem(Storage.EMAIL, email)
                return res
            })
    }
}

export const fetchLogin = (email, password) => {
    return dispatch => {
        if (!email) return Promise.reject(Errors.MISSING_EMAIL)
        if (!password) return Promise.reject(Errors.MISSING_PASSWORD)

        return PostNoAuth(getURL(URL.ACCOUNT_LOGIN), { email, password })
            .then(res => {
                dispatch({ payload: email, type: Reducers.EMAIL })
                setItem(Storage.EMAIL, email)
                setItem(Storage.TOKEN, res.token)
                return res
            })
    }
}

export const fetchMessages = (channel, filter = {}) => {
    return dispatch => {
        const opts = {}

        return Get(getURL(URL.ACCOUNT_MESSAGES), opts)
            .then(res => {
                dispatch({ payload: res.messages, type: Reducers.MESSAGES })
                return res
            })
    }
}

export const fetchRegister = (email, password) => {
    return dispatch => {
        if (!email) return Promise.reject(Errors.MISSING_EMAIL)
        if (!password) return Promise.reject(Errors.MISSING_PASSWORD)

        return PostNoAuth(getURL(URL.CREATE_ACCOUNT), { email, password })
            .then(res => {
                dispatch({ payload: email, type: Reducers.EMAIL })
                setItem(Storage.EMAIL, email)
                setItem(Storage.TOKEN, res.token)
                return res
            })
    }
}

export const fetchThings = () => {
    return dispatch => {
        return Get(getURL(URL.ACCOUNT_THINGS))
            .then(res => {
                dispatch({ payload: res.things, type: Reducers.THINGS })
                return res
            })
    }
}

export default {
    fetchChannels,
    fetchCheckEmail,
    fetchLogin,
    fetchMessages,
    fetchRegister,
    fetchThings,
}