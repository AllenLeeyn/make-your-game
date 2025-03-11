import { player } from "./player.js";
import * as m from "./main.js";
import { showFeedback, updateBulletDisplay, updateScoreDisplay } from "./ui.js";

const bgLayer = document.getElementById('bgLayer')
const targetsLayer = document.getElementById('targetsLayer')
const wordDisplay = document.getElementById('word-display');
const targetCircle = document.getElementsByClassName('target-circle');
const targetText = document.getElementsByClassName('target-text');
const bulletCircle = document.getElementsByClassName('bullet-circle');

const svgContainerSize = {
    height: 600,
    width: 800
};

const speedVar = {
    xMin: 1,
    yMin: 0.5,
    xRange: 3,
    yRange: 3.5,
}

const randomDX = () => (Math.random() * speedVar.xRange) + speedVar.xMin;
const randomDY = () => (Math.random() * speedVar.yRange) + speedVar.yMin;

let targets = [];

export function initTargets(){
    targets = [];

    for (let i = 0; i < 10; i++) {
        const target = {
            active: true,
            circle: targetCircle[i],
            text: targetText[i],
            x: Math.random() * (svgContainerSize.width - 100) + 50,
            y: Math.random() * (svgContainerSize.height - 100) + 50,
            dx: (Math.random() * speedVar.xRange) + speedVar.xMin,
            dy: (Math.random() * speedVar.yRange) + speedVar.yMin,
            r: 20,
            letter: m.gameState.targetList[i],
            speed: (Math.random() * 2) + 1,
        };
        console.log(`${i}: ${target.letter} added`)
        target.text.textContent = m.gameState.targetList[i];
        target.circle.setAttribute('cy', target.y);
        target.text.setAttribute('y', target.y+10);
        target.circle.classList.remove('target-removal');
        target.text.classList.remove('target-removal');
        target.circle.classList.add('target-fade-in');
        target.text.classList.add('target-fade-in');

        targets.push(target);
    }
    m.gameState.currentWordIndex = 0;
    m.gameState.currentTargetIndex = 10;
}

function addTarget(i, letter){
    const target = targets[i];

    target.active = true;
    target.letter = letter;
    target.x = Math.random() * (svgContainerSize.width - 100) + 50;
    target.y = Math.random() * (svgContainerSize.height - 100) + 50;
    target.dx = (Math.random() * speedVar.xRange) + speedVar.xMin;
    target.dy = (Math.random() * speedVar.yRange) + speedVar.yMin;

    target.text.textContent = letter;
    target.circle.setAttribute('cy', target.y);
    target.text.setAttribute('y', target.y+10);
    target.circle.classList.remove('target-removal');
    target.text.classList.remove('target-removal');
    target.circle.classList.add('target-fade-in');
    target.text.classList.add('target-fade-in');
};

export async function moveTargets() {
    targets.forEach(t => {
        if (t.active) {
            t.x += t.dx;
            t.y += t.dy;

            if (t.x > svgContainerSize.width-15 || t.x < 20) {
                t.dx = (t.dx > 0) ? -randomDX() : randomDX() ;
                t.dy = (t.dy > 0) ? randomDY() : -randomDY() ;
                t.x = (t.x < 20) ? 20 : svgContainerSize.width-20;
            };

            if (t.y > svgContainerSize.height-72 || t.y < 72) {
                t.dx = (t.dx > 0) ? randomDX() : -randomDX() ;
                t.dy = (t.dy > 0) ? -randomDY() : randomDY() ;
                t.y = (t.y < 72) ? 72 : svgContainerSize.height-72;
            }

            t.circle.setAttribute("cx", t.x);
            t.circle.setAttribute("cy", t.y);
            t.text.setAttribute("x", t.x);
            t.text.setAttribute("y", t.y+10);
        };
    });

};

//----------- bang bang logic -------------//
const HIT = 'hit';
const MISS = 'miss';
const BIM = 'bim';

export function shoot(p) {
    p.player.bullets--;
    updateBulletDisplay(p.player.bullets);
    if (p.player.bullets <= 0) m.gameState.state = m.GAME_OVER;
    let targetHit = false;
    targets.forEach((target, i) => {
        const dx = p.player.x - target.x;
        const dy = p.player.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance <= p.player.radius + 1 && target.active) {
            targetHit = true;
            target.active = false;
            console.log(`${i}: ${target.letter} hit`)
            target.circle.classList.add('target-removal');
            target.text.classList.add('target-removal');
            let letter = target.letter;
            const result = checkWordCompletion(target.letter);
    
            if (result !== MISS) {
                letter = m.gameState.targetList[m.gameState.currentTargetIndex];
                m.gameState.currentTargetIndex++;
                if (result === BIM) {
                    m.gameState.currentWordIndex++;
                    if (m.gameState.currentWordIndex >= m.gameState.wordList.length){
                        m.gameState.state = m.COMPLETE;
                        return;
                    };
                };
                player.score += Math.floor(100 * (1+(player.combo/10)));
                player.combo++;
                showFeedback(result);
            };

            setTimeout(() => {
                target = addTarget(i, letter);
            }, 1100);
        }
    });

    if (!targetHit){
        player.combo = 0;
        showFeedback(MISS);
    }
    addBulletHole(player.x, player.y, targetHit);
    updateScoreDisplay();
}


function checkWordCompletion(letter){
    const wordObj = m.gameState.wordList[m.gameState.currentWordIndex];
    let [key, value] = Object.entries(wordObj)[0];
    const word = wordDisplay.textContent;
    const parts = word.split(/(?=[_A-Z])|(?<=[_A-Z])/);
    
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
            m.gameState.wordList[m.gameState.currentWordIndex][key] = value;
            console.log(wordDisplay.textContent)
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
    console.log(bulletHoleIndex);

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