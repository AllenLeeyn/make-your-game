import * as p from './player.js';
import * as t from './target.js';
import * as u from './ui.js';
import { getWordsAndTargets } from './words.js';

export const gameState = {
    timeDuration: 100,
    wordList: [],
    currentWordIndex: 0,
    targetList: [],
    state: 'atStart',
};

//--------------- initialize and start gameLoop ---------------//
export async function main() {
    // show main menu

    // prepare game parameters and data
    [gameState.wordList, gameState.targetList] = await getWordsAndTargets('questOne');
    //create all targets
    t.createTargets();

    // initalize game 
    p.initPlayer();
    t.initTargets();
    u.initTimer(gameState.timeDuration);
    u.initWordDisplay();
    
    gameState.state = 'running';
    requestAnimationFrame(gameLoop);
}

//--------------- game logic ---------------//
function gameLoop(timestamp) {
    if (gameState.state === 'running'){
        p.updatePlayerPosition(); // Update player position
        t.addTargets();
        t.moveTargets();           // Update target positions

        renderFps(timestamp);
        requestAnimationFrame(gameLoop); // Keep the game loop running
    } 
    if (gameState.state === 'timeIsUp') {
        console.log('Time is up');
        // show gameover menu
    }
    if (gameState.state === 'retry') {
        t.createTargets();
        p.initPlayer();
        t.initTargets();
        u.initTimer(gameState.timeDuration);
        gameState.state = 'running';
        requestAnimationFrame(gameLoop);
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
    if (event.key === ' ' && gameState.state === 'running') t.checkTargetHit(p);
    if (event.key === 'Escape') {
        if (gameState.state === 'running') {
            gameState.state = 'paused';
        } else if (gameState.state === 'paused') {
            gameState.state = 'running';
        };
        if (gameState.state === 'timeIsUp') {
            gameState.state = 'retry';
        };
        console.log(gameState.state)
        requestAnimationFrame(gameLoop);
    }
}
  
// Handle keyup events
function handleKeyUp(event) {
    if (event.key in p.keysPressed) {
      p.keysPressed[event.key] = false; // Mark the key as released
    }
}

// Add event listeners for keydown and keyup
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
