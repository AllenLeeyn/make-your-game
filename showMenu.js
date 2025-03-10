import { gameState, PAUSED } from "./main.js";

const menuLayer = document.getElementById('menuLayer');
const pauseMenu = document.getElementById('pause-menu');
const pauseMenuItems = document.getElementById('pause-menu').children;
const startMenu = document.getElementById('start-menu');
const startMenuItems = document.getElementById('start-menu').children;

let startMenuSelection = 0;


export function showStartScreenMenu() {
    menuLayer.setAttribute('transform', 'translate(0, 0)'); 
    pauseMenu.setAttribute('visibility', 'hidden')
    startMenu.setAttribute('visibility', 'visible');
}

export function hideStartScreenMenu() {
    startMenu.setAttribute('visibility', 'hidden');
}

export function handleStartMenuKeys(event) {
    if (gameState.state === AT_START) {
        const buttons = Array.from(startMenuItems).filter(item => item.tagName === 'rect' && item.classList.contains('button'));
    
        if (event.key === 'ArrowUp') {
            startMenuSelection = Math.max(0, startMenuSelection - 1);
        } else if (event.key === 'ArrowDown') {
            startMenuSelection = Math.min(buttons.length - 1, startMenuSelection + 1);
        } else if (event.key === ' ') {
            event.preventDefault();
            if (startMenuSelection === 0) {
                // Start Game Logic
                hideStartScreenMenu();
            } else if (startMenuSelection === 1) {
                // Instructions Logic (if needed)
                console.log("Instructions selected");
            }
        }
        buttons.forEach((button, index) => {
            if (index === startMenuSelection) {
                button.setAttribute('fill', 'yellow'); // Highlight selected button
                button.setAttribute('stroke', 'yellow'); // Add a border
                button.setAttribute('stroke-width', '3');
            } else {
                button.setAttribute('fill', 'white'); // Reset other buttons
                button.removeAttribute('stroke');
            }
        });
    }
}

let currentSelection = 0; // Index of the currently selected menu item

export function showPauseMenu() {
    pauseMenu.setAttribute('visibility', 'visible');
    pauseMenu.setAttribute('transform', 'translate(250, 170)')
    startMenu.setAttribute('visibility', 'hidden')
    menuLayer.setAttribute('transform', 'translate(0,0)'); // Move to center
}

export function hidePauseMenu() {
    pauseMenu.setAttribute('visibility', 'hidden');
    menuLayer.setAttribute('transform', 'translate(-1000, -1000)'); // Move off-screen
    
    currentSelection = 0; 
}


export function handlePauseKeys(event) {
    if (event.key === 'Escape') {
        gameState.state = 'running';
    }
    
    // Filter out non-button elements (e.g., background, text)
    const buttons = Array.from(pauseMenuItems).filter(item => item.tagName === 'rect' && item.classList.contains('button'));
    
    if (event.key === 'ArrowUp') {
        currentSelection = Math.max(0, currentSelection - 1);
    } else if (event.key === 'ArrowDown') {
        currentSelection = Math.min(buttons.length - 1, currentSelection + 1);
    } else if (event.key === ' ') {
        event.preventDefault();
        if (currentSelection === 0) {
            gameState.state = 'running';
        } else if (currentSelection === 1) {
            gameState.state = 'restart'
        } else if (currentSelection === 2) {
            gameState.state = 'atStart'
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
