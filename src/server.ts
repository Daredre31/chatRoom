import express from 'express'
import { env } from './config/env'
import { connectDB } from './config/db'
import route from './Route/allRoute'

const app = express()

app.use(express.json())
app.use('/api', route)

const port = env.PORT

const serverStart = async() => {
     try {

      await connectDB()

      app.listen(port , ()=> {
        console.log(`server is running on port ${port}`)
      })
     } catch (error) {
      console.log(error),
      process.exit(1)
     }
}

serverStart()
  