import type { ResolvedSelections } from '../types/engine.types.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { resolvePhysicalOptions } from '../data/physics/index.js';

const numeric = (id: string): number => Number(id.split('-').at(-1));
const driverAngles = new Set([1, 4, 5, 8, 12, 13, 14, 15]);
const passengerAngles = new Set([6]);
const rearSeatAngles = new Set([7]);
const seatedPoses = new Set(Array.from({ length: 15 }, (_, i) => i + 1));

export interface ResolvedCapture {
  inside: boolean;
  close: boolean;
  mounted: boolean;
  seat: 'driver' | 'passenger' | 'rear' | 'unspecified' | 'outside';
  pose: string;
  angleText: string;
  poseRepaired: boolean;
  steeringHand: boolean;
}

// Angle determines camera origin; incompatible pose options never teleport the
// subject across the cabin or turn a driver-seat selfie into an exterior shot.
export function resolveCapture(choices: ResolvedSelections): ResolvedCapture {
  const angle = numeric(choices.selfieAngles.id);
  const poseNumber = numeric(choices.poses.id);
  const physics = resolvePhysicalOptions(choices);
  const poseSafe = physics.poses.physics.mechanicallySafe;
  const inside = cabinMayBeVisible(choices.selfieAngles.id, choices.poses.id);
  const close = [2, 9].includes(angle);
  const seat: ResolvedCapture['seat'] = !inside ? 'outside' :
    passengerAngles.has(angle) ? 'passenger' :
    rearSeatAngles.has(angle) ? 'rear' :
    driverAngles.has(angle) || (seatedPoses.has(poseNumber) && poseNumber !== 10) ? 'driver' :
    'unspecified';
  const seated = seatedPoses.has(poseNumber);
  const exteriorPose = !seated;
  const mismatch = (inside && exteriorPose) ||
    (!inside && seated) ||
    (seat === 'passenger' && poseNumber <= 9) ||
    (seat === 'rear' && (poseNumber <= 10)) ||
    (seat === 'driver' && poseNumber === 10) || !poseSafe;
  let pose = choices.poses.text;
  if (mismatch) {
    pose = !poseSafe && seat==='outside'
      ? 'standing on grounded feet with only light hand contact on the hood, never seated on its sheet metal'
      : seat === 'outside'
      ? 'naturally posed at the selected exterior spot, with supported balance'
      : seat === 'passenger'
        ? 'seated in front-right passenger seat with reachable phone hand'
        : seat === 'rear'
          ? 'seated in rear seat with reachable phone grip'
          : 'seated in front-left driver seat with phone within reach';
  }
  const mounted = !mismatch && physics.poses.physics.requiresFixedPhoneMount;
  const steeringHand = !mismatch && seat === 'driver' && [1, 5, 8].includes(poseNumber);
  const angleText = mounted
    ? angle === 4 ? 'rear-camera timer reflection from a supported cabin phone mount'
      : 'subject-initiated front-camera timer selfie from the selected seat, using a real phone mount'
    : choices.selfieAngles.text;
  return { inside, close, mounted, seat, pose, angleText, poseRepaired: mismatch, steeringHand };
}
