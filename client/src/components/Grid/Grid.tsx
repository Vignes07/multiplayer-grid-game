import React from "react";
import PopupModal from "../PopupModal/PopupModal.tsx";
import "./Grid.css";
import {Toaster} from "react-hot-toast";

interface GridProps {
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
            <h2 className="game-title">MULTIPLAYER GRID GAME</h2>
            <div className="grid">{generateGrid()}</div>
            {isModalOpen && <div className="modal-backdrop" />}
            <PopupModal
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
