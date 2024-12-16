import React, {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {v4 as uuidv4} from "uuid";
import "./Grid.css";
import PopupInputField from "./PopupInputField.tsx";
import toast, {Toaster} from "react-hot-toast";

const socket: Socket = io("http://localhost:5000");

const Grid: React.FC = () => {
    const [gridState, setGridState] = useState<{ [key: string]: string }>({});
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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

        socket.on("submissionStatus", (status: { [key: string]: boolean }) => {
            const submittedStatus = status[storedPlayerId] || false;
            setIsSubmitted(submittedStatus);
            localStorage.setItem("isSubmitted", JSON.stringify(submittedStatus));
        });

        socket.on("error", (message: string) => {
            toast(message);
        });


        const storedSubmissionStatus = localStorage.getItem("isSubmitted");
        if (storedSubmissionStatus) {
            setIsSubmitted(JSON.parse(storedSubmissionStatus));
        }

        return () => {
            socket.off("gridState");
            socket.off("playerCount");
            socket.off("submissionStatus");
            socket.off("error");
        };
    }, []);


    const handleCellClick = (row: number, col: number) => {
        if (isSubmitted) {
            toast("You can only submit once!");
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
        if (isSubmitted) {
            toast("You have already submitted your cell value.");
            return;
        }

        const cellId = `${selectedCell?.row}-${selectedCell?.col}`;
        socket.emit("updateCell", {cellId, value: inputValue, playerId});

        setIsSubmitted(true);
        setIsModalOpen(false);
        setInputValue("");
        localStorage.setItem("isSubmitted", JSON.stringify(true));
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
            <div className="grid">{generateGrid()}</div>
            {isModalOpen && <div className="modal-backdrop"/>}
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
