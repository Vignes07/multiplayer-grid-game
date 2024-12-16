import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const setupSocketIO = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: { origin: "*" },
    });

    let playerCount = 0;
    const gridState: { [key: string]: string } = {};
    const playerConnections: { [playerId: string]: Set<string> } = {};


    const shutdownServerAfterInactivity = () => {
        setTimeout(() => {
            if (playerCount === 0) {
                console.log("No players left. Shutting down server...");
                process.exit(0);
            }
        }, 5 * 60 * 1000);
    };

    io.on("connection", (socket) => {

        socket.on("player-connected", (playerId: string) => {
            if (!playerConnections[playerId]) {
                playerConnections[playerId] = new Set();
            }
            playerConnections[playerId].add(socket.id);

            io.emit("playerCount", Object.keys(playerConnections).length);
            console.log(`Player Connected: ${playerId}`);
        });

        console.log(`Player Connected: ${socket.id}`);

        socket.emit("gridState", gridState);

        socket.on("updateCell", ({ cellId, value }) => {
            gridState[cellId] = value;
            io.emit("gridState", gridState);

        });

        socket.on("disconnect", () => {
            playerCount--;
            io.emit("playerCount", playerCount);

            console.log(`Player Disconnected: ${socket.id}`);

            if (playerCount === 0) {
                shutdownServerAfterInactivity();
            }
        });
    });

    return io;
};

export default setupSocketIO;
