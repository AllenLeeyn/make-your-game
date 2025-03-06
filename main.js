import * as p from './player.js';
import * as t from './target.js';

const uiLayer = document.getElementById('uiLayer')

//--------------- initialize and start gameLoop ---------------//
export async function main() {
    t.createTargets();
    p.initPlayer();
    requestAnimationFrame(gameLoop);
}

//--------------- game logic ---------------//
function gameLoop(timestamp) {
    p.updatePlayerPosition(); // Update player position
    t.moveTargets();           // Update target positions

    renderFps(timestamp);
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

//--------------- event handlers ---------------//
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