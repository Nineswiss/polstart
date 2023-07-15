const jwt = require("jsonwebtoken");
const {secret} = require('../config')

verifyToken = (req, res, next) => {

    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "Not logged in" });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });

};


const authJwt = {
    verifyToken
};
module.exports = authJwt;