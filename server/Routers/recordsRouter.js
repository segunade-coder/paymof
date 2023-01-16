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
      if (req?.session?.user) {
        db.query(
          `SELECT * FROM ${
            req?.session?.databaseName
          }_payment_record WHERE (name LIKE "%${name.toLowerCase()}%" OR payment_id LIKE "%${name.toLowerCase()}%") GROUP BY keyid`
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
      // console.log(filterArray)
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
        }_payment_record WHERE (name LIKE "%${name.toLowerCase()}%" OR payment_id LIKE "%${name.toLowerCase()}%") AND ${sqlstring} GROUP BY keyid`;
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
        `SELECT *, SUM(amount_paid) AS TotalPaid FROM ${req?.session?.databaseName}_payment_record WHERE id = ${searchId} GROUP BY keyid`
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
        }_payment_record WHERE (name LIKE "%${name.toLowerCase()}%" OR payment_id = "${name.toLowerCase()}") GROUP BY keyid`
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
      `SELECT COUNT(*) as total FROM ${req?.session?.databaseName}_payment_record GROUP BY keyid`
    )
      .then((data) => (total = data.length))
      .catch((err) => console.log(err));
    db.query(
      `SELECT * FROM ${req?.session?.databaseName}_payment_record  GROUP BY keyid ORDER BY id LIMIT ${limit} OFFSET ${offset}`
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
  .get("/get-view", (req, res) => {
    let { key } = req.query;
    if (key) {
      db.getByColumnName(
        `keyid`,
        key,
        `${req?.session?.databaseName}_payment_record`
      )
        .then((data) => {
          res.json({
            status: true,
            message: data,
          });
        })
        .catch((err) => {
          res.json({
            status: false,
            message: "Something went wrong. Try refreshing the page.",
          });
          console.log(err);
        });
    }
  })
  .get("/delete", (req, res) => {
    let { key } = req.query;
    if (key) {
      db.query(
        `DELETE FROM ${req?.session?.databaseName}_payment_record WHERE keyid = '${key}'`
      )
        .then((data) => {
          return res.json({
            status: true,
            message: "Record deleted succesfully",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.json({
            status: false,
            message: "Something went wrong. Try refreshing",
          });
        });
    }
  })
  .post("/edit", (req, res) => {
    let { key, name, studentClass, total, balance, balanceDate, status } =
      req.body;
    if (key && name && studentClass && total && balance) {
      if (status) {
        db.query(
          `UPDATE ${req?.session?.databaseName}_payment_record SET name = '${name}', class = '${studentClass}', expected_payment = ${total}, balance = ${balance}, balance_date  = '${balanceDate}' WHERE keyid = '${key}'`
        )
          .then((data) => {
            return res.json({
              status: true,
              message: "Record edited succesfully",
            });
          })
          .catch((err) => {
            console.log(err);
            return res.json({
              status: false,
              message: "Something went wrong. Try refreshing",
            });
          });
      } else {
        db.query(
          `UPDATE ${req?.session?.databaseName}_payment_record SET name = '${name}', class = '${studentClass}', expected_payment = ${total}, balance = ${balance}, WHERE keyid = '${key}'`
        )
          .then((data) => {
            return res.json({
              status: true,
              message: "Record edited succesfully",
            });
          })
          .catch((err) => {
            console.log(err);
            return res.json({
              status: false,
              message: "Something went wrong. Try refreshing",
            });
          });
      }
    }
  })
  .post("/debtors", (req, res) => {
    let { filteredDate, filteredClass, filteredSess, filteredTerm, sort } =
      req.body;
    if (
      filteredDate === "" ||
      filteredClass === "" ||
      filteredTerm === "" ||
      filteredSess === "" ||
      sort === ""
    ) {
      return res.json({
        status: false,
        message: "Enter the necessaey fields",
      });
    } else {
      let date = new Date(filteredDate);
      let conn = db.returnConnection();
      let dateArr = [
        date?.getDate() < 10 ? `0${date?.getDate()}` : date?.getDate(),
        date?.getUTCMonth() + 1 < 10
          ? `0${date?.getUTCMonth() + 1}`
          : date?.getUTCMonth() + 1,
        date?.getUTCFullYear(),
      ];

      if (sort == "debtors") {
        db.query(
          `SELECT * FROM ${
            req?.session?.databaseName
          }_payment_record WHERE (DOG >= "${dateArr.join(
            "/"
          )}" AND session = "${filteredSess}" AND term = "${filteredTerm}"  AND class = "${filteredClass}" AND balance > 0) GROUP BY keyid ORDER BY name`
        )
          .then((data) => {
            if (data.length !== 0) {
              let names = data.map((ind) => ind.keyid);
              conn.query(
                `SELECT COUNT(*) AS total, SUM(amount_paid) AS totalPaid FROM ${req?.session?.databaseName}_payment_record WHERE keyid IN (?) GROUP BY keyid`,
                [names],
                (err, totalArr) => {
                  if (err) throw err;
                  console.log(totalArr);
                  return res.json({
                    status: true,
                    message: data,
                    totalArr,
                  });
                }
              );
            } else {
              return res.json({
                status: true,
                message: data,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.json({
              status: false,
              message: "Something went wrong. Try refreshing",
            });
          });
      } else if (sort == "cleared") {
        db.query(
          `SELECT * FROM ${
            req?.session?.databaseName
          }_payment_record WHERE (DOG >= "${dateArr.join(
            "/"
          )}" AND session = "${filteredSess}" AND term = "${filteredTerm}"  AND class = "${filteredClass}" AND balance = 0) GROUP BY keyid ORDER BY name`
        )
          .then((data) => {
            if (data.length !== 0) {
              let names = data.map((ind) => ind.keyid);
              conn.query(
                `SELECT COUNT(*) AS total, SUM(amount_paid) AS totalPaid FROM ${req?.session?.databaseName}_payment_record WHERE keyid IN (?) GROUP BY keyid`,
                [names],
                (err, totalArr) => {
                  if (err) throw err;
                  return res.json({
                    status: true,
                    message: data,
                    totalArr,
                  });
                }
              );
            } else {
              return res.json({
                status: true,
                message: data,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.json({
              status: false,
              message: "Something went wrong. Try refreshing",
            });
          });
      } else if (sort == "all") {
        db.query(
          `SELECT * FROM ${
            req?.session?.databaseName
          }_payment_record WHERE (DOG >= "${dateArr.join(
            "/"
          )}" AND session = "${filteredSess}" AND term = "${filteredTerm}"  AND class = "${filteredClass}") GROUP BY keyid ORDER BY name`
        )
          .then((data) => {
            if (data.length !== 0) {
              let names = data.map((ind) => ind.keyid);
              conn.query(
                `SELECT COUNT(*) AS total, SUM(amount_paid) AS totalPaid FROM ${req?.session?.databaseName}_payment_record WHERE keyid IN (?) GROUP BY keyid`,
                [names],
                (err, totalArr) => {
                  if (err) throw err;
                  return res.json({
                    status: true,
                    message: data,
                    totalArr,
                  });
                }
              );
            } else {
              return res.json({
                status: true,
                message: data,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.json({
              status: false,
              message: "Something went wrong. Try refreshing",
            });
          });
      } else {
        db.query(
          `SELECT * FROM ${
            req?.session?.databaseName
          }_payment_record WHERE (DOG >= "${dateArr.join(
            "/"
          )}" AND session = "${filteredSess}" AND term = "${filteredTerm}"  AND class = "${filteredClass}" AND payment_for = "${sort}") GROUP BY keyid ORDER BY name`
        )
          .then((data) => {
            if (data.length !== 0) {
              let names = data.map((ind) => ind.keyid);
              conn.query(
                `SELECT COUNT(*) AS total, SUM(amount_paid) AS totalPaid FROM ${req?.session?.databaseName}_payment_record WHERE keyid IN (?) GROUP BY keyid`,
                [names],
                (err, totalArr) => {
                  if (err) throw err;
                  return res.json({
                    status: true,
                    message: data,
                    totalArr,
                  });
                }
              );
            } else {
              return res.json({
                status: true,
                message: data,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.json({
              status: false,
              message: "Something went wrong. Try refreshing",
            });
          });
      }
    }
  })
  .post("/weekly", (req, res) => {
    let { classes, date, sess, term } = req.body;
    date = new Date(date).toJSON().slice(0, 10);
    let others = ["busfare"];
    if (classes.length === 0 || term === "" || date === "" || sess === "") {
      return res.json({
        status: false,
        message: "Enter all important fields",
      });
    } else {
      let conn = db.returnConnection();
      console.log(date);
      conn.query(
        `SELECT class, SUM(amount_paid) AS overTOTAL, SUM(pta) AS totalPTA, SUM(lesson) AS totalLesson, SUM(tuition) AS totalTuition, COUNT(*) AS totalPayment FROM ${req?.session?.databaseName}_payment_record WHERE WEEK(created_at) = WEEK(?) AND term = ? AND session = ? AND payment_for <> (?) AND class IN (?) GROUP BY class`,
        [date, term, sess, others, classes],
        (err, data) => {
          if (err) throw err;
          console.log(data);
        }
      );
    }
  })
  .get("/notifications", (req, res) => {
    db.query(
      `SELECT * FROM ${req?.session?.databaseName}_notifications ORDER BY id DESC`
    )
      .then((data) => {
        setTimeout(() => {
          db.query(
            `UPDATE ${req?.session?.databaseName}_notifications SET status = 1 WHERE status = 0`
          )
            .then()
            .catch((err) => {
              console.log(err);
            });
        }, 10000);
        res.json({
          status: true,
          message: data,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          status: false,
          message: "Something went wrong. Try refreshing.",
        });
      });
  })
  .get("/deleteNoti", (req, res) => {
    let { id } = req.query;
    if (id) {
      db.query(
        `DELETE FROM ${req?.session?.databaseName}_notifications WHERE id = ${id}`
      )
        .then((data) => {
          return res.json({
            status: true,
            message: "Notification deleted succesfully",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.json({
            status: false,
            message: "Something went wrong. Try refreshing",
          });
        });
    }
  });

module.exports = router;
