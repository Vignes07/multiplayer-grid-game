import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

const setupSocketIO = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: { origin: '*' }
    });

    let playerCount = 0;
    const gridState: { [key: string]: string } = {};
    const playerSubmissionStatus: { [key: string]: boolean } = {};
    let inactivityTimeout: NodeJS.Timeout | null = null;

    const shutdownServerAfterInactivity = () => {
        if (inactivityTimeout) {
            clearTimeout(inactivityTimeout);
        }

        inactivityTimeout = setTimeout(() => {
            if (playerCount === 0) {
                console.log("No players left. Shutting down server...");
                process.exit(0);
            }
        }, 5 * 60 * 1000);
    };

    io.on('connection', (socket) => {
        playerCount++;
        io.emit('playerCount', playerCount);

        console.log(`Player Connected: ${socket.id}`);

        socket.emit('gridState', gridState);
        socket.emit('submissionStatus', playerSubmissionStatus);

        socket.on('updateCell', ({ cellId, value, playerId }) => {
            if (playerSubmissionStatus[playerId]) {
                socket.emit('error', 'You have already submitted!');
                return;
            }

            gridState[cellId] = value;
            playerSubmissionStatus[playerId] = true;

            io.emit('gridState', gridState);
            io.emit('submissionStatus', playerSubmissionStatus);
        });

        socket.on('disconnect', () => {
            playerCount--;
            io.emit('playerCount', playerCount);

            console.log(`Player Disconnected: ${socket.id}`);

            if (playerCount === 0) {
                shutdownServerAfterInactivity();
            }
        });

        socket.on('player-connected', () => {
            if (inactivityTimeout) {
                clearTimeout(inactivityTimeout);
            }
        });
    });

    return io;
};

export default setupSocketIO;
