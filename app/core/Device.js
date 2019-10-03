
import { NetInfo } from 'react-native'

const ev = 'connectionChange'
const is = NetInfo.isConnected

export const addConnectedListener = callback => is.addEventListener(ev, callback)

export const isConnected = async () => {
  try {
    return await is.fetch()
  } catch(err) {
    console.log('Device.isConnected:', err)
    return false
  }
}

export const isWeb = () => typeof(document) !== 'undefined'

export const removeConnectedListener = callback => is.removeEventListener(ev, callback)

export default {
  addConnectedListener,
  isConnected,
  isWeb,
  removeConnectedListener,
}
