import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import router from './router'
import errorMiddleware from './app/middlewares/errorMiddleware'

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)
app.use(errorMiddleware)

app.listen(3000, () => console.log('runing in 3000'))
