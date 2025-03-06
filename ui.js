const uiLayer = document.getElementById('uiLayer')
const timerElement = document.getElementById('timer');

let timerValue;
export let isTimeUp = false;

export function initTimer(timeDuration){
    timerValue = timeDuration;
    timerElement.textContent = timerValue; 
    isTimeUp = false;
    timerInterval = setInterval(updateTimer, 1000);  // Update the timer every second
}
// Function to update the timer display
function updateTimer() {
    if (timerValue > 0) {
        timerValue--;
        timerElement.textContent = timerValue;  // Update the text content of the timer
    } else {
        clearInterval(timerInterval);  // Stop the timer once it reaches 0
        isTimeUp = true;
        // Additional logic to handle game over can go here
    }
}

let timerInterval;

