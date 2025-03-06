const svgContainer = document.getElementById('svg-container');
const playerLayer = document.getElementById('playerLayer')
const targetsLayer = document.getElementById('targetsLayer')
const uiLayer = document.getElementById('uiLayer')

const player = {
    xAxis: document.createElementNS('http://www.w3.org/2000/svg', 'line'),
    yAxis: document.createElementNS('http://www.w3.org/2000/svg', 'line'),
    circle: document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
    y: 300,
    x: 400,
    radius: 25,
    speed: 6,
};

const svgContainerSize = {
    height: 600,
    width: 800
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
    createTargets();
    initPlayer();
    requestAnimationFrame(gameLoop);
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

    player.yAxis.setAttribute('y1', player.y);
    player.yAxis.setAttribute('y2', player.y);

    player.xAxis.setAttribute('x1', player.x);
    player.xAxis.setAttribute('x2', player.x);

    player.circle.setAttribute('cx', player.x);
    player.circle.setAttribute('cy', player.y); 
}

// Handle keydown events
async function handleKeyDown(event) {
    if (event.key in keysPressed) {
      keysPressed[event.key] = true; // Mark the key as pressed
    }
    if (event.key === ' ') await checkTargetHit();
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
    moveTargets();           // Update target positions
    lastFrameTime = timestamp; // Store the timestamp of the current frame
    frameCount++; // Increment the frame count

    renderFps(timestamp);
    requestAnimationFrame(gameLoop); // Keep the game loop running
}

async function renderFps(timestamp) {
    // Calculate FPS every second (1000ms)
    const elapsedSinceLastFPS = timestamp - lastFPSTime;
    if (elapsedSinceLastFPS >= 1000) {
        currentFPS = frameCount; // Set FPS to the number of frames in the last second
        frameCount = 0; // Reset frame count for the next second
        lastFPSTime = timestamp; // Reset the last FPS time
    }

    fpsDisplay.textContent = `FPS: ${currentFPS}`;
}

function getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function getMoveParameter(){    
    const m = (Math.random() * 700) - 50;
    const c = (Math.random() * 0.7) - 0.05;
    const x = Math.random() * (svgContainerSize.width - 40) + 15;
    return {
        m: m,
        c: c,
        x: x,
        y: m + (x*c),
        direction: Math.random() < 0.5 ? 1 : -1,
    }
}

let targets = [];
const targetCount = 10;

function createTargets(){
    for (let i = targets.length; i < targetCount; i++){
        const moveParameter = getMoveParameter();
        const targetEle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const target = {
            ele: targetEle,
            x: moveParameter.x,
            y: moveParameter.y,
            m: moveParameter.m,
            c: moveParameter.c,
            direction: moveParameter.direction,
            letter: getRandomLetter(),
            radius: 10,
            speed: (Math.random() * 1) + 0,
        }
        targetEle.setAttribute("x", target.x);
        targetEle.setAttribute("y", target.y);
        targetEle.setAttribute("r", 15);
        targetEle.setAttribute("font-family", "Roboto Mono, monospace");
        targetEle.setAttribute("font-size", "30");
        targetEle.setAttribute("fill", "red");
        targetEle.classList.add("targets");
        targetEle.textContent = target.letter;
        targetsLayer.appendChild(targetEle);
        targets.push(target);
    }
}

async function moveTargets() {
    targets.forEach(t => {
        t.x += t.direction * t.speed;
        t.y = t.m + (t.c * t.x);

        if (t.x > svgContainerSize.width + 30 || t.x < -30){
            t.direction = Math.random() < 0.5 ? 1 : -1;
            t.speed = (t.direction < 0) ? -t.speed : t.speed;
            t.x = (t.speed < 0) ? svgContainerSize.width + 30 : -30;
            t.m = (Math.random() * 660) -30;
            t.c = (Math.random() * 0.7) -0.05;
        };

        if (t.y > svgContainerSize.height + 30) {t.y = -30;}
        if (t.y < -30)t.y = svgContainerSize.height + 30;

        t.ele.setAttribute("x", t.x);
        t.ele.setAttribute("y", t.y);
    });

};

async function checkTargetHit() {
    targets.forEach(target => {
        const dx = player.x - target.x;
        const dy = player.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= player.radius + target.radius) {
            console.log("Hit target: ", target.letter);
            targets = targets.filter(t => t !== target);
            target.ele.classList.add('target-removal');

            setTimeout(() => {
                // Remove the target from the SVG after the timeout
                targetsLayer.removeChild(target.ele);
            }, 1000); // 500ms delay (0.5s)
        }
    });
}

// Function to initialize the player
function initPlayer() {
    player.yAxis.setAttribute('x1', 0);
    player.yAxis.setAttribute('y1', player.y);
    player.yAxis.setAttribute('x2', window.innerWidth);
    player.yAxis.setAttribute('y2', player.y);
    player.yAxis.classList.add('vertical');

    player.xAxis.setAttribute('x1', player.x);
    player.xAxis.setAttribute('y1', 0);
    player.xAxis.setAttribute('x2', player.x);
    player.xAxis.setAttribute('y2', window.innerHeight);
    player.xAxis.classList.add('horizontal');

    player.circle.setAttribute('cx', player.x);
    player.circle.setAttribute('cy', player.y);
    player.circle.setAttribute('r', '20');
    player.circle.classList.add('crosshair-circle');

    playerLayer.appendChild(player.xAxis);
    playerLayer.appendChild(player.yAxis);
    playerLayer.appendChild(player.circle);
}