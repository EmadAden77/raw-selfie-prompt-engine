// Complete immutable location-specific profiles; canonical order is checked against option-mappings.
import { optionCatalogue } from '../option-mappings.js';
export type ScenePeriod = 'day' | 'night';
export type PreferredAngle = 'driver' | 'passenger' | 'outside';
export interface SceneIllumination { readonly source:string; readonly kelvin:number; readonly shadows:string; readonly reflections:string }
export interface PlaceSceneProfile {
 readonly id:string; readonly arabicLabel:string; readonly parking:string; readonly preferredAngle:PreferredAngle;
 readonly angleReason:string; readonly ground:string; readonly background:string;
 readonly bestTime:ScenePeriod; readonly goldenTime:string;
 readonly day:SceneIllumination; readonly night:SceneIllumination;
}
const rows:readonly PlaceSceneProfile[] = [
  {
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
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "actually illuminated vehicle headlights only when switched on; otherwise dim sky",
      "kelvin": 4000,
      "shadows": "deep darkness and only source-aligned local shadows",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-2",
    "arabicLabel": "طريق صحراوي ترابي",
    "parking": "on firm level sand or a safe road shoulder, aligned with its real edge, no invented curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "compacted sand, dusty roadside and uneven tyre impressions",
    "background": "rough sand and weathered roadway",
    "bestTime": "day",
    "goldenTime": "late afternoon before sunset",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "actually illuminated vehicle headlights only when switched on; otherwise dim sky",
      "kelvin": 4000,
      "shadows": "deep darkness and only source-aligned local shadows",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-3",
    "arabicLabel": "الصحراء وقت الغروب",
    "parking": "on firm level sand or a safe road shoulder, aligned with its real edge, no invented curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "compacted sand, dusty roadside and uneven tyre impressions",
    "background": "low horizon and dry tire tracks",
    "bestTime": "night",
    "goldenTime": "late afternoon before sunset",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "actually illuminated vehicle headlights only when switched on; otherwise dim sky",
      "kelvin": 4000,
      "shadows": "deep darkness and only source-aligned local shadows",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-4",
    "arabicLabel": "طريق صحراوي ليلاً",
    "parking": "on firm level sand or a safe road shoulder, aligned with its real edge, no invented curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "compacted sand, dusty roadside and uneven tyre impressions",
    "background": "dim road edge and unlit sand",
    "bestTime": "night",
    "goldenTime": "late afternoon before sunset",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "actually illuminated vehicle headlights only when switched on; otherwise dim sky",
      "kelvin": 4000,
      "shadows": "deep darkness and only source-aligned local shadows",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-5",
    "arabicLabel": "استراحة صحراوية",
    "parking": "on firm level sand or a safe road shoulder, aligned with its real edge, no invented curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "compacted sand, dusty roadside and uneven tyre impressions",
    "background": "plain rest shelter and nearby parked vehicles",
    "bestTime": "day",
    "goldenTime": "late afternoon before sunset",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "actually illuminated vehicle headlights only when switched on; otherwise dim sky",
      "kelvin": 4000,
      "shadows": "deep darkness and only source-aligned local shadows",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-6",
    "arabicLabel": "بوابة مركز تسوق",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "plain entrance and pedestrians",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-7",
    "arabicLabel": "مواقف مركز تسوق",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "marked bays and shoppers' parked cars",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
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
      "source": "daylight entering through actual openings, or an existing ceiling fixture if daylight cannot reach",
      "kelvin": 4000,
      "shadows": "soft contact shadows in actual shade, no direct sun through opaque roof",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing overhead canopy or garage fixture",
      "kelvin": 4000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-9",
    "arabicLabel": "كشك قهوة قرب مركز تسوق",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "takeaway hatch and waiting customers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
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
      "source": "daylight entering through actual openings, or an existing ceiling fixture if daylight cannot reach",
      "kelvin": 4000,
      "shadows": "soft contact shadows in actual shade, no direct sun through opaque roof",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing overhead canopy or garage fixture",
      "kelvin": 4000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-11",
    "arabicLabel": "مضخة البنزين",
    "parking": "in the service position aligned with the left driver door beside the pump, pump on driver's left; do not block circulation",
    "preferredAngle": "driver",
    "angleReason": "an attainable handheld cabin selfie preserves driver-side perspective and keeps the face dominant",
    "ground": "scuffed concrete with realistic painted bay lines",
    "background": "driver-side pump, hose and canopy column",
    "bestTime": "night",
    "goldenTime": "soft daylight near the opening or early evening under existing canopy lights",
    "day": {
      "source": "daylight entering through actual openings, or an existing ceiling fixture if daylight cannot reach",
      "kelvin": 4000,
      "shadows": "soft contact shadows in actual shade, no direct sun through opaque roof",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing overhead canopy or garage fixture",
      "kelvin": 4000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-12",
    "arabicLabel": "مغسلة سيارات",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "driver",
    "angleReason": "an attainable handheld cabin selfie preserves driver-side perspective and keeps the face dominant",
    "ground": "scuffed concrete with realistic painted bay lines",
    "background": "wash bay, drain and wet concrete only if wet",
    "bestTime": "night",
    "goldenTime": "soft daylight near the opening or early evening under existing canopy lights",
    "day": {
      "source": "daylight entering through actual openings, or an existing ceiling fixture if daylight cannot reach",
      "kelvin": 4000,
      "shadows": "soft contact shadows in actual shade, no direct sun through opaque roof",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing overhead canopy or garage fixture",
      "kelvin": 4000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
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
      "source": "daylight entering through actual openings, or an existing ceiling fixture if daylight cannot reach",
      "kelvin": 4000,
      "shadows": "soft contact shadows in actual shade, no direct sun through opaque roof",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing overhead canopy or garage fixture",
      "kelvin": 4000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-14",
    "arabicLabel": "استراحة طريق",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "service buildings and parked travelers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-15",
    "arabicLabel": "باب فيلا",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "villa gate and concrete boundary wall",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing villa gate wall light",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-16",
    "arabicLabel": "فيلا بسور",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "continuous villa wall and gate",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing villa gate wall light",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-17",
    "arabicLabel": "فيلا ليلاً",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "villa gate with existing wall fixture",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing villa gate wall light",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-18",
    "arabicLabel": "عمارة سكنية",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "apartment doors and parked vehicles",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-19",
    "arabicLabel": "شقق سكنية",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "building frontage and residents",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-20",
    "arabicLabel": "بيت صديق",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "ordinary home gate and surrounding houses",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-21",
    "arabicLabel": "سوبر ماركت",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "shopfront and trolleys",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-22",
    "arabicLabel": "بقالة الحي",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "small storefront and neighborhood foot traffic",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-23",
    "arabicLabel": "مخبز",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "bakery entrance and customers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-24",
    "arabicLabel": "سوق خضار",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "produce crates and shoppers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-25",
    "arabicLabel": "ملحمة",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "butcher storefront and foot traffic",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-26",
    "arabicLabel": "محل ورد",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "flower display at shop doorway",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-27",
    "arabicLabel": "صيدلية",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "pharmacy shopfront and pedestrians",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-28",
    "arabicLabel": "مواقف مفتوحة",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "faded painted parking bays and cars",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
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
      "source": "daylight entering through actual openings, or an existing ceiling fixture if daylight cannot reach",
      "kelvin": 4000,
      "shadows": "soft contact shadows in actual shade, no direct sun through opaque roof",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing overhead canopy or garage fixture",
      "kelvin": 4000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-30",
    "arabicLabel": "مواقف علوية",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "open upper deck, guardrail and parked cars",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-31",
    "arabicLabel": "بين سيارتين",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "flanking parked cars and painted bay lines",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-32",
    "arabicLabel": "موقف بعيد",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "distant bays with a few occupied spaces",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-33",
    "arabicLabel": "مواقف مستشفى",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "hospital parking bays and entrance-side activity",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-34",
    "arabicLabel": "باب نادٍ رياضي",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "gym entrance and arriving visitors",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-35",
    "arabicLabel": "مواقف النادي",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "gym parking spaces and other parked cars",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-36",
    "arabicLabel": "بعد التمرين",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "gym frontage and people leaving exercise",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
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
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
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
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-39",
    "arabicLabel": "مقهى",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "cafe facade and customers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-40",
    "arabicLabel": "مطعم",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "restaurant entrance and customers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-41",
    "arabicLabel": "مسجد بعد الصلاة",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "plain mosque walls and departing worshippers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-42",
    "arabicLabel": "مدرسة",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "school fence and ordinary gate activity",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-43",
    "arabicLabel": "جامعة",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "faded marked asphalt or worn parking concrete",
    "background": "university parking and generic campus walls",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-44",
    "arabicLabel": "حلاق",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "barbershop doorway and waiting people",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-45",
    "arabicLabel": "مغسلة ملابس",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "laundry storefront and garment bags",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-46",
    "arabicLabel": "ورشة",
    "parking": "centered inside an existing marked bay with straight wheels; no fictitious curb",
    "preferredAngle": "driver",
    "angleReason": "an attainable handheld cabin selfie preserves driver-side perspective and keeps the face dominant",
    "ground": "scuffed concrete with realistic painted bay lines",
    "background": "workshop bay, tools only where visible",
    "bestTime": "night",
    "goldenTime": "soft daylight near the opening or early evening under existing canopy lights",
    "day": {
      "source": "daylight entering through actual openings, or an existing ceiling fixture if daylight cannot reach",
      "kelvin": 4000,
      "shadows": "soft contact shadows in actual shade, no direct sun through opaque roof",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing overhead canopy or garage fixture",
      "kelvin": 4000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-47",
    "arabicLabel": "محل جوالات",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "phone shopfront and pedestrians",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-48",
    "arabicLabel": "محل ملابس",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "clothing shopfront and passing shoppers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-49",
    "arabicLabel": "فندق",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "unnamed hotel entry and parked cars",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-50",
    "arabicLabel": "عيادة أسنان",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "clinic frontage and waiting visitors",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-51",
    "arabicLabel": "مكتبة",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "bookshop storefront and pedestrians",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-52",
    "arabicLabel": "صراف آلي",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "bank wall and ATM queue if present",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-53",
    "arabicLabel": "جانب طريق سريع",
    "parking": "on firm level sand or a safe road shoulder, aligned with its real edge, no invented curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "compacted sand, dusty roadside and uneven tyre impressions",
    "background": "safe road shoulder and passing vehicles",
    "bestTime": "day",
    "goldenTime": "late afternoon before sunset",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "actually illuminated vehicle headlights only when switched on; otherwise dim sky",
      "kelvin": 4000,
      "shadows": "deep darkness and only source-aligned local shadows",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
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
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-55",
    "arabicLabel": "مزرعة",
    "parking": "on compacted farm soil by the actual farm gate, away from irrigation and crops",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "compacted farm dirt and loose gravel",
    "background": "farm gate, gravel track and agricultural fencing",
    "bestTime": "day",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing farm entrance fixture if present, otherwise dim sky",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-56",
    "arabicLabel": "خيمة بر",
    "parking": "on firm level sand or a safe road shoulder, aligned with its real edge, no invented curb",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "compacted sand, dusty roadside and uneven tyre impressions",
    "background": "camp tent edge and sandy tire tracks",
    "bestTime": "day",
    "goldenTime": "late afternoon before sunset",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "actually illuminated vehicle headlights only when switched on; otherwise dim sky",
      "kelvin": 4000,
      "shadows": "deep darkness and only source-aligned local shadows",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-57",
    "arabicLabel": "كشك شارع",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "roadside kiosk window and customers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  },
  {
    "id": "location-58",
    "arabicLabel": "محطة حافلات",
    "parking": "parallel to a real beige-gray concrete curb, straight wheels, 20–30 cm clearance from curb face",
    "preferredAngle": "outside",
    "angleReason": "a reachable standing selfie shows only context naturally at the frame edge",
    "ground": "patched dusty Saudi asphalt and beige-gray concrete curb where visible",
    "background": "bus shelter and waiting passengers",
    "bestTime": "night",
    "goldenTime": "late afternoon with low natural sun",
    "day": {
      "source": "one natural sun source, screened by real walls or canopy where present",
      "kelvin": 5500,
      "shadows": "shadows fall away from the single sun, with existing walls screening light",
      "reflections": "consistent restrained daylight highlights on pearl-white paint and real window angles"
    },
    "night": {
      "source": "one existing nearby street or building fixture",
      "kelvin": 3000,
      "shadows": "one set of shadows away from the actual fixture",
      "reflections": "weak localized source-aligned reflections on paint and glazing; no hidden fill"
    }
  }
];
if(rows.length !== 58 || optionCatalogue.locations.length !== rows.length) throw new Error('58 place profiles required');
for(let i=0;i<rows.length;i++) {
 if(rows[i]!.id!==optionCatalogue.locations[i]!.id || rows[i]!.arabicLabel!==optionCatalogue.locations[i]!.label)
  throw new Error('Place profile option mismatch at location-'+(i+1));
 for(const period of ['day','night'] as const) {
  const light=rows[i]![period];
  if(!light.source||!light.kelvin||!light.shadows||!light.reflections)throw new Error('Incomplete '+period+' scene '+rows[i]!.id);
 }
 if(!rows[i]!.parking||!rows[i]!.preferredAngle||!rows[i]!.ground||!rows[i]!.background)throw new Error('Incomplete place geometry '+rows[i]!.id);
}
export const placeSceneProfiles:ReadonlyArray<PlaceSceneProfile> = Object.freeze(rows.map(p=>Object.freeze({...p,day:Object.freeze(p.day),night:Object.freeze(p.night)})));
export function placeSceneProfile(id:string):PlaceSceneProfile {
 const profile=placeSceneProfiles.find(p=>p.id===id);
 if(!profile)throw new Error('Unknown place profile: '+id);
 return profile;
}
