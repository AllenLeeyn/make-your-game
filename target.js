import * as m from "./main.js";

const targetCircle = document.getElementsByClassName('target-circle');
const targetText = document.getElementsByClassName('target-text');

const speedVar = {
    xMin: 1,
    yMin: 0.5,
    xRange: 3,
    yRange: 3.5,
}

const randomDash = () => (Math.random() < 0.1) ? 3 : 1;
const randomDX = () => ((Math.random() * speedVar.xRange) + speedVar.xMin) * randomDash();
const randomDY = () => ((Math.random() * speedVar.yRange) + speedVar.yMin) * randomDash();

export function initTargets(){
    m.GAME.targets = [];

    for (let i = 0; i < 10; i++) {
        const t = {
            circle: targetCircle[i],
            text: targetText[i],
            r: 20,
        };
        m.GAME.targets.push(t);
        addTarget(i, m.GAME.targetList[i])

        console.log(`${i}: ${t.letter} added`)
    }
    m.GAME.currentWordIndex = 0;
    m.GAME.currentTargetIndex = 10;
}

export function addTarget(i, letter){
    const t = m.GAME.targets[i];

    t.active = true;
    t.letter = letter;
    t.x = Math.random() * (m.GAME.width - 100) + 50;
    t.y = Math.random() * (m.GAME.height - 100) + 50;
    t.dx = randomDX();
    t.dy = randomDY();

    t.text.textContent = letter;
    setTargetPosition(t)
    t.circle.classList.remove('target-removal');
    t.text.classList.remove('target-removal');
    t.circle.classList.add('target-fade-in');
    t.text.classList.add('target-fade-in');
};

export function hideTarget(t){
    t.active = false;
    t.circle.classList.add('target-removal');
    t.text.classList.add('target-removal');
}

export async function moveTargets() {
    m.GAME.targets.forEach(t => {
        if (t.active) {
            t.x += t.dx;
            t.y += t.dy;

            if (t.x > m.GAME.width-20 || t.x < 20) {
                t.dx = (t.dx > 0) ? -randomDX() : randomDX() ;
                t.dy = (t.dy > 0) ? randomDY() : -randomDY() ;
                t.x = (t.x < 20) ? 20 : m.GAME.width-20;
            };
            if (t.y > m.GAME.height-72 || t.y < 72) {
                t.dx = (t.dx > 0) ? randomDX() : -randomDX() ;
                t.dy = (t.dy > 0) ? -randomDY() : randomDY() ;
                t.y = (t.y < 72) ? 72 : m.GAME.height-72;
            }
            setTargetPosition(t)
        };
    });
};

function setTargetPosition(t){
    t.circle.setAttribute("cx", t.x);
    t.circle.setAttribute("cy", t.y);
    t.text.setAttribute("x", t.x);
    t.text.setAttribute("y", t.y+10);
}
