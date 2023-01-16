const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
const logErr = require("../conn&apis/logErrors");

require("../conn&apis/prototypes");

router
  .get("/", (req, res) => {
    db.getAll(`${req?.session?.databaseName}_users`)
      .then((data) => {
        return res.json({
          status: true,
          data,
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
  })
  .post("/add", (req, res) => {
    let { username, pass, loggedSchool } = req.body;
    username = username.toLowerCase();
    loggedSchool = loggedSchool.toLowerCase();
    pass = pass.toLowerCase();
    db.getByColumnName(
      "user",
      `${username}`,
      `${req?.session?.databaseName}_users`
    )
      .then((data) => {
        console.log(data);
        if (data.length !== 0) {
          return res.json({
            status: false,
            message: "Username already exist. Try a different name",
          });
        }
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
    if (username && pass) {
      db.insert(`${req?.session?.databaseName}_users`, {
        school: loggedSchool.toLowerCase(),
        user: username.toLowerCase(),
        password: pass.toLowerCase(),
        status: 1,
      })
        .then((data) =>
          res.json({ status: true, message: "opertion succesful" })
        )
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
  })
  .post("/edit", (req, res) => {
    let { id, status } = req.body;

    db.query(
      `UPDATE ${req?.session?.databaseName}_users SET status = '${status}' WHERE id = ${id}`
    )
      .then((data) => res.json({ status: true, message: "opertion succesful" }))
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
  })
  .post("/delete-user", (req, res) => {
    let { id } = req.body;
    if (id) {
      db.delete(`${req?.session?.databaseName}_users`, parseInt(id))
        .then((data) =>
          res.json({ status: true, message: "opertion succesful" })
        )
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

module.exports = router;
