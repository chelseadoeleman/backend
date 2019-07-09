'use strict'

const express = require('express')
const helmet = require('helmet')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const multer = require ('multer')
const upload = multer({dest: 'static/upload/'})
const {
    handleIndexRoute,
    handleHomeRoute,
    handleLoginRoute,
    handleSignUpRoute,
    handleMatchesRoute,
    handleUserRoute,
    handleLogin,
    handleSignUp,
    handleLogOut,
    success
} = require('./routes')
const app = express()

app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET
}))

app.use(helmet())
app.use(express.static('static'))
app.use('/images', express.static('db/images'))
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
app.get('/success', success)
app.get('/logOut', handleLogOut)

app.post('/handleLogin', handleLogin)
app.post('/handleSignUp', upload.single('profileImage'), handleSignUp)

app.listen({ port: process.env.PORT || 7000 }), () => {
    console.log(`listening on port ${process.env.PORT || 7000}`)
}   