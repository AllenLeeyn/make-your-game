import * as m from "./main.js";

const targetCircle = document.getElementsByClassName('target-circle');
const targetText = document.getElementsByClassName('target-text');

const speedVar = {
    xMin: 1,
    yMin: 0.5,
    xRange: 3,
    yRange: 3.5,
}

const randomDX = () => (Math.random() * speedVar.xRange) + speedVar.xMin;
const randomDY = () => (Math.random() * speedVar.yRange) + speedVar.yMin;

export function initTargets(){
    m.game.targets = [];

    for (let i = 0; i < 10; i++) {
        const target = {
            circle: targetCircle[i],
            text: targetText[i],
            r: 20,
        };
        m.game.targets.push(target);
        addTarget(i, m.game.targetList[i])

        console.log(`${i}: ${target.letter} added`)
    }
    m.game.currentWordIndex = 0;
    m.game.currentTargetIndex = 10;
}

export function addTarget(i, letter){
    const target = m.game.targets[i];

    target.active = true;
    target.letter = letter;
    target.x = Math.random() * (m.game.width - 100) + 50;
    target.y = Math.random() * (m.game.height - 100) + 50;
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

export function hideTarget(target){
    target.active = false;
    target.circle.classList.add('target-removal');
    target.text.classList.add('target-removal');
}

export async function moveTargets() {
    m.game.targets.forEach(t => {
        if (t.active) {
            t.x += t.dx;
            t.y += t.dy;

            if (t.x > m.game.width-15 || t.x < 20) {
                t.dx = (t.dx > 0) ? -randomDX() : randomDX() ;
                t.dy = (t.dy > 0) ? randomDY() : -randomDY() ;
                t.x = (t.x < 20) ? 20 : m.game.width-20;
            };

            if (t.y > m.game.height-72 || t.y < 72) {
                t.dx = (t.dx > 0) ? randomDX() : -randomDX() ;
                t.dy = (t.dy > 0) ? -randomDY() : randomDY() ;
                t.y = (t.y < 72) ? 72 : m.game.height-72;
            }

            t.circle.setAttribute("cx", t.x);
            t.circle.setAttribute("cy", t.y);
            t.text.setAttribute("x", t.x);
            t.text.setAttribute("y", t.y+10);
        };
    });

};
