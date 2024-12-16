import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'

const setupSocketIO = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: { origin: '*' }
    })

    let playerCount = 0
    const gridState: { [key: string]: string } = {}

    io.on('connection', (socket) => {
        playerCount++
        io.emit('playerCount', playerCount)

        console.log(`Player Connected: ${socket.id}`)

        socket .emit('gridState', gridState)

        socket.on('updateCell', ( { cellId, value }) => {
            gridState[cellId] = value
            io.emit('gridState', gridState)
        })

        socket.on('disconnect', () => {
            playerCount--
            io.emit('playerCount', playerCount)

            console.log(`Player Disconnected: ${socket.id}`)
        })
    })

    return io
}

export default setupSocketIO;