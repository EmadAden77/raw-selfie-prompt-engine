import type { PlaceSceneProfile } from '../place-scene-profiles.js';
// Complete profile for محطة بنزين, canonical location-10.
export const location10: PlaceSceneProfile = {
  "id": "location-10",
  "arabicLabel": "محطة بنزين",
  "parking": "in the service position aligned with the left driver door beside the pump, pump on driver's left; do not block circulation",
  "preferredAngle": "driver",
  "angleReason": "an attainable handheld cabin selfie preserves driver-side perspective and keeps the face dominant",
  "ground": "scuffed concrete with realistic painted bay lines",
  "background": "pump canopy and service lane",
  "bestTime": "night",
  "goldenTime": "soft daylight near the opening or early evening under existing canopy lights",
  "day": {
    "source": "diffuse daylight entering through the open side of the petrol canopy",
    "kelvin": 5500,
    "shadows": "soft contact shadows aligned with daylight from the actual opening, never direct sun through the opaque roof",
    "reflections": "reflections from the selected opening or ceiling lamp only, muted on pearl-white paint and glass"
  },
  "night": {
    "source": "one existing petrol-station canopy luminaire above the driver's side",
    "kelvin": 4000,
    "shadows": "one coherent set of downward and rearward shadows cast by the single ceiling fixture",
    "reflections": "one restricted overhead highlight on real vehicle surfaces, with dark unlit surroundings"
  }
};
