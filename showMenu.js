// Function to create the start screen menu

import { restartGameLoop, resumeGameLoop } from "./main.js";

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
    pauseMenu.classList.add('hidden')

    const pauseMessage = document.createElement('h2');
    pauseMessage.textContent = 'Game Paused';

    // Add menu items (e.g., resume, restart, quit)
    const resumeButton = document.createElement('button');
    resumeButton.textContent = 'Resume';
    resumeButton.onclick = resumeGameLoop;

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.onclick = restartGameLoop;
    //pauseMenu.classList.remove('hidden')

    // const quitButton = document.createElement('button');
    // quitButton.textContent = 'Quit';
    // quitButton.onclick = quitGame;

    pauseMenu.appendChild(pauseMessage);
    pauseMenu.appendChild(resumeButton);
    pauseMenu.appendChild(restartButton);
   // pauseMenu.appendChild(quitButton); 

    document.getElementById('game-container').appendChild(pauseMenu);
}


export function showPauseMenu() {
    document.getElementById('pause-menu').classList.remove('hidden');
}

export function hidePauseMenu() {
    console.log('Hiding pause menu...');
    document.getElementById('pause-menu').classList.add('hidden');
}


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
