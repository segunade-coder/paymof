const { JSON } = require("mysql/lib/protocol/constants/types");
const conn = require("./conn");
const dbQueries = require("./mysqlApi");
const settings = require('./inputSettings')
// initialize dbqueries class

const db = new dbQueries(conn);

// create all necessary table
const createTables = (school) => {
  school = school.replace(/ /g, "_");
  // create student table
  db.query(
    `CREATE TABLE ${school}_users (id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, school VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, last_login VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL)`
  )
    .then((data) => console.log(`table ${school}_users created...`))
    .catch((err) => console.log(err));

  db.createTable(
    `${school}_students`,
    { columnName: "name", dataType: "varchar" },
    { columnName: "class", dataType: "varchar" },
    { columnName: "guardian_name", dataType: "varchar" },
    { columnName: "guardian_id", dataType: "varchar" },
    { columnName: "phone_number", dataType: "varchar" },
    { columnName: "address", dataType: "varchar" },
    { columnName: "status", dataType: "varchar" }
  )
  .then((data) => console.log(`table ${school}_students created...`))
  .catch((err) => console.log(err));

  db.createTable(
    `${school}_settings`,
    { columnName: "classes", dataType: "varchar" },
    { columnName: "current_session", dataType: "varchar" },
    { columnName: "current_term", dataType: "varchar" },
    { columnName: "fees", dataType: "varchar" },
  )
  .then((data) => console.log(`table ${school}_settings created...`))
  .catch((err) => console.log(err));
  
  db.query(
    `ALTER TABLE ${school}_settings MODIFY classes VARCHAR(1500)`
  )
  .then((data) => console.log(`alter table ${school}_settings {school}...`))
  .catch((err) => console.log(err));
  
  db.insert(`${school}_settings`,
        {
        classes:settings.classes, 
        current_session:'2021/2022',
        current_term:'3rd',
        fees:settings.fees,
        }).then( data => console.log('inserted data into settings succesfully')).catch(err => console.log(err))
  db.createTable(
    `${school}_notifications`,
    { columnName: "body", dataType: "varchar" },
    { columnName: "user", dataType: "varchar" }
  )
  .then((data) => console.log(`table ${school}_notifications created...`))
  .catch((err) => console.log(err));

  db.createTable(
    `${school}_payment_record`,
    { columnName: "name", dataType: "varchar" },
    { columnName: "payment_id", dataType: "varchar" },
    { columnName: "amount_paid", dataType: "varchar" },
    { columnName: "expected_payment", dataType: "varchar" },
    { columnName: "balance", dataType: "varchar" },
    { columnName: "term", dataType: "varchar" },
    { columnName: "session", dataType: "varchar" },
    { columnName: "DOG", dataType: "varchar" },
    { columnName: "DOP", dataType: "varchar" },
    { columnName: "balance_date", dataType: "varchar" },
    { columnName: "remark", dataType: "varchar" }
  )
  .then((data) => console.log(`table ${school}_payment_record created...`))
  .catch((err) => console.log(err));
};
module.exports = createTables;
