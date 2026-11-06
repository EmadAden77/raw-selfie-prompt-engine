export const backgroundDetails=[
  'a pedestrian carrying shopping bags and another parked vehicle behind the subject',
  'a passing delivery motorcycle at a plausible distance in the background',
  'two people walking naturally, with shadows consistent with the available light',
  'a worker crossing the background and subtle everyday road dust',
  'a passing car reflected softly in the vehicle window',
  'a small roadside object and a few distant pedestrians in the active background',
  'ordinary parked cars, a pedestrian and restrained road-surface reflections',
  'a quiet but inhabited street with scattered activity and natural color variation'
] as const;
export const interiorDetails=[
  'subtle fingerprints on the console screen and a coffee cup in the holder',
  'naturally creased beige leather and faint dust on the dashboard',
  'a charging cable resting naturally by the center console',
  'small everyday reflections across the panoramic roof glass'
] as const;
export function stableVariation(value:number,length:number):number{
  return Math.abs(value)%length;
}

