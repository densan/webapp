/**
 * Webapp
 */

var express = require("express"),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    csrf = require("csurf"),
    MongoStore = require("connect-mongo")(session),
    hogan = require("hogan-express"),
    passport = require("passport"),
    path = require("path"),
    routes = require("./routes"),
    config = require("config");

var app = express();

// express settings
app.disable("x-powered-by");
app.set("port", process.env.PORT || config.server.port || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", hogan);
/* comment out (後々使います)
app.locals.partials = {
  header: "partials/header",
  footer: "partials/footer",
  modal: "partials/modal"
};
//*/

// middleware
app.use(express.static(path.resolve(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
  name: config.session.name,
  cookie: config.session.cookie,
  secret: config.session.secret,
  store: new MongoStore({
    db: config.db.name,
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.pass
  })
}));
/* comment out (後々使います)
app.use(csrf());
app.use(function (req, res, next) {
  res.locals._csrf = req.csrfToken();
  next();
});
//*/

// passport settings
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

// load routes
app.use(routes);

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    console.error(err);

    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: err
    });
  });
} else {
  process.on("uncaughtException", function (err) {
    console.error(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error(err);

  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: null
  });
});

// start server (late start)
var server = app.listen(app.get("port"), function() {
  console.log("Express server listening on " + JSON.stringify(server.address()));
});

module.exports = app;
