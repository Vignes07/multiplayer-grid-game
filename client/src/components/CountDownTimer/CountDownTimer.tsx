import "./CountDownTimer.css"

interface CountDownTimerProps {
    cooldown: number;
}

function CountDownTimer({cooldown}) {
    return (
        <div className="countdown">
            {cooldown ? <div className="countdown-number">{cooldown}</div> : ""}
        </div>
    );
}

export default CountDownTimer;