import dotenv from 'dotenv'
import cron from 'node-cron'
import express from 'express'
import winston from 'winston'

import { currentlyAvailable, resolveCurrentlyAvailableServers } from './serverCheck.js'
import loadbalancingRouter from './loadbalancingRouter.js'

dotenv.config()

const consoleTransport = new winston.transports.Console()
const winstonOptions = {
    transports: [consoleTransport]
}
export const logger = new winston.createLogger(winstonOptions)

const app = express()
const { LB_PORT, LB_SCHEDULE } = process.env

app.use('/', loadbalancingRouter)

const resolveServers = async () => {
    await resolveCurrentlyAvailableServers()
    logger.debug(`${currentlyAvailable.length} Backend server(s) available.`)
}

cron.schedule(LB_SCHEDULE,() => {
    resolveServers()
})

app.listen(LB_PORT, async () => {
    resolveServers()
    logger.info(`LB listening to ${LB_PORT}`)
})


