const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: 'todolist'
});
  
module.exports = {
    connection
}