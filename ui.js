import { game, RUNNING, GAME_OVER } from './main.js';
import { player } from './player.js';

const SCORE_DISPLAY = document.getElementById('score-display');
const COMBO_DISPLAY = document.getElementById('combo-display');
const WRD_DISPLAY = document.getElementById('word-display');
const WRD_AIM_DISPLAY = document.getElementById('wordAim-display');
const MISS_DISPLAY = document.getElementsByClassName('miss-display');
const HIT_DISPLAY = document.getElementById('hit-display');
const BIM_DISPLAY = document.getElementById('bim-display');
const TIMER_DISPLAY = document.getElementById('timer');

let timerValue;
let timerInterval;

export async function initUI(){
    initTimer();
    updateWordDisplay();
    updateScoreDisplay();
    updateBulletDisplay(player.bullets);
}

export async function updateUI(result){
    updateBulletDisplay();
    updateScoreDisplay();
    showFeedback(result);
}

async function initTimer(){
    clearInterval(timerInterval); 
    timerValue = game.timeDuration;
    TIMER_DISPLAY.textContent = timerValue;
    timerInterval = setInterval(updateTimer, 1000);  // Update the timer every second
}

// Function to update the timer display
async function updateTimer() {
    if (game.state === RUNNING) {
        if (timerValue > 0) {
            timerValue--;
            TIMER_DISPLAY.textContent = timerValue;  // Update the text content of the timer
        } else {
            game.state = GAME_OVER;
            clearInterval(timerInterval);  // Stop the timer once it reaches 0
            // Additional logic to handle game over can go here
        }
    };
}

async function updateBulletDisplay(){
    const bulletCountElement = document.getElementById('bulletCount');
    bulletCountElement.setAttribute('fill', 'limegreen');
    bulletCountElement.classList.remove('flashing-red');

    let result = '';

    for (let i = 0; i < player.bullets; i ++){
        result += '▋';
    }
    bulletCountElement.textContent = result;

    if (player.bullets === 1) {
        bulletCountElement.classList.add('flashing-red');
    } else if (player.bullets <= 3) {
        bulletCountElement.setAttribute('fill', 'red');
    } else if (player.bullets <= 7) {
        bulletCountElement.setAttribute('fill', 'gold');
    }
}

async function updateWordDisplay() {
    if (game.currentWordIndex >= game.wordList.length) return;

    // show word with missing characters
    const [word] = Object.keys(game.wordList[game.currentWordIndex]);
    WRD_DISPLAY.textContent = `[${word.replaceAll('_',' ')}]`;

    // show word with all characters
    const [key, value] = Object.entries(game.wordList[game.currentWordIndex])[0];
    let parts = key.split('');
    let valueIndex = 0;
    for (let i = 0; i < parts.length; i++){
        if (parts[i] === '_') {
            parts[i] = value[valueIndex];
            valueIndex++;
        };
    };
    WRD_AIM_DISPLAY.textContent = `[${parts.join('')}]`;
};

let missCounter= 0;
async function showFeedback(result) {
    if (result === 'miss'){
        MISS_DISPLAY[missCounter].style.display = 'block';
        MISS_DISPLAY[missCounter].classList.add('fade-in-out-up');
        setTimeout(() => {
            MISS_DISPLAY[missCounter].classList.remove('fade-in-out-up');
            MISS_DISPLAY[missCounter].style.display = 'none';
        }, 600);
        missCounter++;
        if (missCounter >= 10) missCounter=0;
    }
    if (result === 'hit'){
        HIT_DISPLAY.style.display = 'block';
        HIT_DISPLAY.classList.add('fade-in-out-up');
        setTimeout(() => {
            HIT_DISPLAY.classList.remove('fade-in-out-up');
            HIT_DISPLAY.style.display = 'none';
        }, 1000);
    }
    if (result === 'bim'){
        WRD_DISPLAY.setAttribute('fill', 'green');
        BIM_DISPLAY.style.display = 'block';
        BIM_DISPLAY.classList.add('fade-in-out-up');
        setTimeout(() => {
            BIM_DISPLAY.classList.remove('fade-in-out-up');
            WRD_DISPLAY.setAttribute('fill', 'red');
            BIM_DISPLAY.style.display = 'none';
            updateWordDisplay();
        }, 1000);
    }
}

async function updateScoreDisplay(){
    if (player.combo === 0) {
        COMBO_DISPLAY.style.display = "none";
    } else {
        COMBO_DISPLAY.style.display = "block";
        COMBO_DISPLAY.textContent = `COMBO ${player.combo}`;
    }
    SCORE_DISPLAY.textContent = player.score.toString().padStart(6, '0');
}
