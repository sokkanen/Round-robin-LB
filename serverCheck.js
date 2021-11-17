import fs from 'fs'
import axios from 'axios'

import { logger } from './index.js'

const servers = JSON.parse(fs.readFileSync('./servers.json')).servers

export let currentlyAvailable = []

const getHostAndPort = (url) => {
    return url.substring(7, 21)
}

const removeFromAvailable = (error) => {
    logger.warn(`Service not available: ${ error.config.url }`,)
    const errorUrl = getHostAndPort(error.config.url)
    currentlyAvailable = currentlyAvailable.filter(server => server.host !== errorUrl)
}

const addToAvailable = (response) => {
    logger.info(`Service responded ${response.status}: ${response.config.url}`)
    const successUrl = getHostAndPort(response.config.url)
    if (currentlyAvailable.findIndex(server => server === successUrl) === -1) {
        currentlyAvailable = currentlyAvailable.concat([successUrl])
    }
} 

const createPromises = () => {
    const promises = servers.map(server => axios.get(`http://${server.host}${server.health}`))
    return promises.map(promise => promise
        .then(response => addToAvailable(response))
        .catch(error => removeFromAvailable(error)))
}

export const resolveCurrentlyAvailableServers = async () => {
    let currentlyAvailable = []
    const resolved = createPromises(currentlyAvailable)
    await axios.all(resolved)
}