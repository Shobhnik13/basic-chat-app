'use client'
import React, { useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

interface socketProviderProps {
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg: string) => any,
    messages: string[],
}

const SocketContext = React.createContext<ISocketContext | null>(null)

export const SocketProvider: React.FC<socketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([])

    const sendMessage: ISocketContext["sendMessage"] = useCallback(
        (msg) => {
            console.log("Send Message", msg);
            if (socket) {
                socket.emit("event:message", { message: msg });
            }
        },
        [socket]
    );

    const sendMessageReceive = useCallback((msg: string) => {
        console.log('message received from server', msg);
        const parsedMessage = JSON.parse(msg)
        setMessages((prevMessages) => [...prevMessages, parsedMessage.message])
    }, [])

    useEffect(() => {
        const socket = io('http://localhost:8000');
        socket.on('message', sendMessageReceive)
        setSocket(socket)
        return () => {
            socket.disconnect()
            socket.off('message', sendMessageReceive)
            setSocket(undefined)
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    const state = useContext(SocketContext)
    if (!state) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return state
}
