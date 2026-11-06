import { z } from 'zod';
import type { ResolvedSelections } from '../types/engine.types.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { deriveSceneLighting } from './rule-builder.js';

// No image is transmitted. This is a textual plan grounded in validated option IDs.
// Zod validates the complete model proposal before any value can affect the prompt.
const detail=z.string().trim().min(5).max(200);
export const scenePlanSchema=z.object({
  cameraGeometry:z.object({
    phonePosition:detail,
    opticalAxis:detail,
    armReachCm:z.number().int().min(25).max(130),
    framing:z.enum(['face','upper-body','torso']),
    visibleBody:detail
  }).strict(),
  physicalPoseConsistency:z.object({support:detail,handPlacement:detail}).strict(),
  naturalLightSimulation:z.object({
    source:detail,kelvin:z.number().int().min(2000).max(7500),shadowDirection:detail
  }).strict(),
  humanAppearancePreservation:z.object({
    faceUnchanged:z.boolean(),heightCm:z.number().int(),weightKg:z.number().int(),physique:detail
  }).strict(),
  environmentalRealism:z.object({parking:detail,roadTexture:detail,background:detail}).strict(),
  clothingAndMaterialPhysics:z.object({fabricBehavior:detail,contactShadow:detail}).strict(),
  vehicleInteriorConsistency:z.object({
    visible:z.boolean(),visibleElements:z.array(detail).max(5),
    exteriorVisibleParts:z.array(detail).max(4),materials:detail
  }).strict(),
  photographicImperfectionControl:z.object({skin:detail,optics:detail,exposure:detail}).strict()
}).strict();
export type ScenePlan=z.infer<typeof scenePlanSchema>;
export type ScenePlanCandidate=ScenePlan;

const angleNumber=(id:string)=>Number(id.split('-').at(-1));
export function createScenePlan(choices:ResolvedSelections):ScenePlan {
  const angle=angleNumber(choices.selfieAngles.id);
  const close=[2,3,9,10,11].includes(angle);
  const interior=cabinMayBeVisible(choices.selfieAngles.id,choices.poses.id);
  const mirror=[4,29].includes(angle);
  const scene=deriveSceneLighting(choices);
  const position=mirror?'a handheld phone visible only as a plausible mirror or glass reflection':
    interior?'the subject-held front camera at reachable arm length from the selected seat':
    'the subject-held front camera at reachable arm length beside the parked vehicle';
  const framing=close?'face':angle===10||angle===24?'torso':'upper-body';
  const candidate:ScenePlan={
    cameraGeometry:{
      phonePosition:position,
      opticalAxis:mirror?'phone aimed at the selected reflective surface to capture the subject naturally':'front camera pointed at the reference subject from a plausible handheld angle',
      armReachCm:close?38:angle===10?83:65,framing,
      visibleBody:close?'face and only naturally included neck or shoulder':
        framing==='torso'?'face, shoulders and naturally framed torso':'face, shoulders and upper torso only where visible'
    },
    physicalPoseConsistency:{
      support:'body weight and seating or standing support follow the selected pose: '+choices.poses.text,
      handPlacement:mirror?'one reachable phone hand has an honest optical reflection':
        'one hand holds the front-facing phone at reachable arm length; the other follows the selected pose'
    },
    naturalLightSimulation:{
      source:scene.source,kelvin:scene.kelvin,shadowDirection:scene.shadows
    },
    humanAppearancePreservation:{
      faceUnchanged:true,heightCm:195,weightKg:88,physique:'natural lean athletic'
    },
    environmentalRealism:{
      parking:scene.parking,roadTexture:scene.surface,
      background:'only ordinary Saudi activity already visible from '+choices.locations.text
    },
    clothingAndMaterialPhysics:{
      fabricBehavior:'gravity-consistent folds in '+choices.clothing.text+' following the actual pose and fabric weight',
      contactShadow:'small contact shadows at the actual seat, arm, foot or garment support points'
    },
    vehicleInteriorConsistency:{
      visible:interior,
      visibleElements:interior?['light beige leather only if in frame','black leather steering wheel only if in frame','dark wood and piano-black trim only if in frame']:[],
      exteriorVisibleParts:angle>=16?(angle===19?['front grille only if in frame','nearby hood edge only if in frame']:
        angle===26?['rear hatch only if in frame']:
        angle===27?['side mirror only if in frame']:
        ['nearest parked pearl-white body panel only if in frame']):[],
      materials:'fixed light beige leather, glossy dark wood, chrome and piano-black trim; black leather steering wheel'
    },
    photographicImperfectionControl:{
      skin:'preserve only natural reference skin texture with no invented blemishes',
      optics:'plausible ordinary front-phone optics and restrained wide-angle perspective',
      exposure:'phone exposure and reflections consistent with the single selected light source'
    }
  };
  return scenePlanSchema.parse(candidate);
}

export function scenePlanInput(choices:ResolvedSelections,base:ScenePlan):string {
  // No photo bytes, identity image or credential enters this model context.
  return JSON.stringify({
    selections:Object.fromEntries(Object.entries(choices).map(([key,value])=>[key,value.text])),
    immutable:{heightCm:195,weightKg:88,physique:'lean athletic',car:'parked 2022 pearl-white Range Rover Sport',
      cabin:'light beige leather, glossy dark wood, chrome, piano-black, black steering wheel',
      identity:'preserve exact reference face, skin and hair; person is sole primary subject'},
    baseline:base
  });
}
