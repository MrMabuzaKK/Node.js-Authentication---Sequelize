require("dotenv").config();

const express = require("express");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const {checkAuthenticated, checkNotAuthenticated,} = require("./middlewares/auth");
const {connectToMysql} = require('./connections/MysqlConnection');
const {getSequelize} = require('./connections/MysqlConnection');
const {createUser, getUserByEmail} = require('./repositories/UserRepository');

const app = express();

const initializePassport = require("./passport-config");
initializePassport(passport);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index", { name: req.user.name });
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post("/register", checkNotAuthenticated, async (req, res) => {
  const userFound = await getUserByEmail(req.body.email)
  if (userFound) {
    req.flash("error", "User with that email already exists");
    res.redirect("/register");
  } else {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      await createUser({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      })
      res.redirect("/login");
    } catch (error) {
      console.error('Error occurred while registering a user', error);
      res.redirect("/register");
    }
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  res.render("index", { name: req.user.name });
})

app.use((req, res, next) => {
  res.status(404).send("Page requested does not exist!");
})

async function start() {
  try {
    await connectToMysql();
    console.log('Connection has been established successfully.');

    // sync db not suitable for production (use migrations for prod)
    await getSequelize().sync();

    await app.listen(process.env.PORT);
    console.log("Server is running on Port 3000");
  } catch (error) {
    console.error('error occurred while starting server');
    process.exit(1);
  }
}

start();


