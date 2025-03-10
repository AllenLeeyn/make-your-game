// Function to create the start screen menu

import { restartGameLoop, resumeGameLoop, gameState, PAUSED} from "./main.js";

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
    const menuLayer = document.getElementById('menuLayer');

    
    // Create a group for the pause menu
    const pauseMenuGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    pauseMenuGroup.id = 'pause-menu';
    pauseMenuGroup.setAttribute('visibility', 'hidden');

    // Calculate the center of the SVG container
    const centerX = 400;
    const centerY = 300;
    
    // Dimensions of the pause menu background
    const menuWidth = 300;
    const menuHeight = 200;
    
    // Calculate the top-left corner of the pause menu to center it
    const menuX = centerX - (menuWidth / 2);
    const menuY = centerY - (menuHeight / 2);
    
    // Add a rectangle for the background
    const pauseBackground = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    pauseBackground.setAttribute('x', menuX); 
    pauseBackground.setAttribute('y', menuY); 
    pauseBackground.setAttribute('width', menuWidth); 
    pauseBackground.setAttribute('height', menuHeight); 
    pauseBackground.setAttribute('fill', 'rgba(0, 0, 0, 0.5)'); 

    // Add a text element for the "Game Paused" message
    const pauseMessage = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    pauseMessage.setAttribute('x', centerX); 
    pauseMessage.setAttribute('y', menuY + 50); 
    pauseMessage.setAttribute('font-size', 24); 
    pauseMessage.setAttribute('fill', 'white'); 
    pauseMessage.setAttribute('text-anchor', 'middle'); // Center the text horizontally
    pauseMessage.textContent = 'Game Paused';

    // Add buttons as SVG rectangles with text
    const resumeButton = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    resumeButton.setAttribute('x', centerX - 50); 
    resumeButton.setAttribute('y', menuY + 100); 
    resumeButton.setAttribute('width', 100); 
    resumeButton.setAttribute('height', 30); 
    resumeButton.setAttribute('fill', 'white');
    resumeButton.setAttribute('class', 'button'); 

    const resumeButtonText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    resumeButtonText.setAttribute('x', centerX); 
    resumeButtonText.setAttribute('y', menuY + 120); 
    resumeButtonText.setAttribute('font-size', 18); 
    resumeButtonText.setAttribute('fill', 'black'); 
    resumeButtonText.setAttribute('text-anchor', 'middle'); // Center the text horizontally
    resumeButtonText.textContent = 'Resume';


    const restartButton = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    restartButton.setAttribute('x', centerX - 50); 
    restartButton.setAttribute('y', menuY + 140); 
    restartButton.setAttribute('width', 100); 
    restartButton.setAttribute('height', 30); 
    restartButton.setAttribute('fill', 'white');
    restartButton.setAttribute('class', 'button'); 

    const restartButtonText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    restartButtonText.setAttribute('x', centerX); 
    restartButtonText.setAttribute('y', menuY + 160); 
    restartButtonText.setAttribute('font-size', 18); 
    restartButtonText.setAttribute('fill', 'black'); 
    restartButtonText.setAttribute('text-anchor', 'middle'); // Center the text horizontally
    restartButtonText.textContent = 'Restart';


    // Append elements to the pause menu group
    pauseMenuGroup.appendChild(pauseBackground);
    pauseMenuGroup.appendChild(pauseMessage);
    pauseMenuGroup.appendChild(resumeButton);
    pauseMenuGroup.appendChild(resumeButtonText);
    pauseMenuGroup.appendChild(restartButton);
    pauseMenuGroup.appendChild(restartButtonText);

    // Append the pause menu group to the menu layer
    menuLayer.appendChild(pauseMenuGroup);
}


let currentSelection = 0; // Index of the currently selected menu item

export function showPauseMenu() {
    const pauseMenu = document.getElementById('pause-menu');
    console.log(pauseMenu); // Check if the element is found
    if (pauseMenu) {
        pauseMenu.setAttribute('visibility', 'visible');
    } else {
        console.error('Pause menu element not found');
    }
}

export function hidePauseMenu() {
    const pauseMenu = document.getElementById('pause-menu');
    console.log(pauseMenu)
    if (pauseMenu) {
        pauseMenu.setAttribute('visibility', 'hidden');
    } else {
        console.error('Pause menu element not found');
    }
    currentSelection = 0; 
}


export function handleArrowKeys(event) {
    if (gameState.state === PAUSED) {
        const menuItems = document.getElementById('pause-menu').children;
        
        // Filter out non-button elements (e.g., background, text)
        const buttons = Array.from(menuItems).filter(item => item.tagName === 'rect' && item.classList.contains('button'));
        
        if (event.key === 'ArrowUp') {
            currentSelection = Math.max(0, currentSelection - 1);
        } else if (event.key === 'ArrowDown') {
            currentSelection = Math.min(buttons.length - 1, currentSelection + 1);
        } else if (event.key === ' ') {
            event.preventDefault();
            if (currentSelection === 0) {
                resumeGameLoop(); // Resume game
            } else if (currentSelection === 1) {
                restartGameLoop(); // Restart game
            }
        }
        
        // Visual feedback: Highlight the selected button
        buttons.forEach((button, index) => {
            if (index === currentSelection) {
                button.setAttribute('fill', 'lightblue'); // Highlight selected button
            } else {
                button.setAttribute('fill', 'white'); // Reset other buttons
            }
        });
    }
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
