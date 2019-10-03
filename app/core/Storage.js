
import { AsyncStorage } from 'react-native'

export const get = async key => {
  try {
    const val = await AsyncStorage.getItem(key)
    return val
  } catch(err) {
    console.log('Storage.get:', err)
    return null
  }
}

export const remove = async key => {
  try {
    return await AsyncStorage.removeItem(key)
  } catch(err) {
    console.log('Storage.remove:', err)
  }
}

export const set = async (key, val) => {
  try {
    return await AsyncStorage.setItem(key, val)
  } catch(err) {
    console.log('Storage.set:', err)
  }
}

export default {
  get,
  remove,
  set,
}
