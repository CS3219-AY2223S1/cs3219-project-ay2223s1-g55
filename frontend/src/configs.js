const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000'

const PREFIX_USER_SVC = '/api/user'

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC
export const URL_USER_LOGIN = `${URL_USER_SVC}/login`
export const URL_USER_SESSION = `${URL_USER_SVC}/session`
