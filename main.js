import * as p from './player.js';
import * as t from './target.js';
import * as u from './ui.js';
const timeDuration = 30;

//--------------- initialize and start gameLoop ---------------//
export async function main() {
    p.initPlayer();
    t.initTargets();
    u.initTimer(timeDuration);
    requestAnimationFrame(gameLoop);
}

//--------------- game logic ---------------//
function gameLoop(timestamp) {
    if (!u.isTimeUp){
        p.updatePlayerPosition(); // Update player position
        t.moveTargets();           // Update target positions

        renderFps(timestamp);
    } else {
        p.initPlayer();
        t.initTargets();
        u.initTimer(timeDuration);
    }
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