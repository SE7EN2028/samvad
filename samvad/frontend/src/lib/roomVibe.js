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
    const hue2 = (hue + 30) % 360;
    return {
        "--room-primary": `hsl(${hue}, 70%, 62%)`,
        "--room-primary-dark": `hsl(${hue}, 76%, 48%)`,
        "--room-primary-light": `hsl(${hue}, 70%, 78%)`,
        "--room-glow": `hsla(${hue}, 70%, 60%, 0.18)`,
        "--room-bubble": `linear-gradient(135deg, hsl(${hue}, 70%, 56%), hsl(${hue2}, 72%, 44%))`,
        "--room-bubble-shadow": `hsla(${hue}, 70%, 50%, 0.28)`,
        "--room-header-border": `hsla(${hue}, 70%, 60%, 0.35)`,
        "--room-bg-glow": `radial-gradient(ellipse at 50% 0%, hsla(${hue}, 60%, 50%, 0.08) 0%, transparent 65%)`,
    };
}
