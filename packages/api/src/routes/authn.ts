import { Router, json } from 'express'

import { authn as handler } from '../handlers/authn.js'

const authn = Router()

authn.post('/login', json(), handler.login)
authn.get('/status', handler.status)

export { authn }
