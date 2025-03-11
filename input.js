import * as m from "./main.js";
import * as s from './shoot.js';

export const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

const pauseMenuText = document.getElementsByClassName('pauseText');
const pauseMenuButton = document.getElementsByClassName('pauseButton');

//--------------- player input ---------------//
// Handle keydown events
export function handleKeyDown(event) {
    if (m.game.state === m.AT_START) {
        if (event.key === ' ') m.game.state = m.INIT;

    } else if (m.game.state === m.RUNNING) {
        handleGameKeys(event);

    } else if (m.game.state === m.AT_PAUSED) {
        handlePauseKeys(event);

    } else if (m.game.state === m.GAME_OVER || m.game.state === m.COMPLETE) {
        if (event.key === ' ') m.game.state = m.RESTART;
    }
}

// Handle keyup events
export function handleKeyUp(event) {
    if (event.key in keysPressed) {
      keysPressed[event.key] = false;
    }
}

function handleGameKeys(event) {
    if (event.key === ' ') s.shoot();
    if (event.key === 'Escape') m.game.state = m.PAUSED;
    if (event.key in keysPressed) keysPressed[event.key] = true;
}

export function handlePauseKeys(event) {
    if (event.key === 'Escape') m.game.state = m.RUNNING;
    
    if (event.key === 'ArrowUp') {
        m.game.pauseSelection = Math.max(0, m.game.pauseSelection - 1);
    } else if (event.key === 'ArrowDown') {
        m.game.pauseSelection = Math.min(2, m.game.pauseSelection + 1);
    } else if (event.key === ' ') {
        event.preventDefault();
        if (m.game.pauseSelection === 0) {
            m.game.state = m.RUNNING;
        } else if (m.game.pauseSelection === 1) {
            m.game.state = m.RESTART
        } else if (m.game.pauseSelection === 2) {
            m.game.state = m.START
        }
    }

    for (let i = 0; i < 3; i++){
        if (i === m.game.pauseSelection) {
            pauseMenuText[i].setAttribute("fill", "green")
            pauseMenuButton[i].setAttribute("stroke", "green")
        } else {
            pauseMenuText[i].setAttribute("fill", "grey")
            pauseMenuButton[i].setAttribute("stroke", "grey")
        }
    };
}

