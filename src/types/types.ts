export type Difficulty = "easy" | "medium" | "hard";
export type Mode = "timed" | "passage";


export type startDefault = {
    difficulty: Difficulty;
    mode: Mode;
    showOverlay: Boolean;
    setShowOverlay: any;
    onUpdate: any;
}



export type charState = {
    expected: string;
    entered: string | null;
    timeMs: number | null;
}

export type sessionData = {
    accuracy?: number | null;
    wpm?: number | null;
    bestWPM?: number | null;
    time?: number;
    enteredCount?: number;
    correctCount?: number;
    wrongCount?: number;
    runs: number;
    firstTest?: Boolean;
    beatPB?: Boolean;

}