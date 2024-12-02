import React, { useState, useEffect, useCallback } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

const SnakeGame = () => {
    const GRID_SIZE = 20;
    const CELL_SIZE = 20;
    const INITIAL_SPEED = 150;

    const [snake, setSnake] = useState([
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState("RIGHT");
    const [isStarted, setIsStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const generateFood = useCallback(() => {
        const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        setFood(newFood);
    }, []);

    const resetGame = () => {
        setSnake([
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ]);
        setDirection("RIGHT");
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
        generateFood();
    };

    const moveSnake = useCallback(() => {
        if (gameOver || isPaused) return;

        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        switch (direction) {
            case "UP":
                head.y -= 1;
                break;
            case "DOWN":
                head.y += 1;
                break;
            case "LEFT":
                head.x -= 1;
                break;
            case "RIGHT":
                head.x += 1;
                break;
            default:
                break;
        }

        if (
            head.x < 0 ||
            head.x >= GRID_SIZE ||
            head.y < 0 ||
            head.y >= GRID_SIZE ||
            snake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
            setGameOver(true);
            return;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            setScore((prev) => prev + 1);
            generateFood();
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    }, [snake, direction, food, gameOver, isPaused, generateFood]);

    useEffect(() => {
        const handleKeyPress = (e: any) => {
            switch (e.key) {
                case "ArrowUp":
                    if (direction !== "DOWN") setDirection("UP");
                    break;
                case "ArrowDown":
                    if (direction !== "UP") setDirection("DOWN");
                    break;
                case "ArrowLeft":
                    if (direction !== "RIGHT") setDirection("LEFT");
                    break;
                case "ArrowRight":
                    if (direction !== "LEFT") setDirection("RIGHT");
                    break;
                case " ":
                    setIsPaused((prev) => !prev);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [direction]);

    useEffect(() => {
        const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
        return () => clearInterval(gameLoop);
    }, [moveSnake]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            {!isStarted ? (
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Snake Game</h1>
                    <button
                        onClick={() => setIsStarted(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Play Game
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-2xl font-bold text-white">Score: {score}</div>
                    <div
                        className="relative bg-gray-800 rounded-lg overflow-hidden"
                        style={{
                            width: GRID_SIZE * CELL_SIZE,
                            height: GRID_SIZE * CELL_SIZE
                        }}
                    >
                        {snake.map((segment, index) => (
                            <div
                                key={index}
                                className="absolute bg-green-500 rounded-sm transition-all duration-150"
                                style={{
                                    width: CELL_SIZE - 2,
                                    height: CELL_SIZE - 2,
                                    left: segment.x * CELL_SIZE,
                                    top: segment.y * CELL_SIZE
                                }}
                            />
                        ))}
                        <div
                            className="absolute bg-red-500 rounded-full transition-all duration-150"
                            style={{
                                width: CELL_SIZE - 2,
                                height: CELL_SIZE - 2,
                                left: food.x * CELL_SIZE,
                                top: food.y * CELL_SIZE
                            }}
                        />
                        {gameOver && (
                            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
                                    {/* Nút Play Again */}
                                    <div className="flex gap-4">
                                        {/* Nút Play Again */}
                                        <button
                                            onClick={resetGame} // Chơi lại ngay
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                        >
                                            Play Again
                                        </button>

                                        {/* Nút Back to Start */}
                                        <button
                                            onClick={() => {
                                                setIsStarted(false); // Quay lại màn hình bắt đầu
                                                resetGame();
                                            }}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                        >
                                            Back to Start
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {isPaused ? <FaPlay /> : <FaPause />}
                        </button>
                        <button
                            onClick={resetGame}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            <FaRedo />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SnakeGame;