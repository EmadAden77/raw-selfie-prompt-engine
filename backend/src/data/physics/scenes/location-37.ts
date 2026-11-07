import type { PlaceSceneProfile } from '../place-scene-profiles.js';
// Complete profile for ملعب حي, canonical location-37.
export const location37: PlaceSceneProfile = {
  "id": "location-37",
  "arabicLabel": "ملعب حي",
  "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
  "preferredAngle": "outside",
  "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
  "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
  "background": "local pitch fence and pedestrians",
  "bestTime": "night",
  "goldenTime": "late afternoon with low natural sun",
  "day": {
    "source": "one natural sun from the actual open sky, with walls and roofs physically screening it where present",
    "kelvin": 5500,
    "shadows": "one set of sun-opposed shadows altered only by existing building occlusion",
    "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
  },
  "night": {
    "source": "one existing neighborhood football pitch perimeter fixture",
    "kelvin": 3000,
    "shadows": "one set of deep night shadows extending away from the selected real fixture",
    "reflections": "a localized muted fixture reflection on pearl-white paint and side glass"
  }
};
