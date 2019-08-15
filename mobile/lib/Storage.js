
import { AsyncStorage } from 'react-native'

export const clearItem = async (key) => {
    console.log('Storage.clearItem', key)
    let result
    try {
        result = await AsyncStorage.removeItem(key)
    } catch(err) {
        console.log('Storage.clearItem:', err)
    }
    return result
}

export const getItem = async (key) => {
    let item
    try {
        item = await AsyncStorage.getItem(key)
    } catch(err) {
        console.log('Storage.getItem:', err)
        item = null
    }
    if (item instanceof Promise || typeof(item) === 'object') {
        console.log('Storage.getItem: item of type Promise or other object')
        item = null
    }
    console.log('Storage.getItem', key, item)
    return item
}

export const setItem = async (key, item) => {
    console.log('Storage.setItem', key, item)
    let result
    try {
        result = await AsyncStorage.setItem(key, item)
    } catch(err) {
        console.log('Storage.setItem:', err)
    }
    return result
}

export default {
    clearItem,
    getItem,
    setItem,
}