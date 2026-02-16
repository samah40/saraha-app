import express from 'express'
import checkConnectionDB from './DB/connectionDB.js'
import userRouter from './modules/user/user.controller.js'
const app = express()
const port = 3000

const bootstrap = () => {
    app.use(express.json())
    checkConnectionDB()
    app.get('/', (req, res) => res.status(200).json({ msg: "hello in my app..😍😍" }))
    app.use("/users", userRouter)
    app.use((req, res, next) => {
        throw new Error(`url ${req.originalUrl} not found`, { cause: 404 });

    })


    app.use((err, req, res, next) => {

        res.status(err.cause || 500).json({ msg: err.message, stack: err.stack })
    })
    app.listen(port, () => console.log(`server is running on port ${port}!...😉`))

}

export default bootstrap