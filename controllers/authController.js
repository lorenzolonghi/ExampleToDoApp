const validation = require("../libraries/validation");
const db = require("../data/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/* 
    SECURITY:
    -all the passwords are hashed using the Bcrypt function + salt, which is also Timing Safe preventing Timing Attacks
    -the SQL queries are parametrized which prevents SQL Injection
    -currently no risk of XSS attack since no data is shared between users
    -CORS policies are as default for Express, which only allows requests from the same domain and no Cross Origin
*/



const maxAge = 3 * 24 * 60 * 60; //three days
const createToken = (id) => {
  return jwt.sign({ id }, 'secretkey', {
    expiresIn: maxAge
  });
};

const auth_login = (req, res) => {
    const { email, password } = req.body;

    //this function returns a valid value containing the error message, otherwise return undefined
    const error = validation.validateEmailAndPassword(email, password);
    if(error) return res.status(400).json(error);

    db.connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if(err) return res.status(500).json("Errore interno");
        if(result.length === 0) return res.status(400).json("Email non trovata");

        const user = result[0];
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) return res.status(401).json("Password errata");

        //if everything is ok create token
        const token = createToken(user.pkuser);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).end(); 
    })
}

const auth_signup = (req, res) => {
    const { email, password } = req.body;

    const error = validation.validateEmailAndPassword(email, password);
    if(error) return res.status(400).json(error);

    db.connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if(err) return res.status(500).json("Errore interno");
        if(result.length > 0) return res.status(400).json("Email già in uso");

        //if everything is ok create the account
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        db.connection.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], (err, result) => {
            if(err) return res.status(500).json("Errore interno");

            //if ok, create token
            const pkuser = result.insertId;
            const token = createToken(pkuser);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            return res.status(200).end();
        })
    })
}

const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}


module.exports = {
    auth_login,
    auth_signup,
    logout
}