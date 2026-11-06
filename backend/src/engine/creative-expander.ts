import { backgroundDetails, interiorDetails, stableVariation } from '../data/creative-details.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { deriveSceneLighting } from './rule-builder.js';
import type { ResolvedSelections } from '../types/engine.types.js';

export function expandCreativeDetails(options:ResolvedSelections,variation:number):string{
  const scene=deriveSceneLighting(options);
  const background=backgroundDetails[stableVariation(variation,backgroundDetails.length)]!;
  const interior=interiorDetails[stableVariation(Math.floor(variation/2),interiorDetails.length)]!;
  const inside=cabinMayBeVisible(options.selfieAngles.id,options.poses.id);
  // NVIDIA's existing connector sends the first 700 characters of this text.
  // Put the fully derived scene/lighting context FIRST, never generic lighting.
  const details=[
    'For NVIDIA scene-dependent realism only: location='+options.locations.text+
      '; time='+scene.time+'; weather='+scene.weather+'; selfie angle='+options.selfieAngles.text+
      '; dominant source='+scene.source+'; temperature='+scene.kelvin+'K; shadows='+scene.shadows+
      '; parking='+scene.parking+'; road material='+scene.surface+'.',
    'Add subtle lighting/exposure detail consistent with that ONE source and the camera field of view only: same-side illumination of face, body, parked vehicle, visible cabin and existing background; reflections and shadow directions must agree. No general-purpose lighting template, second dominant source, hidden fill, cosmetic light, extra streetlight, or cinematic effects.',
    'Only if already inside the natural selfie field of view, add subtle believable background activity: '+background+'.',
    inside
      ? 'Only if the relevant cabin surface is naturally visible: '+interior+'. Never reveal any additional cabin components to fit this detail.'
      : 'Only if already visible near the frame edge, include natural road dust and location-consistent worn pavement without fabricating a street.',
    'Keep the reference person as the sole primary subject at unchanged selfie distance and scale. Never alter the fixed 195 cm, 88 kg lean athletic proportions, facial identity, 2022 Range Rover Sport, legally parked alignment, existing worn street, light beige upholstery, BLACK leather steering wheel, glossy dark wood, chrome, piano-black trim, dashboard layout or any selected option. Never widen, stage, reframe or reveal off-screen elements.'
  ];
  return details.join(' ');
}
