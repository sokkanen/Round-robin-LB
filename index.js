import dotenv from 'dotenv'
import cron from 'node-cron'
import express from 'express'
import { currentlyAvailable, resolveCurrentlyAvailableServers } from './serverCheck.js'
import loadbalancingRouter from './loadbalancingRouter.js'

dotenv.config()

const app = express()
const { PORT, SCHEDULE } = process.env

app.use('/', loadbalancingRouter)

const resolveServers = async () => {
    await resolveCurrentlyAvailableServers()
    console.log(`${currentlyAvailable.length} Backend server(s) available.`)
}

cron.schedule(SCHEDULE,() => {
    resolveServers()
})

app.listen(PORT, async () => {
    resolveServers()
    console.log(`LB listening to ${PORT}`)
})


