
import { AsyncStorage } from 'react-native'

export const KEY = {
  TOKEN: '@itshere-token',
  USER: '@itshere-user'
}

export const getItem = async k => {
  try {
    const v = await AsyncStorage.getItem(k)
    return v && v.substr(0, 1) === '{' ? JSON.parse(v) : v
  } catch(err) {
    console.log('Storage.getItem error:', err)
    return null
  }
}

export const removeItem = async k => {
  try {
    await AsyncStorage.removeItem(k)
  } catch(err) {
    console.log('Storage.removeItem error:', err)
  }
}

export const setItem = async (k, v) => {
  try {
    if (!v || v === 'undefined') return
    if (typeof(v) !== 'string') v = JSON.stringify(v)
    await AsyncStorage.setItem(k, v)
  } catch(err) {
    console.log('Storage.setItem error:', err)
  }
}

export default {
  KEY,

  getItem,
  removeItem,
  setItem,
}
