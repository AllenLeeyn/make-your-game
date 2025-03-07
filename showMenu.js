// Function to create the start screen menu

export function createStartScreenMenu() {
    const startMenu = document.createElement('div');
    startMenu.id = 'start-menu';
    startMenu.style.display = 'block'; // Initially visible

    // Add menu items (e.g., start game, instructions)
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.onclick = startGame;

    startMenu.appendChild(startButton);

    document.body.appendChild(startMenu);
}


export function hideStartScreenMenu() {
    document.getElementById('start-menu').style.display = 'none';
}

export function createPauseMenu() {
    const pauseMenu = document.createElement('div');
    pauseMenu.id = 'pause-menu';
    pauseMenu.style.display = 'none'; // Initially hidden

    // Add menu items (e.g., resume, restart, quit)
    const resumeButton = document.createElement('button');
    resumeButton.textContent = 'Resume';
    resumeButton.onclick = resumeGame;

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.onclick = restartGame;

    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    quitButton.onclick = quitGame;

    pauseMenu.appendChild(resumeButton);
    pauseMenu.appendChild(restartButton);
    pauseMenu.appendChild(quitButton); 

    document.body.appendChild(pauseMenu);
}


export function showPauseMenu() {
    document.getElementById('pause-menu').classList.remove('hidden');
}

export function hidePauseMenu() {
    document.getElementById('pause-menu').classList.add('hidden');
}

document.getElementById('continue-btn').addEventListener('click', resumeGameLoop);
document.getElementById('restart-btn').addEventListener('click', restartGameLoop);



// ----

// // Example functions for handling menu actions
// function startGame() {
//     hideStartScreenMenu();
//     // Call main game initialization function
//     main();
// }

// function showInstructions() {
//     // Display game instructions
// }

// function resumeGame() {
//     hidePauseMenu();
//     // Call function to resume the game loop
//     resumeGameLoop();
// }

// function restartGame() {
//     hidePauseMenu();
//     // Call functions to restart the game
//     restartGameLoop();
// }

// function quitGame() {
//     hidePauseMenu();
//     // Handle quitting the game
// }