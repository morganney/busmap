import { Router, json } from 'express'

import { favorite as handler } from '../handlers/favorite.js'

const favorite = Router()

favorite.put('/add', json(), handler.add)
favorite.delete('/remove', json(), handler.remove)
favorite.get('/list', handler.list)

export { favorite }
