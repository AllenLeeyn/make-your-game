const targetsLayer = document.getElementById('targetsLayer')

const svgContainerSize = {
    height: 600,
    width: 800
};

function getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function getMoveParameter(){    
    const m = (Math.random() * 700) - 50;
    const c = (Math.random() * 0.7) - 0.05;
    const x = Math.random() * (svgContainerSize.width - 40) + 15;
    return {
        m: m,
        c: c,
        x: x,
        y: m + (x*c),
        direction: Math.random() < 0.5 ? 1 : -1,
    }
}

let targets = [];
const targetCount = 10;
const template = document.getElementById('hidden-template');

export function createTargets(){
    for (let i = targets.length; i < targetCount; i++){
        const circle = template.getElementById('template-circle').cloneNode();
        const text = template.getElementById('template-text').cloneNode();
        const moveParameter = getMoveParameter();

        const target = {
            circle: circle,
            text: text,
            x: moveParameter.x,
            y: moveParameter.y,
            m: moveParameter.m,
            c: moveParameter.c,
            r: 15,
            direction: moveParameter.direction,
            letter: getRandomLetter(),
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
}

export async function moveTargets() {
    targets.forEach(t => {
        t.x += t.direction * t.speed;
        t.y = t.m + (t.c * t.x);

        if (t.x > svgContainerSize.width + 30 || t.x < -30){
            t.direction = Math.random() < 0.5 ? 1 : -1;
            t.speed = (t.direction < 0) ? -t.speed : t.speed;
            t.x = (t.speed < 0) ? svgContainerSize.width + 30 : -30;
            t.m = (Math.random() * 660) -30;
            t.c = (Math.random() * 0.7) -0.05;
        };

        if (t.y > svgContainerSize.height + 30) {t.y = -30;}
        if (t.y < -30)t.y = svgContainerSize.height + 30;

        t.circle.setAttribute("cx", t.x);
        t.circle.setAttribute("cy", t.y);

        t.text.setAttribute("x", t.x);
        t.text.setAttribute("y", t.y+10);
    });

};

export function checkTargetHit(p) {
    targets.forEach(target => {
        const dx = p.player.x - target.x;
        const dy = p.player.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        console.log(distance)
        if (distance <= p.player.radius + 1) {
            console.log(distance)
            console.log("Hit target: ", target.letter);
            targets = targets.filter(t => t !== target);
            target.circle.classList.add('target-removal');
            target.text.classList.add('target-removal');

            setTimeout(() => {
                // Remove the target from the SVG after the timeout
                targetsLayer.removeChild(target.circle);
                targetsLayer.removeChild(target.text);
            }, 1000); // 500ms delay (0.5s)
        }
    });
}