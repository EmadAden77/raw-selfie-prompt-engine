import type { PlaceSceneProfile } from '../place-scene-profiles.js';
// Complete profile for حديقة عامة, canonical location-38.
export const location38: PlaceSceneProfile = {
  "id": "location-38",
  "arabicLabel": "حديقة عامة",
  "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
  "preferredAngle": "outside",
  "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
  "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
  "background": "park fence, paths and passersby",
  "bestTime": "night",
  "goldenTime": "late afternoon with low natural sun",
  "day": {
    "source": "one natural sun from the actual open sky, with walls and roofs physically screening it where present",
    "kelvin": 5500,
    "shadows": "one set of sun-opposed shadows altered only by existing building occlusion",
    "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
  },
  "night": {
    "source": "one existing garden path lighting fixture",
    "kelvin": 3000,
    "shadows": "one set of deep night shadows extending away from the selected real fixture",
    "reflections": "a localized muted fixture reflection on pearl-white paint and side glass"
  }
};
