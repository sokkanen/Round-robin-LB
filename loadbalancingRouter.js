import express from 'express'
import bodyParser from 'body-parser'
import { currentlyAvailable } from './serverCheck.js'
import axios from 'axios'

const router = express.Router()

router.use(bodyParser.json())

let serverIndex = 0

const roundRobin = () => {
    serverIndex++
    if (serverIndex > currentlyAvailable.length -1) {
        serverIndex = 0
    }
}

const constructUrl = (url) => {
    return`http://${currentlyAvailable[serverIndex]}${url}`
}

const proxyRequest = async (method, url, body) => {
    let response
    roundRobin()
    switch (method) {
        case 'GET' || 'get':
            response = await axios.get(constructUrl(url))
            break;
        case 'POST' || 'post':
            response = await axios.post(constructUrl(url), body )
            break;
        case 'PUT' || 'put':
            response = await axios.put(constructUrl(url), body)
            break;
        case 'DELETE' || 'delete':
            response = await axios.delete(constructUrl(url))
            break;
        default:
            return { status: 400, data: { 'error': 'bad request' }}
    }
    return response
}


router.all('*', async (req, res) => {
    try {
        const response = await proxyRequest(req.method, req.url, req.body)
        res.status(response.status).json(response.data)
    } catch (error) {
        res.status(error.status || 500).send(error)
    }
})

export default router