const COLORS = ["#d0bcff", "#5de6ff", "#a2eeff", "#e9ddff", "#a078ff", "#2fd9f4", "#ec4899", "#fbbf24"];
const SHAPES = ["circle", "square", "ribbon"];

export function launchConfetti() {
    const count = 120;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const el = document.createElement("div");
            const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const size = Math.random() * 9 + 5;
            const startX = Math.random() * 100;
            const duration = Math.random() * 2.5 + 2;
            const drift = (Math.random() - 0.5) * 200;
            const rotation = Math.random() * 720 - 360;

            el.style.cssText = `
                position: fixed;
                top: -20px;
                left: ${startX}vw;
                width: ${shape === "ribbon" ? size * 0.4 : size}px;
                height: ${shape === "ribbon" ? size * 2.5 : size}px;
                background: ${color};
                border-radius: ${shape === "circle" ? "50%" : shape === "square" ? "2px" : "1px"};
                z-index: 9999;
                pointer-events: none;
                animation: confetti-fall ${duration}s ease-in forwards;
                --drift: ${drift}px;
                --rotation: ${rotation}deg;
                opacity: 1;
            `;

            document.body.appendChild(el);
            setTimeout(() => el.remove(), (duration + 0.5) * 1000);
        }, Math.random() * 600);
    }
}

export function launchActionAnimation(action) {
    if (action === "celebrate") {
        return launchConfetti();
    }

    const emojis = {
        laugh: ["😂", "🤣", "💀", "😭"],
        angry: ["😡", "🤬", "🔥", "💢"],
        surprised: ["😮", "😲", "🤯", "👀"]
    };

    const selected = emojis[action] || ["✨"];
    const count = 40;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const el = document.createElement("div");
            const emoji = selected[Math.floor(Math.random() * selected.length)];
            const startX = Math.random() * 100;
            const duration = Math.random() * 2 + 2;
            const drift = (Math.random() - 0.5) * 200;
            const rotation = Math.random() * 60 - 30;
            const size = Math.random() * 20 + 24;

            el.innerHTML = emoji;
            el.style.cssText = `
                position: fixed;
                bottom: -40px;
                left: ${startX}vw;
                font-size: ${size}px;
                z-index: 9999;
                pointer-events: none;
                animation: emoji-float ${duration}s ease-out forwards;
                --drift: ${drift}px;
                --rotation: ${rotation}deg;
                opacity: 1;
            `;

            document.body.appendChild(el);
            setTimeout(() => el.remove(), (duration + 0.5) * 1000);
        }, Math.random() * 400);
    }
}
