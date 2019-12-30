
import { getItem, KEY } from './Storage'
import { getURL } from './API'

async function checkError(res) {
  try {
    if (!res.ok) {
      const json = await res.json()
      console.log('FETCH_ERROR:', res, json)

      // TODO: attempt to login again after a 401.

      throw new Error(`${ res.statusCode } - ${ json.error || res.statusText }`)
    }


    return res.json()
  } catch(err) {
    return Promise.reject(err)
  }
}

function request(route, opts) {
  const url = getURL(route)

  return setupOpts(opts)
    .then(options => {
      console.log(url, '=>', opts)
      return fetch(url, options).then(checkError)
    })
}

async function setupOpts(opts) {
  const token = await getItem(KEY.TOKEN)

  return {
    ...opts,
    cache: 'no-cache',
    headers: {
      'Accept': 'application/json',
      'Authorization': token,
      'Content-Type': 'application/json',
      'User-Agent': 'ItsHere v1.0.0',
      ...opts.headers,
    },
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  }
}

export const DELETE = (route, data = {}, opts = {}) => {
  if (typeof(data) !== 'string') data = JSON.stringify(data)
  return request(route, { ...opts, body: data, method: 'DELETE' })
}

export const GET = (route, opts = {}) => {
  return request(route, { ...opts, method: 'GET' })
}

export const POST = (route, data = {}, opts = {}) => {
  if (typeof(data) !== 'string') data = JSON.stringify(data)
  return request(route, { ...opts, body: data, method: 'POST' })
}

export const PUT = (route, data = {}, opts = {}) => {
  if (typeof(data) !== 'string') data = JSON.stringify(data)
  return request(route, { ...opts, body: data, method: 'PUT' })
}
