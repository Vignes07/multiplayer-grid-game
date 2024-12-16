import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "./Grid.css";
import PopupInputField from "./PopupInputField.tsx";
import toast, { Toaster } from "react-hot-toast";

const socket: Socket = io("http://localhost:5000");

const Grid: React.FC = () => {
    const [gridState, setGridState] = useState<{ [key: string]: string }>({});
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [cooldown, setCooldown] = useState<number>(0);

    useEffect(() => {
        let storedPlayerId = localStorage.getItem("playerId");
        if (!storedPlayerId) {
            storedPlayerId = uuidv4();
            localStorage.setItem("playerId", storedPlayerId);
        }
        setPlayerId(storedPlayerId);

        socket.emit("player-connected", storedPlayerId);

        socket.on("playerCount", (count: number) => {
            setPlayerCount(count);
        });

        socket.on("gridState", (updatedGridState: { [key: string]: string }) => {
            setGridState(updatedGridState);
        });

        socket.on("cooldown", ({ remainingTime }: { remainingTime: number }) => {
            setCooldown(remainingTime);
            if (remainingTime > 0) {
                startCooldownTimer(remainingTime);
            }
        });

        socket.emit("checkCooldown", storedPlayerId); // Check cooldown on load

        return () => {
            socket.off("gridState");
            socket.off("playerCount");
            socket.off("cooldown");
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

        setSelectedCell({ row: row, col: col });
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        if (cooldown > 0) {
            toast(`Wait for ${cooldown} seconds`);
            return;
        }

        const cellId = `${selectedCell?.row}-${selectedCell?.col}`;
        socket.emit("updateCell", { cellId, value: inputValue, playerId });

        setIsModalOpen(false);
        setInputValue("");
    };

    const generateGrid = () => {
        const rows = [];
        for (let row = 0; row < 10; row++) {
            const cols = [];
            for (let col = 0; col < 10; col++) {
                const cellId = `${row}-${col}`;
                cols.push(
                    <div
                        key={cellId}
                        className={`grid-cell ${gridState[cellId] ? "filled" : ""}`}
                        onClick={() => handleCellClick(row, col)}
                    >
                        {gridState[cellId] || ""}
                    </div>
                );
            }
            rows.push(
                <div key={`row-${row}`} className="grid-row">
                    {cols}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="grid-container">
            <h2>Multiplayer Grid</h2>
            <p>Players Online: {playerCount}</p>
            <p>Player Id: {playerId}</p>
            {cooldown > 0 && <p>Cooldown: {cooldown} seconds remaining</p>}
            <div className="grid">{generateGrid()}</div>
            {isModalOpen && <div className="modal-backdrop" />}
            <PopupInputField
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSubmit={handleSubmit}
            />
            <Toaster />
        </div>
    );
};

export default Grid;
