import { Routes, Route } from "react-router-dom";
import App from "./App";        // previous App UI moved to Home
import Results from "./results";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}
