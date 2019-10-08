
import { API, STORE } from './Constants'
import Storage from './Storage'

function checkError(res) {
  try {
    if (!res.ok) {
      console.log(res)
      throw new Error(`${ res.status } - ${ res.statusText }`)
    }

    return res.json()
  } catch(err) {
    return Promise.reject(err)
  }
}

function request(route, opts) {
  let url = `${ API.HOST }${ route }`
  if (url.substr(0, url.length - 1) !== '/') url += '/'

  return setupOpts(opts)
    .then(options => fetch(url, options).then(checkError))
}

async function setupOpts(opts) {
  const token = await Storage.get(STORE.TOKEN)

  return {
    headers: {
      'Accept': 'application/json',
      'Authorization': token,
      'Content-Type': 'application/json',
      'User-Agent': 'SafeBox Mobile v0.1.0',
      ...opts.headers,
    },
    ...opts,
  }
}

export const del = (route, data = {}, opts = {}) => {
  return request(route, { ...opts, method: 'DELETE' })
}

export const get = (route, opts = {}) => {
  return request(route, { ...opts, method: 'GET' })
}

export const post = (route, data = {}, opts = {}) => {
  return request(route, { ...opts, body: JSON.stringify(data), method: 'POST' })
}

export const put = (route, data = {}, opts = {}) => {
  return request(route, { ...opts, body: JSON.stringify(data), method: 'PUT' })
}
