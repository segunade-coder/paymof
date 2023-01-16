import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotAuthorize = () => {
  const navigate = useNavigate()
  return (
    <div>Sorry, you are not authorized to access this page 
        <p onClick={(e) => navigate('../')}> go back</p>
    </div>
  )
}

export default NotAuthorize