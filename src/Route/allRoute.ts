import express from 'express'
import createNewService from '../Controller/createNewService'
import workerRegistration from '../Controller/workerRegistration'
import room from '../Controller/room'
import workerLogin from '../Controller/workerLogin'
import protect from '../middleware/auth'

const route = express.Router()

route.post('/join/room',room.joinRoom )
route.post('/create/service', createNewService.createService)
route.get('/service/allservice', createNewService.getservice)
route.post('/worker/signup', workerRegistration.registerWorker)
route.post('/worker/login' , workerLogin.loginWorker)
route.get('/room/mine' ,protect, room.getworkerRoom)
route.post('/refresh', workerLogin.refreshAccessToken)

export default route