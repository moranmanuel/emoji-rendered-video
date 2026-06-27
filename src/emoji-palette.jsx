export const EMOJI_PALETTE = [
  { emoji: "⬛", r: 30,  g: 30,  b: 30  },
  { emoji: "⬜", r: 240, g: 240, b: 240 },
  { emoji: "🟥", r: 196, g: 30,  b: 30  },
  { emoji: "🟧", r: 230, g: 126, b: 34  },
  { emoji: "🟨", r: 241, g: 196, b: 15  },
  { emoji: "🟩", r: 39,  g: 174, b: 96  },
  { emoji: "🟦", r: 41,  g: 128, b: 185 },
  { emoji: "🟫", r: 139, g: 90,  b: 43  },
  { emoji: "🟪", r: 142, g: 68,  b: 173 },
];

export function closestEmoji(r, g, b) {
  let best = null;
  let bestDist = Infinity;

  for (const e of EMOJI_PALETTE) {
    const dist = (r - e.r) ** 2 + (g - e.g) ** 2 + (b - e.b) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = e;
    }
  }

  return best.emoji;
}