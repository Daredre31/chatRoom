import express from 'express'
import createNewService from '../Controller/createNewService'
import workerRegistration from '../Controller/workerRegistration'
import room from '../Controller/room'

const route = express.Router()

route.post('/join/room',room.joinRoom )
route.post('/create/service', createNewService.createService)
route.get('/service/allservice', createNewService.getservice)
route.post('/create/worker', workerRegistration.registerWorker)

export default route