import React from 'react';
import { Level } from "../store"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toast =(props: {id:string, message:string, level?: Level}) =>{
  const {message, level} = props
  let color = ""
  if(level === Level.Info){
    color = "is-info"
  }
  else if(level === Level.Warning){
    color = "is-warning"
  }
  else if(level === Level.Error){
    color = "is-warning"
  }
  toast(message, { 
    className:`message ${color} p-0`,
    bodyClassName:`message-body`,
  })

  return (
    <ToastContainer />
  );
}
export default Toast;
