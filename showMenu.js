import { gameState, AT_START} from "./main.js";

const pauseMenu = document.getElementById('pause-menu');
const pauseMenuText = document.getElementsByClassName('pauseText');
const pauseMenuButton = document.getElementsByClassName('pauseButton');
console.log(pauseMenuButton);
const startMenu = document.getElementById('start-menu');
const startMenuItems = document.getElementById('start-menu').children;

let startMenuSelection = 0;


export function showStartScreenMenu() {  
    startMenu.style.display = 'block';
    startMenu.classList.add('fade-in');
    gameState.state = 'atStart';
}

export function hideStartScreenMenu() {
    startMenu.style.display = 'none';
    startMenu.classList.remove('fade-in');
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
                gameState.state = 'initalize';
            } else if (startMenuSelection === 1) {
                // Instructions Logic (if needed)
                console.log("Instructions selected");
            }
        }
        buttons.forEach((button, index) => {
            if (index === startMenuSelection) {
                button.setAttribute('fill', 'lightblue'); // Highlight selected button
                button.setAttribute('stroke', 'yellow'); // Add a border
                button.setAttribute('stroke-width', '3');
            } else {
                button.setAttribute('fill', 'red'); // Reset other buttons
                button.removeAttribute('stroke', 'grey');
                button.setAttribute('stroke-width', '2');
            }
        });
    }
}

export function showPauseMenu() {
    gameState.state = 'atPaused';
    currentSelection = 0;
    pauseMenu.style.display = 'block';
    pauseMenu.classList.add('fade-in');
    pauseMenuText[0].setAttribute("fill", "green")
    pauseMenuButton[0].setAttribute("stroke", "green")
    pauseMenuText[1].setAttribute("fill", "grey")
    pauseMenuButton[1].setAttribute("stroke", "grey")
    pauseMenuText[2].setAttribute("fill", "grey")
    pauseMenuButton[1].setAttribute("stroke", "grey")
}

export function hidePauseMenu() {
    pauseMenu.style.display = 'none';
    pauseMenu.classList.remove('fade-in');
    
}

let currentSelection = 0; // Index of the currently selected menu item

export function handlePauseKeys(event) {
    if (event.key === 'Escape') {
        gameState.state = 'running';
    }
    
    if (event.key === 'ArrowUp') {
        currentSelection = Math.max(0, currentSelection - 1);
    } else if (event.key === 'ArrowDown') {
        currentSelection = Math.min(2, currentSelection + 1);
    } else if (event.key === ' ') {
        event.preventDefault();
        if (currentSelection === 0) {
            gameState.state = 'running';
        } else if (currentSelection === 1) {
            gameState.state = 'restart'
        } else if (currentSelection === 2) {
            gameState.state = 'atStart'
            hidePauseMenu();
            showStartScreenMenu();
            startMenuSelection = 0;
        }
    }
    
    console.log(currentSelection)
    for (let i = 0; i < 3; i++){
        if (i === currentSelection) {
            pauseMenuText[i].setAttribute("fill", "green")
            pauseMenuButton[i].setAttribute("stroke", "green")
        } else {
            pauseMenuText[i].setAttribute("fill", "grey")
            pauseMenuButton[i].setAttribute("stroke", "grey")
        }
    };
}
