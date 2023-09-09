import { useMachine } from "@xstate/react";
import { trafficLightsMachine } from "./machines/MyMachine";

import "./App.css";

function App() {
  const [state, send] = useMachine(trafficLightsMachine);

  const redClass =
    state.matches("playingState.redLight") ||
    state.context.prevActiveTab === "RED.INTIAL" ||
    state.context.prevActiveTab === "RED.FINAL"
      ? "light red-large"
      : "light red-small";

  const greenClass =
    state.matches("playingState.greenLight") ||
    state.context.prevActiveTab === "GREEN"
      ? "light green-on"
      : "light green-off";

  const yellowClass =
    state.matches("playingState.yellowLight") ||
    state.context.prevActiveTab === "YELLOW"
      ? "light yellow-on"
      : "light yellow-off";

  const emojiClass =
    state.matches("playingState.redLight.finalState") ||
    state.context.prevActiveTab === "RED.FINAL"
      ? "emoji blink-image"
      : "emoji";

  return (
    <div className="main-div">
      <div className="traffic-div">
        <div className="traffic-lights">
          <div className={redClass}></div>
          <div className={yellowClass}></div>
          <div className={greenClass}></div>
        </div>
        <div className="signal-board">
          <div className={emojiClass}>
            {(state.context.prevActiveTab === "RED.INTIAL" &&
              state.matches("playingState.paused")) ||
            state.matches("playingState.redLight.intialState") ? (
              <span role="img" aria-label="Walk">
                🚶
              </span>
            ) : (
              <span role="img" aria-label="Wait">
                ✋
              </span>
            )}
          </div>
          <p className="timer">
            {state.matches("playingState.redLight") ||
            (state.matches("playingState.paused") &&
              (state.context.prevActiveTab === "RED.FINAL" ||
                state.context.prevActiveTab === "RED.INTIAL"))
              ? state.context.trafficTimer
              : null}
          </p>
        </div>
      </div>
      <div className="buttons">
        <button className="btn" onClick={() => send({ type: "moveBackward" })}>
          <span role="img" aria-label="Previous">
            ⏪
          </span>
        </button>
        {state.context.isPaused ? (
          <button
            className="btn"
            onClick={() => {
              send({ type: "Resume" });
            }}
          >
            <span role="img" aria-label="Play">
              ▶️
            </span>
          </button>
        ) : (
          <button
            className="btn"
            onClick={() => {
              send({ type: "pause", activeState: state.value });
            }}
          >
            <span role="img" aria-label="Pause">
              ⏸
            </span>
          </button>
        )}

        <button className="btn" onClick={() => send({ type: "moveForward" })}>
          <span role="img" aria-label="Next">
            ⏩
          </span>
        </button>
      </div>
    </div>
  );
}

export default App;
