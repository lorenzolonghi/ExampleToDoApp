const jwt = require("jsonwebtoken");
const db = require("../data/database");

//check if the request is authenticated and adds user id to the res.locals
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "secretkey", (err, decodedToken) => {
            if (err) {
                return res.status(401).end();
            }
            
            //if token is valid saves user id
            res.locals.pkuser = decodedToken.id;
            next();
        });
    } else {
        return res.status(401).end();
    }
}

const authPage = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "secretkey", (err, decodedToken) => {
            if (err) {
                return res.redirect("/login");
            }
            
            //if token is valid saves user id
            res.locals.pkuser = decodedToken.id;
            next();
        });
    } else {
        return res.redirect("/login");
    }
}

module.exports = {
    requireAuth,
    authPage
}
