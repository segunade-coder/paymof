import React, { useContext, useEffect, useRef, useState } from 'react'
import {RiCloseFill, RiDeleteBin4Fill, RiPriceTag3Line, RiSaveLine, RiUserAddLine, } from 'react-icons/ri'
import ModalCont from '../../small_comps/modal/ModalCont'
import './users.css'
import { MainContext } from "../Helpers/Context";
import {Notifications} from 'react-push-notification'

const Users = () => {
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dataFetchedRef = useRef(false);
  let { loggedSchool, url, loggedUser, notifications} = useContext(MainContext);
  
  const fetchData = () => {
    setIsLoading(true);
    fetch(
      `${url}/main/users`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
         if (data.status){
           setUsers(data.data)
           console.log(loggedUser);
           setUsers(data['data'].filter(user => user.id !== 1 ))
         }
     
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchData();
  });
  let addUser = () => {
    if(username === '' || pass === ''){
      notifications.warning('Each field must be filled out')
    }else{
      if(username.length <= 2 || pass.length <= 2){
        notifications.warning('Username or password must be greater than two')
      }else{
        let added = {
          school:loggedSchool,
          user:username,
          password:pass,
          last_login:'',
          status:1,
        }
        fetch(`${url}/main/users/add`, {
          credentials:"include",
          headers: {
            "Content-Type": "application/json",
          },
          method:'POST',
    body:JSON.stringify({
      username,
      pass,
      loggedSchool,
    })}).then(res => res.json()).then(data => {
      data.status ? notifications.success(data.message) : notifications.warning(data.message)
      data.status && document.getElementsByClassName('user-modal')[0].classList.remove("show-modal")
      data.status && setUsers([...users, added])
      document.body.style.overflow = 'auto';
      document.body.style.top = ''

    })
    .catch(err => console.log(err))
      }
  }
  }
  
  let editActivation = (id, status, action) => {
    status === 0 ? status = 1 : status = 0;
    let tempArr = users;
    if(window.confirm(`Do you want to ${action} this account`)){
        tempArr.forEach((elem) => {
          if(elem.id === id){
            elem.status = status;
          }
        });
        fetch(`${url}/main/users/edit`, {
          credentials:"include",
          headers: {
            "Content-Type": "application/json",
          },
          method:'POST',
    body:JSON.stringify({
      id,
      status,
    })}).then(res => res.json()).then((data) => {
      if (data.status){
        notifications.success(data.message)
        setUsername('add')
        setUsers(tempArr)
        setPass('')
      }else{
        notifications.warning(data.message)
      }
      
    })
    .catch(err => console.log(err))
      }
  }
  let deleteUser = (id, userAcc) => {
    if(window.confirm(`Do you want to delete ${userAcc} from users?`)){
      
        fetch(`${url}/main/users/delete-user`, {
          credentials:"include",
          headers: {
            "Content-Type": "application/json",
          },
          method:'POST',
          body:JSON.stringify({
      id,
    })}).then(res => res.json()).then((data) => {
      if (data.status){
        notifications.success(data.message)
        setUsers(users.filter( user => user.id !== id))
      }else{
        notifications.warning(data.message)
      }
      
    })
    .catch(err => console.log(err))
      }
  }
  let showModal = () =>{
    setUsername('')
    setPass('')
    document.getElementsByClassName('user-modal')[0].classList.add("show-modal")
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, parseInt(window.scrollY || '0') * -1)
  }
  return (
    <div className='__users'>
      <Notifications position='top-right'/>
    <h2>Users</h2>
    <div className="add-btn">
      <button onClick={(e) => showModal()}> <RiUserAddLine size={22} />
      </button>
    </div>
    <table border={1} className="table table-responsive">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (<tr><td colSpan={3}>loading...</td></tr>) : 
      users.length === 0 ? (<tr><td>No user available</td></tr>) : (users.map((user, index) => (<tr key={user.user + user.password + new Date() + Math.random()}>
        <td>{user.user}</td>
        <td>{user.status === 1 ? "active" : "disabled"} <RiPriceTag3Line fill={user.status === 1 ? "green" : "red"}/> </td>
        <td>
          <div className="action-cont">
            {user.status === 0 && (<div onClick={(e) => editActivation(user.id, user.status, 'activate')}><span>activate</span> <RiSaveLine fill='green'/> </div>)}
            {user.status === 1 && (<div onClick={(e) => editActivation(user.id, user.status, 'disable')}> <span>disable</span><RiCloseFill fill='red'/> </div>)}
            <div onClick={(e) => deleteUser(user.id, user.user)}> <span>delete</span><RiDeleteBin4Fill fill='red'/> </div>
            
          </div>
        </td>
      </tr>)))    
      }
        
      </tbody>
    </table>
    <ModalCont title="Add User" classModal="user-modal" save={addUser}>
    <div className="inputs-container">
           <form >
            <div className="input-cont">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                autoComplete='on'
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-cont">
              <label htmlFor="pass">Password</label>
              <input
                type="password"
                id="pass"
                value={pass}
                autoComplete="on"
                onChange={(e) => setPass(e.target.value)}
                maxLength={10}
              />
            </div>
           </form>
           </div>
        </ModalCont>
  
          </div>
  )
}

export default Users