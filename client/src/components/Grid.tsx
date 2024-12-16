import React from "react";
import PopupInputField from "./PopupInputField.tsx";
import "./Grid.css";

interface GridProps {
    playerId: string | null;
    playerCount: number;
    cooldown: number;
    gridState: { [key: string]: string };
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleCellClick: (row: number, col: number) => void;
    handleSubmit: () => void;
}

const Grid: React.FC<GridProps> = ({
                                       playerId,
                                       playerCount,
                                       cooldown,
                                       gridState,
                                       inputValue,
                                       setInputValue,
                                       isModalOpen,
                                       setIsModalOpen,
                                       handleCellClick,
                                       handleSubmit,
                                   }) => {
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
        </div>
    );
};

export default Grid;
