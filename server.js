const http = require('http')
require('dotenv').config();
const app = require('./app')
const db = require('./db');
const server = http.createServer(app)

server.listen(process.env.PORT,()=>{
    console.log("Server is Listening on PORT No",process.env.PORT)
})