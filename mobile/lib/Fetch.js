
import Storage from '../constants/Storage'

const checkForError = response => {
    return response.json()
}

const fixOptions = options => {
    token = Storage.getItem(Storage.TOKEN)
    
    return { 
        ...options, 
        cors: false,
        headers: {
            Accept: 'application/json',
            Authorization: token,
            'Content-Type': 'application/json'
        }, 
        method: 'GET'
    }
}

export const Delete = (url, options = {}) => {
    options = fixOptions(options)
    options.method = 'DELETE'

    return fetch(url, options)
        .then(checkForError)
}

export const Get = (url, options = {}) => {
    options = fixOptions(options)

    return fetch(url, options)
        .then(checkForError)
}

export const Post = (url, data, options = {}) => {
    options = fixOptions(options)
    options.body = JSON.stringify(data)
    options.method = 'POST'

    console.log('Post', url, options)
    return fetch(url, options)
        .then(checkForError)   
}

export const PostNoAuth = (url, data, options = {}) => {
    options = fixOptions(options)
    options.body = JSON.stringify(data)
    options.headers.Authorization = undefined
    options.method = 'POST'
    
    console.log('PostNoAuth', url, options)
    return fetch(url, options)
        .then(checkForError)   
}

export default {
    Delete,
    Get,
    Post,
}