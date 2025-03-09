import * as p from './player.js';
import * as t from './target.js';
import * as u from './ui.js';
import { getWordsAndTargets } from './words.js';

// Constants for game states
export const AT_START = 'atStart';    // Game is in the start state (before gameplay)
export const RUNNING = 'running';     // Game is currently running
export const PAUSED = 'paused';       // Game is paused
export const GAME_OVER = 'gameover';  // Game is over
export const COMPLETE = 'complete';   // Game is complete (successfully finished)

export const gameState = {
    timeDuration: 120,
    wordList: [],
    currentQuest: 'questOne',
    currentWordIndex: 0,
    currentTargetIndex: 0,
    targetList: [],
    state: AT_START,
};

//--------------- initialize and start gameLoop ---------------//
export function main() {
    // show main menu

    initGame();
}

async function initGame() {
    // prepare game parameters and data
    [gameState.wordList, gameState.targetList] = await getWordsAndTargets(gameState.currentQuest);

    //create all targets and bullet holes
    t.createTargets();

    // initalize game 
    p.initPlayer();
    t.initTargets();
    u.initTimer(gameState.timeDuration);
    u.showNextWord();
    
    gameState.state = RUNNING;
    requestAnimationFrame(gameLoop);
}

//--------------- game logic ---------------//
function gameLoop(timestamp) {
    if (gameState.state === RUNNING){
        p.updatePlayerPosition(); // Update player position
        t.moveTargets();           // Update target positions
        t.addTargets();
        renderFps(timestamp);
        requestAnimationFrame(gameLoop); // Keep the game loop running
    } 
    if (gameState.state === GAME_OVER) {
        console.log(GAME_OVER);
        // show gameover menu
    }
    if (gameState.state === COMPLETE) {
        console.log(COMPLETE)
    }
}

//--------------- FPS counter ---------------//
// Create an SVG element to show FPS
const fpsDisplay = document.getElementById("fps-display");

let frameCount = 0;
let lastFPSTime = 0;
let currentFPS = 0;

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
    if (event.key in p.keysPressed) {
      p.keysPressed[event.key] = true; // Mark the key as pressed
    }
    if (event.key === ' ' && gameState.state === RUNNING) {
        t.checkTargetHit(p)
        u.shoot();
    };
    if (event.key === 'Escape') {
        if (gameState.state === RUNNING) {
            gameState.state = PAUSED;
        } else if (gameState.state === PAUSED) {
            gameState.state = RUNNING;
            requestAnimationFrame(gameLoop);
        };
        if (gameState.state === GAME_OVER) {
            initGame();
        };
        console.log(gameState.state)
    }
}

// Handle keyup events
function handleKeyUp(event) {
    if (event.key in p.keysPressed) {
      p.keysPressed[event.key] = false; // Mark the key as released
    }
}

//--------------- Pause Menu ------------------//

function pauseGameLoop() {
    isGamePaused = true;
    m.showPauseMenu(); 
}
export function resumeGameLoop() {
    isGamePaused = false;
    m.hidePauseMenu();
}

export function restartGameLoop() {
    isGamePaused = false;
    m.hidePauseMenu();
    
    // Logic to restart the game (e.g., reset player position, targets, timer)
    p.initPlayer();
    t.initTargets();
    u.initTimer(timeDuration);

    p.initPlayer();
    t.initTargets();
    u.initTimer(timeDuration);

    generateWordList('questOne').then((wordList) => {
        displayWordsSequentially(wordList);
        collectMissingLetters(wordList).then((missingLetters) => {
            t.setValidAnswers(missingLetters);
        });
    });
}

// Add event listeners for keydown and keyup
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
