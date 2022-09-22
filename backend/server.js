const express = require('express')
const app = require('./app')
const connectDatabase = require ('./database/Database')
const dotenv = require ('dotenv')

process.on('uncaughtException',(err)=>{
    console.log(`error: ${err.message}`);
    console.log(`Server shutting down: Uncaught Exception`)
})

dotenv.config({
    path:"backend/config/.env"
})

connectDatabase()

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working http://localhost:${process.env.PORT}`)
})
process.on('unhandledRejection',(err)=>{
    console.log(`Shutting down the server ${err.message}`);

    console.log(`Shutting down unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})