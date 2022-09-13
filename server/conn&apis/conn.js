const mysql = require('mysql');
// mysql apache credentials for connnecting to xampp without database 
const db_cred = {
  database:'paymof',
  host: "",
  user: "tee",
  password: "",
  port: "3306",
};

// create a database connection with the credentials above
const connection = mysql.createConnection(db_cred);

//connect to the apache server
  connection.connect((err) => {
    if (err) {
      console.log(`Error conneting to apache database at ${__filename}`, err);
    } else {
      console.log("connected to apache database...");
    }
  });

  // export the connection
  module.exports = connection;