import * as m from './main.js';

const wordDisplay = document.getElementById('word-display');
const timerElement = document.getElementById('timer');

let timerValue;
export let isTimeUp = false;

export function initTimer(){
    timerValue = m.gameState.timeDuration;
    timerElement.textContent = timerValue; 
    isTimeUp = false;
    timerInterval = setInterval(updateTimer, 1000);  // Update the timer every second
}

// Function to update the timer display
function updateTimer() {
    if (m.gameState.state === 'running') {
        if (timerValue > 0) {
            timerValue--;
            timerElement.textContent = timerValue;  // Update the text content of the timer
        } else {
            isTimeUp = true;
            m.gameState.state = 'timeIsUp';
            clearInterval(timerInterval);  // Stop the timer once it reaches 0
            // Additional logic to handle game over can go here
        }
    };
}

let timerInterval;

export function initWordDisplay() {
    const [word] = Object.keys(m.gameState.wordList[0]);
    wordDisplay.textContent = word;
}
