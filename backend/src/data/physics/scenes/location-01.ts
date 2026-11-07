import type { PlaceSceneProfile } from '../place-scene-profiles.js';
// Complete profile for جانب طريق صحراوي, canonical location-1.
export const location01: PlaceSceneProfile = {
  "id": "location-1",
  "arabicLabel": "جانب طريق صحراوي",
  "parking": "on firm level sand or a safe road shoulder, aligned with its real edge, no invented curb",
  "preferredAngle": "outside",
  "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
  "ground": "compacted sand, dusty roadside and uneven tyre impressions",
  "background": "dusty roadside and distant traffic",
  "bestTime": "day",
  "goldenTime": "late afternoon before sunset",
  "day": {
    "source": "one natural sun from the actual open sky, with walls and roofs physically screening it where present",
    "kelvin": 5500,
    "shadows": "grounded shadows away from the unobstructed sun",
    "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
  },
  "night": {
    "source": "dim natural night sky alone, without an invented streetlamp",
    "kelvin": 4000,
    "shadows": "deep low-contrast darkness, only faint grounded contact shadowing",
    "reflections": "very faint sky reflections on paint and glass, no illuminated empty background"
  }
};
