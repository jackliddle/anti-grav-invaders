import React from 'react';

const Overlay = ({ score, lives, gameOver, gameStarted, onRestart, onStart }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div className="hud" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <h2 className="glow-text" style={{ margin: 0, color: '#00f3ff' }}>SCORE: {score}</h2>
                <h2 className="glow-text" style={{ margin: 0, color: '#ff00ff' }}>LIVES: {lives}</h2>
            </div>

            {/* Title Screen */}
            {!gameStarted && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '40px',
                    border: '2px solid #00f3ff',
                    borderRadius: '10px',
                    boxShadow: '0 0 20px #00f3ff',
                    pointerEvents: 'auto'
                }}>
                    <h1 className="glow-text" style={{
                        fontSize: '48px',
                        marginBottom: '20px',
                        color: '#00f3ff',
                        textTransform: 'uppercase'
                    }}>
                        Anti-Grav Invaders
                    </h1>
                    <div style={{ marginBottom: '30px', color: '#aaa', fontSize: '18px' }}>
                        <p style={{ margin: '10px 0' }}>Arrow Keys to Move</p>
                        <p style={{ margin: '10px 0' }}>Space to Shoot</p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        margin: '0 auto 30px auto',
                        width: 'fit-content'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ffff00',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                color: '#000', fontWeight: 'bold', marginRight: '15px',
                                boxShadow: '0 0 10px #ffff00', fontSize: '16px'
                            }}>S</div>
                            <span style={{ color: '#fff', fontSize: '16px', textShadow: '0 0 5px #ffff00' }}>Spread Shot</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#00ffff',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                color: '#000', fontWeight: 'bold', marginRight: '15px',
                                boxShadow: '0 0 10px #00ffff', fontSize: '16px'
                            }}>F</div>
                            <span style={{ color: '#fff', fontSize: '16px', textShadow: '0 0 5px #00ffff' }}>Time Freeze</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ff0000',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                color: '#000', fontWeight: 'bold', marginRight: '15px',
                                boxShadow: '0 0 10px #ff0000', fontSize: '16px'
                            }}>R</div>
                            <span style={{ color: '#fff', fontSize: '16px', textShadow: '0 0 5px #ff0000' }}>Rapid Fire</span>
                        </div>
                    </div>
                    <button
                        onClick={onStart}
                        style={{
                            padding: '15px 30px',
                            fontSize: '24px',
                            backgroundColor: 'transparent',
                            color: '#00ff00',
                            border: '2px solid #00ff00',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            textTransform: 'uppercase',
                            boxShadow: '0 0 10px #00ff00'
                        }}
                    >
                        Start Game
                    </button>
                </div>
            )}

            {/* Game Over Screen */}
            {gameOver && gameStarted && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '40px',
                    border: '2px solid #ff00ff',
                    borderRadius: '10px',
                    boxShadow: '0 0 20px #ff00ff',
                    pointerEvents: 'auto'
                }}>
                    <h1 className="glow-text" style={{ fontSize: '48px', marginBottom: '20px', color: '#ff00ff' }}>GAME OVER</h1>
                    <h2 style={{ marginBottom: '30px' }}>Final Score: {score}</h2>
                    <button
                        onClick={onRestart}
                        style={{
                            padding: '10px 20px',
                            fontSize: '20px',
                            backgroundColor: 'transparent',
                            color: '#00f3ff',
                            border: '2px solid #00f3ff',
                            cursor: 'pointer',
                            fontFamily: 'inherit'
                        }}
                    >
                        RESTART
                    </button>
                </div>
            )}
        </div>
    );
};

export default Overlay;
