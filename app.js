const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const app = express();

// Passport Config //
require("./config/passport")(passport);

// DB Config //
const db = require("./config/keys").MongoURI;

// Connect Mongoose //
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Coonected...");
  })
  .catch((err) => console.log(err));

// EJS //
app.use(expressLayout);
app.set("view engine", "ejs");

// BodyParser //
app.use(express.urlencoded({ extended: false }));

// Sessions //
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Flash //
app.use(flash());

// Set Global Variables //
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes //
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
