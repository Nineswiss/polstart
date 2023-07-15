const secret = "1545554FEA15545SFECVCXC256251"
const db = "mongodb://localhost:27017"
const databaseName = 'polstart'
const appURL = "http://localhost:8080"
const emailResetURL = "http://localhost:8080/reset/"
const verfiyURL = "http://localhost:8080/verfiy/"
const appName = 'Polstart'

module.exports = {
    secret,
    db,
    appURL,
    databaseName,
    appName,
    emailResetURL,
    verfiyURL
}