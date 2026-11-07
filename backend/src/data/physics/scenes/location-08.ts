import type { PlaceSceneProfile } from '../place-scene-profiles.js';
// Complete profile for مدخل مواقف مركز تسوق, canonical location-8.
export const location08: PlaceSceneProfile = {
  "id": "location-8",
  "arabicLabel": "مدخل مواقف مركز تسوق",
  "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
  "preferredAngle": "driver",
  "angleReason": "an attainable handheld cabin selfie preserves driver-side perspective and keeps the face dominant",
  "ground": "scuffed concrete with realistic painted bay lines",
  "background": "ramp wall, tyre tracks and garage openings",
  "bestTime": "night",
  "goldenTime": "soft daylight near the opening or early evening under existing canopy lights",
  "day": {
    "source": "directional diffuse skylight entering through the real parking-ramp opening",
    "kelvin": 5500,
    "shadows": "soft contact shadows aligned with daylight from the actual opening, never direct sun through the opaque roof",
    "reflections": "reflections from the selected opening or ceiling lamp only, muted on pearl-white paint and glass"
  },
  "night": {
    "source": "one existing ceiling fixture over the parking ramp",
    "kelvin": 4000,
    "shadows": "one coherent set of downward and rearward shadows cast by the single ceiling fixture",
    "reflections": "one restricted overhead highlight on real vehicle surfaces, with dark unlit surroundings"
  }
};
