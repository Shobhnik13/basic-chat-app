import { Server } from 'socket.io'
import Redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()

const redis_uri = process.env.redis_uri || ''

const pub = new Redis(redis_uri)
const sub = new Redis(redis_uri)

class SocketService {
    private _io: Server
    constructor() {
        console.log('init socket server');
        this._io = new Server({
            cors:{
                allowedHeaders:['*'],
                origin: '*',
            }
        }
        )
        sub.subscribe('MESSAGES')
    }
    public initListeners() {
        console.log('init block entered before client connection');
        
        const io = this._io
        io.on('connect', (socket)=>{
            console.log('new client connected', socket.id);

            socket.on('event:message', async({message}:{message:string})=>{
                console.log('message received', message);
                
                // received now and publish it to redis - pub
                await pub.publish('MESSAGES', JSON.stringify({ message }))
            })
        })

        sub.on('message',(channel, message)=>{
            if(channel === 'MESSAGES'){
                io.emit('message', message)
            }
        })

        
    }
    get io(){
        return this._io
    }
}

export default SocketService

