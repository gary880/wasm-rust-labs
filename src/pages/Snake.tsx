import { useEffect, useRef, useState } from "react";
// @ts-ignore
import init, { SnakeGame, Direction } from "@snake";

const CELL_SIZE = 20;

const SNAKE_COLOR = "#4CAF50";
const FOOD_COLOR = "#FF5722";
const BG_COLOR = "#000000";

const SnakePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<SnakeGame | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"loading" | "playing" | "game_over">("loading");

  // Timing for game loop
  const lastTickRef = useRef<number>(0);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    let isActive = true;

    const startGame = async () => {
      await init();
      if (!isActive) return;

      const GAME_WIDTH = 20;
      const GAME_HEIGHT = 20;

      const game = SnakeGame.new(GAME_WIDTH, GAME_HEIGHT);
      gameRef.current = game;
      setGameState("playing");

      // Start loop
      lastTickRef.current = performance.now();
      renderLoop(performance.now());
    };

    startGame();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId.current);
      if (gameRef.current) {
        try {
          gameRef.current.free();
        } catch (e) {
          console.error("Error freeing game memory:", e);
        }
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRef.current || gameState !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
          gameRef.current.change_direction(Direction.Up);
          break;
        case "ArrowDown":
          gameRef.current.change_direction(Direction.Down);
          break;
        case "ArrowLeft":
          gameRef.current.change_direction(Direction.Left);
          break;
        case "ArrowRight":
          gameRef.current.change_direction(Direction.Right);
          break;
      }
    };

    const handleRestartKey = (e: KeyboardEvent) => {
      if (gameState === "game_over" && e.key === "Enter") {
        restartGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleRestartKey);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleRestartKey);
    };
  }, [gameState]);

  const renderLoop = (time: number) => {
    const game = gameRef.current;
    if (!game) return;

    if (game.is_game_over()) {
      setGameState("game_over");
      return;
    }

    // Update game logic every 150ms
    const timeSinceLastTick = time - lastTickRef.current;
    if (timeSinceLastTick > 150) {
      game.tick();
      setScore(game.get_score());
      lastTickRef.current = time;
    }

    draw(game);
    animationFrameId.current = requestAnimationFrame(renderLoop);
  };

  const draw = (game: SnakeGame) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Double check game exists to avoid boundary errors
    if (!game) return;

    try {
      const width = game.get_width();
      const height = game.get_height();

      // Clear canvas
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width * CELL_SIZE, height * CELL_SIZE);

      // Draw snake
      const snakeCells = game.get_snake_cells();
      ctx.fillStyle = SNAKE_COLOR;
      // Iterate by 2 (x, y)
      for (let i = 0; i < snakeCells.length; i += 2) {
        const x = snakeCells[i];
        const y = snakeCells[i + 1];
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      // Draw food
      const foodX = game.food_x();
      const foodY = game.food_y();
      ctx.fillStyle = FOOD_COLOR;

      ctx.beginPath();
      ctx.arc(
        foodX * CELL_SIZE + CELL_SIZE / 2,
        foodY * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    } catch (e) {
      // If memory is invalid, stop the loop
      console.warn("Error drawing game:", e);
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const restartGame = () => {
    // Ensure we clean up the old game properly
    if (gameRef.current) {
      try {
        gameRef.current.free();
      } catch (e) {
        console.error("Error freeing during restart", e);
      }
      gameRef.current = null;
    }
    const newGame = SnakeGame.new(20, 20);
    gameRef.current = newGame;
    setScore(0);
    setGameState("playing");
    lastTickRef.current = performance.now();
    renderLoop(performance.now());
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100%",
      background: "#1a1a1a",
      color: "white",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>WASM Snake</h2>

      <div style={{ position: "relative", border: "2px solid #333", borderRadius: "8px", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          width={20 * CELL_SIZE}
          height={20 * CELL_SIZE}
          style={{ display: "block" }}
        />

        {gameState === "game_over" && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <h3 style={{ fontSize: "1.5rem", color: "#ff5252" }}>Game Over</h3>
            <p>Final Score: {score}</p>
            <button
              onClick={restartGame}
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "none",
                background: "#4CAF50",
                color: "white",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Play Again
            </button>
            <p style={{ marginTop: "10px", fontSize: "0.8rem", color: "#ccc" }}>or press Enter</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
        Score: {score}
      </div>
    </div>
  );
};

export default SnakePage;
