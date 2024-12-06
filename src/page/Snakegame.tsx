import React, { useState, useEffect, useCallback } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import "./SnakeGame.css";

const SnakeGame = () => {

    const topplayer = [
        {
            name: "Player1",
            point: "100000",
        },
        {
            name: "Player1",
            point: "100000",
        },
        {
            name: "Player1",
            point: "100000",
        },
        {
            name: "Player1",
            point: "100000",
        },
        {
            name: "Player1",
            point: "100000",
        },

    ]

    const GRID_SIZE = 35;
    const CELL_SIZE = 25;
    const INITIAL_SPEED = 150;

    const [snake, setSnake] = useState([
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
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
            y: Math.floor(Math.random() * GRID_SIZE),
        };
        setFood(newFood);
    }, []);

    const resetGame = () => {
        setSnake([
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
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
                    e.preventDefault();
                    break;
                case "ArrowDown":
                    if (direction !== "UP") setDirection("DOWN");
                    e.preventDefault();
                    break;
                case "ArrowLeft":
                    if (direction !== "RIGHT") setDirection("LEFT");
                    e.preventDefault();
                    break;
                case "ArrowRight":
                    if (direction !== "LEFT") setDirection("RIGHT");
                    e.preventDefault();
                    break;
                case " ":
                    setIsPaused((prev) => !prev);
                    e.preventDefault();
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
        <>
            <div className="header">
                <div className="text">
                    <h2>Snaker IO</h2>
                </div>
            </div>

            <div className="snake-body">
                <div className="snake-container">
                    {!isStarted ? (
                        <div className="start-screen">
                            <h1 className="game-title">Snake Game</h1>
                            <div>
                                <button className="start-button" onClick={() => setIsStarted(true)}>
                                    Play Game
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="score-display">Score: {score}</div>
                            <div
                                className="game-grid"
                                style={{
                                    width: GRID_SIZE * CELL_SIZE,
                                    height: GRID_SIZE * CELL_SIZE,
                                }}
                            >
                                {snake.map((segment, index) => (
                                    <div
                                        key={index}
                                        className="snake-segment"
                                        style={{
                                            width: CELL_SIZE - 2,
                                            height: CELL_SIZE - 2,
                                            left: segment.x * CELL_SIZE,
                                            top: segment.y * CELL_SIZE,
                                        }}
                                    />
                                ))}
                                <div
                                    className="food"
                                    style={{
                                        width: CELL_SIZE - 2,
                                        height: CELL_SIZE - 2,
                                        left: food.x * CELL_SIZE,
                                        top: food.y * CELL_SIZE,
                                    }}
                                />
                                {gameOver && (
                                    <div className="game-over-screen">
                                        <div>
                                            <h2 className="game-over-text">Game Over!</h2>
                                            <div className="action-buttons">
                                                <button className="play-again-button" onClick={resetGame}>
                                                    Play Again
                                                </button>
                                                <button
                                                    className="back-to-start-button"
                                                    onClick={() => {
                                                        setIsStarted(false);
                                                        resetGame();
                                                    }}
                                                >
                                                    Back to Start
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="controls">
                                <button
                                    className="control-button"
                                    onClick={() => setIsPaused(!isPaused)}
                                >
                                    {isPaused ? <FaPlay /> : <FaPause />}
                                </button>
                                <button className="control-button" onClick={resetGame}>
                                    <FaRedo />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="top-sidebar">
                    <div className="item-content-1">
                        <h3>Top Players</h3>
                        {topplayer.map((player, index) => (
                            <div className="top-player" key={index}>
                                <span>{index + 1}. {player.name}</span>
                                <span>{player.point} pts</span>
                            </div>
                        ))}
                    </div>

                    <div className="item-content-2">
                        <h2>Developer Info</h2>
                        <p>Team: Snake Devs</p>
                        <p>Email: devs@snakegame.com</p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default SnakeGame;
