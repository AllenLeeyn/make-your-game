import { game } from "./main.js";

const TARGET_CIRCLE = document.getElementsByClassName('target-circle');
const TARGET_TEXT = document.getElementsByClassName('target-text');

const SPEED_VAR = {
    xMin: 1,
    yMin: 0.5,
    xRange: 3,
    yRange: 3.5,
}

const randomDash = () => (Math.random() < 0.1) ? 3 : 1;
const randomDX = () => ((Math.random() * SPEED_VAR.xRange) + SPEED_VAR.xMin) * randomDash();
const randomDY = () => ((Math.random() * SPEED_VAR.yRange) + SPEED_VAR.yMin) * randomDash();

export async function initTargets(){
    game.targets = new Array(10).fill({});

    for (let i = 0; i < 10; i++) {
        addTarget(i, game.targetList[i])
        console.log(`${i}: ${game.targets[i].letter} added`)
    }
    game.currentWordIndex = 0;
    game.currentTargetIndex = 10;
}

export async function addTarget(i, letter){
    const t = {
        circle: TARGET_CIRCLE[i],
        text: TARGET_TEXT[i],
        r: 20,
    };

    t.active = true;
    t.letter = letter;
    t.x = Math.random() * (game.width - 100) + 50;
    t.y = Math.random() * (game.height - 100) + 50;
    t.dx = randomDX();
    t.dy = randomDY();

    t.text.textContent = letter;
    setTargetPosition(t)
    t.circle.classList.remove('target-removal');
    t.text.classList.remove('target-removal');
    t.circle.classList.add('target-fade-in');
    t.text.classList.add('target-fade-in');

    game.targets[i] = t;
};

export async function hideTarget(t){
    t.active = false;
    t.circle.classList.add('target-removal');
    t.text.classList.add('target-removal');
}

export async function moveTargets() {
    game.targets.forEach(async t => {
        if (t.active) {
            t.x += t.dx;
            t.y += t.dy;

            if (t.x > game.width-20 || t.x < 20) {
                t.dx = (t.dx > 0) ? -randomDX() : randomDX() ;
                t.dy = (t.dy > 0) ? randomDY() : -randomDY() ;
                t.x = (t.x < 20) ? 20 : game.width-20;
            };
            if (t.y > game.height-72 || t.y < 72) {
                t.dx = (t.dx > 0) ? randomDX() : -randomDX() ;
                t.dy = (t.dy > 0) ? -randomDY() : randomDY() ;
                t.y = (t.y < 72) ? 72 : game.height-72;
            }
            setTargetPosition(t)
        };
    });
};

async function setTargetPosition(t){
    t.circle.setAttribute("cx", t.x);
    t.circle.setAttribute("cy", t.y);
    t.text.setAttribute("x", t.x);
    t.text.setAttribute("y", t.y+10);
}
