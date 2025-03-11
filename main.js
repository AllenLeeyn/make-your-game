import * as p from './player.js';
import * as t from './target.js';
import * as u from './ui.js';
import { handleStartMenuKeys, hideStartScreenMenu ,showPauseMenu, hidePauseMenu, handlePauseKeys, showStartScreenMenu } from './showMenu.js';
import { getWordsAndTargets } from './words.js';

// Constants for game states
export const START = 'start';
export const AT_START = 'atStart';
export const INIT = 'initalize';     // Game is in the start state (before gameplay)
export const RUNNING = 'running';     // Game is currently running
export const PAUSED = 'paused';       // Game is paused
export const AT_PAUSED = 'atPaused';       // Game is paused
export const GAME_OVER = 'gameover';  // Game is over
export const COMPLETE = 'complete';   // Game is complete (successfully finished)
export const RESTART = 'restart';   // Game is complete (successfully finished)

export const gameState = {
    timeDuration: 120,
    wordList: [],
    currentQuest: 'questOne',
    currentWordIndex: 0,
    currentTargetIndex: 0,
    targetList: [],
    state: START,
};

//--------------- initialize and start gameLoop ---------------//
export function main() {
    requestAnimationFrame(gameLoop);
}

async function initGame() {

    [gameState.wordList, gameState.targetList] = await getWordsAndTargets(gameState.currentQuest);

    // initalize game 
    p.initPlayer();
    t.initTargets();
    u.initTimer(gameState.timeDuration);
    u.updateWordDisplay();
    u.updateScoreDisplay();
    u.updateBulletDisplay(p.player.bullets);
    
    gameState.state = RUNNING;
}

//--------------- game logic ---------------//
function gameLoop(timestamp) {
    if (gameState.state === START) {
        showStartScreenMenu();

    } else if (gameState.state === INIT || gameState.state === RESTART){
        initGame();

    } else if (gameState.state === RUNNING){
        hideStartScreenMenu();
        u.hideGameComplete();
        u.hideGameOver();
        hidePauseMenu();
        p.updatePlayerPosition(); // Update player position
        t.moveTargets();           // Update target positions
        renderFps(timestamp);

    } else if (gameState.state === PAUSED) {
        showPauseMenu();

    }else if (gameState.state === GAME_OVER) {
        u.showGameOver();

    }else if (gameState.state === COMPLETE) {
        u.showGameComplete();
    }
    requestAnimationFrame(gameLoop); // Keep the game loop running
}

//--------------- FPS counter ---------------//
// Create an SVG element to show FPS
const fpsDisplay = document.getElementById("fps-display");

let frameCount = 0;
let lastFPSTime = 0;
let currentFPS;

async function renderFps(timestamp) {
    frameCount++; // Increment the frame count

    // Calculate FPS every second (1000ms) 
    const elapsedSinceLastFPS = timestamp - lastFPSTime;
    if (elapsedSinceLastFPS >= 1000) {
        currentFPS = frameCount; // Set FPS to the number of frames in the last second
        frameCount = 0; // Reset frame count for the next second
        lastFPSTime = timestamp; // Reset the last FPS time
    }

    fpsDisplay.textContent = `FPS: ${currentFPS}`;
}

//--------------- player input ---------------//
// Handle keydown events
function handleKeyDown(event) {
    if (gameState.state === AT_START) {
        handleStartMenuKeys(event);

    } else if (gameState.state === RUNNING) {
        handleGameKeys(event);

    } else if (gameState.state === AT_PAUSED) {
        handlePauseKeys(event);

    } else if (gameState.state === GAME_OVER || gameState.state === COMPLETE) {
        if (event.key === ' ') gameState.state = RESTART;
    }
}


// Handle keyup events
function handleKeyUp(event) {
    if (event.key in p.keysPressed) {
      p.keysPressed[event.key] = false;
    }
}

function handleGameKeys(event) {
    if (event.key === ' ') t.shoot(p);
    if (event.key === 'Escape') gameState.state = PAUSED;
    if (event.key in p.keysPressed) p.keysPressed[event.key] = true;
}

// Add event listeners for keydown and keyup
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
