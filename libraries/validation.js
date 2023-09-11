const validator = require('validator');

const validateEmailAndPassword = (email, password) => {
    if(!validator.isEmail(email)) return "Email non valida";

    if(!password || password.length < 6) return "Password non valida";
}

const validateTodo = (title) => {
    if(!title || title.length > 60) return "Titolo non valido";
}

module.exports = {
    validateEmailAndPassword,
    validateTodo
}