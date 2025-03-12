import * as m from "./main.js";
import * as input from "./input.js";

export const player = {
    xAxis: document.getElementById('yAxis'),
    yAxis: document.getElementById('xAxis'),
    circle: document.getElementById('playerOrigin'),
    y: 300,
    x: 400,
    radius: 25,
    speed: 6,
    bullets: 15,
    score: 0,
    combo: 0
};

// Update the player's position in the SVG
export function updatePlayerPosition() {
    if (input.keysPressed['ArrowUp']) {
        const newY = player.y - player.speed;
        player.y = (newY < player.radius+50) ? player.radius+50 : newY;
    };
    if (input.keysPressed['ArrowDown']) {
        const newY = player.y + player.speed;
        player.y = (newY > m.GAME.height-player.radius-50) ? m.GAME.height-player.radius-50 : newY;
    };
    if (input.keysPressed['ArrowLeft']) {
        const newX = player.x - player.speed;
        player.x = (newX < player.radius) ? player.radius : newX;
    };
    if (input.keysPressed['ArrowRight']) {
        const newX = player.x + player.speed;
        player.x = (newX > m.GAME.width-player.radius) ? m.GAME.width-player.radius : newX;
    };
    setPlayerPostion();
}

// Function to initialize the player
export function initPlayer() {
    player.score = 0;
    player.combo = 0;
    player.bullets = 15;
    player.y = 300;
    player.x = 400;
    setPlayerPostion();
}

function setPlayerPostion(){
    player.yAxis.setAttribute('y1', player.y);
    player.yAxis.setAttribute('y2', player.y);
    player.xAxis.setAttribute('x1', player.x);
    player.xAxis.setAttribute('x2', player.x);
    player.circle.setAttribute('cx', player.x);
    player.circle.setAttribute('cy', player.y);
}