import express from 'express'
import restbus from 'restbus'

const app = express()

app.use('/restbus', restbus.middleware())

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port 3000')
})
