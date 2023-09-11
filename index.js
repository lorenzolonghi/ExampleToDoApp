const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require("path");

//routes
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");

const authLibrary = require("./libraries/authLibrary");

const app = express();

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//page routes
app.get("/", authLibrary.authPage, (req, res) => { res.sendFile(path.join(__dirname, "./views/index.html")); })
app.get("/login", (req, res) => { res.sendFile(path.join(__dirname, "./views/login.html")); })
app.get("/signup", (req, res) => { res.sendFile(path.join(__dirname, "./views/signup.html")); })

app.use("/auth", authRoutes);
app.use("/api", authLibrary.requireAuth, apiRoutes);


app.listen(3000, () => {
    console.log("App running on port 3000");
});
