import type { PlaceSceneProfile } from '../place-scene-profiles.js';
// Complete profile for محطة شحن, canonical location-13.
export const location13: PlaceSceneProfile = {
  "id": "location-13",
  "arabicLabel": "محطة شحن",
  "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
  "preferredAngle": "driver",
  "angleReason": "an attainable handheld cabin selfie preserves driver-side perspective and keeps the face dominant",
  "ground": "scuffed concrete with realistic painted bay lines",
  "background": "charging pedestal and marked service bay",
  "bestTime": "night",
  "goldenTime": "soft daylight near the opening or early evening under existing canopy lights",
  "day": {
    "source": "diffuse daylight entering through the open side of the charging canopy",
    "kelvin": 5500,
    "shadows": "soft contact shadows aligned with daylight from the actual opening, never direct sun through the opaque roof",
    "reflections": "reflections from the selected opening or ceiling lamp only, muted on pearl-white paint and glass"
  },
  "night": {
    "source": "one existing charging-bay canopy luminaire",
    "kelvin": 4000,
    "shadows": "one coherent set of downward and rearward shadows cast by the single ceiling fixture",
    "reflections": "one restricted overhead highlight on real vehicle surfaces, with dark unlit surroundings"
  }
};
