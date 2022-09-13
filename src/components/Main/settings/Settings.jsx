import React, { useContext, useEffect, useState } from 'react'
import { MainContext } from '../Helpers/Context'
import './settings.css'
const Settings = () => {
    let {loggedSchool} = useContext(MainContext)
    const [classes, setClasses] = useState([])
    const [showMore, setShowMore] = useState(false)
    const [currentSession, setCurrentSession] = useState('')
    const [currentTerm, setCurrentTerm] = useState('')
    const [fees, setFees] = useState([])
    useEffect(() => {
     fetch(`http://192.168.43.236:80/main/settings?school=${loggedSchool.replace(/ /g, "-")}`,{credentials:'include'})
     .then(res => res.json())
     .then(data => {
         console.log(data);
         let classes = data.message[0].classes
         setClasses(JSON.parse(classes))
         setFees(JSON.parse(data.message[0].fees))
         setCurrentSession(data.message[0].current_session)
         setCurrentTerm(data.message[0].current_term)
     })
     .catch(err => console.log(err))
    }, [loggedSchool])
    const showMoreFnc = () => {
        setShowMore(true)
        setClasses(classes)
    }
  return (
    <div className="__settings">
        <h2>Settings</h2>
        <div className="container">
            <h3>Classes</h3>
            {classes && classes.slice(0,5).map(elem => (<div key={elem+Math.random()}>{elem}</div>))}
            {!showMore && <p onClick={showMoreFnc}>more...</p>}
        </div>
    </div>
  )
}

export default Settings