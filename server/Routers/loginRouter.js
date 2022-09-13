const express = require("express");
const router = express.Router();
const conn = require("../conn&apis/conn"); // connection module made to apache server
const dbQueries = require("../conn&apis/mysqlApi"); // mysql api module
const db = new dbQueries(conn);
router.post("/", (req, res) => {
  let { school, user, pass } = req.body;
  let status = false;
  if (school || user || pass !== "") {
      let newScl = `${school.toLowerCase().replace(/ /g, "_")}`;
    db.query(`SELECT school, user, password FROM ${newScl}_users  WHERE school = '${school}' AND user = '${user}'`)
      .then((response) => {
          if(response.length > 0) {
              response.forEach(element => {
                  let {password} = element;
                  if(password === pass) status = true;
                  else status = false;
              });
              if(status){
                 req.session.user = {
                     school,
                     user,
                     admin:false,
                 }
                 console.log(req.session);
                  return res.json({
                    error:false,
                    message: "Successful login"
                }) 
              } 
            return res.json({
                error:true,
                message: "Invalid password"
            })
          }else {
              return res.json({
                  error:true,
                  message: "Invalid username"
              })
          }
          
      })
      .catch((err) => {
          console.log(err) 
          return res.json({
              error:true,
              message:'Something went wrong, try again.'
          })
        });
  }else {
      return res.json({
          error:true,
          message:'Fill in all fields'
      })
  }
}).get('/schools', (req, res) => {
    db.getAll('school_cred').then(data => {
       let schoolArr = [];
        data.forEach(element => schoolArr.push({school:element.school}))
        return res.json({
            error:false,
            school:schoolArr,
        })
    }).catch(err => console.log(err))
})
module.exports = router;
