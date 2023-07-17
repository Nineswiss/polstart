const jwtSecret = "1545554FEA15545SFECVCXC256251" // CHANGE THIS!
const db = "mongodb://localhost:27017"
const databaseName = 'polstart'
const appURL = "http://localhost:8080"
const emailResetURL = "http://localhost:8080/reset/"
const verfiyURL = "http://localhost:8080/verfiy/"
const magicLinkSignin = "http://localhost:8080/magic-signin/"
const appName = 'Polstart'

module.exports = {
    jwtSecret,
    db,
    appURL,
    databaseName,
    appName,
    emailResetURL,
    verfiyURL,
    magicLinkSignin
}