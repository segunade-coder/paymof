const cron = require("node-cron");

let crodrun = 0;
let keyidArr = [];
let scheduler = (db, req) => {
  let Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // console.log(crodrun);
  cron.schedule("10 8 * * *", () => {
    if (crodrun === 0) {
      console.log("checking for expired balance date");
      ++crodrun;
      db.query(
        `SELECT payment_id FROM ${req?.session?.databaseName}_notifications`
      )
        .then((noti) => {
          noti.forEach((element) => {
            keyidArr.push(element.payment_id);
          });
        })
        .catch((err) => console.log(err));
      db.query(
        `SELECT name, balance_date, keyid FROM ${req?.session?.databaseName}_payment_record WHERE balance_date < CURRENT_TIMESTAMP AND balance > 0 IN (SELECT MAX(id) FROM ${req?.session?.databaseName}_payment_record GROUP BY keyid)`
      )
        .then((users) => {
          users.forEach((user) => {
            if (keyidArr.includes(user.keyid)) {
              console.log(`user ${user.name} exist`);
            } else {
              let title = `Balance date expired.`;
              let text = `The balance date of ${user.name} expired on ${
                (new Date(user.balance_date) &&
                  new Date(user.balance_date).getDate()) > 3 &&
                new Date(user.balance_date).getDate() + "th"
              } of ${
                (new Date(user.balance_date) &&
                  Months[new Date(user.balance_date).getMonth()]) ||
                ""
              }, ${
                (new Date(user.balance_date) &&
                  new Date(user.balance_date).getFullYear()) ||
                ""
              }`;
              payment_id = user.keyid;
              if (title == "" || text == "" || payment_id == "") {
                return;
              } else {
                db.insert(`${req?.session?.databaseName}_notifications`, {
                  title: title,
                  text: text,
                  payment_id: payment_id,
                })
                  .then((data) => {
                    console.log("success");
                  })
                  .catch((err) => console.log(err));
              }
            }
          });
        })
        .catch((err) => console.log(err));
    }
  });

  //  noti.forEach((noti) => {

  //   data.forEach((user) => {
  //     if(noti.keyid == user.keyid){
  //       console.log('notification already exist');
  //     }else{
  //
  //       }

  //     }
  //   });

  // })
};
module.exports = scheduler;
