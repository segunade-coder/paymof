const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
const createTables = require("../conn&apis/sqlHelper");
const logErr = require("../conn&apis/logErrors");
router.get("/school", (req, res) => {
  let { school_name } = req.query;
  school_name ? (school_name = school_name.replace(/-/g, " ")) : "";
  if (school_name) {
    db.query("SHOW TABLES LIKE 'school_cred'")
      .then((response) => {
        if (response.length != 0) {
          db.getByColumnName("school", `${school_name}`, "school_cred")
            .then((data) => {
              if (data.length !== 0) {
                res.json({
                  error: true,
                  message: "School Already Exist",
                });
              } else {
                createTables(school_name);
                res.status(200);
                res.json({
                  error: false,
                  message: "",
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
        } else {
          db.createTable(
            "school_cred",
            { columnName: "school", dataType: "varchar" },
            { columnName: "admin", dataType: "varchar" },
            { columnName: "password", dataType: "varchar" }
          )
            .then((response) => {
              createTables(school_name);
              res.status(200);
              res.json({
                error: false,
                message: "",
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
  } else {
    res.status(403);
    res.json({
      error: true,
      status: false,
      message: "There was an error while getting name",
    });
  }
});
router.post("/admin-reg", (req, res) => {
  let { adminName, adminCode, schoolName } = req.body;
  if (adminName || adminCode) {
    db.insert("school_cred", {
      school: schoolName.toLowerCase(),
      admin: adminName.toLowerCase(),
      password: adminCode.toLowerCase(),
    })
      .then((response) => {
        let newScl = `${schoolName.toLowerCase().replace(/ /g, "_")}`;
        db.insert(`${newScl}_users`, {
          school: schoolName.toLowerCase(),
          user: adminName.toLowerCase(),
          password: adminCode.toLowerCase(),
          status: 1,
        });
        res.json({ error: false, message: "Registration Successful" });
      })
      .catch((err) => {
        logErr(
          err,
          __filename,
          new Error().stack.match(/(:[\d]+)/)[0].replace(":", "")
        );
        res.status(503);
        res.json({
          error: true,
          message: "Registration failed. Try again later...",
        });
      });
  }
});
module.exports = router;
