import { game, START, RUNNING, PAUSED, GAME_OVER, COMPLETE } from "./main.js";
// import { } from './ui.js'

// -- In-Game Music --- //

let audioFlags = {
    gameOver: false,
    success: false,
};

export function playMusic(){
    if (game.state === START) playBGM();
    if (game.state === PAUSED) playPauseMenuMusic();
    if (game.state === GAME_OVER) playGameOverMusic();
    if (game.state === COMPLETE) playSuccessMusic();
    if (game.state === RUNNING) playBGM();
}

export function playBGM() {
    const bgm = document.getElementById('start-menu-music');
    bgm.volume = 0.8
    const playPromise = bgm.play();

    if (playPromise !== undefined) {
    playPromise.then(_ => {
    })
    .catch(error => {
        console.log('Autoplay failed: ', error);
    });
    }
}

function playPauseMenuMusic() {
    const music = document.getElementById('start-menu-music')
    music.volume = 0.1;
    music.play();
}

function playGameOverMusic() {
    document.getElementById('start-menu-music').pause();

    const gameOverMusic = document.getElementById('game-over-music');

    if (!audioFlags.gameOver) {
        gameOverMusic.play();    
        audioFlags.gameOver = true;       
    }
}

function playSuccessMusic() {
    document.getElementById('start-menu-music').pause();
    
    const successMusic = document.getElementById('success-music');
    if (!audioFlags.success) {
        successMusic.play();
        audioFlags.success = true;  
    }
}

export function resetAudioFlags() {
    for (const flag in audioFlags) {
        audioFlags[flag] = false;
    }
}


// function playSoundEffect(effectName) {
//     // If the sound effect is already played, do nothing
//     if (audioFlags[effectName]) return; 
    
//     // Assuming you have an element for the sound effect
//     const soundEffect = document.getElementById(effectName);
//     if (soundEffect) {
//         soundEffect.play();
//         audioFlags[effectName] = true;
//     }
// }


// -- Player UI Feedback --- //

export function playSFX(type) {
    const soundMap = {
        MISS: document.getElementById('miss-sound'),
        HIT: document.getElementById('bim-sound'),
        BIM: document.getElementById('bim-sound'),
        MENU: document.getElementById('menu-sound'),
    };

    if (soundMap[type]) {
        soundMap[type].play();
    } else {
        console.error('Undefined Sound Type');
    }
}

// -- Chrome's Autoplay Policy -- //

let bgmPlayed = false;

export function initAutoplayPolicy() {
    ['keydown', 'click'].forEach(eventType => {
        document.addEventListener(eventType, function allowPlay() {
            if (!bgmPlayed) {
                playBGM();
                bgmPlayed = true;
            }
            document.removeEventListener(eventType, allowPlay);
        }, { once: true });
    });
}
