import { useState } from "react";
import { StartScreen, PlayScreen } from "./Screens";

function App() {
  const [gameState, setGameState] = useState("start");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  }

  switch (gameState) {
    case "start":
      return <StartScreen start={() => setGameState("play")} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
    case "play":
      return <PlayScreen end={() => setGameState("start")} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
