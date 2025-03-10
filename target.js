import { player } from "./player.js";
import * as m from "./main.js";
import { showFeedback, updateBulletDisplay } from "./ui.js";

const bgLayer = document.getElementById('bgLayer')
const targetsLayer = document.getElementById('targetsLayer')
const wordDisplay = document.getElementById('word-display');
const template = document.getElementById('hidden-template');

const svgContainerSize = {
    height: 600,
    width: 800
};

const speedVar = {
    xMin: 1,
    yMin: 0.5,
    xRange: 1,
    yRange: 0.5,
}

const randomDX = () => (Math.random() * speedVar.xRange) + speedVar.xMin;
const randomDY = () => (Math.random() * speedVar.yRange) + speedVar.yMin;

let targets = [];
let lastTargetIndex = 0;

function getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

export function createTargets(){
    targets.forEach(t=>{
        targetsLayer.removeChild(t.circle);
        targetsLayer.removeChild(t.text);
    });
    targets = [];

    // insert 5 random letters into target list 
    for (let i = 0; i < 5; i++) {
        const letter = getRandomLetter();
        createTarget(letter, i);
    }

    for (let i = 0; i < m.gameState.targetList.length; i++) {
        const letter = m.gameState.targetList[i];
        createTarget(letter, i+5);
    }
}

export function createTarget(letter, i) {
    const circle = template.getElementById('template-circle').cloneNode();
    const text = template.getElementById('template-text').cloneNode();

    const target = {
        index: i,
        active: false,
        circle: circle,
        text: text,
        dx: (Math.random() * speedVar.xRange) + speedVar.xMin,
        dy: (Math.random() * speedVar.yRange) + speedVar.yMin,
        r: 20,
        letter: letter,
        speed: (Math.random() * 2) + 1,
    }
    text.textContent = target.letter;

    targetsLayer.appendChild(circle);
    targetsLayer.appendChild(text);
    targets.push(target);
}

export function initTargets(){
    createTargets();

    targets.forEach(t=>{
        t.active = false;
        t.circle.setAttribute('cy', -100);
        t.text.setAttribute('y', -100);
    });
    m.gameState.currentWordIndex = 0;
    m.gameState.currentTargetIndex = 0;
    lastTargetIndex = 0;
    addTargets();
}

export function addTargets(){
    if (lastTargetIndex >= targets.length) return;
    for (let i = lastTargetIndex; lastTargetIndex < m.gameState.currentTargetIndex+10; i++) {
        addTarget(i);
        lastTargetIndex = i+1;
    };
}

function addTarget(i){
    console.log(`${targets[i].index}: ${targets[i].letter} added`)
    targets[i].x = Math.random() * (svgContainerSize.width - 100) + 50,
    targets[i].y = Math.random() * (svgContainerSize.height - 100) + 50,
    targets[i].circle.setAttribute('cy', targets[i].y);
    targets[i].text.setAttribute('y', targets[i].y+10);
    targets[i].circle.classList.remove('target-removal');
    targets[i].text.classList.remove('target-removal');
    targets[i].circle.classList.add('target-fade-in');
    targets[i].text.classList.add('target-fade-in');
    targets[i].active = true;
}

function hideTarget(i) {
    console.log(`${targets[i].index}: ${targets[i].letter} hide`)
    targets[i].ative = false;
    targets[i].circle.setAttribute('cy', -100);
    targets[i].text.setAttribute('y', -100);
}

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
    targets.forEach(target => {

        const dx = p.player.x - target.x;
        const dy = p.player.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance <= p.player.radius + 1 && target.active) {
            target.active = false;
            console.log(`${target.index}: ${target.letter} hit`)
            const bulletCircle = addBulletHole(player.x, player.y, targetsLayer);
            bulletCircle.classList.add('target-removal');
            target.circle.classList.add('target-removal');
            target.text.classList.add('target-removal');
            const result = checkWordCompletion(target.letter);
    
            setTimeout(() => {
                hideTarget(target.index);
            }, 1000);
    
            if (result === MISS) {
                setTimeout(() => {
                    addTarget(target.index);
                }, 1100);
            } else {
                targetHit = true;
                m.gameState.currentTargetIndex++;
                if (result === BIM) {
                    m.gameState.currentWordIndex++;
                    if (m.gameState.currentWordIndex >= m.gameState.wordList.length){
                        m.gameState.state = m.COMPLETE;
                        return;
                    };
                };
                showFeedback(result)
            };
        }
    });

    if (!targetHit){
        showFeedback(MISS)
        addBulletHole(player.x, player.y, bgLayer);
    }
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

function addBulletHole(x, y, layer) {
    const bulletCircle = document.getElementById('bullet-circle').cloneNode();
    bulletCircle.classList.remove('target-removal');

    bulletCircle.setAttribute('cx', x);
    bulletCircle.setAttribute('cy', y);
    layer.appendChild(bulletCircle);

    setTimeout(() => {
        layer.removeChild(bulletCircle);
    }, 1000);

    return bulletCircle;
}