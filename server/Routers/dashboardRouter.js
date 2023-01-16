const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
require('../conn&apis/prototypes')
const logErr = require("../conn&apis/logErrors");

router.get("/", (req, res) => {
  if (req.session.user) {
    db.query(
      `SELECT COUNT(*) AS count FROM ${req?.session?.databaseName}_students`
    )
      .then((data) => {
        return res.json({
          status: true,
          message: data[0].count,
        });
      })
      .catch((err) => {
        logErr(
          err,
          __filename,
          new Error().stack.match(/(:[\d]+)/)[0].replace(":", "")
        );
        res.json({
          status: false,
          message: "something went wrong. Try refreshing or restarting",
        });
      });
  }
});
module.exports =  router;