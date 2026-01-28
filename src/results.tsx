import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import tick from "./assets/images/icon-completed.svg";
import redo from "./assets/images/icon-restart.svg";
import type { sessionData } from "./types/types";
import pb from "./assets/images/icon-new-pb.svg";
import star2 from "./assets/images/pattern-star-2.svg";
import star1 from "./assets/images/pattern-star-1.svg";
import confetti from "./assets/images/pattern-confetti.svg";
import "./confetti.css";

const Results = () => {
  const navigate = useNavigate();
  const [metric, setMetric] = useState<sessionData>();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (metric?.beatPB) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2500); // keep visible then exit
      return () => clearTimeout(t);
    }
  }, [metric?.beatPB]);
  useEffect(() => {
    const raw = sessionStorage.getItem("lastMetric");
    if (!raw) return;
    try {
      const parsedData = JSON.parse(raw);
      setMetric(parsedData);
    } catch (err) {
      console.error(err);
    }
  }, [navigate]);
  if (!metric) return;

  return (
    <div>
      <Header wpm={metric.wpm} />
      <section className="flex flex-col items-center text-center mt-10">
        {showConfetti && (
          <div
            className="confetti-full"
            aria-hidden
          >
            <img
              src={confetti}
              alt="confetti"
              className="confetti-drop"
            />
          </div>
        )}

        <div className="flex flex-row">
          <img
            src={metric.beatPB ? "" : star2}
            alt=""
            className="absolute left-10 top-32 w-5"
          />
          <img src={metric.beatPB ? pb : tick} alt="tick" className="w-15" />
        </div>
        <h1 className="my-2 mt-7 text-2xl font-bold">
          {metric.firstTest
            ? "Baseline Established!"
            : metric.beatPB
              ? "High Score Smashed!"
              : "Test Complete!"}
        </h1>
        <p className="text-neutral-400 font-base">
          {metric.firstTest
            ? "You've set the bar. Now the real challenge begins-time to beat it."
            : metric.beatPB
              ? "You're getting faster. That was incredible typing."
              : "Solid run. Keep pushing to beat your high score."}
        </p>
      </section>
      <section className="mt-7 lg:flex lg:flex-row lg:justify-center">
        <div className="rounded-lg border p-5 lg:mt-5 lg:mx-2 lg:w-44 border-gray-500">
          <h2 className="text-neutral-400 font-medium text-xl">WPM:</h2>
          <h3 className="text-neutral-0 font-extrabold text-xl mt-2">
            {metric.wpm}
          </h3>
        </div>
        <div className="rounded-lg border p-5 mt-5 lg:mx-2 lg:w-44 border-gray-500">
          <h2 className="text-neutral-400 font-medium text-xl">Accuracy:</h2>
          <h3 className="text-[#ef4444] font-extrabold text-xl mt-2">
            {metric.accuracy}%
          </h3>
        </div>
        <div className="rounded-lg border p-5 mt-5 lg:mx-2 lg:w-44 border-gray-500">
          <h2 className="text-neutral-400 font-medium text-xl">Characters</h2>
          <div className="flex flex-row">
            <h3 className="text-[#10b981] font-extrabold text-xl mt-2">
              {metric.correctCount}
            </h3>
            <span className="text-neutral-400 font-extrabold text-xl mt-2">
              /
            </span>
            <h3 className="text-[#ef4444] font-extrabold text-xl mt-2">
              {metric.wrongCount}
            </h3>
          </div>
        </div>
      </section>
      <div className="flex flex-row items-center justify-center mt-10">
        <a href="/">
          <button className="flex cursor-pointer p-3 bg-neutral-0 text-black font-bold text-xl rounded-lg">
            {metric.firstTest ? "Beat this Score" : "Go Again"}
            <img src={redo} alt="redo" className="ml-2 mix-blend-difference" />
          </button>
        </a>
        <img
          src={metric.beatPB ? "" : star1}
          alt=""
          className="absolute right-12 bottom-15 w-9"
        />
      </div>
    </div>
  );
};

export default Results;
