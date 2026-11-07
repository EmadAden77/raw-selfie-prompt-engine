import { fixedPhysicsOptions } from './base.js';
export interface HairPhysical {
  readonly strandDirection: string;
  readonly strandLiftDeg: number;
  readonly airflowOrContact: string;
  readonly gravityActsDownward: true;
  readonly referenceLengthOnly: true;
  readonly referenceTextureOnly: true;
  readonly densityChangePct: 0;
}
const rows: ReadonlyArray<readonly [string,number,string]> = [
  [
    "forward",
    0,
    "none"
  ],
  [
    "right",
    7,
    "ambient wind"
  ],
  [
    "left",
    7,
    "ambient wind"
  ],
  [
    "side",
    0,
    "none"
  ],
  [
    "front up",
    7,
    "none"
  ],
  [
    "forehead down",
    0,
    "none"
  ],
  [
    "downward damp",
    0,
    "moisture"
  ],
  [
    "loosely random",
    0,
    "none"
  ],
  [
    "toward open window",
    10,
    "open-window air"
  ],
  [
    "forehead down",
    0,
    "moisture"
  ],
  [
    "one front strand",
    0,
    "none"
  ],
  [
    "back",
    6,
    "none"
  ],
  [
    "natural center part",
    0,
    "none"
  ],
  [
    "natural side part",
    0,
    "none"
  ],
  [
    "forward with original gaps",
    0,
    "none"
  ],
  [
    "reference curls",
    0,
    "none"
  ],
  [
    "loose outward",
    10,
    "ambient wind"
  ],
  [
    "toward head tilt",
    0,
    "gravity"
  ],
  [
    "forward with head bend",
    0,
    "gravity"
  ],
  [
    "slightly tangled",
    0,
    "none"
  ],
  [
    "original dusty strands",
    0,
    "none"
  ],
  [
    "damp strand tips",
    0,
    "moisture"
  ],
  [
    "under cap",
    0,
    "cap contact"
  ],
  [
    "at cap edge",
    0,
    "cap contact"
  ],
  [
    "side out center down",
    4,
    "none"
  ],
  [
    "slightly pushed",
    4,
    "air conditioner"
  ],
  [
    "clumped",
    0,
    "humidity"
  ],
  [
    "natural irregular ends",
    0,
    "none"
  ],
  [
    "single forward strand",
    0,
    "none"
  ],
  [
    "loosely tousled",
    0,
    "none"
  ]
];
export const hairPhysics = fixedPhysicsOptions('hairstyles',rows.map(
  ([strandDirection,strandLiftDeg,airflowOrContact]):HairPhysical=>({
    strandDirection,strandLiftDeg,airflowOrContact,gravityActsDownward:true,
    referenceLengthOnly:true,referenceTextureOnly:true,densityChangePct:0
  })),p=>
  `strands ${p.strandDirection}, lift ${p.strandLiftDeg}°, ${p.airflowOrContact}; reference density only`);
