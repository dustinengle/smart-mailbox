
import Reducers from '../constants/Reducers'

const channels = (state = [], action) => {
    switch(action.type) {
        case Reducers.CHANNELS:
            return [...action.payload]
        default:
            return state
    }
}

const email = (state = null, action) => {
    switch(action.type) {
        case Reducers.EMAIL:
            return action.payload
        default:
            return state
    }
}

const loading = (state = false, action) => {
    switch(action.type) {
        case Reducers.LOADING:
            return action.payload
        default:
            return state
    }
}

const messages = (state = [], action) => {
    switch(action.type) {
        case Reducers.MESSAGES:
            return [...action.payload]
        default:
            return state
    }
}

const things = (state = [], action) => {
    switch(action.type) {
        case Reducers.THINGS:
            return [...action.payload]
        default:
            return state
    }
}

export default {
    channels,
    email, 
    loading,
    messages,
    things,
}