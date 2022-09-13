const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
require('../conn&apis/prototypes')

router.get('/', (req, res) => {
    let {school} = req.query;
    school = school.replace(/-/g, "_")
    db.getAll(`${school}_settings`).then(data => {
        res.json({
            status:true,
            message:data,
        })
    }).catch(err => console.log(err))
   
})
module.exports =  router;