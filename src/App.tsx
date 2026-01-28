// import './App.css'
import { useState } from "react";
import { Start } from "./start";
import type { Difficulty, Mode } from "./types/types";
import Header from "./header";

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [mode, setMode] = useState<Mode>("timed");
  const [showOverlay, setShowOverlay] = useState(true);
  const [update, setUpdate] = useState({ accuracy: 0, wpm: 0, time: null });

  const handleUpdate = (newUpdate: any) => {
    setUpdate(newUpdate);
  };

  const formatTime = (sec: number | null | undefined) => {
    const totalSeconds = Math.max(0, Math.round(sec ?? 0));
    const mm = Math.floor(totalSeconds / 60).toString();
    const ss = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <>
      <div>
        <Header wpm={update.wpm} />
        <section className="flex flex-col lg:flex-row lg:justify-around lg:items-center">
          <div className="flex flex-row justify-around items-center text-center">
            <div className="flex flex-col lg:flex-row lg:px-5">
              <h1 className="text-neutral-400 font-medium mr-3">WPM:</h1>
              <h2 className="text-neutral-0 font-extrabold text-xl">
                {update.wpm}
              </h2>
            </div>

            <div className="w-px h-8 bg-neutral-700"></div>

            <div className="flex flex-col lg:flex-row lg:px-5">
              <h1 className="text-neutral-400 font-medium mr-3">Accuracy:</h1>
              <h2 className="text-neutral-0 font-extrabold text-xl">
                {update.accuracy}%
              </h2>
            </div>

            <div className="w-px h-8 bg-neutral-700"></div>

            <div className="flex flex-col lg:flex-row lg:px-5">
              <h1 className="text-neutral-400 font-medium mr-3">Time:</h1>
              <h2 className="text-neutral-0 font-extrabold text-xl">
                {formatTime(update.time ?? 60)}
              </h2>
            </div>
          </div>

          <div className="lg:flex hidden flex-row items-start my-3">
            <h2 className="text-neutral-400 font-medium mr-3">Difficulty:</h2>

            <button
              onClick={() => {
                setDifficulty("easy");
                setShowOverlay(true);
              }}
              className={`border rounded-lg px-3 mr-1 ${difficulty === "easy" ? "text-blue-400" : ""}`}
            >
              Easy
            </button>

            <button
              onClick={() => {
                setDifficulty("medium");
                setShowOverlay(true);
              }}
              className={`border rounded-lg px-3 mr-1 ${difficulty === "medium" ? "text-blue-400" : ""}`}
            >
              Medium
            </button>

            <button
              onClick={() => {
                setDifficulty("hard");
                setShowOverlay(true);
              }}
              className={`border rounded-lg px-3 mr-3 ${difficulty === "hard" ? "text-blue-400" : ""}`}
            >
              Hard
            </button>

            <div className="w-px h-8 bg-neutral-700" />

            <h2 className="text-neutral-400 font-medium mx-3">Mode:</h2>

            <button
              onClick={() => {
                setMode("timed");
                setShowOverlay(true);
              }}
              className={`border rounded-lg px-3 mx-1 ${mode === "timed" ? "text-blue-400" : ""}`}
            >
              Timed(60s)
            </button>

            <button
              onClick={() => {
                setMode("passage");
                setShowOverlay(true);
              }}
              className={`border rounded-lg px-3 mr-1 ${mode === "passage" ? "text-blue-400" : ""}`}
            >
              Passage
            </button>
          </div>

          <div className="flex flex-row justify-around text-center my-3 lg:hidden">
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value as Difficulty);
                setShowOverlay(true);
              }}
              className="border rounded-lg px-10 py-1"
            >
              <option className="radio" value="easy">
                Easy
              </option>
              <hr className="bg-neutral-700" />
              <option className="" value="medium">
                Medium
              </option>
              <hr className="bg-neutral-700" />
              <option className="" value="hard">
                Hard
              </option>
            </select>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as Mode);
                setShowOverlay(true);
              }}
              className="border rounded-lg px-10 py-1"
            >
              <option value="timed">Timed(60s)</option>
              <hr className="bg-neutral-700" />
              <option value="passage">Passage</option>
            </select>
          </div>
        </section>
        <hr className="text-neutral-700" />
        <section className="min-h-full flex flex-col">
          <Start
            difficulty={difficulty}
            mode={mode}
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            onUpdate={handleUpdate}
          />
        </section>
        
      </div>
    </>
  );
}

export default App;
