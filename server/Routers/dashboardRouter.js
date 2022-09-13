const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
require('../conn&apis/prototypes')

router.get('/', (req, res) => {
    // console.log(req.session);
    let {school} = req.query;
    if(school){
    school = school.replace(/-/g, "_")
    db.getAll(`${school}_students`).then(data => {
        // console.log(data.length)
        return res.json({
            status:true,
            message:data.length,
        })
    }).catch(err => console.log(err, 'from dashboard'))
}
    
})
module.exports =  router;