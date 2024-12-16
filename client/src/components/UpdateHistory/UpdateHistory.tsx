import "./UpdateHistory.css"

interface GridStateProps {
    gridState: { [key: string]: string };
}

function UpdateHistory({ gridState }: GridStateProps) {
    return (
        <div className="update-history">
            {Object.entries(gridState).map(([key, value], i) => (
                <div key={i}>
                    Grid: {key} Value: {value}
                </div>
            ))}
        </div>
    );
}

export default UpdateHistory;
