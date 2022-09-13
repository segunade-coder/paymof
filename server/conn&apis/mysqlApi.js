const mysql = require("mysql");
require("./prototypes");
class dbQueries {
  constructor(connection) {
    this.connection = connection;
  }
  createTable = (table, ...params) => {
    
    return new Promise((resolve, reject) => {
      let query_string = ``;
      let columnNames = [];
      let dataType = [];
      let qry = "";
      params.forEach((param) => {
        columnNames.push(param.columnName);
        dataType.push(param.dataType);
      });
      for (let i = 0; i < columnNames.length; i++) {
        qry += `${columnNames[i]} ${dataType[i].toUpperCase()}${
          dataType[i].toUpperCase() === "VARCHAR" ? "(255)" : "(11)"
        } NOT NULL ${i === (columnNames.length -1) ? '' : ','} `;
      }
      // this.connection.query(`SELECT * FROM ${table}`, (err, data ))
      query_string = `CREATE TABLE ${table} (id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, ${qry}, created_at TIMESTAMP NOT NULL)`
      this.connection.query(query_string,
        (err, data) => {
          if(err) {
            reject(err)
            return;
          } 
          resolve(data);
        }
      );
    });



  };
  query = (query) => {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  getAll = (table) => {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM " + table;
      this.connection.query(sql, (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  getById = (id, table) => {
    if (typeof id !== "number" && typeof table !== "string") {
      return new Promise((resolve, reject) =>
        reject(
          new SyntaxError(
            "Id be of type 'number' and table name must be type 'string'"
          )
        )
      );
    }
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM " + table + " WHERE id = ?";
      this.connection.query(sql, [id], (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  getByColumnName = (columnName, value, table) => {
    if (typeof columnName && typeof value && typeof table !== "string") {
      return new Promise((resolve, reject) =>
        reject(new SyntaxError("Must be of type 'string'"))
      );
    }
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${table} WHERE ${columnName} = ?`;
      this.connection.query(sql, [value], (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  insert = (table, values) => {
    if (typeof table !== "string" && typeof values !== "object") {
      return new Promise((resolve, reject) =>
        reject(new SyntaxError("Must be of type 'string'"))
      );
    }
    return new Promise((resolve, reject) => {
      let keyArray = [];
      let valueArray = [];
      let sqlInject = [];
      for (let key in values) {
        keyArray.push(key);
        valueArray.push(`${mysql.escape(values[key])}`);
        sqlInject.push("?");
      }
      let sql = `INSERT INTO ${table} (${keyArray.join(
        ", "
      )}) VALUES(${valueArray.join(", ")})`;
      this.connection.query(sql, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  };
}
module.exports = dbQueries;
