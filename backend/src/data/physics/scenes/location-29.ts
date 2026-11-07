import type { PlaceSceneProfile } from '../place-scene-profiles.js';
// Complete profile for مواقف تحت الأرض, canonical location-29.
export const location29: PlaceSceneProfile = {
  "id": "location-29",
  "arabicLabel": "مواقف تحت الأرض",
  "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
  "preferredAngle": "driver",
  "angleReason": "an attainable handheld cabin selfie preserves driver-side perspective and keeps the face dominant",
  "ground": "scuffed concrete with realistic painted bay lines",
  "background": "concrete columns and underground bays",
  "bestTime": "night",
  "goldenTime": "soft daylight near the opening or early evening under existing canopy lights",
  "day": {
    "source": "one existing underground garage ceiling fixture",
    "kelvin": 4000,
    "shadows": "contact shadows directly below the single ceiling lamp",
    "reflections": "reflections from the selected opening or ceiling lamp only, muted on pearl-white paint and glass"
  },
  "night": {
    "source": "one existing underground garage ceiling fixture",
    "kelvin": 4000,
    "shadows": "one coherent set of downward and rearward shadows cast by the single ceiling fixture",
    "reflections": "one restricted overhead highlight on real vehicle surfaces, with dark unlit surroundings"
  }
};
