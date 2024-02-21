import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start, darkMode, toggleDarkMode }) {
  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`text-center p-10 rounded-2xl m-20 h-60vh shadow-2xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-pink-100 text-pink-500"
        }`}
      >
        <h1 className={`text-4xl font-bold mb-14`}>Memory</h1>

        <h2
          className={`font-bold mb-20`}
          style={{
            width: "250px",
          }}
        >
          Flip over tiles looking for pairs
        </h2>

        <button
          onClick={start}
          className={`p-2 px-20 md:px-30 rounded-full text-2xl font-bold ${
            darkMode ? "bg-gray-700 text-white" : "bg-pink-500 text-white"
          }`}
        >
          Play
        </button>
        <button
          onClick={toggleDarkMode}
          className="absolute text-gray top-5 right-5 p-2"
        >
          {darkMode ? "LightMode" : "DarkMode"}
        </button>
      </div>
    </div>
  );
}

export function PlayScreen({ end, darkMode, toggleDarkMode }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <div
        className={`flex flex-col justify-center items-center min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <div
          className={`absolute top-28 left-0 w-full flex justify-center mt-10 md:mt-20 ${
            darkMode ? "text-white" : "text-purple-600"
          }`}
        >
          <div
            className={`font-bold ${
              darkMode ? "text-white" : "text-purple-600"
            }`}
          >
            Tries
            <span
              className={`bg-blue-200 mx-2 p-1 px-3.5 rounded-xl ${
                darkMode ? "text-white bg-purple-800" : "text-purple-600"
              }`}
            >
              {tryCount}
            </span>
          </div>
        </div>

        <div
          className={`w-80 h-80 p-2 relative rounded-xl shadow-xl mt-10 md:mt-20 ${
            darkMode ? "bg-gray-800" : "bg-purple-200"
          }`}
        >
          <div className="grid grid-cols-4 justify-center items-center gap-4 h-full">
            {getTiles(16).map((tile, i) => (
              <div
                key={i}
                className="w-full h-full flex justify-center items-center"
              >
                <Tile flip={() => flip(i)} {...tile} />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={toggleDarkMode}
          className="absolute text-gray top-5 right-5 p-2"
        >
          {darkMode ? "LightMode" : "DarkMode"}
        </button>
      </div>
    </>
  );
}
