import { useEffect, useRef, useState } from "react";
import data from "./data.json";
import type { charState, startDefault } from "./types/types";
import { useNavigate } from "react-router-dom";
import { readSession, writeSession } from "./utils";

export const Start = ({
  difficulty,
  mode,
  showOverlay,
  setShowOverlay,
  onUpdate,
}: startDefault) => {
  const [passage, setPassage] = useState<string>("");
  const [chars, setChars] = useState<charState[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const list = data[difficulty];
    if (!Array.isArray(list) || list.length === 0) {
      setPassage("");
      return;
    }
    const idx = Math.floor(Math.random() * list.length);
    setPassage(list[idx]?.text ?? "");
  }, [difficulty]);

  useEffect(() => {
    setChars(
      passage
        .split("")
        .map((ch) => ({ expected: ch, entered: null, timeMs: null })),
    );
    setTimeLeft(60);
    setRunning(false);
    setStartTime(null);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [passage, mode]);

  const getCurrentIndex = () => chars.findIndex((c) => c.entered === null);

  const computeMetrics = (nowMs: number = Date.now()) => {
    const enteredCount = chars.filter((c) => c.entered !== null).length;
    const correctCount = chars.filter((c) => c.entered === c.expected).length;
    const accuracy = enteredCount > 0 ? correctCount / enteredCount : 0;
    const elapsedMs = startTime ? nowMs - startTime : 0;
    const elapsedMinutes = Math.max(elapsedMs / 60000, 1 / 60000);
    const wordsTyped = correctCount / 5;
    const wpm = Math.floor(wordsTyped / elapsedMinutes);
    return {
      accuracy: Number((accuracy * 100).toFixed(2)),
      wpm: Math.max(0, wpm),
      time: Math.round(timeLeft),
      enteredCount,
      correctCount,
      wrongCount: enteredCount - correctCount,
    };
  };

  const onTestComplete = (final: any) => {
    const sessionOld = readSession();
    sessionStorage.setItem("bestWpm", String(final.wpm));
    console.log(sessionOld.bestWPM);

    const wasPB = sessionOld.bestWPM == null || final.wpm > sessionOld.bestWPM;

    const newData = {
      accuracy: final.accuracy,
      wpm: final.wpm,
      time: final.time,
      bestWPM: final.wpm,
      enteredCount: final.enteredCount,
      correctCount: final.correctCount,
      wrongCount: final.wrongCount,
      runs: sessionOld.runs + 1,
      firstTest: sessionOld.runs === 0,
      beatPB: wasPB,
    };
    writeSession(newData);
  };

  const handleStart = () => {
    setShowOverlay(false);
    if (!startTime) {
      const now = Date.now();
      setStartTime(now);
      setRunning(true);
      setTimeLeft(60);

      if (mode === "timed") {
        const startMs = now;
        timerRef.current = window.setInterval(() => {
          const remainingMs = Math.max(0, startMs + 60000 - Date.now());
          setTimeLeft(Math.max(0, Math.floor(remainingMs / 1000)));
          if (remainingMs <= 0 && timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
            setRunning(false);
          }
        }, 250);
      }
    }
    setTimeout(() => containerRef.current?.focus(), 0);
  };

  const resetTest = () => {
  // stop timer
  if (timerRef.current) {
    window.clearInterval(timerRef.current);
    timerRef.current = null;
  }

  // reset state
  setShowOverlay(true);
  setStartTime(null);
  setRunning(false);
  setTimeLeft(60);
  setChars(
    passage
      .split("")
      .map((ch) => ({ expected: ch, entered: null, timeMs: null })),
  );

  // ensure overlay is visible and focus is cleared
  containerRef.current?.blur?.();
};


  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const metrics = computeMetrics();
      onUpdate({
        accuracy: metrics.accuracy,
        wpm: metrics.wpm,
        time: metrics.time,
      });
    }, 250);
    return () => clearInterval(interval);
  }, [running, chars, startTime, timeLeft, mode]);

  useEffect(() => {
    const isPrintable = (e: KeyboardEvent) =>
      e.key.length === 1 || e.key === " ";
    const handler = (e: KeyboardEvent) => {
      if (showOverlay) {
        if (isPrintable(e)) {
          handleStart();
          e.preventDefault();
        }
        return;
      }
      if (e.key === " ") e.preventDefault();
      if (!isPrintable(e)) return;

      const currentIndex = getCurrentIndex();
      if (currentIndex === -1) return;
      setChars((prev) => {
        const next = [...prev];
        const now = Date.now();
        next[currentIndex] = {
          ...next[currentIndex],
          entered: e.key,
          timeMs: now,
        };
        return next;
      });

      setTimeout(() => {
        const metrics = computeMetrics();
        onUpdate({
          accuracy: metrics.accuracy,
          wpm: metrics.wpm,
          time: metrics.time,
        });
      }, 0);

      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    };

    window.addEventListener("keydown", handler, { passive: false });
    return () => window.removeEventListener("keydown", handler);
  }, [showOverlay, passage, chars, startTime, timeLeft, mode]);

  useEffect(() => {
    if (!running || chars.length === 0) return;
    const enteredCount = chars.filter((c) => c.entered !== null).length;
    const finishedByTyping = enteredCount === chars.length;
    const finishedByTime = mode === "timed" && timeLeft === 0;

    if (finishedByTime || finishedByTyping) {
      setRunning(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const final = computeMetrics(Date.now());

      try {
        onTestComplete(final);
      } catch (e) {}
      navigate("/results");
    }
  }, [running, chars, timeLeft, mode, navigate]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    },
    [],
  );

  return (
    <div className="relative w-full">
      <div className="text-3xl mt-8 leading-10 tracking-wider overflow-y-auto">
        <div>
          {chars.map((char, i) => {
            const currentIndex = getCurrentIndex();
            const className =
              i < currentIndex
                ? char.entered === char.expected
                  ? "correct"
                  : "incorrect"
                : i === currentIndex
                  ? "current"
                  : "untyped";
            return (
              <span key={i} className={className}>
                {char.expected}
              </span>
            );
          })}
            <hr className="text-neutral-700 mt-10" />
          <div className="w-full flex justify-center mt-6">
            <button
              className={`bg-neutral-500 font-bold text-lg w-44 rounded-lg py-2 cursor-pointer ${showOverlay ? "hidden" : "block"}`}
              onClick={resetTest}
            >
              Restart Test
            </button>
          <div ref={containerRef} />
          </div>
        </div>
      </div>

<div
  className={`absolute inset-0 flex flex-col items-center justify-center ${showOverlay ? "" : "pointer-events-none opacity-0"}`}
  style={{ zIndex: showOverlay ? 50 : 0 }}
  aria-hidden={!showOverlay}
>
  {showOverlay && (
    <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-sm" />
  )}

  <div className="relative z-20 text-center">
    <button onClick={handleStart} className="bg-blue-500 font-bold text-lg w-44 rounded-lg py-2 cursor-pointer">
      Start Typing Test
    </button>
    <div className="font-semibold mt-3">Or click the text and start typing</div>
  </div>
</div>

    </div>
  );
};

export default Start;
