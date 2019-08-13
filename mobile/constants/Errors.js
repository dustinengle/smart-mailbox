
function e(msg) {
    return new Error(msg)
}

export const MISSING_EMAIL = e('missing email')
export const MISSING_PASSWORD = e('missing password')

export default {
    MISSING_EMAIL,
    MISSING_PASSWORD,
}