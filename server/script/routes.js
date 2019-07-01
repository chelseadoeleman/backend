const handleIndexRoute = (request, response) => {
    response.render('../views/index.ejs')
}

const handleHomeRoute = (request, response) => {
    response.render('../views/home.ejs')
}

const handleLoginRoute = (request, response) => {
    response.render('../views/login.ejs')
}

const handleSignUpRoute = (request, response) => {
    response.render('../views/signUp.ejs')
}

const handleMatchesRoute = (request, response) => {
    response.render('../views/matches.ejs')
}

const handleUserRoute = (request, response) => {
    response.render('../views/user.ejs')
}

module.exports = {
    handleIndexRoute,
    handleHomeRoute,
    handleLoginRoute,
    handleSignUpRoute,
    handleMatchesRoute,
    handleUserRoute
}