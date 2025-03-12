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
    if (m.GAME.state === m.AT_START) {
        if (event.key === ' ') m.GAME.state = m.INIT;

    } else if (m.GAME.state === m.RUNNING) {
        handleGameKeys(event);

    } else if (m.GAME.state === m.AT_PAUSED) {
        handlePauseKeys(event);

    } else if (m.GAME.state === m.GAME_OVER || m.GAME.state === m.COMPLETE) {
        if (event.key === ' ') m.GAME.state = m.RESTART;
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
    if (event.key === 'Escape') m.GAME.state = m.PAUSED;
    if (event.key in keysPressed) keysPressed[event.key] = true;
}

export function handlePauseKeys(event) {
    if (event.key === 'Escape') m.GAME.state = m.RUNNING;
    
    if (event.key === 'ArrowUp') {
        m.GAME.pauseSelection = Math.max(0, m.GAME.pauseSelection - 1);
    } else if (event.key === 'ArrowDown') {
        m.GAME.pauseSelection = Math.min(2, m.GAME.pauseSelection + 1);
    } else if (event.key === ' ') {
        event.preventDefault();
        if (m.GAME.pauseSelection === 0) m.GAME.state = m.RUNNING;
        if (m.GAME.pauseSelection === 1) m.GAME.state = m.RESTART;
        if (m.GAME.pauseSelection === 2) m.GAME.state = m.START;
    }

    for (let i = 0; i < 3; i++){
        if (i === m.GAME.pauseSelection) {
            pauseMenuText[i].setAttribute("fill", "green");
            pauseMenuButton[i].setAttribute("stroke", "green");
        } else {
            pauseMenuText[i].setAttribute("fill", "grey");
            pauseMenuButton[i].setAttribute("stroke", "grey");
        }
    };
}

