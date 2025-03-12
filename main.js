import * as p from './player.js';
import * as tgt from './target.js';
import * as ui from './ui.js';
import * as input from './input.js';
import * as menu from './showMenu.js'
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

export const GAME = {
    height: 600,
    width: 800,
    currentQuest: 'questOne',
    state: START,
    timeDuration: 60,
    wordList: [],
    currentWordIndex: 0,
    targetList: [],
    targets: [],
    currentTargetIndex: 0,
    pauseSelection: 0,
};

//--------------- start gameLoop ---------------//
export function main() {
    gameLoop();
}

//--------------- game logic ---------------//
function gameLoop(timestamp) {
    if (GAME.state === START) {
        menu.hidePauseMenu();
        menu.showStartScreenMenu();

    } else if (GAME.state === INIT || GAME.state === RESTART){
        initGame();

    } else if (GAME.state === RUNNING){
        menu.hideStartScreenMenu();
        menu.hideGameComplete();
        menu.hideGameOver();
        menu.hidePauseMenu();
        p.updatePlayerPosition();
        tgt.moveTargets();

    } else if (GAME.state === PAUSED) {
        menu.showPauseMenu();

    }else if (GAME.state === GAME_OVER) {
        menu.showGameOver();

    }else if (GAME.state === COMPLETE) {
        menu.showGameComplete();
    }
    renderFps(timestamp);
    requestAnimationFrame(gameLoop);
}

// initalize game 
async function initGame() {

    [GAME.wordList, GAME.targetList] = await getWordsAndTargets(GAME.currentQuest);
    p.initPlayer();
    tgt.initTargets();
    ui.initTimer(GAME.timeDuration);
    ui.updateWordDisplay();
    ui.updateScoreDisplay();
    ui.updateBulletDisplay(p.player.bullets);
    
    GAME.state = RUNNING;
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

// Add event listeners for keydown and keyup
document.addEventListener('keydown', input.handleKeyDown);
document.addEventListener('keyup', input.handleKeyUp);