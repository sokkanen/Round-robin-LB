import express from 'express'
import bodyParser from 'body-parser'
import { currentlyAvailable, resolveCurrentlyAvailableServers } from './serverCheck.js'
import axios from 'axios'

import { logger } from './index.js'

const router = express.Router()

router.use(bodyParser.json())

let serverIndex = 0

const nextServer = () => {
    serverIndex++
    if (serverIndex > currentlyAvailable.length -1) {
        serverIndex = 0
    }
}

const roundRobin = async () => {
    let additionalResolve = false
    nextServer()
    if (currentlyAvailable[serverIndex] === undefined && !additionalResolve) {
        await resolveCurrentlyAvailableServers()
        additionalResolve = true;
        nextServer()
    }
}

const constructUrl = (url) => {
    return`http://${currentlyAvailable[serverIndex]}${url}`
}

const proxyRequest = async (method, url, body) => {
    roundRobin()
    const constructedUrl = constructUrl(url)
    logger.info(`Proxying ${method} ${url} with body ${JSON.stringify(body)}`)
    const response = await axios.request({ 
        method: method, 
        url: constructedUrl,
        data: JSON.stringify(body),
        headers: { "content-type": "application/json" }
    })
    logger.info(`Successfully requested '${method}' '${url}' with body '${JSON.stringify(body)}' to '${currentlyAvailable[serverIndex]}'`)
    return response   
}


router.all('*', async (req, res) => {
    try {
        const response = await proxyRequest(req.method, req.url, req.body)
        res.status(response.status).json(response.data)
    } catch (error) {
        if (error.response) {
            logger.warn(`Proxying request success, but server responded with status: ${error.response.status}`)
            res.status(error.response.status || 500).send(error.message || error)
        } else {
            logger.error('Proxying request failed')
            res.status(500).send('No backend servers available')
        }
    }
})

export default router