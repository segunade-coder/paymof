const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
require('../conn&apis/prototypes')
const paymentRoute = require('./paymentRouter')
const dashboardRoute = require('./dashboardRouter')
const settingsRoute = require('./settingsRouter')
const usersRoute = require("./usersRouter");
const feesRoute = require("./feesRouter");
const recordsRoute = require("./recordsRouter");
const logErr = require("../conn&apis/logErrors");
let admin = "";
const scheduler = require("./scheduler");
function checkAdmin(req, res, next) {
  if (req?.session?.user?.admin) next();
  else res.redirect(301, "/authorization");
}
function checkAuth(req, res, next) {
  if (req?.session?.user) next();
  else {
    console.log("not logged in");
    res.redirect("/");
  }
}

router
  .get("/", checkAuth, (req, res) => {
    if (req?.session?.user?.school) {
      db.query(
        `SELECT * FROM school_cred WHERE school = '${req?.session?.user?.school}' AND admin = '${req?.session?.user?.user}'`
      )
        .then((data) => {
          data.length > 0 ? (admin = true) : (admin = false);
        })
        .catch((err) => {
          logErr(
            err,
            __filename,
            new Error().stack.match(/(:[\d]+)/)[0].replace(":", "")
          );
          res.json({
            status: "something",
            message: "Try again or refresh server",
          });
        });

      req.session.user.admin = admin;
      res.json({
        status: true,
        creds: req?.session?.user,
      });
      scheduler(db, req);
    } else {
      console.log("session", req?.session?.user?.school);
      res.json({
        status: false,
        message: "Not logged in",
      });
    }
  })
  .use("/payment", checkAuth, paymentRoute)
  .use("/dashboard", checkAuth, dashboardRoute)
  .use("/users", [checkAuth, checkAdmin], usersRoute)
  .use("/settings", [checkAuth, checkAdmin], settingsRoute)
  .use("/fees", checkAuth, feesRoute)
  .use("/records", checkAuth, recordsRoute);


module.exports =  router;