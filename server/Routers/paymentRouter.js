const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
require('../conn&apis/prototypes')

admin = false;

router.post('/findName', (req, res) => {
    let {name} = req.body;
    db.query(`SELECT * FROM ${req.session.databaseName}_students WHERE name LIKE "%${name}%"`)
    .then(data => res.json({
        status: true,
        message:data,
    }))
    .catch(err => console.log(err))
    
}).get('/classes', (req, res) => {
    db.query(`SELECT * FROM ${req.session.databaseName}_settings`)
    .then(data => res.json({
        status: true,
        message:data,
    }))
    .catch(err => console.log(err))
}).post('/save', (req, res) => {
   let {datas} = req.body;
   let {name, paymentId, studentClass, DOP, DOB, DOG, paymentFor, paymentMethod, term, totalFee, feePaid, balance, remark} = datas;
   if(name === '' || paymentId === '' || studentClass === '' || DOP === '' || paymentFor === '' || paymentMethod === '' || term === '' || totalFee === '' || feePaid === '' || balance === ''){
    return res.json({
        status:false,
        message:'Please fill in all the textbox'
    });
  }else{
      db.insert(`${req.session.databaseName}_payment_record`,{
        name,
        payment_id:paymentId,
        amount_paid:feePaid,
        expected_payment:totalFee,
        balance,
        term,
        DOP,
        DOG,
        balance_date:DOB,
        remark,

      }).then(data => {
          console.log('Inserted data into {payment record succesfully}')
          return res.json({
              status:true,
              message:'Record added succesfully'
          })
    }).catch(err => {
        console.log(err)
        return res.json({
            status:false,
            message:'something went wrong, please try again later'
        })
    })
  }
})

module.exports =  router;