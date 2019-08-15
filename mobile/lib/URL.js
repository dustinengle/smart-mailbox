
import { API_URL } from '../constants/URL'

export const getURL = route => `${API_URL}${route}`

export default {
    getURL,
}