import * as p from './player.js';
import * as t from './target.js';
import * as u from './ui.js';
import * as m from './showMenu.js';
import { generateWordList, displayWordsSequentially, collectMissingLetters } from './words.js';

const timeDuration = 60;
let isGamePaused = false;



//--------------- initialize and start gameLoop ---------------//
export async function main() {
    // show main menu
    m.createPauseMenu();
    // prepare game parameters and data
    // initalize game 
    p.initPlayer();
    u.initTimer(timeDuration);

    // Generate word list and display words
    const questOneWordList = await generateWordList('questOne');
    displayWordsSequentially(questOneWordList);

    //Collect the missing letters and set them as valid answers
    const missingLetters = await collectMissingLetters(questOneWordList);
    
    t.setValidAnswers(missingLetters);
    t.initTargets();

    requestAnimationFrame(gameLoop);
}

//--------------- game logic ---------------//
function gameLoop(timestamp) {
    if (!u.isTimeUp && !isGamePaused) {
        p.updatePlayerPosition(); // Update player position
        t.moveTargets();           // Update target positions

        renderFps(timestamp);
    } 
    // else {
    //     p.initPlayer();
    //     t.initTargets();
    //     u.initTimer(timeDuration);
    // }
    requestAnimationFrame(gameLoop); // Keep the game loop running
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
    if (event.key === ' ') t.checkTargetHit(p);
    if (event.key === 'b') {
        if (isGamePaused) {
            resumeGameLoop();
        } else {
            pauseGameLoop();
        }
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
