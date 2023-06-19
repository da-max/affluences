import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { DateTime } from 'luxon'
import { GetRessourceIdParams } from './types'
import { getReservations, getTimables, isOpen, isReserved } from './utils'

dotenv.config()

const app: Express = express()
const port: string = process.env.API_PORT || '3000'

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server')
})

app.get(
    '/:datetime/:ressourceId/available',
    async (req: Request<GetRessourceIdParams>, res: Response) => {
        const date = DateTime.fromISO(req.params.datetime)
        const ressourceId = req.params.ressourceId
        if (!date.isValid || !date.hasSame(DateTime.now(), 'day')) {
            res.status(400).send({
                msg: 'The first param is not valid datetime.',
            })
            return
        }

        const timetables = await getTimables(date, ressourceId)
        const reservations = await getReservations(date, ressourceId)

        if (isOpen(date, timetables) && !isReserved(date, reservations)) {
            res.status(200).send({ available: true })
        } else {
            res.status(200).send({ available: false })
        }
    }
)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
