import { Router, json } from 'express'

import { favorite as handler } from '../handlers/favorite.js'

const favorite = Router()

favorite.put('/add', json(), handler.add)

export { favorite }
