import * as m from './main.js';
import * as p from './player.js';

const scoreDisplay = document.getElementById('score-display');
const comboDisplay = document.getElementById('combo-display');
const wordDisplay = document.getElementById('word-display');
const wordAimDisplay = document.getElementById('wordAim-display');
const missDisplay = document.getElementsByClassName('miss-display');
const hitDisplay = document.getElementById('hit-display');
const bimDisplay = document.getElementById('bim-display');
const timerElement = document.getElementById('timer');

let timerValue;
let timerInterval;

export function initTimer(){
    clearInterval(timerInterval); 
    timerValue = m.GAME.timeDuration;
    timerElement.textContent = timerValue;
    timerInterval = setInterval(updateTimer, 1000);  // Update the timer every second
}

// Function to update the timer display
function updateTimer() {
    if (m.GAME.state === m.RUNNING) {
        if (timerValue > 0) {
            timerValue--;
            timerElement.textContent = timerValue;  // Update the text content of the timer
        } else {
            m.GAME.state = m.GAME_OVER;
            clearInterval(timerInterval);  // Stop the timer once it reaches 0
            // Additional logic to handle game over can go here
        }
    };
}


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
    // show word with missing characters
    const [word] = Object.keys(m.GAME.wordList[m.GAME.currentWordIndex]);
    wordDisplay.textContent = `[${word.replaceAll('_',' ')}]`;

    // show word with all characters
    const [key, value] = Object.entries(m.GAME.wordList[m.GAME.currentWordIndex])[0];
    let parts = key.split('');
    let valueIndex = 0;
    for (let i = 0; i < parts.length; i++){
        if (parts[i] === '_') {
            parts[i] = value[valueIndex];
            valueIndex++;
        };
    };
    wordAimDisplay.textContent = `[${parts.join('')}]`;
};

let missCounter= 0;
export function showFeedback(result) {
    if (result === 'miss'){
        missDisplay[missCounter].style.display = 'block';
        missDisplay[missCounter].classList.add('fade-in-out-up');
        setTimeout(() => {
            missDisplay[missCounter].style.display = 'none';
            missDisplay[missCounter].classList.remove('fade-in-out-up');
        }, 600);
        missCounter++;
        if (missCounter >= 10) missCounter=0;
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
