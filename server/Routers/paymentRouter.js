const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
require("../conn&apis/prototypes");
const logErr = require("../conn&apis/logErrors");

admin = false;

router
  .post("/findName", (req, res) => {
    let { name } = req.body;
    if (req?.session?.user) {
      db.query(
        `SELECT * FROM ${
          req?.session?.databaseName
        }_students WHERE name LIKE "%${name.toLowerCase()}%"`
      )
        .then((data) =>
          res.json({
            status: true,
            message: data,
          })
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
    } else {
      res.json({
        status: false,
        message: "Not logged in",
      });
    }
  })
  .get("/classes", (req, res) => {
    if (req?.session?.user) {
      db.query(`SELECT * FROM ${req?.session?.databaseName}_settings`)
        .then((data) =>
          res.json({
            status: true,
            message: data,
          })
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
    } else {
      res.json({
        status: false,
        message: "Not logged in",
      });
    }
  })
  .post("/save", (req, res) => {
    let key = randomKey() + randomKey();
    if (req?.session?.user) {
      let { datas } = req.body;
      let {
        name,
        paymentId,
        studentClass,
        DOP,
        DOB,
        DOG,
        PTA,
        lesson,
        paymentFor,
        paymentMethod,
        term,
        totalFee,
        feePaid,
        balance,
        remark,
        session,
        loggedUser,
      } = datas;
      if (
        name === "" ||
        paymentId === "" ||
        studentClass === "" ||
        DOP === "" ||
        paymentFor === "" ||
        paymentMethod === "" ||
        term === "" ||
        totalFee === "" ||
        feePaid === "" ||
        balance === "" ||
        session === ""
      ) {
        return res.json({
          status: false,
          message: "Please fill in all the textbox",
        });
      } else {
        let tuition = paymentFor.toLowerCase().includes("bus")
          ? 0
          : parseInt(feePaid - (parseInt(PTA) + parseInt(lesson)));
        let fnc = () => {
          if (key) {
            let innerFnc = () => {
              db.insert(`${req?.session?.databaseName}_payment_record`, {
                name: name.toLowerCase(),
                payment_id: paymentId,
                amount_paid: feePaid,
                expected_payment: totalFee.toLowerCase(),
                balance,
                term: term.toLowerCase(),
                session: session.toLowerCase(),
                DOP,
                DOG,
                PTA,
                lesson,
                tuition,
                balance_date: DOB,
                remark: remark.toLowerCase(),
                class: studentClass.toLowerCase(),
                keyid: key,
                payment_for: paymentFor.toLowerCase(),
                payment_method: paymentMethod.toLowerCase(),
                accountant: loggedUser.toLowerCase(),
              })
                .then((data) => {
                  return res.json({
                    status: true,
                    message: "Record added succesfully",
                    key_id: key,
                  });
                })
                .catch((err) => {
                  logErr(
                    err,
                    __filename,
                    new Error().stack.match(/(:[\d]+)/)[0].replace(":", "")
                  );
                  return res.json({
                    status: false,
                    message: "something went wrong, please try again later",
                  });
                });
            };
            db.getByColumnName(
              "keyid",
              key,
              `${req?.session?.databaseName}_payment_record`
            )
              .then((data) => {
                if (data.length == 0) {
                  innerFnc();
                } else {
                  key = randomKey() + randomKey();
                  fnc();
                }
              })
              .catch((err) => {
                console.log(err);
                return res.json({
                  status: false,
                  message: "something went wrong, please try again later",
                });
              });
          }
        };
        fnc();
      }
    } else {
      res.json({
        status: false,
        message: "Not logged in",
      });
    }
  });

module.exports = router;
