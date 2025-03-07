import { player } from "./player.js";
import { gameState } from "./main.js";

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
let lastWordIndex = 0;

export function createTargets(){
    targets.forEach(t=>{
        targetsLayer.removeChild(t.circle);
        targetsLayer.removeChild(t.text);
    });
    targets = [];
    for (let i = 0; i < gameState.targetList.length; i++) {
        const letter = gameState.targetList[i];
        createTarget(letter);
    }
}

export function initTargets(){
    targets.forEach(t=>{
        t.state = false;
        t.circle.setAttribute('cy', -100);
        t.text.setAttribute('y', -100);
    });
    gameState.currentWordIndex = 0;
    lastWordIndex = 0;
    addTargets();
}

export function addTargets(){
    if (lastWordIndex >= targets.length) return;
    for (let i = lastWordIndex; lastWordIndex < gameState.currentWordIndex+10; i++) {
        targets[i].x = Math.random() * (svgContainerSize.width - 100) + 50,
        targets[i].y = Math.random() * (svgContainerSize.height - 100) + 50,
        targets[i].circle.setAttribute('cy', targets[i].y);
        targets[i].text.setAttribute('y', targets[i].y+10);
        targets[i].circle.classList.add('target-fade-in');
        targets[i].text.classList.add('target-fade-in');
        targets[i].state = true;
        lastWordIndex = i+1;
    };
}

function createTarget(letter) {
    const circle = template.getElementById('template-circle').cloneNode();
    const text = template.getElementById('template-text').cloneNode();

    const target = {
        state: false,
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

export async function moveTargets() {
    targets.forEach(t => {
        if (t.state) {
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

export function checkTargetHit(p) {
    console.log('bang')
    const bulletCircle = addBulletHole(player.x, player.y);

    targets.forEach(target => {
        const dx = p.player.x - target.x;
        const dy = p.player.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= p.player.radius + 1) {
            console.log("Hit target: ", target.letter);
            targets = targets.filter(t => t !== target);
            bulletCircle.classList.add('target-removal');
            target.circle.classList.add('target-removal');
            target.text.classList.add('target-removal');
            checkWordCompletion(target.letter);
            //gameState.currentWordIndex++;

            setTimeout(() => {
                targetsLayer.removeChild(target.circle);
                targetsLayer.removeChild(target.text);
            }, 1000);
        }
    });
}

function checkWordCompletion(letter){
    const wordObj = gameState.wordList[gameState.currentWordIndex];
    const word = wordDisplay.textContent;
    const parts = word.split(/(?=[_A-Z])|(?<=[_A-Z])/);
    
    let underscoreCount = 0;
    for (let key in wordObj) {
        const value = wordObj[key];
        for (let i = 0; i < value.length; i++) {
            if (value[i] === letter){
                for (let j = 0; j < parts.length; j++) {
                    if(parts[j] === '_') underscoreCount++;

                    if (underscoreCount === i+1){
                        parts[j] = letter;
                        break;
                    }
                }
                console.log(parts);
                wordDisplay.textContent = parts.join('');
                gameState.wordList[gameState.currentWordIndex] = value.filter((v) => v !== letter)
                console.log(gameState.wordList[gameState.currentWordIndex])
            }
        }
    }
}

function addBulletHole(x, y) {
    const bulletCircle = document.getElementById('bullet-circle').cloneNode();
    
    bulletCircle.classList.remove('target-removal');

    bulletCircle.setAttribute('cx', x);
    bulletCircle.setAttribute('cy', y);

    targetsLayer.appendChild(bulletCircle);

    setTimeout(() => {
        targetsLayer.removeChild(bulletCircle);
    }, 1000);

    return bulletCircle;
}