import express, { Request, Response } from 'express'
import 'express-async-error'
import { json, urlencoded } from 'body-parser'
import { errorHandler, NotFoundError } from '@atickets/common'
import cors from 'cors'
import helmet from 'helmet'
import {
  subscribers,
  eventsHandler,
  sendEventToSubscriber,
  sendEventToAllSubscriber,
  closeConnection,
} from './middleware'

const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(cors())
app.use(helmet())
app.use(urlencoded({ extended: false }))

// Define endpoints
app.get('/events', eventsHandler)
app.get('/status', (req: Request, res: Response) =>
  res.json({ clients: subscribers.length })
)
app.post('/publishs', sendEventToSubscriber)
app.delete('/closes/:id', closeConnection)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
