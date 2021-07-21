import { useState, useRef } from "react";
import styled from "@emotion/styled";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./styles.css";

const renderTime = ({ remainingTime }) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? "down" : ""}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

const Bold = styled.div`
  font-weight: bold;
`;

const draftOrder = [
  {
    team: "VAN",
    round: 1
  },
  {
    team: "NYR",
    round: 1
  },
  {
    team: "NJD",
    round: 1
  },
  {
    team: "NYR",
    round: 1
  },
  {
    team: "NSH",
    round: 1
  },
  {
    team: "VAN",
    round: 2
  },
  {
    team: "NYR",
    round: 2
  },
  {
    team: "NJD",
    round: 2
  },
  {
    team: "NYR",
    round: 2
  },
  {
    team: "NSH",
    round: 2
  },
  {
    team: "VAN",
    round: 3
  },
  {
    team: "NYR",
    round: 3
  },
  {
    team: "NJD",
    round: 3
  },
  {
    team: "NYR",
    round: 3
  },
  {
    team: "NSH",
    round: 3
  }
];

const firstRound = draftOrder.filter((pick) => pick.round === 1);
const secondRound = draftOrder.filter((pick) => pick.round === 2);
const thirdRound = draftOrder.filter((pick) => pick.round === 3);

export default function App() {
  const [draftList, setDraftList] = useState(draftOrder);

  const [currentPick, setCurrentPick] = useState(1);

  const [value, setValue] = useState("");
  const handleChange = (e) => setValue(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedDraft = [...draftOrder];
    updatedDraft[currentPick - 1].selection = value;
    setValue("");
    setDraftList(updatedDraft);
    setCurrentPick(currentPick + 1);
  };

  const [isTimeRunning, setIsTimeRunning] = useState(false);
  const handleStartDraftClick = () => {
    setIsTimeRunning((current) => !current);
  };

  const handleTimerComplete = () => {
    addViolation();
    setCurrentPick(currentPick + 1);
  };

  const addViolation = () => {
    const updatedDraft = [...draftOrder];
    updatedDraft[currentPick - 1].violation = true;
    setValue("");
    setDraftList(updatedDraft);
  };

  return (
    <div className="App">
      <div className="container">
        <div>
          {currentPick < firstRound.length + 1 && (
            <div>
              {draftList.map((pick, i) => (
                <div>
                  {currentPick === i + 1 ? (
                    <Bold>{pick.team}</Bold>
                  ) : (
                    <div className={pick.violation && "violation"}>
                      {pick.team}
                      <span>
                        {pick.selection && <span> - {pick.selection}</span>}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              disabled={!isTimeRunning}
              type="text"
              value={value}
              onChange={handleChange}
            />
          </form>
        </div>
        <div>
          <CountdownCircleTimer
            isPlaying={isTimeRunning}
            duration={5}
            colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
            onComplete={handleTimerComplete}
            key={currentPick}
          >
            {renderTime}
          </CountdownCircleTimer>
          <br />
          <button type="button" onClick={handleStartDraftClick}>
            start draft
          </button>
        </div>
      </div>
    </div>
  );
}
