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

const HIT = 'hit';
const MISS = 'miss';
const BIM = 'bim';
export function showNextWord(result) {
    console.log(result)
    if (result === undefined) {
        const [word] = Object.keys(m.gameState.wordList[0]);
        wordDisplay.textContent = word;
    }

    if (result === MISS){
        
    }

    if (result === HIT){

    }

    if (result === BIM){
        m.gameState.currentWordIndex++;

        if (m.gameState.currentWordIndex >= m.gameState.wordList.length){
            m.gameState.state = m.COMPLETE;
            return;
        };
        const [word] = Object.keys(m.gameState.wordList[m.gameState.currentWordIndex]);
        wordDisplay.textContent = word;
    }
}
