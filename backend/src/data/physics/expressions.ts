import { fixedPhysicsOptions } from './base.js';

export interface ExpressionPhysical {
  readonly activeMuscles: string;
  readonly browAngleDeg: number;
  readonly mouthCornerAngleDeg: number;
  readonly leftEyeOpeningPct: number;
  readonly rightEyeOpeningPct: number;
  readonly eyeGazeAngleDeg: number;
  readonly referenceIdentityLocked: true;
  readonly faceReshapingAllowed: false;
}
// Values are relative expression cues, not surgical face measurements.
const rows: ReadonlyArray<readonly [string,number,number,number,number,number]> = [
  [
    "resting facial muscles",
    0,
    0,
    90,
    90,
    0
  ],
  [
    "zygomatic muscles",
    0,
    6,
    88,
    88,
    0
  ],
  [
    "zygomatic and cheek muscles",
    1,
    18,
    78,
    78,
    0
  ],
  [
    "zygomatic and orbicularis oculi",
    1,
    19,
    48,
    48,
    0
  ],
  [
    "relaxed brow and lip muscles",
    -1,
    0,
    86,
    86,
    0
  ],
  [
    "frontalis and eyelid elevator",
    8,
    0,
    100,
    100,
    0
  ],
  [
    "one frontalis muscle",
    12,
    0,
    90,
    90,
    0
  ],
  [
    "one orbicularis oculi",
    0,
    0,
    8,
    88,
    0
  ],
  [
    "extraocular gaze muscles",
    0,
    0,
    90,
    90,
    20
  ],
  [
    "gentle eyelid relaxation",
    -2,
    -1,
    72,
    72,
    0
  ],
  [
    "eyelid lowering",
    -2,
    0,
    55,
    55,
    0
  ],
  [
    "relaxed forehead and jaw",
    0,
    2,
    90,
    90,
    0
  ],
  [
    "mild corrugator activity",
    1,
    0,
    84,
    84,
    5
  ],
  [
    "corrugator and depressor supercilii",
    -8,
    -6,
    82,
    82,
    0
  ],
  [
    "inner brow elevator",
    5,
    -5,
    80,
    80,
    0
  ],
  [
    "zygomatic suppression",
    0,
    2,
    75,
    75,
    -10
  ],
  [
    "orbicularis and cheek relaxation",
    -2,
    -1,
    72,
    72,
    0
  ],
  [
    "mild corrugator and eyelid focus",
    -3,
    0,
    80,
    80,
    0
  ],
  [
    "neutral facial muscle tone",
    0,
    0,
    93,
    93,
    0
  ],
  [
    "jaw depressor with relaxed lips",
    0,
    0,
    90,
    90,
    0
  ],
  [
    "orbicularis oris",
    0,
    -1,
    87,
    87,
    0
  ],
  [
    "unilateral frontalis",
    12,
    0,
    88,
    88,
    0
  ],
  [
    "orbicularis oculi squint",
    -1,
    0,
    48,
    48,
    0
  ],
  [
    "jaw-opening muscles",
    4,
    -1,
    60,
    60,
    0
  ],
  [
    "zygomatic and lip elevator",
    1,
    16,
    79,
    79,
    0
  ],
  [
    "extraocular gaze muscles",
    -1,
    0,
    85,
    85,
    -22
  ],
  [
    "corrugator supercilii",
    -8,
    -4,
    78,
    78,
    0
  ],
  [
    "frontalis eyelid elevator",
    10,
    0,
    100,
    100,
    0
  ],
  [
    "orbicularis oculi and cheeks",
    1,
    18,
    12,
    12,
    0
  ],
  [
    "one zygomatic group",
    1,
    10,
    85,
    88,
    0
  ]
];
const models: ReadonlyArray<ExpressionPhysical> = rows.map(([activeMuscles,browAngleDeg,
  mouthCornerAngleDeg,leftEyeOpeningPct,rightEyeOpeningPct,eyeGazeAngleDeg])=>({
  activeMuscles,browAngleDeg,mouthCornerAngleDeg,leftEyeOpeningPct,
  rightEyeOpeningPct,eyeGazeAngleDeg,
  referenceIdentityLocked:true,faceReshapingAllowed:false
}));
export const expressionPhysics = fixedPhysicsOptions('expressions',models,p=>
  `brow ${p.browAngleDeg}°, mouth ${p.mouthCornerAngleDeg}°, eyes ${p.leftEyeOpeningPct}/${p.rightEyeOpeningPct}%; identity locked`);
