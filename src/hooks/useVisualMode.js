
import {useState} from "react";
export default function useVisualMoode(inital) {
  const [mode, setMode] = useState(inital);
  const [history, setHistory] = useState([inital]);
  const transition = (value, replace = false) => {
    setHistory((prev) => {
      const newHistory = [...prev];

      replace ? newHistory[newHistory.length - 1] = value : newHistory.push(value);
      return newHistory;
    });
    setMode(value);
  };
  const back = () => {
    const newHistory = history.length > 1 ? history.slice(0, history.length - 1) : history;
    setHistory(newHistory);
    setMode(newHistory[newHistory.length - 1]);
  };
  return {
    mode,
    transition,
    back
  }
}