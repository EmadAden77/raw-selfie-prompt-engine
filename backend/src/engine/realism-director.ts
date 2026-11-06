import type { ScenePlan } from './scene-planner.js';
import type { ResolvedSelections } from '../types/engine.types.js';
import { deriveSceneLighting } from './rule-builder.js';

// The model supplies optional scene-specific observations, never camera or
// vehicle authority. Select only details relevant to the chosen shot.
export function directRealism(plan:ScenePlan,choices:ResolvedSelections):string {
  const scene=deriveSceneLighting(choices);
  const shots=[
    'Camera geometry: '+plan.cameraGeometry.phonePosition+'; '+plan.cameraGeometry.visibleBody+
      '; naturally handheld from a reachable arm with no reframing.',
    'Pose and fabric: '+plan.clothingAndMaterialPhysics.fabricBehavior+
      '; '+plan.clothingAndMaterialPhysics.contactShadow+'.',
    'Natural exposure: '+scene.kelvin+'K from '+scene.source+
      '; '+scene.shadows+'; camera exposure, visible fabric and surface reflections agree.',
    'Everyday realism: '+plan.environmentalRealism.background+
      '; only if naturally visible inside the selfie field of view.'
  ];
  if(/night|screen|flash/i.test(scene.time)){
    shots.push('Phone optics: '+plan.photographicImperfectionControl.exposure+
      '; preserve believable low-light falloff without invented illumination.');
  }else if(/face|upper-body/.test(plan.cameraGeometry.framing)){
    shots.push('Natural skin and phone optics: '+plan.photographicImperfectionControl.skin+
      '; '+plan.photographicImperfectionControl.optics+'.');
  }
  if(plan.vehicleInteriorConsistency.visible){
    shots.push('Only existing in-frame cabin elements: '+plan.vehicleInteriorConsistency.visibleElements.join('; ')+
      '. No dashboard or seat is revealed outside this angle.');
  }
  return shots.join(' ');
}
