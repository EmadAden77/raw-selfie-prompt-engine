import { backgroundDetails, interiorDetails, stableVariation } from '../data/creative-details.js';
import type { ResolvedSelections } from '../types/engine.types.js';

export function expandCreativeDetails(options:ResolvedSelections,variation:number):string{
  const background=backgroundDetails[stableVariation(variation,backgroundDetails.length)]!;
  const interior=interiorDetails[stableVariation(Math.floor(variation/2),interiorDetails.length)]!;
  const inside=Number(options.selfieAngles.id.split('-').at(-1))<=15 &&
    Number(options.poses.id.split('-').at(-1))<=15;
  const details=[
    'Lively believable background detail: '+background+'.',
    inside?'Interior detail, only where visible: '+interior+'.':'Include faint natural road dust or weather-appropriate pavement detail.',
    'Slightly imperfect spontaneous composition and everyday realistic scene variation; do not change the subject, fixed vehicle or selections.'
  ];
  return details.join(' ');
}

