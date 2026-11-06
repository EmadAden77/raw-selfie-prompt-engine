export const backgroundDetails=[
  'a pedestrian carrying shopping bags at a distant edge of the visible street',
  'a passing delivery motorcycle at a plausible distance in the naturally visible background',
  'two people walking in the visible background with shadows from available light',
  'a worker crossing the visible background and subtle everyday road dust',
  'a passing car reflected softly in a naturally visible vehicle window',
  'a small roadside object and distant pedestrians only where already in view',
  'ordinary parked cars and restrained reflections only in visible scene areas',
  'a quiet but inhabited street with natural colors visible beyond the subject'
] as const;
export const interiorDetails=[
  'subtle fingerprints on an already visible piano-black console screen, if in shot',
  'natural creases in an already visible light beige leather seat or door panel',
  'a charging cable resting naturally beside a visible glossy dark wood center console',
  'small everyday reflections across a visible portion of the panoramic roof glass'
] as const;
export function stableVariation(value:number,length:number):number{
  return Math.abs(value)%length;
}
