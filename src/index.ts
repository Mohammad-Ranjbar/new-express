import express, {Request,Response,Express} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
// @ts-ignore
import UserRoute from './routes/UserRoute'
import PostRoute from './routes/PostRoute'

dotenv.config()

const app: Express = express()
const port:string|5000 = process.env.APP_PORT || 5000

app.use(cors())
app.use(express.json())
app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!')
})
app.use(UserRoute)
app.use(PostRoute)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

export default app