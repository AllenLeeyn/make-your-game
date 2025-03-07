import { player } from "./player.js";

const targetsLayer = document.getElementById('targetsLayer')
const template = document.getElementById('hidden-template');

const targetCount = 10;

const svgContainerSize = {
    height: 600,
    width: 800
};

const speedVar = {
    xMin: 1,
    yMin: 0.5,
    xRange: 4,
    yRange: 4.5
}

let validAnswers = []; // This will store all the missing letters from each wordList

export function setValidAnswers(answers) {
    validAnswers = answers;
    //console.log("Valid answers set: ", validAnswers);
}

let targets = [];
export function initTargets(){
    targets.forEach(t=>{
        targetsLayer.removeChild(t.circle);
        targetsLayer.removeChild(t.text);
    });
    targets = [];
    createTargets();
}

let currentIndex = 0;
export function createTargets(){
    for (let i = 0; i < validAnswers.length; i++) {
        const letter = validAnswers[i];
        createTarget(letter);
        i++;
    }
}

function createTarget(letter) {
    const circle = template.getElementById('template-circle').cloneNode();
    const text = template.getElementById('template-text').cloneNode();

    const target = {
        circle: circle,
        text: text,
        x: Math.random() * (svgContainerSize.width - 100) + 50,
        y: Math.random() * (svgContainerSize.height - 100) + 50,
        dx: (Math.random() * speedVar.xRange) + speedVar.xMin,
        dy: (Math.random() * speedVar.yRange) + speedVar.yMin,
        r: 20,
        letter: letter,
        speed: (Math.random() * 2) + 1,
    }
    circle.setAttribute('cx', target.x);
    circle.setAttribute('cy', target.y);
    circle.setAttribute('fill', 'red');
    
    text.setAttribute('x', target.x);
    text.setAttribute('y', target.y+10);
    text.textContent = target.letter;

    targetsLayer.appendChild(circle);
    targetsLayer.appendChild(text);
    circle.classList.add('target-fade-in');
    text.classList.add('target-fade-in');
    targets.push(target);
}

export async function moveTargets() {
    targets.forEach(t => {
        t.x += t.dx;
        t.y += t.dy;

        if (t.x > svgContainerSize.width-15 || t.x < 20) {
            const randomDX = (Math.random() * speedVar.xRange) + speedVar.xMin;
            const randomDY = (Math.random() * speedVar.yRange) + speedVar.yMin;
            t.dx = (t.dx > 0) ? -randomDX : randomDX ;
            t.dy = (t.dy > 0) ? randomDY : -randomDY ;
            t.x = (t.x < 20) ? 20 : svgContainerSize.width-20;
        };

        if (t.y > svgContainerSize.height-72 || t.y < 72) {
            const randomDX = (Math.random() * speedVar.xRange) + speedVar.xMin;
            const randomDY = (Math.random() * speedVar.yRange) + speedVar.yMin;
            t.dx = (t.dx > 0) ? randomDX : -randomDX ;
            t.dy = (t.dy > 0) ? -randomDY : randomDY ;
            t.y = (t.y < 72) ? 72 : svgContainerSize.height-72;
        }

        t.circle.setAttribute("cx", t.x);
        t.circle.setAttribute("cy", t.y);
        t.text.setAttribute("x", t.x);
        t.text.setAttribute("y", t.y+10);
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

            setTimeout(() => {
                targetsLayer.removeChild(target.circle);
                targetsLayer.removeChild(target.text);
            }, 1000);
        }
    });
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