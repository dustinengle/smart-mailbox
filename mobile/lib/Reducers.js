
export const CHANNELS = 'CHANNELS'
export const EMAIL = 'EMAIL'
export const LOADING = 'LOADING'
export const MESSAGES = 'MESSAGES'
export const THINGS = 'THINGS'

const channels = (state = [], action) => {
    switch(action.type) {
        case CHANNELS:
            return [...action.payload]
        default:
            return state
    }
}

const email = (state = null, action) => {
    switch(action.type) {
        case EMAIL:
            return action.payload
        default:
            return state
    }
}

const loading = (state = false, action) => {
    switch(action.type) {
        case LOADING:
            return action.payload
        default:
            return state
    }
}

const messages = (state = [], action) => {
    switch(action.type) {
        case MESSAGES:
            return [...action.payload]
        default:
            return state
    }
}

const things = (state = [], action) => {
    switch(action.type) {
        case THINGS:
            return [...action.payload]
        default:
            return state
    }
}

export const Reducers = {
    channels,
    email, 
    loading,
    messages,
    things,
}

export default {
    CHANNELS,
    EMAIL,
    LOADING,
    MESSAGES,
    THINGS,

    Reducers,
}