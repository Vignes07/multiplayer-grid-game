import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "./Grid.css";
import PopupInputField from "./PopupInputField.tsx";

const socket: Socket = io("http://localhost:5000");

const Grid: React.FC = () => {
    const [gridState, setGridState] = useState<{ [key: string]: string }>({});
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [playerId, setPlayerId] = useState<string | null>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    // Listen to Socket.IO events
    useEffect(() => {
        // Retrieve player ID from localStorage or generate a new one
        let storedPlayerId = localStorage.getItem("playerId");
        if (!storedPlayerId) {
            storedPlayerId = uuidv4();
            localStorage.setItem("playerId", storedPlayerId);
        }
        setPlayerId(storedPlayerId);

        // Emit the player ID to the server upon connection
        socket.emit("player-connected", storedPlayerId);

        // Get the grid state from localStorage
        const savedGridState = JSON.parse(localStorage.getItem("gridState") || "{}");
        setGridState(savedGridState);

        // Retrieve submission state from localStorage
        const savedIsSubmitted = localStorage.getItem("isSubmitted") === "true";
        setIsSubmitted(savedIsSubmitted);

        // Get the player count
        socket.on("playerCount", (count: number) => {
            setPlayerCount(count);
        });

        // Listen to the grid state updates from the server
        socket.on("gridState", (updatedGridState: { [key: string]: string }) => {
            setGridState(updatedGridState);
            // Update localStorage whenever grid state is updated
            localStorage.setItem("gridState", JSON.stringify(updatedGridState));
        });

        return () => {
            socket.off("gridState");
            socket.off("playerCount");
        };
    }, []);

    // Handle cell click
    const handleCellClick = (row: number, col: number) => {
        if (isSubmitted) {
            alert("You can only submit once!");
            return;
        }

        const cellId = `${row}-${col}`;
        if (gridState[cellId]) {
            alert("This cell is already filled!");
            return;
        }

        setSelectedCell({ row: row, col: col });
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        const cellId = `${selectedCell?.row}-${selectedCell?.col}`;
        socket.emit("updateCell", { cellId, value: inputValue });

        const newGridState = { ...gridState, [cellId]: inputValue };
        setGridState(newGridState);
        localStorage.setItem("gridState", JSON.stringify(newGridState));

        // Set the submission state to true and persist it
        setIsSubmitted(true);
        localStorage.setItem("isSubmitted", "true");

        setIsModalOpen(false);
        setInputValue("");
    };

    // Generate the grid UI
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
            <div className="grid">{generateGrid()}</div>
            {isModalOpen && <div className="modal-backdrop" />}
            <PopupInputField
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default Grid;
