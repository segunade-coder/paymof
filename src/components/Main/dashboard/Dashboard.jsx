import React, { useEffect, useContext, useState } from 'react'
import './dashboard.css'
import {FaUsers, FaDonate, FaBox} from 'react-icons/fa'
import { MainContext } from '../Helpers/Context'
import Box from '../../small_comps/box/Box'
const Dashboard = () => {
  let {loggedSchool} = useContext(MainContext)
  const [totalStudent, setTotalStudent] = useState('')
  useEffect(() => {
   fetch(`http://192.168.43.236:80/main/dashboard?school=${loggedSchool.replace(/ /g, "-")}`,{credentials:'include'}).then(res => res.json()).then(data => {
     data.status && setTotalStudent(data.message)
   }).catch(err => console.log(err))
  
  }, [loggedSchool])
  
  return (
    <div className='__dashboard'>
      <h2>Dashboard</h2>
      <p>Welcome to {loggedSchool} School Fee Record System</p>
      <br />
      <div className="container">
        <Box style={{backgroundColor:'#eee'}}>
          <div className="content">
            <h3>Students</h3>
            <FaUsers size={70}/>
            <p><b>{totalStudent} </b></p>
          </div>
        </Box >
        <Box style={{backgroundColor:'wheat'}}>
        <div className="content">
            <h3>Monthly Fee</h3>
            <FaDonate size={60}/>
            <p><b>200,000,000 </b></p>
          </div>
        </Box>
        <Box style={{backgroundColor:'#c5d7e5'}}>
        <div className="content">
            <h3>Total </h3>
            <FaBox size={60}/>
            <p><b>700,000,000.00 </b></p>

          </div>
        </Box>
      </div>
    </div>
  )
}

export default Dashboard