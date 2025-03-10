
const playerLayer = document.getElementById('playerLayer');

const svgContainerSize = {
    height: 600,
    width: 800
};

export const player = {
    xAxis: document.createElementNS('http://www.w3.org/2000/svg', 'line'),
    yAxis: document.createElementNS('http://www.w3.org/2000/svg', 'line'),
    circle: document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
    y: 300,
    x: 400,
    radius: 20,
    speed: 6,
    bullets: 15,
    score: 0,
    combo: 0
};

export const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

// Update the player's position in the SVG
export function updatePlayerPosition() {
    if (keysPressed['ArrowUp']) {
        const newY = player.y - player.speed;
        player.y = (newY < player.radius+60) ? player.radius+60 : newY;
    };
    if (keysPressed['ArrowDown']) {
        const newY = player.y + player.speed;
        player.y = (newY > svgContainerSize.height-player.radius-60) ? svgContainerSize.height-player.radius-60 : newY;

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

// Function to initialize the player
export function initPlayer() {
    player.y = 300;
    player.x = 400;
    player.yAxis.setAttribute('x1', 0);
    player.yAxis.setAttribute('y1', player.y);
    player.yAxis.setAttribute('x2', svgContainerSize.width);
    player.yAxis.setAttribute('y2', player.y);
    player.yAxis.classList.add('vertical');

    player.xAxis.setAttribute('x1', player.x);
    player.xAxis.setAttribute('y1', 0);
    player.xAxis.setAttribute('x2', player.x);
    player.xAxis.setAttribute('y2', svgContainerSize.height);
    player.xAxis.classList.add('horizontal');

    player.circle.setAttribute('cx', player.x);
    player.circle.setAttribute('cy', player.y);
    player.circle.setAttribute('r', '20');
    player.circle.classList.add('crosshair-circle');

    playerLayer.appendChild(player.xAxis);
    playerLayer.appendChild(player.yAxis);
    playerLayer.appendChild(player.circle);

    player.bullets = 15;
}
