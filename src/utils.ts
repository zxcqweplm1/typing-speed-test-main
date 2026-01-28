import type { sessionData } from "./types/types";

export const readSession = (): sessionData => {
  try {
    const raw = sessionStorage.getItem("lastMetric");
    if (!raw) {
      return {
        bestWPM: null,
        runs: 0,
        firstTest: false,
        beatPB: false,
      };
    }
    return JSON.parse(raw) as sessionData;
  } catch {
    return {
      bestWPM: null,
      runs: 0,
      firstTest: false,
      beatPB: false,
    };
  }
};


export const writeSession = (data: sessionData)  => {
    sessionStorage.setItem("lastMetric", JSON.stringify(data))
}