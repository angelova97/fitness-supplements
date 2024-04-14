const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
let router = express.Router();
const session = require("express-session");
const app = express();

app.use(
  session({
    secret: "random string",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }, // expires after 1 minute
  }),
);

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const todoRouter = require("./routes/todo");
const favoritesRouter = require("./routes/favorites");
const searchRouter = require("./routes/search");
const productlistRouter = require("./routes/productlist");
const reviewsRouter = require("./routes/reviews");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/todo", todoRouter);
app.use("/favorites", favoritesRouter);
app.use("/search", searchRouter);
app.use("/product", productlistRouter);
app.use("/submit-review", reviewsRouter);
app.use("/reviews", reviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
