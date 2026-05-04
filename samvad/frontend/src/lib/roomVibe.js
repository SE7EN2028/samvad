export function roomIdToHue(roomId) {
    let hash = 0;
    for (let i = 0; i < roomId.length; i++) {
        hash = roomId.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }
    return Math.abs(hash) % 360;
}

export function getRoomVibe(roomId) {
    const hue = roomIdToHue(roomId);
    return {
        "--room-primary": `hsl(${hue}, 85%, 78%)`,
        "--room-primary-dark": `hsl(${hue}, 60%, 32%)`,
        "--room-primary-light": `hsl(${hue}, 90%, 88%)`,
        "--room-glow": `hsla(${hue}, 85%, 72%, 0.22)`,
        "--room-bubble": `hsla(${hue}, 85%, 72%, 0.18)`,
        "--room-bubble-shadow": `hsla(${hue}, 85%, 65%, 0.22)`,
        "--room-header-border": `hsla(${hue}, 85%, 72%, 0.35)`,
        "--room-bg-glow": `radial-gradient(ellipse at 50% 0%, hsla(${hue}, 80%, 65%, 0.12) 0%, transparent 70%)`,
    };
}
