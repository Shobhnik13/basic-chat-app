'use client'
import { useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import classes from './page.module.css'
const page = () => {
  const { sendMessage, messages } = useSocket()
  const [message, setMessage] = useState<string>('')

  return (
    <div>
      <div>
        <h1>All messages</h1>
      </div>
      <div>
        <input onChange={(e)=>setMessage(e.target.value)} type="text" className={classes['chat-input']} placeholder='message'/>
        <button onClick={(e)=>sendMessage(message)} className={classes['button']}>Send message</button>
      </div>
    <div>
      {messages && messages.map((item)=>(
        <div key={Math.random()}>{item}</div>
      ))}
    </div>
    </div>
  )
}

export default page