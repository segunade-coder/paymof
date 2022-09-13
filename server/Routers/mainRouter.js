const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
require('../conn&apis/prototypes')
const paymentRoute = require('./paymentRouter')
const dashboardRoute = require('./dashboardRouter')
const settingsRoute = require('./settingsRouter')
let admin = '';
router.get('/', (req, res) => {
    // console.log(req.session);
    db.query(`SELECT * FROM school_cred WHERE school = '${req.session.user.school}' AND admin = '${req.session.user.user}'`)
    .then(data => {
        data.length > 0 ? admin = true : admin = false;
    }).catch(err => console.log(err))
    if(req.session.user.school){
        req.session.user.admin = admin;
        req.session.databaseName = req.session.user.school.replace(/ /g, "_")
        res.json({
            status:true,
            creds:req.session.user,
        })
    }

}).use('/payment', paymentRoute)
.use('/dashboard', dashboardRoute)
.use('/settings', settingsRoute)
.get('/logout', (req, res) => {
    res.redirect('http://localhost:3000/login')
})

module.exports =  router;