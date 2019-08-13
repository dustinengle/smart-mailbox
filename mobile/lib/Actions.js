
import { AsyncStorage } from 'react-native'
import { Delete, Get, Post, PostNoAuth } from './Fetch'
import { MISSING_EMAIL, MISSING_PASSWORD } from '../constants/Errors'
import URL from '../constants/URL'
import Storage from '../constants/Storage'

export const fetchLogin = (email, password) => {
    return dispatch => {
        if (!email) return Promise.reject(MISSING_EMAIL)
        if (!password) return Promise.reject(MISSING_PASSWORD)

        return PostNoAuth(URL.getURL(URL.ACCOUNT_LOGIN), { email, password })
            .then(res => {
                dispatch({ payload: email, type: 'EMAIL' })
                AsyncStorage.setItem(Storage.EMAIL, email)
                AsyncStorage.setItem(Storage.TOKEN, res.token)
                return res
            })
    }
}

export default {
    fetchLogin,
}