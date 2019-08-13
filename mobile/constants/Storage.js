
import { AsyncStorage } from 'react-native'

export const EMAIL = '@smart-mailbox-email'
export const TOKEN = '@smart-mailbox-token'

export const getItem = async key => {
    let item
    try {
        item = await AsyncStorage.getItem(key)
    } catch(err) {
        console.log(err)
        item = null
    }
    return item
}

export default {
    EMAIL,
    TOKEN,

    getItem,
}