import * as m from './main.js';
import * as p from './player.js';

const scoreDisplay = document.getElementById('score-display');
const comboDisplay = document.getElementById('combo-display');
const wordDisplay = document.getElementById('word-display');
const missDisplay = document.getElementById('miss-display');
const hitDisplay = document.getElementById('hit-display');
const bimDisplay = document.getElementById('bim-display');
const timerElement = document.getElementById('timer');
const gameOverDisplay = document.getElementById('gameover-display');
const gameCompleteDisplay = document.getElementById('gamecomplete-display');

let timerValue;
export let isTimeUp = false;

export function initTimer(){
    clearInterval(timerInterval); 
    timerValue = m.gameState.timeDuration;
    timerElement.textContent = timerValue; 
    isTimeUp = false;
    timerInterval = setInterval(updateTimer, 1000);  // Update the timer every second
}

// Function to update the timer display
function updateTimer() {
    if (m.gameState.state === m.RUNNING) {
        if (timerValue > 0) {
            timerValue--;
            timerElement.textContent = timerValue;  // Update the text content of the timer
        } else {
            isTimeUp = true;
            m.gameState.state = m.GAME_OVER;
            clearInterval(timerInterval);  // Stop the timer once it reaches 0
            // Additional logic to handle game over can go here
        }
    };
}

let timerInterval;

export function updateBulletDisplay(count){
    const bulletCountElement = document.getElementById('bulletCount');
    bulletCountElement.setAttribute('fill', 'limegreen');
    bulletCountElement.classList.remove('flashing-red');

    let result = '';

    for (let i = 0; i < count; i ++){
        result += '▋';
    }
    bulletCountElement.textContent = result;


    if (count === 1) {
        bulletCountElement.classList.add('flashing-red');
    } else if (count <= 3) {
        bulletCountElement.setAttribute('fill', 'red');
    } else if (count <= 7) {
        bulletCountElement.setAttribute('fill', 'gold');
    }
}

export function updateWordDisplay() {
    const [word] = Object.keys(m.gameState.wordList[m.gameState.currentWordIndex]);
    wordDisplay.textContent = word;
}

export function showFeedback(result) {
    if (result === 'miss'){
        missDisplay.style.display = 'block';
        missDisplay.classList.add('fade-in-out-up');
        setTimeout(() => {
            missDisplay.style.display = 'none';
            missDisplay.classList.remove('fade-in-out-up');
        }, 1000);
    }
    if (result === 'hit'){
        hitDisplay.style.display = 'block';
        hitDisplay.classList.add('fade-in-out-up');
        setTimeout(() => {
            hitDisplay.style.display = 'none';
            hitDisplay.classList.remove('fade-in-out-up');
        }, 1000);
    }
    if (result === 'bim'){
        wordDisplay.setAttribute('fill', 'green');
        bimDisplay.style.display = 'block';
        bimDisplay.classList.add('fade-in-out-up');
        setTimeout(() => {
            bimDisplay.style.display = 'none';
            bimDisplay.classList.remove('fade-in-out-up');
            wordDisplay.setAttribute('fill', 'red');
            updateWordDisplay();
        }, 1000);
    }
}

export function updateScoreDisplay(){
    if (p.player.combo === 0) {
        comboDisplay.style.display = "none";
    } else {
        comboDisplay.style.display = "block";
        comboDisplay.textContent = `COMBO ${p.player.combo}`;
    }
    scoreDisplay.textContent = p.player.score.toString().padStart(6, '0');
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
