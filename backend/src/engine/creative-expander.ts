import { backgroundDetails, interiorDetails, stableVariation } from '../data/creative-details.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import type { ResolvedSelections } from '../types/engine.types.js';

export function expandCreativeDetails(options:ResolvedSelections,variation:number):string{
  const background=backgroundDetails[stableVariation(variation,backgroundDetails.length)]!;
  const interior=interiorDetails[stableVariation(Math.floor(variation/2),interiorDetails.length)]!;
  const inside=cabinMayBeVisible(options.selfieAngles.id,options.poses.id);
  const details=[
    'Only if already inside the natural selfie field of view, add subtle believable background activity: '+background+'.',
    inside
      ? 'Only if the relevant cabin surface is naturally visible: '+interior+'. Never reveal any additional cabin components to fit this detail.'
      : 'Only if already visible near the frame edge, include faint natural road dust or weather-appropriate pavement detail.',
    'Keep the reference person as the sole primary subject at unchanged selfie distance and scale. Never alter the fixed 195 cm, 88 kg lean athletic proportions, facial identity, 2022 Range Rover Sport, light beige upholstery, BLACK leather steering wheel, glossy dark wood, chrome, piano-black trim, dashboard layout or any selected option. Do not widen, stage, reframe or reveal off-screen elements.'
  ];
  return details.join(' ');
}
