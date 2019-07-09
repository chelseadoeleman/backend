require('dotenv').config()
const mongo = require('mongodb')
const argon2 = require('argon2')
const fs = require('fs')
let db = null
const url = `mongodb://${process.env.DB_HOST}/${process.env.DB_PORT}`

mongo.MongoClient.connect(url, {useNewUrlParser: true }, function (error, client) {
	if (error) throw error
	db = client.db(process.env.DB_NAME)
})

const handleIndexRoute = (request, response) => {
    response.render('../views/index.ejs')
}

const handleHomeRoute = (request, response) => {
    response.render('../views/home.ejs')
}


const handleLogin = (request, response, next) => {
	const email = request.body.email.toLowerCase()
    const password = request.body.password

    if (!email || !password) {
		response.status(400).send('Email or password are missing')
		return
    }
	
	db.collection('matches').findOne({email: email}, done)
	
	function done (error, data) {
		const user = data
		
		if (error) {
			next(error)
		} else if (user) { 
			argon2.verify(user.password, password).then(onVerify, next)
		} else {
			response.status(401).send('Email does not exist')
		}
		
		function onVerify (match) {
			if (match) {
				let username = user.name.charAt(0).toUpperCase() + user.name.slice(1)
				request.session.user = {username: username, _id: user._id}
				response.redirect('/matches')
			} else {
				response.status(401).send('Password incorrect')
			}
		}
	}
}

const handleSignUp = (request, response, next) => {
	const email = request.body.email
	const password = request.body.password
	
	if (!email || !password) {
		response.status(400).send('Email or password are missing')
		return
	}
	
	db.collection('matches').findOne({email: email}, findDuplicateEmail)
	
	function findDuplicateEmail(error, data) {
		if (error) {
			next(error)
		} else if (data) {
			response.status(400).send('Existing email')
		} else {
			
			const onhash = (hash) => {
				const fileName = null
				
				if (request.file && request.file.filename) {
					fs.rename(path.join(__dirname, '../static/upload/' + request.file.filename), path.join(__dirname, '../static/upload/' + request.file.filename + '.png'), function(error) {
						if (error) {
							next(error)
						} else {
							fileName = request.file.filename + '.png'
						}
					})
				}

				const done = async (error, data) => {
					if (error) {
						next(error)
					} else {
						let username = request.body.name.charAt(0).toUpperCase() + request.body.name.slice(1)
						request.session.user = {username: username, _id: data.insertedId}
						response.redirect('/success')
					}
				}
				
				db.collection('matches').insertOne({
                    name: request.body.name,
                    age: request.body.age,
					gender: request.body.gender,
                    image_url: fileName,
                    favorite_movie: request.body.favorite_movie,
                    movies: request.body.movies,
                    genres: request.body.genres,
					email: request.body.email,
					password: hash, 
				}, done)
			}
			argon2.hash(password).then(onhash, next)
		}
	}
}

const success = (request, response, next) => {
	if (request.session.user) {
		const done = (error, data) => {
			if (error) {
				next(error)
			} else {
				console.log(request.session.user.username)
				response.render('../views/matches.ejs', {data: data})
			}
		}
		db.collection('matches').find().toArray(done)
	} else {
		request.session.error = {title: 'Creditentials required'}
		const customError = new Error('Creditentials required')
		next(customError)
		response.status(401).send('Credentials required')
	}
}


const handleLoginRoute = (request, response) => {
    response.render('../views/login.ejs')
}

const handleSignUpRoute = (request, response) => {
    response.render('../views/signUp.ejs')
}

const handleMatchesRoute = (request, response, next) => {
	if (request.session.user) {
		const done = (error, data) => {	
			if (error) {
				next(error)
			} else {
				console.log(request.session.user.username)
				response.render('../views/matches.ejs', {data: data, name: request.session.user.username})
			}
		}
		db.collection('matches').find().toArray(done)
	} else {
		// User is not logged in, so can't show matches
		request.session.error = {title: 'Creditentials required'}
		customError = new Error('Creditentials required')
		next(customError)
		response.status(401).send('Credentials required')
	}
}

const handleUserRoute = (request, response, next) => {
	if (request.session.user) {
		response.render('../views/user.ejs')
	} else {
		// User is not logged in, so can't show matches
		request.session.error = {title: 'Creditentials required'}
		const customError = new Error('Creditentials required')
		next(customError)
		response.status(401).send('Credentials required')
	}
}

const handleLogOut = (request, response, next) => {
	request.session.destroy(function (error) {
		if (error) {
		  next(error)
		} else {
		  response.redirect('/login')
		}
	})
}

module.exports = {
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
}