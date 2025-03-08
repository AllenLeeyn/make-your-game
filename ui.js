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

const bulletCountElement = document.getElementById('bulletCount');
export function shoot() {
    const bulletCount = player.bullets;
    if (bulletCount > 0) {
        bulletCount--;
        bulletCountElement.textContent = `Bullets: ${player.bullets}`;
        console.log(`Bullet remaining: ${player.bullets}`);
        //player.bulletElement.textContent = player.bullets;
    } else {
        bulletCountElement.textContent = 'No bullets left!';
        isTimeUp = true;
        console.log('No bullets left! Game over.');
    }
}


export function showNextWord() {
    const [word] = Object.keys(m.gameState.wordList[m.gameState.currentWordIndex]);
    wordDisplay.textContent = word;
}
