import type { PlaceSceneProfile } from '../place-scene-profiles.js';
// Complete profile for دوار, canonical location-54.
export const location54: PlaceSceneProfile = {
  "id": "location-54",
  "arabicLabel": "دوار",
  "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
  "preferredAngle": "outside",
  "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
  "ground": "faded marked asphalt or worn parking concrete",
  "background": "legal parking near roundabout and visible traffic",
  "bestTime": "night",
  "goldenTime": "late afternoon with low natural sun",
  "day": {
    "source": "one natural sun from the actual open sky, with walls and roofs physically screening it where present",
    "kelvin": 5500,
    "shadows": "one set of sun-opposed shadows altered only by existing building occlusion",
    "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
  },
  "night": {
    "source": "one existing roundabout-adjacent legal-bay streetlight",
    "kelvin": 3000,
    "shadows": "one set of deep night shadows extending away from the selected real fixture",
    "reflections": "a localized muted fixture reflection on pearl-white paint and side glass"
  }
};
