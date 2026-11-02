import { useState } from "react";
import * as CONSTANTS from "../constants/constants"

export function ClockWindow(
    {setShowClockWindow,
    Add
    }
) {
    const [clockDelayInput, setClockDelayInput] = useState("");

    function confirmClock() {
        if (clockDelayInput === "") { //empty or alphabet string is sent as empty due to type="number" in input tag below
            alert("Enter a valid number");
            return;
        }
        const delay = Number(clockDelayInput);

        if (delay < CONSTANTS.MIN_FRAME_TIME) {
            alert(`Delay entered less than ${CONSTANTS.MIN_FRAME_TIME}`);
            return;
        }
        setShowClockWindow(false);
        setClockDelayInput("");

        Add("CLOCK", null, null, delay);
    }
    return (
        <div className="clock-window-overlay">
            <div className="clock-window">

                <div className="clock-window-title">Add Clock</div>
                <div className="clock-window-content">

                    <label>Clock Delay</label>

                    <div className="clock-input-row">
                        <input
                            type="number"
                            min={CONSTANTS.MIN_FRAME_TIME}
                            value={clockDelayInput}
                            autoFocus
                            onChange={(e) => setClockDelayInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") confirmClock();
                                if (e.key === "Escape") {
                                    setShowClockWindow(false);
                                    setClockDelayInput("");
                                }
                            }}
                        />

                        <span>ms</span>
                    </div>

                    <div className="clock-minimum">Minimum: {CONSTANTS.MIN_FRAME_TIME} ms </div>
                </div>

                <div className="clock-window-buttons">

                    <button
                        onClick={() => {
                            setShowClockWindow(false);
                            setClockDelayInput("");
                        }}
                    >
                        Cancel
                    </button>

                    <button onClick={confirmClock}>
                        Add Clock
                    </button>

                </div>

            </div>
        </div>
    )
}