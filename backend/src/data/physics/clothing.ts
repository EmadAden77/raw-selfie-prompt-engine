import { fixedPhysicsOptions } from './base.js';

export type ClothingCut = 'thobe'|'tee'|'shirt'|'hoodie'|'jacket'|'suit'|'layered'|'trousers'|'sports'|'coat'|'sweater';
export interface ClothingPhysical {
  readonly material: string;
  readonly modelArealMassGsm: number;
  readonly modelThicknessMm: number;
  readonly cut: ClothingCut;
  readonly gravityDrape: string;
  readonly standingFolds: string;
  readonly seatedFolds: string;
  readonly walkingFolds: string;
  readonly windResponse: string;
}
// Approximate visual simulation parameters, never claims of measured garment
// specifications. Each row is one fixed option in the canonical ID order.
const models: ReadonlyArray<readonly [string, number, number, ClothingCut]> = [
  [
    "cotton",
    160,
    0.35,
    "thobe"
  ],
  [
    "cotton",
    170,
    0.38,
    "thobe"
  ],
  [
    "cotton",
    160,
    0.36,
    "thobe"
  ],
  [
    "cotton",
    175,
    0.4,
    "thobe"
  ],
  [
    "cotton",
    180,
    0.42,
    "thobe"
  ],
  [
    "cotton",
    175,
    0.4,
    "thobe"
  ],
  [
    "cotton",
    180,
    0.42,
    "thobe"
  ],
  [
    "wool",
    310,
    0.85,
    "thobe"
  ],
  [
    "cotton",
    175,
    0.4,
    "thobe"
  ],
  [
    "cotton",
    175,
    0.4,
    "thobe"
  ],
  [
    "cotton jersey",
    165,
    0.38,
    "tee"
  ],
  [
    "cotton jersey",
    175,
    0.41,
    "tee"
  ],
  [
    "cotton jersey",
    165,
    0.39,
    "tee"
  ],
  [
    "cotton jersey",
    165,
    0.39,
    "tee"
  ],
  [
    "cotton poplin",
    135,
    0.29,
    "shirt"
  ],
  [
    "denim",
    250,
    0.66,
    "shirt"
  ],
  [
    "cotton woven",
    175,
    0.43,
    "shirt"
  ],
  [
    "linen",
    185,
    0.46,
    "shirt"
  ],
  [
    "cotton fleece",
    325,
    0.86,
    "hoodie"
  ],
  [
    "cotton fleece",
    320,
    0.85,
    "hoodie"
  ],
  [
    "cotton fleece",
    320,
    0.85,
    "hoodie"
  ],
  [
    "denim",
    380,
    0.99,
    "jacket"
  ],
  [
    "leather",
    570,
    1.2,
    "jacket"
  ],
  [
    "woven nylon",
    225,
    0.68,
    "jacket"
  ],
  [
    "technical polyester",
    205,
    0.58,
    "jacket"
  ],
  [
    "wool blend",
    270,
    0.7,
    "suit"
  ],
  [
    "wool blend",
    265,
    0.68,
    "suit"
  ],
  [
    "wool blend",
    270,
    0.7,
    "suit"
  ],
  [
    "denim and jersey",
    215,
    0.6,
    "layered"
  ],
  [
    "denim and fleece",
    300,
    0.79,
    "layered"
  ],
  [
    "cotton twill",
    235,
    0.6,
    "trousers"
  ],
  [
    "cotton jersey",
    285,
    0.74,
    "trousers"
  ],
  [
    "technical polyester",
    165,
    0.42,
    "sports"
  ],
  [
    "cotton pique",
    190,
    0.47,
    "shirt"
  ],
  [
    "cotton jersey",
    200,
    0.46,
    "tee"
  ],
  [
    "cotton woven and jersey",
    195,
    0.46,
    "layered"
  ],
  [
    "insulated woven shell",
    480,
    1.35,
    "coat"
  ],
  [
    "wool fur blend",
    660,
    2.1,
    "coat"
  ],
  [
    "wool knit",
    330,
    1.05,
    "sweater"
  ],
  [
    "cotton and leather",
    450,
    1,
    "layered"
  ],
  [
    "cotton and insulated shell",
    440,
    1.1,
    "layered"
  ],
  [
    "cotton jersey",
    170,
    0.4,
    "sports"
  ],
  [
    "cotton twill",
    225,
    0.58,
    "layered"
  ],
  [
    "cotton poplin",
    140,
    0.31,
    "shirt"
  ],
  [
    "cotton jersey",
    180,
    0.43,
    "tee"
  ],
  [
    "cotton fleece",
    325,
    0.84,
    "hoodie"
  ],
  [
    "cotton poplin",
    165,
    0.34,
    "shirt"
  ],
  [
    "cotton",
    170,
    0.4,
    "thobe"
  ],
  [
    "cotton jersey",
    175,
    0.42,
    "tee"
  ],
  [
    "cotton",
    175,
    0.4,
    "thobe"
  ]
];

const foldModes: Record<ClothingCut, readonly [string,string,string,string]> = {
  thobe: ['vertical hem drop','long vertical folds','waist and knee compression','alternating lower hem folds'],
  tee: ['soft torso drape','loose underarm folds','waist and elbow bunching','small side-seam folds'],
  shirt: ['light structured drape','collar and sleeve creases','elbow and waist creases','natural moving sleeve creases'],
  hoodie: ['heavy soft drape','hood and wrist folds','waist and elbow compression','small hem movement'],
  jacket: ['structured heavy drape','sleeve and shoulder folds','elbow articulation creases','minimal panel flutter'],
  suit: ['tailored structured drape','natural lapel and trouser folds','seat and knee compression','modest trouser swing'],
  layered: ['independent layered drape','overlapping fabric creases','seat and elbow layer folds','separate hem movement'],
  trousers: ['leg-weighted drape','knee and hem vertical creases','hip and knee compression','knee flexion folds'],
  sports: ['light flexible drape','subtle side and sleeve folds','waist and knee compression','small elastic fabric movement'],
  coat: ['heavy gravitational drape','weight-held vertical panel folds','thick seat and elbow folds','low flutter at outer hem'],
  sweater: ['knit body drape','knit elbow and waist folds','waist and elbow compression','limited knit hem movement']
};
const data: ReadonlyArray<ClothingPhysical> = models.map(([material,modelArealMassGsm,modelThicknessMm,cut])=>{
  const [gravityDrape,standingFolds,seatedFolds,walkingFolds]=foldModes[cut];
  return {material,modelArealMassGsm,modelThicknessMm,cut,
    gravityDrape:gravityDrape!,standingFolds:standingFolds!,
    seatedFolds:seatedFolds!,walkingFolds:walkingFolds!,
    windResponse:modelArealMassGsm>=300?'resists incidental breeze':'subtle motion only if air is present'};
});
export const clothingPhysics = fixedPhysicsOptions('clothing',data,p=>
  `${p.material} ~${p.modelArealMassGsm}g/m² ${p.modelThicknessMm}mm; ${p.gravityDrape}`);
