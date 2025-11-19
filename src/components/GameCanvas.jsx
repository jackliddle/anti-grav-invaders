import { useEffect, useRef, useState } from 'react';
import { GameState } from '../game/GameState';
import Overlay from './UI/Overlay';

const GameCanvas = () => {
    const canvasRef = useRef(null);
    const gameStateRef = useRef(null);
    const requestRef = useRef(null);

    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const handleRestart = () => {
        if (gameStateRef.current) {
            gameStateRef.current.restart();
            setScore(0);
            setLives(3);
            setGameOver(false);
        }
    };

    const handleStart = () => {
        setGameStarted(true);
        if (gameStateRef.current && gameStateRef.current.audio.ctx.state === 'suspended') {
            gameStateRef.current.audio.ctx.resume();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 800;
        canvas.height = 600;

        // Initialize game state
        gameStateRef.current = new GameState(canvas.width, canvas.height);

        // Bind callbacks
        gameStateRef.current.onScoreUpdate = (newScore) => setScore(newScore);
        gameStateRef.current.onGameOver = () => setGameOver(true);
        gameStateRef.current.onLivesUpdate = (newLives) => setLives(newLives);

        const animate = (time) => {
            if (!gameStateRef.current) return;

            // Update game state
            if (gameStarted) {
                gameStateRef.current.update(time);
            }

            // Clear canvas
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw game state
            gameStateRef.current.draw(ctx);

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        // Input handling
        const handleKeyDown = (e) => {
            gameStateRef.current?.handleInput(e.key, true);

            if (e.key === 'Enter' && !gameStarted) {
                handleStart();
            }
        };
        const handleKeyUp = (e) => gameStateRef.current?.handleInput(e.key, false);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameStarted]);

    return (
        <div style={{ position: 'relative', width: 800, height: 600 }}>
            <canvas ref={canvasRef} />
            <Overlay
                score={score}
                lives={lives}
                gameOver={gameOver}
                gameStarted={gameStarted}
                onRestart={handleRestart}
                onStart={handleStart}
            />
        </div>
    );
};

export default GameCanvas;
