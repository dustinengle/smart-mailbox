
import Storage from '../constants/Storage'

import { getItem } from '../lib/Storage'

const checkForError = response => {
    return response.json()
}

const expandQueryParams = (url, options = {}) => {
    let query = ''
    if (!options.query) return url

    for(let [k, v] in Object.entries(options)) {
        query += `${k}=${encodeURIComponent(v)}&`
    }

    if (query[query.length - 1] === '&') {
        query = query.substr(0, query.length - 1)
    }

    return `${url}?${query}`
}

const fixOptions = async (options) => {
    delete options['query']

    token = await getItem(Storage.TOKEN)
    
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

export const Delete = async (url, options = {}) => {
    const opts = await fixOptions(options)
    opts.method = 'DELETE'

    url = expandQueryParams(url, options)

    console.log('Delete', url, opts)
    return fetch(url, opts)
        .then(checkForError)
}

export const Get = async (url, options = {}) => {
    const opts = await fixOptions(options)

    url = expandQueryParams(url, opts)

    console.log('Get', url, opts)
    return fetch(url, opts)
        .then(checkForError)
}

export const Post = async (url, data, options = {}) => {
    const opts = await fixOptions(options)
    opts.body = JSON.stringify(data)
    opts.method = 'POST'

    url = expandQueryParams(url, options)

    console.log('Post', url, opts)
    return fetch(url, opts)
        .then(checkForError)   
}

export const PostNoAuth = async (url, data, options = {}) => {
    const opts = await fixOptions(options)
    opts.body = JSON.stringify(data)
    opts.method = 'POST'

    delete opts.headers['Authorization']
    
    url = expandQueryParams(url, options)

    console.log('PostNoAuth', url, opts)
    return fetch(url, opts)
        .then(checkForError)   
}

export const Put = async (url, data, options = {}) => {
    const opts = await fixOptions(options)
    opts.body = JSON.stringify(data)
    opts.method = 'PUT'

    url = expandQueryParams(url, options)

    console.log('Put', url, opts)
    return fetch(url, opts)
        .then(checkForError)   
}

export default {
    Delete,
    Get,
    Post,
    Put,
}