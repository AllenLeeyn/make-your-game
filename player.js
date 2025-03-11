const svgContainerSize = {
    height: 600,
    width: 800
};

export const player = {
    xAxis: document.getElementById('yAxis'),
    yAxis: document.getElementById('xAxis'),
    circle: document.getElementById('playerOrigin'),
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
    player.score = 0;
    player.combo = 0;
    player.bullets = 15;
    player.y = 300;
    player.x = 400;

    player.yAxis.setAttribute('y1', player.y);
    player.yAxis.setAttribute('y2', player.y);
    player.xAxis.setAttribute('x1', player.x);
    player.xAxis.setAttribute('x2', player.x);
    player.circle.setAttribute('cx', player.x);
    player.circle.setAttribute('cy', player.y);

}
