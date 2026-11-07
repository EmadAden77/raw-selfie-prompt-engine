import { fixedPhysicsOptions } from './base.js';
export type ClothingCut = 'thobe'|'tee'|'shirt'|'hoodie'|'jacket'|'suit'|'layered'|'trousers'|'sports'|'coat'|'sweater';
export interface ClothingPhysical {
  readonly material:string;
  readonly cut:ClothingCut;
  readonly gravityDrape:string;
  readonly standingFolds:string;
  readonly seatedFolds:string;
  readonly walkingFolds:string;
  readonly windResponse:string;
}
// 50 unique canonical options; no invented fabric mass or thickness.
const rows:ReadonlyArray<readonly [string,ClothingCut]> = [["cotton","thobe"],["cotton","thobe"],["cotton","thobe"],["cotton","thobe"],["cotton","thobe"],["cotton","thobe"],["cotton","thobe"],["wool","thobe"],["cotton","thobe"],["cotton","thobe"],["cotton jersey","tee"],["cotton jersey","tee"],["cotton jersey","tee"],["cotton jersey","tee"],["cotton poplin","shirt"],["denim","shirt"],["cotton woven","shirt"],["linen","shirt"],["cotton fleece","hoodie"],["cotton fleece","hoodie"],["cotton fleece","hoodie"],["denim","jacket"],["leather","jacket"],["woven nylon","jacket"],["technical polyester","jacket"],["wool blend","suit"],["wool blend","suit"],["wool blend","suit"],["denim and jersey","layered"],["denim and fleece","layered"],["cotton twill","trousers"],["cotton jersey","trousers"],["technical polyester","sports"],["cotton pique","shirt"],["cotton jersey","tee"],["cotton woven and jersey","layered"],["insulated woven shell","coat"],["wool fur blend","coat"],["wool knit","sweater"],["cotton and leather","layered"],["cotton and insulated shell","layered"],["cotton jersey","sports"],["cotton twill","layered"],["cotton poplin","shirt"],["cotton jersey","tee"],["cotton fleece","hoodie"],["cotton poplin","shirt"],["cotton","thobe"],["cotton jersey","tee"],["cotton","thobe"]];
const folds:Record<ClothingCut,readonly [string,string,string,string]>={
 thobe:['vertical hem drop','long vertical folds','waist and knee compression','alternating lower hem folds'],
 tee:['soft torso drape','loose underarm folds','waist and elbow bunching','small side-seam folds'],
 shirt:['light structured drape','collar and sleeve creases','elbow and waist creases','natural moving sleeve creases'],
 hoodie:['heavy soft drape','hood and wrist folds','waist and elbow compression','small hem movement'],
 jacket:['structured drape','sleeve and shoulder folds','elbow articulation creases','minimal panel flutter'],
 suit:['tailored structured drape','natural lapel and trouser folds','seat and knee compression','modest trouser swing'],
 layered:['independent layered drape','overlapping fabric creases','seat and elbow layer folds','separate hem movement'],
 trousers:['leg-weighted drape','knee and hem vertical creases','hip and knee compression','knee flexion folds'],
 sports:['light flexible drape','subtle side and sleeve folds','waist and knee compression','small elastic fabric movement'],
 coat:['heavy gravitational drape','weight-held vertical panel folds','thick seat and elbow folds','low outer-hem movement'],
 sweater:['knit body drape','knit elbow and waist folds','waist and elbow compression','limited knit hem movement']
};
export const clothingPhysics=fixedPhysicsOptions('clothing',rows.map(([material,cut]):ClothingPhysical=>{
 const [gravityDrape,standingFolds,seatedFolds,walkingFolds]=folds[cut];
 return {material,cut,gravityDrape:gravityDrape!,standingFolds:standingFolds!,seatedFolds:seatedFolds!,walkingFolds:walkingFolds!,
 windResponse:'movement only when explicitly selected, never invent ambient wind'};
}),p=>p.material+', '+p.gravityDrape+', '+p.standingFolds);
