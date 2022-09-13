import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { MainContext } from './Helpers/Context'
import {RiDashboard2Fill, RiMoneyCnyCircleFill, RiUserSharedFill, RiExchangeFill, RiDatabaseFill, RiUserAddFill, RiNotification2Fill, RiListSettingsFill, RiDeviceFill, RiLogoutBoxRLine, RiUser4Fill} from 'react-icons/ri'
import './main.css'
const Main = () => {
    const [loggedSchool, setloggedSchool] = useState('')
    const [loggedUser, setLoggedUser] = useState('Tobi')
    const [admin, setAdmin] = useState(true)
    let navigate = useNavigate()
  useEffect(() => {
    fetch('http://192.168.43.236:80/main',{
      credentials:'include'}).then(res => res.json()).then(data => {
        if(data){
          if(data.creds.school){
          setLoggedUser(data.creds.user)
          setloggedSchool(data.creds.school)
          setAdmin(data.creds.admin)
        }
      }else{
          navigate('../authentication')
        }

      }).catch(err => {
        navigate('../authentication')
        console.log(err)}
        )
  }, [loggedSchool])
  
    const handleLogout = async () => {
      console.log('hi');
    }
  return (  
    <div className='home'>
      
       <MainContext.Provider value={{
         loggedSchool,
         loggedUser,
         admin
       }}>
         <div className="vert__nav">
           <div className='slogan'> 
             <RiUser4Fill size={40}/>
             <p>Admin Fee Record</p>
           </div>
         <nav>
                <NavLink to='dashboard'> <RiDashboard2Fill />  <span>Dashboard</span></NavLink>
                <NavLink to='students'> <RiUserSharedFill/>  <span> Students</span></NavLink>
                <NavLink to='payment'> <RiMoneyCnyCircleFill/>  <span >Make Payment</span></NavLink>
                <NavLink to='fees'> <RiExchangeFill/> <span >Fees</span></NavLink>
                <NavLink to='record'> <RiDatabaseFill /> <span >Record</span></NavLink>
                <NavLink to='users'> <RiUserAddFill /> <span >Users</span></NavLink>
                { admin && (<>
                <NavLink to='notifications'> <RiNotification2Fill/>  <span >Notifications</span></NavLink>
                <NavLink to='settings'> <RiListSettingsFill/>  <span >Settings</span></NavLink>
                <NavLink to='backup'> <RiDeviceFill/>  <span >Backup</span></NavLink>
                </>)}
            </nav>
         </div>
       <header>
         <h4 className='school-name'>{loggedSchool}</h4>
            <button onClick={handleLogout} className="desktop">Logout <RiLogoutBoxRLine style={{marginLeft:'.3rem'}}/></button>
            <button onClick={handleLogout} className="phone"><RiLogoutBoxRLine style={{marginLeft:'.3rem'}}/></button>
            <div className="user">{loggedUser[0]}</div>
        </header>
        <div className="hor-nav">
        <nav>
                <NavLink to='dashboard'> <RiDashboard2Fill />  </NavLink>
                <NavLink to='students'> <RiUserSharedFill/>  </NavLink>
                <NavLink to='payment'> <RiMoneyCnyCircleFill/></NavLink>
                <NavLink to='fees'> <RiExchangeFill/> </NavLink>
                <NavLink to='record'> <RiDatabaseFill /></NavLink>
                <NavLink to='users'> <RiUserAddFill /> </NavLink>
                { admin && (<>
                <NavLink to='notifications'> <RiNotification2Fill/></NavLink>
                <NavLink to='settings'> <RiListSettingsFill/> </NavLink>
                <NavLink to='backup'> <RiDeviceFill/> </NavLink>
                </>)}
            </nav>
        </div>
        <main className='content'>
          <Outlet />
          </main>
       </MainContext.Provider>
    </div>
  )
}

export default Main