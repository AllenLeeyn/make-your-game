const svgContainer = document.getElementById('svg-container');
const frameDuration = 15;
const playerEle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
const player = {
    x: 20,
    y: 20,
    radius: 20,
    speed: 6,
};

const svgContainerSize = {
    height: '600',
    width: '800'
};
let lastFrameTime = 0;
let frameCount = 0;
let lastFPSTime = 0;
let currentFPS = 0;

let keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

// Create an SVG element to show FPS
const fpsDisplay = document.getElementById("fps-display");

export async function main() {
    initSvgContainer();
    initPlayer();
    requestAnimationFrame(gameLoop);
}
function initSvgContainer() {
    svgContainer.setAttribute('height', svgContainerSize.height);
    svgContainer.setAttribute('width', svgContainerSize.width);
}

// Function to initialize the player
function initPlayer() {
    playerEle.setAttribute('cx', player.x);
    playerEle.setAttribute('cy', player.y);
    playerEle.setAttribute('r', player.radius);
    playerEle.setAttribute('fill', 'blue');
    playerEle.setAttribute('id', 'player');
    svgContainer.appendChild(playerEle);
}

// Update the player's position in the SVG
function updatePlayerPosition() {
    if (keysPressed['ArrowUp']) {
        const newY = player.y - player.speed;
        player.y = (newY < player.radius) ? player.radius : newY;
    };
    if (keysPressed['ArrowDown']) {
        const newY = player.y + player.speed;
        player.y = (newY > svgContainerSize.height-player.radius) ? svgContainerSize.height-player.radius : newY;

    };
    if (keysPressed['ArrowLeft']) {
        const newX = player.x - player.speed;
        player.x = (newX < player.radius) ? player.radius : newX;
    };
    if (keysPressed['ArrowRight']) {
        const newX = player.x + player.speed;
        player.x = (newX > svgContainerSize.width-player.radius) ? svgContainerSize.width-player.radius : newX;
    };

    playerEle.setAttribute('cx', player.x);
    playerEle.setAttribute('cy', player.y);
}

// Handle keydown events
function handleKeyDown(event) {
    if (event.key in keysPressed) {
      keysPressed[event.key] = true; // Mark the key as pressed
    }
}
  
  // Handle keyup events
function handleKeyUp(event) {
    if (event.key in keysPressed) {
      keysPressed[event.key] = false; // Mark the key as released
    }
}

// Add event listeners for keydown and keyup
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function gameLoop(timestamp) {

    updatePlayerPosition(); // Update player position
    lastFrameTime = timestamp; // Store the timestamp of the current frame
    frameCount++; // Increment the frame count

    // Calculate FPS every second (1000ms)
    const elapsedSinceLastFPS = timestamp - lastFPSTime;
    if (elapsedSinceLastFPS >= 1000) {
        currentFPS = frameCount; // Set FPS to the number of frames in the last second
        frameCount = 0; // Reset frame count for the next second
        lastFPSTime = timestamp; // Reset the last FPS time
    }

    // Update the FPS display text
    fpsDisplay.textContent = `FPS: ${currentFPS}`;

    requestAnimationFrame(gameLoop); // Keep the game loop running
}