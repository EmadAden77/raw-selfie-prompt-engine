export const INTERIOR_RULE = 'The vehicle is a 2022 Range Rover Sport with a pearl-white exterior. Its interior must consistently feature a luxurious light beige leather cabin, premium beige front seats with visible longitudinal stitching and supportive side bolsters, a large beige leather center armrest, beige leather door panels with darker upper sections, elegant integrated door handles, glossy dark wood trim, subtle chrome accents, and piano-black details. The center console features glossy dark wood, a realistically positioned modern gear selector, and neatly arranged driving-mode and vehicle controls. The three-spoke steering wheel is wrapped in black leather, with integrated multifunction buttons, the Range Rover emblem in the center, and a modern digital instrument cluster behind it. The dashboard features a centrally positioned portrait-oriented infotainment display with a glossy black surround, with climate controls and metallic rotary dials below. A large panoramic glass roof, soft interior LED lighting, and subtle ambient illumination complete the cabin. Preserve realistic automotive geometry, natural material textures, accurate reflections, and a premium factory-finished appearance. Never alter the specified interior colors, steering wheel color, materials, or cabin layout.';

// Angle is the authoritative field of view. An exterior selfie cannot be widened
// to reveal a cabin simply because a conflicting seated pose was selected.
export function cabinMayBeVisible(selfieAngleId: string, poseId: string): boolean {
  const angle = Number(selfieAngleId.split('-').at(-1));
  const pose = Number(poseId.split('-').at(-1));
  const interiorAngles = new Set([1, 4, 5, 6, 7, 8, 12, 13, 14, 15]);
  const closeAngles = new Set([2, 3, 9, 10, 11]);
  return interiorAngles.has(angle) || (closeAngles.has(angle) && pose >= 1 && pose <= 15);
}

export const INTERIOR_VISIBILITY_RULE = 'Use these interior specifications only for cabin surfaces naturally visible in the selected selfie framing. Never reveal the full dashboard, roof, seats or steering wheel merely to display them; retain factory-correct locations, orientation, materials and lighting without mirrored or rearranged components.';
