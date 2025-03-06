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

let targets = [];
const targetCount = 10;
const template = document.getElementById('hidden-template');

export function createTargets(){
    for (let i = targets.length; i < targetCount; i++){
        const circle = template.getElementById('template-circle').cloneNode();
        const text = template.getElementById('template-text').cloneNode();

        const target = {
            circle: circle,
            text: text,
            x: Math.random() * (svgContainerSize.width - 100) + 50,
            y: Math.random() * (svgContainerSize.height - 100) + 50,
            dx: (Math.random() * 6) - 3,
            dy: (Math.random() * 6) - 3,
            r: 20,
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
        t.x += t.dx;
        t.y += t.dy;

        if (t.x > svgContainerSize.width+40 || t.x < -40) {
            const randomDX = (Math.random() * 2.25)+0.75;
            const randomDY = (Math.random() * 2.25)+0.75;
            t.dx = (t.dx > 0) ? -randomDX : randomDX ;
            t.dy = (t.dy > 0) ? randomDY : -randomDY ;
        };

        if (t.y > svgContainerSize.height+40 || t.y < -40) {
            const randomDX = (Math.random() * 2.25)+0.75;
            const randomDY = (Math.random() * 2.25)+0.75;
            t.dx = (t.dx > 0) ? randomDX : -randomDX ;
            t.dy = (t.dy > 0) ? -randomDX : randomDX ;
        }

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