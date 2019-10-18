
import { API, STORE } from './Constants'
import Storage from './Storage'

function checkError(res) {
  try {
    if (!res.ok) {
      console.log(res)

      // TODO: attempt to login again after a 401.

      throw new Error(`${ res.status } - ${ res.statusText }`)
    }

    return res.json()
  } catch(err) {
    return Promise.reject(err)
  }
}

function request(route, opts) {
  const url = `${ API.HOST }${ route }/`

  return setupOpts(opts)
    .then(options => fetch(url, options).then(checkError))
}

async function setupOpts(opts) {
  const token = await Storage.get(STORE.TOKEN)

  return {
    ...opts,
    cache: 'no-cache',
    headers: {
      'Accept': 'application/json',
      'Authorization': token,
      'Content-Type': 'application/json',
      'User-Agent': 'It\'s Here Mobile v0.1.0',
      ...opts.headers,
    },
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  }
}

export const del = (route, data = {}, opts = {}) => {
  return request(route, { ...opts, method: 'DELETE' })
}

export const get = (route, opts = {}) => {
  return request(route, { ...opts, method: 'GET' })
}

export const post = (route, data = {}, opts = {}) => {
  if (typeof(data) !== 'string') data = JSON.stringify(data)
  return request(route, { ...opts, body: data, method: 'POST' })
}

export const put = (route, data = {}, opts = {}) => {
  if (typeof(data) !== 'string') data = JSON.stringify(data)
  return request(route, { ...opts, body: data, method: 'PUT' })
}
