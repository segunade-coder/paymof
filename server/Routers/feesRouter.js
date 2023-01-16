const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
require("../conn&apis/prototypes");
const logErr = require("../conn&apis/logErrors");

router
  .post("/find-name", (req, res) => {
    let { name, condition } = req.body;
    if (!condition) {
      if (req?.session?.databaseName) {
        db.query(
          `SELECT * FROM ${
            req?.session?.databaseName
          }_payment_record WHERE (name LIKE "%${name.toLowerCase()}%" OR payment_id LIKE "%${name.toLowerCase()}%") AND balance > 0 GROUP BY keyid`
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
    } else {
      let { filterArray } = req.body;
      let sqlqry = [];
      let sqlstring = "";
      for (filter of filterArray) {
        for (let key in filter) {
          sqlqry.push(`${key} LIKE "%${filter[key].trim().toLowerCase()}%"`);
          sqlqry.push("AND");
        }
      }
      if (sqlqry[sqlqry.length - 1] == "AND") sqlqry.pop();
      sqlstring = sqlqry.join(" ");
      if (sqlstring) {
        let qry = `SELECT id, name, class FROM ${
          req?.session?.databaseName
        }_payment_record WHERE (name LIKE "%${name.toLowerCase()}%" OR payment_id LIKE "%${name.toLowerCase()}%") AND ${sqlstring} AND balance > 0 GROUP BY keyid`;
        db.query(qry)
          .then((data) => {
            res.json({
              status: true,
              message: data,
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
    }
  })
  .post("/findId", (req, res) => {
    let { status, name, searchId } = req.body;
    if (status) {
      db.query(
        `SELECT *, SUM(amount_paid) AS TotalPaid FROM ${req?.session?.databaseName}_payment_record WHERE id = ${searchId} AND balance > 0 GROUP BY keyid`
      )
        .then((data) => {
          if (data) {
            res.json({
              status: true,
              message: data,
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
      db.query(
        `SELECT *, SUM(amount_paid) AS TotalPaid FROM ${
          req?.session?.databaseName
        }_payment_record WHERE (name LIKE "%${name.toLowerCase()}%" OR payment_id = "${name.toLowerCase()}") AND balance > 0 GROUP BY keyid`
      )
        .then((data) => {
          if (data) {
            res.json({
              status: true,
              message: data,
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
    }
  })
  .get("/records", (req, res) => {
    let { limit, page } = req.query;
    const offset = (page - 1) * limit;
    let total = 0;
    db.query(
      `SELECT COUNT(*) as total FROM ${req?.session?.databaseName}_payment_record WHERE balance > 0 GROUP BY keyid`
    )
      .then((data) => (total = data.length))
      .catch((err) => console.log(err));
    db.query(
      `SELECT * FROM ${req?.session?.databaseName}_payment_record WHERE balance > 0 IN (SELECT MAX(id) FROM ${req?.session?.databaseName}_payment_record GROUP BY keyid) GROUP BY keyid ORDER BY id LIMIT ${limit} OFFSET ${offset}`
    )
      .then((data) => {
        return res.json({
          status: true,
          message: data,
          total,
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
  .post("/save", (req, res) => {
    let {
      name,
      payment_id,
      balanceClass,
      amount_paid,
      expected_payment,
      balance,
      payment_for,
      payment_method,
      term,
      session,
      DOG,
      DOP,
      balance_date,
      remark,
      keyid,
      accountant,
    } = req.body;

    if (
      name === "" ||
      payment_id === "" ||
      balanceClass === "" ||
      DOP === "" ||
      payment_for === "" ||
      payment_method === "" ||
      term === "" ||
      expected_payment === "" ||
      amount_paid === "" ||
      balance === "" ||
      session === "" ||
      keyid === ""
    ) {
      return res.json({
        status: false,
        message: "Please fill in all the textbox",
      });
    } else {
      let stat = false;
      if (payment_for.toLowerCase().includes("bus")) stat = true;
      else stat = false;
      db.insert(`${req?.session?.databaseName}_payment_record`, {
        name: name.toLowerCase(),
        payment_id,
        class: balanceClass.toLowerCase(),
        amount_paid,
        expected_payment,
        balance,
        term: term.toLowerCase(),
        session,
        DOP,
        DOG,
        tuition: stat ? 0 : amount_paid,
        balance_date,
        remark: remark.toLowerCase(),
        keyid,
        payment_for: payment_for.toLowerCase(),
        payment_method: payment_method.toLowerCase(),
        accountant: accountant.toLowerCase(),
      })
        .then((data) => {
          if (balance == 0) {
            db.query(
              `UPDATE ${req?.session?.databaseName}_payment_record SET balance = 0 WHERE keyid = '${keyid}'`
            )
              .then((data) => {
                return res.json({
                  status: true,
                  message: "Fee balanced succesfully",
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
          } else {
            db.query(
              `UPDATE ${req?.session?.databaseName}_payment_record SET balance = ${balance}, balance_date = '${balance_date}' WHERE keyid = '${keyid}'`
            )
              .then((data) => {
                return res.json({
                  status: true,
                  message: "Fee balanced succesfully",
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
          }
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
    }
  });

module.exports = router;
