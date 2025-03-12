import * as m from "./main.js";
import * as tgt from "./target.js";
import * as ui from "./ui.js";
import { player } from "./player.js";

const bgLayer = document.getElementById('bgLayer');
const targetsLayer = document.getElementById('targetsLayer');
const wordDisplay = document.getElementById('word-display');
const bulletCircle = document.getElementsByClassName('bullet-circle');

//----------- bang bang logic -------------//
const HIT = 'hit';
const MISS = 'miss';
const BIM = 'bim';

export function shoot() {
    player.bullets--;
    ui.updateBulletDisplay(player.bullets);
    if (player.bullets <= 0) m.game.state = m.GAME_OVER;

    let targetHit = false;

    m.game.targets.forEach((target, i) => {
        const distance = getDistance(player, target)
    
        if (distance <= player.radius + 2 && target.active) {
            targetHit = true;
            tgt.hideTarget(target);
            let letter = target.letter;
            const result = checkWordCompletion(target.letter);
    
            if (result !== MISS) {
                letter = m.game.targetList[m.game.currentTargetIndex];
                m.game.currentTargetIndex++;
                if (result === BIM) {
                    m.game.currentWordIndex++;
                    if (m.game.currentWordIndex >= m.game.wordList.length){
                        m.game.state = m.COMPLETE;
                        return;
                    };
                };
                player.score += Math.floor(100 * (1+(player.combo/10)));
                player.combo++;
                ui.showFeedback(result);
            };

            setTimeout(() => {
                target = tgt.addTarget(i, letter);
            }, 1100);
        }
    });

    if (!targetHit){
        player.combo = 0;
        ui.showFeedback(MISS);
    }
    addBulletHole(player.x, player.y, targetHit);
    ui.updateScoreDisplay();
}

function getDistance(player, target){
    const dx = player.x - target.x;
    const dy = player.y - target.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function checkWordCompletion(letter){
    const wordObj = m.game.wordList[m.game.currentWordIndex];
    let [key, value] = Object.entries(wordObj)[0];
    const word = wordDisplay.textContent;
    const parts = word.split('');
    
    let underscoreCount = 0;
    
    for (let i = 0; i < value.length; i++) {
        if (value[i] === letter){
            for (let j = 0; j < parts.length; j++) {
                if(parts[j] === '_') underscoreCount++;

                if (underscoreCount === i+1){
                    parts[j] = letter;
                    break;
                }
            }
            wordDisplay.textContent = parts.join('');
            const index = value.indexOf(letter);
            if (index !== -1) {
                value.splice(index, 1);
            }
            m.game.wordList[m.game.currentWordIndex][key] = value;
            if (value.length === 0) return BIM;
            return HIT;
        }
    }
    return MISS
}

let bulletHoleIndex = 0;
function addBulletHole(x, y, targetHit) {
    const layer = (targetHit) ? targetsLayer : bgLayer;
 
    bulletHoleIndex++;
    if (bulletHoleIndex >= 8) bulletHoleIndex= 0;

    const currentHole = bulletCircle[bulletHoleIndex];
    currentHole.classList.remove('target-removal');

    currentHole.setAttribute('cx', x + (Math.random()*4)-2);
    currentHole.setAttribute('cy', y + (Math.random()*4)-2);
    layer.appendChild(currentHole);
    if (targetHit) currentHole.classList.add('target-removal');

    setTimeout(() => {
        currentHole.setAttribute('cy', -100);
    }, 1000);

    return currentHole;
}