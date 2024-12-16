import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const setupSocketIO = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: { origin: "*" },
    });

    let playerCount = 0;
    const gridState: { [key: string]: string } = {};
    const playerCooldowns: { [key: string]: number } = {}; // Store cooldown end timestamps

    const shutdownServerAfterInactivity = () => {
        setTimeout(() => {
            if (playerCount === 0) {
                console.log("No players left. Shutting down server...");
                process.exit(0);
            }
        }, 5 * 60 * 1000);
    };

    io.on("connection", (socket) => {
        playerCount++;
        io.emit("playerCount", playerCount);

        console.log(`Player Connected: ${socket.id}`);

        socket.emit("gridState", gridState);

        socket.on("updateCell", ({ cellId, value, playerId }) => {
            const currentTime = Date.now();
            const cooldownEnd = playerCooldowns[playerId] || 0;

            if (cooldownEnd > currentTime) {
                const remainingTime = Math.ceil((cooldownEnd - currentTime) / 1000);
                socket.emit("cooldown", { remainingTime });
                return;
            }

            // Update grid and set cooldown
            gridState[cellId] = value;
            playerCooldowns[playerId] = currentTime + 60 * 1000; // Set 60s cooldown
            io.emit("gridState", gridState);

            const remainingTime = 60; // Cooldown duration
            socket.emit("cooldown", { remainingTime });
        });

        socket.on("checkCooldown", (playerId) => {
            const currentTime = Date.now();
            const cooldownEnd = playerCooldowns[playerId] || 0;
            const remainingTime = Math.max(0, Math.ceil((cooldownEnd - currentTime) / 1000));
            socket.emit("cooldown", { remainingTime });
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
