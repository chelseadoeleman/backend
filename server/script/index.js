'use strict'

const express = require('express')
const helmet = require('helmet')
const path = require('path')
const bodyParser = require('body-parser')
const {
    handleIndexRoute,
    handleHomeRoute,
    handleLoginRoute,
    handleSignUpRoute,
    handleMatchesRoute,
    handleUserRoute
} = require('./routes')
const app = express()

app.use(helmet())
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)

app.get('/', handleIndexRoute)
app.get('/home', handleHomeRoute)
app.get('/login', handleLoginRoute)
app.get('/signUp', handleSignUpRoute)
app.get('/matches', handleMatchesRoute)
app.get('/user', handleUserRoute)


app.listen({ port: process.env.PORT || 7000 }), () => {
    console.log(`listening on port ${process.env.PORT || 7000}`)
}   