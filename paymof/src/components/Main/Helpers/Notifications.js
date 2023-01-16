import { RiCheckFill } from 'react-icons/ri'
import addNotification from 'react-push-notification'
let warning = (msg) => {
    addNotification({
      title:'Warning',
      subtitle:'There was a problem',
      message:msg,
      theme:'red',
      closeButton:'X',
      duration:8000,
    })
  }
  let success = (msg) => {
    addNotification({
      title:'Success',
      subtitle:'OK!',
      message:msg,
      theme:'light',
      closeButton:'X',
      backgroundTop:'green',
      backgroundBottom:'yellowgreen',
      duration:8000,
    })
  }

  let notifications = {
    warning,
    success
  }
  export  default notifications