import { game, GAME_OVER, COMPLETE } from "./main.js";
import { hideTarget, addTarget } from "./target.js";
import { updateUI } from "./ui.js";
import { player } from "./player.js";

const BG_LAYER = document.getElementById('bgLayer');
const TGT_LAYER = document.getElementById('targetsLayer');
const WRD_DISPLAY = document.getElementById('word-display');
const BULLET_HOLES = document.getElementsByClassName('bullet-circle');

const HIT = 'hit';
const MISS = 'miss';
const BIM = 'bim';

export function shoot() {
    player.bullets--;
    if (player.bullets <= 0) game.state = GAME_OVER;

    let targetHit = false;
    let result = MISS;

    game.targets.forEach((t, i) => {
        const distance = getDistance(player, t)
    
        if (distance <= t.r + 2 && t.active) {
            targetHit = true;
            hideTarget(t);
            let letter = t.letter;
            result = checkWordCompletion(t.letter);
    
            if (result !== MISS) {
                letter = game.targetList[game.currentTargetIndex];
                game.currentTargetIndex++;
                if (result === BIM) {
                    game.currentWordIndex++;
                    if (game.currentWordIndex >= game.wordList.length){
                        game.state = COMPLETE;
                    };
                };
                player.score += Math.floor(100 * (1+(player.combo/10)));
                player.combo++;
            };

            setTimeout(() => {
                t = addTarget(i, letter);
            }, 1100);
        }
    });

    if (!targetHit || result === MISS){
        player.combo = 0;
    }
    addBulletHole(player.x, player.y, targetHit);
    updateUI(result);
}

function getDistance(player, t){
    const dx = player.x - t.x;
    const dy = player.y - t.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function checkWordCompletion(letter){
    const wordObj = game.wordList[game.currentWordIndex];
    let [key, value] = Object.entries(wordObj)[0];
    const word = WRD_DISPLAY.textContent;
    const parts = word.split('');
    
    let underscoreCount = 0;
    
    for (let i = 0; i < value.length; i++) {
        if (value[i] === letter){
            for (let j = 0; j < parts.length; j++) {
                if(parts[j] === ' ') underscoreCount++;

                if (underscoreCount === i+1){
                    parts[j] = letter;
                    break;
                }
            }
            WRD_DISPLAY.textContent = parts.join('');
            const index = value.indexOf(letter);
            if (index !== -1) {
                value.splice(index, 1);
            }
            game.wordList[game.currentWordIndex][key] = value;
            if (value.length === 0) return BIM;
            return HIT;
        }
    }
    return MISS
}

let bulletHoleIndex = 0;
async function addBulletHole(x, y, targetHit) {
    const layer = (targetHit) ? TGT_LAYER : BG_LAYER;
 
    bulletHoleIndex++;
    if (bulletHoleIndex >= 8) bulletHoleIndex= 0;

    const currentHole = BULLET_HOLES[bulletHoleIndex];

    currentHole.setAttribute('cx', x + (Math.random()*4)-2);
    currentHole.setAttribute('cy', y + (Math.random()*4)-2);
    currentHole.style.display = 'block';
    layer.appendChild(currentHole);
    if (targetHit) currentHole.classList.add('target-removal');

    setTimeout(() => {
        currentHole.classList.remove('target-removal');
        currentHole.style.display = 'none';
        currentHole.setAttribute('cy', -100);
    }, 1000);

    return currentHole;
}