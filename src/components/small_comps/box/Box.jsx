import React from 'react'
import './box.css'
const Box = ({children, style}) => {
  return (
    <div className='box' style={style}>
        {children}
    </div>
  )
}

export default Box