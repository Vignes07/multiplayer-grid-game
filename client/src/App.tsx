import React, {useEffect, useState} from "react";
import Grid from "./components/Grid/Grid.tsx";
import {v4 as uuidv4} from "uuid";
import {io, Socket} from "socket.io-client";
import toast from "react-hot-toast";
import PlayerDetails from "./components/PlayerDetails/PlayerDetails.tsx";
import CountDownTimer from "./components/CountDownTimer/CountDownTimer.tsx";
import UpdateHistory from "./components/UpdateHistory/UpdateHistory.tsx";

const socket: Socket = io(import.meta.env.VITE_APP_SOCKET_URL as string);

const App: React.FC = () => {

    const [gridState, setGridState] = useState<{ [key: string]: string }>({});
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [cooldown, setCooldown] = useState<number>(0);

    useEffect(() => {
        // Load or generate the player ID
        let storedPlayerId = localStorage.getItem("playerId");
        if (!storedPlayerId) {
            storedPlayerId = uuidv4();
            localStorage.setItem("playerId", storedPlayerId);
        }
        setPlayerId(storedPlayerId);

        socket.emit("player-connected", storedPlayerId);

        // Listen for updates
        socket.on("playerCount", (count: number) => {
            setPlayerCount(count);
        });

        socket.on("gridState", (updatedGridState: { [key: string]: string }) => {
            setGridState(updatedGridState);
        });

        // Check cooldown on load
        const cooldownEndTime = localStorage.getItem(`cooldownEndTime_${storedPlayerId}`);
        if (cooldownEndTime) {
            const remainingTime = Math.max(0, Math.ceil((+cooldownEndTime - Date.now()) / 1000));
            if (remainingTime > 0) {
                startCooldownTimer(remainingTime);
            }
        }

        return () => {
            socket.off("gridState");
            socket.off("playerCount");
        };
    }, []);

    const startCooldownTimer = (duration: number) => {
        setCooldown(duration);
        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleCellClick = (row: number, col: number) => {
        if (cooldown > 0) {
            toast(`Wait for ${cooldown} seconds`);
            return;
        }

        const cellId = `${row}-${col}`;
        if (gridState[cellId]) {
            toast("This cell is already filled!");
            return;
        }

        setSelectedCell({row: row, col: col});
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        if (cooldown > 0) {
            toast(`Wait for ${cooldown} seconds`);
            return;
        }

        const cellId = `${selectedCell?.row}-${selectedCell?.col}`;
        socket.emit("updateCell", {cellId, value: inputValue, playerId});

        setIsModalOpen(false);
        setInputValue("");

        // Set cooldown
        const cooldownDuration = 60 * 1000; // 60 seconds
        const cooldownEndTime = Date.now() + cooldownDuration;
        localStorage.setItem(`cooldownEndTime_${playerId}`, cooldownEndTime.toString());
        startCooldownTimer(60); // Start 60-second timer
    };

    return (
        <>
            <Grid cooldown={cooldown} gridState={gridState}
                  inputValue={inputValue} setInputValue={setInputValue} isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen} handleCellClick={handleCellClick} handleSubmit={handleSubmit}/>
            <PlayerDetails playerId={playerId} playerCount={playerCount} />
            <CountDownTimer cooldown={cooldown} />
            <UpdateHistory gridState={gridState} />
        </>
    );
};

export default App;

