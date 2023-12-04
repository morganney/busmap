import { Router, json } from 'express'

import { authn as handler } from '../handlers/authn.js'

const authn = Router()

authn.post('/login', json(), handler.login)
authn.post('/logout', json(), handler.logout)
authn.get('/status', handler.status)
authn.put('/touch', handler.touch)

export { authn }
