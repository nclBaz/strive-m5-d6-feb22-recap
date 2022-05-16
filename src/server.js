import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import productsRouter from "./api/products/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, genericErrorHandler } from "./errorHandlers.js"

const server = express()

const port = 3001

// ************************************** MIDDLEWARES *************************************
server.use(cors())
server.use(express.json())

// ************************************** ENDPOINTS ***************************************
server.use("/products", productsRouter)

// *********************************** ERROR HANDLERS *************************************
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(genericErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is listening on port ${port}`)
})
