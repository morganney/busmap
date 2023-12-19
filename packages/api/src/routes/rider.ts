import { Router, json } from 'express'

import { rider as handler } from '../handlers/rider.js'

const rider = Router()

rider.put('/settings', json(), handler.settings)

export { rider }
