import * as m from "./main.js";

const pauseMenu = document.getElementById('pause-menu');
const pauseMenuText = document.getElementsByClassName('pauseText');
const pauseMenuButton = document.getElementsByClassName('pauseButton');
const startMenu = document.getElementById('start-menu');
const gameOverDisplay = document.getElementById('gameover-display');
const gameCompleteDisplay = document.getElementById('gamecomplete-display');

export function showStartScreenMenu() {  
    startMenu.style.display = 'block';
    startMenu.classList.add('fade-in');
    m.game.state = m.AT_START;
}

export function hideStartScreenMenu() {
    startMenu.style.display = 'none';
    startMenu.classList.remove('fade-in');
}

export function showPauseMenu() {
    m.game.state = m.AT_PAUSED;
    m.game.pauseSelection = 0;
    pauseMenu.style.display = 'block';
    pauseMenu.classList.add('fade-in');
    pauseMenuText[0].setAttribute("fill", "green")
    pauseMenuButton[0].setAttribute("stroke", "green")
    pauseMenuText[1].setAttribute("fill", "grey")
    pauseMenuButton[1].setAttribute("stroke", "grey")
    pauseMenuText[2].setAttribute("fill", "grey")
    pauseMenuButton[2].setAttribute("stroke", "grey")
}

export function hidePauseMenu() {
    pauseMenu.style.display = 'none';
    pauseMenu.classList.remove('fade-in');
}

export function showGameOver() {                     
    gameOverDisplay.style.display = 'block';
    gameOverDisplay.classList.add('fade-in');
}

export function showGameComplete() {                     
    gameCompleteDisplay.style.display = 'block';
    gameCompleteDisplay.classList.add('fade-in');
}
 export function hideGameOver() {
    gameOverDisplay.style.display = 'none';
    gameOverDisplay.classList.remove('fade-in');
}

export function hideGameComplete() {
    gameCompleteDisplay.style.display = 'none';
    gameCompleteDisplay.classList.remove('fade-in');
}
