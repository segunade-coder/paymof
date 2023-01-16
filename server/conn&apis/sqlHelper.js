const { JSON } = require("mysql/lib/protocol/constants/types");
const conn = require("./conn");
const dbQueries = require("./mysqlApi");
const settings = require('./inputSettings')
// initialize dbqueries class
const logErr = require('./logErrors')
const db = new dbQueries(conn);
// create all necessary table
const createTables = (school) => {
  school = school.replace(/ /g, "_");
  // create student table
  db.query(
    `CREATE TABLE ${school}_users (id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, school VARCHAR(20) NOT NULL, user VARCHAR(20) NOT NULL, password VARCHAR(50) NOT NULL, last_login VARCHAR(20) NOT NULL, status INT(11) NOT NULL, created_at TIMESTAMP NOT NULL)`
  )
    .then((data) => console.log(`table ${school}_users created...`))
    .catch((err) => logErr(err, __filename, new Error().stack.match(/(:[\d]+)/)[0].replace(':','')));

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
  .catch((err) => logErr(err, __filename, new Error().stack.match(/(:[\d]+)/)[0].replace(':','')));
  
  db.createTable(
    `${school}_settings`,
    { columnName: "classes", dataType: "varchar" },
    { columnName: "current_session", dataType: "varchar" },
    { columnName: "sessions", dataType: "varchar" },
    { columnName: "current_term", dataType: "varchar" },
    { columnName: "terms", dataType: "varchar" },
    { columnName: "fees", dataType: "varchar" },
    { columnName: "payment_method", dataType: "varchar" },
    { columnName: "payment_for", dataType: "varchar" },
  )
  .then((data) => console.log(`table ${school}_settings created...`))
  .catch((err) => logErr(err, __filename, new Error().stack.match(/(:[\d]+)/)[0].replace(':','')));
  
  db.query(
    `ALTER TABLE ${school}_settings MODIFY classes VARCHAR(3500)`
  )
  .then((data) => console.log(`alter table ${school}_settings {school}...`))
  .catch((err) => logErr(err, __filename, new Error().stack.match(/(:[\d]+)/)[0].replace(':','')));
  
  db.query(
    `ALTER TABLE ${school}_settings MODIFY fees VARCHAR(3500)`
  )
  .then((data) => console.log(`alter table ${school}_settings {school}...`))
  .catch((err) => logErr(err, __filename, new Error().stack.match(/(:[\d]+)/)[0].replace(':','')));
  db.insert(`${school}_settings`,
        {
        classes:settings.classes, 
        current_session:'2021/2022',
        sessions:'2019/2020,2020/2021,2021/2022,2022/2023',
        current_term:'3rd term',
        terms:'1st term,2nd term,3rd term',
        fees:settings.fees,
        payment_method:'Zenith Bank Transfer,Zenith Bank Teller',
        payment_for:'fees ~ pta and lesson,fees and pta (no lesson),part payment,others, busfare',
        }).then( data => console.log('inserted data into settings succesfully')).catch(err => console.log(err))
  db.createTable(
    `${school}_notifications`,
    { columnName: "title", dataType: "varchar" },
    { columnName: "text", dataType: "varchar" },
    { columnName: "payment_id", dataType: "varchar" },
    { columnName: "status", dataType: "varchar" }
  )
  .then((data) => console.log(`table ${school}_notifications created...`))
  .catch((err) => logErr(err, __filename, new Error().stack.match(/(:[\d]+)/)[0].replace(':','')));

  db.createTable(
    `${school}_payment_record`,
    { columnName: "name", dataType: "varchar" },
    { columnName: "payment_id", dataType: "varchar" },
    { columnName: "amount_paid", dataType: "varchar" },
    { columnName: "PTA", dataType: "int" },
    { columnName: "lesson", dataType: "int" },
    { columnName: "tuition", dataType: "int" },
    { columnName: "expected_payment", dataType: "varchar" },
    { columnName: "balance", dataType: "varchar" },
    { columnName: "term", dataType: "varchar" },
    { columnName: "session", dataType: "varchar" },
    { columnName: "DOG", dataType: "varchar" },
    { columnName: "DOP", dataType: "varchar" },
    { columnName: "balance_date", dataType: "varchar" },
    { columnName: "remark", dataType: "varchar" },
    { columnName: "class", dataType: "varchar" },
    { columnName: "keyid", dataType: "varchar" },
    { columnName: "payment_for", dataType: "varchar" },
    { columnName: "payment_method", dataType: "varchar" },
    { columnName: "accountant", dataType: "varchar" }
  )
  .then((data) => console.log(`table ${school}_payment_record created...`))
  .catch((err) => logErr(err, __filename, new Error().stack.match(/(:[\d]+)/)[0].replace(':','')));
};
module.exports = createTables;
