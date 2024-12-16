import"./PlayerDetails.css"

interface PlayerDetailsProps {
    playerId: string | null;
    playerCount: number;
}

function PlayerDetails({ playerId, playerCount }: PlayerDetailsProps): JSX.Element {
    return (
        <div className="details">
            <p>Players Online: {playerCount}</p>
            <p>Player Id: {playerId}</p>
        </div>
    );
}

export default PlayerDetails;