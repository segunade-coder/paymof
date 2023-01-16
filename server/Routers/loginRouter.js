const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
const logErr = require("../conn&apis/logErrors");

router
  .post("/", (req, res) => {
    let { school, user, pass } = req.body;
    let reg_status = false;
    let active = false;
    if (school || user || pass !== "") {
      let newScl = `${school.toLowerCase().replace(/ /g, "_")}`;
      school = school.toLowerCase();
      user = user.toLowerCase();
      pass = pass.toLowerCase();
      db.query(
        `SELECT school, user, password, status FROM ${newScl}_users  WHERE school = '${school}' AND user = '${user}'`
      )
        .then((response) => {
          if (response.length > 0) {
            response.forEach((element) => {
              let { password, status } = element;
              if (password === pass) req_status = true;
              else req_status = false;
              if (status == 1) active = true;
              else active = false;
            });
            if (req_status) {
              if (active) {
                req.session.user = {
                  school,
                  user,
                  admin: false,
                };
                req.session.databaseName = school.replace(/ /g, "_");
                //   console.log(req.session);
                return res.json({
                  error: false,
                  message: "Successful login",
                });
              } else {
                return res.json({
                  error: true,
                  message: "Your account is inactive",
                });
              }
            }
            return res.json({
              error: true,
              message: "Invalid password",
            });
          } else {
            return res.json({
              error: true,
              message: "Invalid username",
            });
          }
        })
        .catch((err) => {
          logErr(
            err,
            __filename,
            new Error().stack.match(/(:[\d]+)/)[0].replace(":", "")
          );
          return res.json({
            error: true,
            message: "Something went wrong, try again.",
          });
        });
    } else {
      return res.json({
        error: true,
        message: "Fill in all fields",
      });
    }
  })
  .get("/schools", (req, res) => {
    db.getAll("school_cred")
      .then((data) => {
        let schoolArr = [];
        if (data.length !== 0) {
          data.forEach((element) => schoolArr.push({ school: element.school }));
          return res.json({
            status: true,
            error: false,
            school: schoolArr,
          });
        } else {
          return res.json({
            error: false,
            status: false,
            message: "no school yet",
          });
        }
      })
      .catch((err) => {
        logErr(
          err,
          __filename,
          new Error().stack.match(/(:[\d]+)/)[0].replace(":", "")
        );
        return res.json({
          error: false,
          status: false,
          message: "no school yet",
        });
      });
  });
module.exports = router;
