import { optionCatalogue } from '../option-mappings.js';
import { getPlaceProfile } from '../place-profiles/index.js';
import clothingP1 from './semantic-files/clothing/clothing-1.json' with { type: 'json' };
import clothingP2 from './semantic-files/clothing/clothing-2.json' with { type: 'json' };
import clothingP3 from './semantic-files/clothing/clothing-3.json' with { type: 'json' };
import clothingP4 from './semantic-files/clothing/clothing-4.json' with { type: 'json' };
import clothingP5 from './semantic-files/clothing/clothing-5.json' with { type: 'json' };
import clothingP6 from './semantic-files/clothing/clothing-6.json' with { type: 'json' };
import clothingP7 from './semantic-files/clothing/clothing-7.json' with { type: 'json' };
import clothingP8 from './semantic-files/clothing/clothing-8.json' with { type: 'json' };
import clothingP9 from './semantic-files/clothing/clothing-9.json' with { type: 'json' };
import clothingP10 from './semantic-files/clothing/clothing-10.json' with { type: 'json' };
import clothingP11 from './semantic-files/clothing/clothing-11.json' with { type: 'json' };
import clothingP12 from './semantic-files/clothing/clothing-12.json' with { type: 'json' };
import clothingP13 from './semantic-files/clothing/clothing-13.json' with { type: 'json' };
import clothingP14 from './semantic-files/clothing/clothing-14.json' with { type: 'json' };
import clothingP15 from './semantic-files/clothing/clothing-15.json' with { type: 'json' };
import clothingP16 from './semantic-files/clothing/clothing-16.json' with { type: 'json' };
import clothingP17 from './semantic-files/clothing/clothing-17.json' with { type: 'json' };
import clothingP18 from './semantic-files/clothing/clothing-18.json' with { type: 'json' };
import clothingP19 from './semantic-files/clothing/clothing-19.json' with { type: 'json' };
import clothingP20 from './semantic-files/clothing/clothing-20.json' with { type: 'json' };
import clothingP21 from './semantic-files/clothing/clothing-21.json' with { type: 'json' };
import clothingP22 from './semantic-files/clothing/clothing-22.json' with { type: 'json' };
import clothingP23 from './semantic-files/clothing/clothing-23.json' with { type: 'json' };
import clothingP24 from './semantic-files/clothing/clothing-24.json' with { type: 'json' };
import clothingP25 from './semantic-files/clothing/clothing-25.json' with { type: 'json' };
import clothingP26 from './semantic-files/clothing/clothing-26.json' with { type: 'json' };
import clothingP27 from './semantic-files/clothing/clothing-27.json' with { type: 'json' };
import clothingP28 from './semantic-files/clothing/clothing-28.json' with { type: 'json' };
import clothingP29 from './semantic-files/clothing/clothing-29.json' with { type: 'json' };
import clothingP30 from './semantic-files/clothing/clothing-30.json' with { type: 'json' };
import clothingP31 from './semantic-files/clothing/clothing-31.json' with { type: 'json' };
import clothingP32 from './semantic-files/clothing/clothing-32.json' with { type: 'json' };
import clothingP33 from './semantic-files/clothing/clothing-33.json' with { type: 'json' };
import clothingP34 from './semantic-files/clothing/clothing-34.json' with { type: 'json' };
import clothingP35 from './semantic-files/clothing/clothing-35.json' with { type: 'json' };
import clothingP36 from './semantic-files/clothing/clothing-36.json' with { type: 'json' };
import clothingP37 from './semantic-files/clothing/clothing-37.json' with { type: 'json' };
import clothingP38 from './semantic-files/clothing/clothing-38.json' with { type: 'json' };
import clothingP39 from './semantic-files/clothing/clothing-39.json' with { type: 'json' };
import clothingP40 from './semantic-files/clothing/clothing-40.json' with { type: 'json' };
import clothingP41 from './semantic-files/clothing/clothing-41.json' with { type: 'json' };
import clothingP42 from './semantic-files/clothing/clothing-42.json' with { type: 'json' };
import clothingP43 from './semantic-files/clothing/clothing-43.json' with { type: 'json' };
import clothingP44 from './semantic-files/clothing/clothing-44.json' with { type: 'json' };
import clothingP45 from './semantic-files/clothing/clothing-45.json' with { type: 'json' };
import clothingP46 from './semantic-files/clothing/clothing-46.json' with { type: 'json' };
import clothingP47 from './semantic-files/clothing/clothing-47.json' with { type: 'json' };
import clothingP48 from './semantic-files/clothing/clothing-48.json' with { type: 'json' };
import clothingP49 from './semantic-files/clothing/clothing-49.json' with { type: 'json' };
import clothingP50 from './semantic-files/clothing/clothing-50.json' with { type: 'json' };
import expressionP1 from './semantic-files/expressions/expression-1.json' with { type: 'json' };
import expressionP2 from './semantic-files/expressions/expression-2.json' with { type: 'json' };
import expressionP3 from './semantic-files/expressions/expression-3.json' with { type: 'json' };
import expressionP4 from './semantic-files/expressions/expression-4.json' with { type: 'json' };
import expressionP5 from './semantic-files/expressions/expression-5.json' with { type: 'json' };
import expressionP6 from './semantic-files/expressions/expression-6.json' with { type: 'json' };
import expressionP7 from './semantic-files/expressions/expression-7.json' with { type: 'json' };
import expressionP8 from './semantic-files/expressions/expression-8.json' with { type: 'json' };
import expressionP9 from './semantic-files/expressions/expression-9.json' with { type: 'json' };
import expressionP10 from './semantic-files/expressions/expression-10.json' with { type: 'json' };
import expressionP11 from './semantic-files/expressions/expression-11.json' with { type: 'json' };
import expressionP12 from './semantic-files/expressions/expression-12.json' with { type: 'json' };
import expressionP13 from './semantic-files/expressions/expression-13.json' with { type: 'json' };
import expressionP14 from './semantic-files/expressions/expression-14.json' with { type: 'json' };
import expressionP15 from './semantic-files/expressions/expression-15.json' with { type: 'json' };
import expressionP16 from './semantic-files/expressions/expression-16.json' with { type: 'json' };
import expressionP17 from './semantic-files/expressions/expression-17.json' with { type: 'json' };
import expressionP18 from './semantic-files/expressions/expression-18.json' with { type: 'json' };
import expressionP19 from './semantic-files/expressions/expression-19.json' with { type: 'json' };
import expressionP20 from './semantic-files/expressions/expression-20.json' with { type: 'json' };
import expressionP21 from './semantic-files/expressions/expression-21.json' with { type: 'json' };
import expressionP22 from './semantic-files/expressions/expression-22.json' with { type: 'json' };
import expressionP23 from './semantic-files/expressions/expression-23.json' with { type: 'json' };
import expressionP24 from './semantic-files/expressions/expression-24.json' with { type: 'json' };
import expressionP25 from './semantic-files/expressions/expression-25.json' with { type: 'json' };
import expressionP26 from './semantic-files/expressions/expression-26.json' with { type: 'json' };
import expressionP27 from './semantic-files/expressions/expression-27.json' with { type: 'json' };
import expressionP28 from './semantic-files/expressions/expression-28.json' with { type: 'json' };
import expressionP29 from './semantic-files/expressions/expression-29.json' with { type: 'json' };
import expressionP30 from './semantic-files/expressions/expression-30.json' with { type: 'json' };
import hairP1 from './semantic-files/hairstyles/hair-1.json' with { type: 'json' };
import hairP2 from './semantic-files/hairstyles/hair-2.json' with { type: 'json' };
import hairP3 from './semantic-files/hairstyles/hair-3.json' with { type: 'json' };
import hairP4 from './semantic-files/hairstyles/hair-4.json' with { type: 'json' };
import hairP5 from './semantic-files/hairstyles/hair-5.json' with { type: 'json' };
import hairP6 from './semantic-files/hairstyles/hair-6.json' with { type: 'json' };
import hairP7 from './semantic-files/hairstyles/hair-7.json' with { type: 'json' };
import hairP8 from './semantic-files/hairstyles/hair-8.json' with { type: 'json' };
import hairP9 from './semantic-files/hairstyles/hair-9.json' with { type: 'json' };
import hairP10 from './semantic-files/hairstyles/hair-10.json' with { type: 'json' };
import hairP11 from './semantic-files/hairstyles/hair-11.json' with { type: 'json' };
import hairP12 from './semantic-files/hairstyles/hair-12.json' with { type: 'json' };
import hairP13 from './semantic-files/hairstyles/hair-13.json' with { type: 'json' };
import hairP14 from './semantic-files/hairstyles/hair-14.json' with { type: 'json' };
import hairP15 from './semantic-files/hairstyles/hair-15.json' with { type: 'json' };
import hairP16 from './semantic-files/hairstyles/hair-16.json' with { type: 'json' };
import hairP17 from './semantic-files/hairstyles/hair-17.json' with { type: 'json' };
import hairP18 from './semantic-files/hairstyles/hair-18.json' with { type: 'json' };
import hairP19 from './semantic-files/hairstyles/hair-19.json' with { type: 'json' };
import hairP20 from './semantic-files/hairstyles/hair-20.json' with { type: 'json' };
import hairP21 from './semantic-files/hairstyles/hair-21.json' with { type: 'json' };
import hairP22 from './semantic-files/hairstyles/hair-22.json' with { type: 'json' };
import hairP23 from './semantic-files/hairstyles/hair-23.json' with { type: 'json' };
import hairP24 from './semantic-files/hairstyles/hair-24.json' with { type: 'json' };
import hairP25 from './semantic-files/hairstyles/hair-25.json' with { type: 'json' };
import hairP26 from './semantic-files/hairstyles/hair-26.json' with { type: 'json' };
import hairP27 from './semantic-files/hairstyles/hair-27.json' with { type: 'json' };
import hairP28 from './semantic-files/hairstyles/hair-28.json' with { type: 'json' };
import hairP29 from './semantic-files/hairstyles/hair-29.json' with { type: 'json' };
import hairP30 from './semantic-files/hairstyles/hair-30.json' with { type: 'json' };
import poseP1 from './semantic-files/poses/pose-1.json' with { type: 'json' };
import poseP2 from './semantic-files/poses/pose-2.json' with { type: 'json' };
import poseP3 from './semantic-files/poses/pose-3.json' with { type: 'json' };
import poseP4 from './semantic-files/poses/pose-4.json' with { type: 'json' };
import poseP5 from './semantic-files/poses/pose-5.json' with { type: 'json' };
import poseP6 from './semantic-files/poses/pose-6.json' with { type: 'json' };
import poseP7 from './semantic-files/poses/pose-7.json' with { type: 'json' };
import poseP8 from './semantic-files/poses/pose-8.json' with { type: 'json' };
import poseP9 from './semantic-files/poses/pose-9.json' with { type: 'json' };
import poseP10 from './semantic-files/poses/pose-10.json' with { type: 'json' };
import poseP11 from './semantic-files/poses/pose-11.json' with { type: 'json' };
import poseP12 from './semantic-files/poses/pose-12.json' with { type: 'json' };
import poseP13 from './semantic-files/poses/pose-13.json' with { type: 'json' };
import poseP14 from './semantic-files/poses/pose-14.json' with { type: 'json' };
import poseP15 from './semantic-files/poses/pose-15.json' with { type: 'json' };
import poseP16 from './semantic-files/poses/pose-16.json' with { type: 'json' };
import poseP17 from './semantic-files/poses/pose-17.json' with { type: 'json' };
import poseP18 from './semantic-files/poses/pose-18.json' with { type: 'json' };
import poseP19 from './semantic-files/poses/pose-19.json' with { type: 'json' };
import poseP20 from './semantic-files/poses/pose-20.json' with { type: 'json' };
import poseP21 from './semantic-files/poses/pose-21.json' with { type: 'json' };
import poseP22 from './semantic-files/poses/pose-22.json' with { type: 'json' };
import poseP23 from './semantic-files/poses/pose-23.json' with { type: 'json' };
import poseP24 from './semantic-files/poses/pose-24.json' with { type: 'json' };
import poseP25 from './semantic-files/poses/pose-25.json' with { type: 'json' };
import poseP26 from './semantic-files/poses/pose-26.json' with { type: 'json' };
import poseP27 from './semantic-files/poses/pose-27.json' with { type: 'json' };
import poseP28 from './semantic-files/poses/pose-28.json' with { type: 'json' };
import poseP29 from './semantic-files/poses/pose-29.json' with { type: 'json' };
import poseP30 from './semantic-files/poses/pose-30.json' with { type: 'json' };
import cleanP1 from './semantic-files/carConditions/clean-1.json' with { type: 'json' };
import cleanP2 from './semantic-files/carConditions/clean-2.json' with { type: 'json' };
import cleanP3 from './semantic-files/carConditions/clean-3.json' with { type: 'json' };
import cleanP4 from './semantic-files/carConditions/clean-4.json' with { type: 'json' };
import cleanP5 from './semantic-files/carConditions/clean-5.json' with { type: 'json' };
import cleanP6 from './semantic-files/carConditions/clean-6.json' with { type: 'json' };

export interface SemanticPhysics {
 readonly id:string;
 readonly material:string;
 readonly gravity:string;
 readonly contact:string;
 readonly motion:string;
}
function freeze(rows:SemanticPhysics[]):ReadonlyArray<Readonly<SemanticPhysics>> {
 return Object.freeze(rows.map(x=>Object.freeze(x)));
}
export const clothingSemantics = freeze([clothingP1,clothingP2,clothingP3,clothingP4,clothingP5,clothingP6,clothingP7,clothingP8,clothingP9,clothingP10,clothingP11,clothingP12,clothingP13,clothingP14,clothingP15,clothingP16,clothingP17,clothingP18,clothingP19,clothingP20,clothingP21,clothingP22,clothingP23,clothingP24,clothingP25,clothingP26,clothingP27,clothingP28,clothingP29,clothingP30,clothingP31,clothingP32,clothingP33,clothingP34,clothingP35,clothingP36,clothingP37,clothingP38,clothingP39,clothingP40,clothingP41,clothingP42,clothingP43,clothingP44,clothingP45,clothingP46,clothingP47,clothingP48,clothingP49,clothingP50]);
export const expressionSemantics = freeze([expressionP1,expressionP2,expressionP3,expressionP4,expressionP5,expressionP6,expressionP7,expressionP8,expressionP9,expressionP10,expressionP11,expressionP12,expressionP13,expressionP14,expressionP15,expressionP16,expressionP17,expressionP18,expressionP19,expressionP20,expressionP21,expressionP22,expressionP23,expressionP24,expressionP25,expressionP26,expressionP27,expressionP28,expressionP29,expressionP30]);
export const hairSemantics = freeze([hairP1,hairP2,hairP3,hairP4,hairP5,hairP6,hairP7,hairP8,hairP9,hairP10,hairP11,hairP12,hairP13,hairP14,hairP15,hairP16,hairP17,hairP18,hairP19,hairP20,hairP21,hairP22,hairP23,hairP24,hairP25,hairP26,hairP27,hairP28,hairP29,hairP30]);
export const poseSemantics = freeze([poseP1,poseP2,poseP3,poseP4,poseP5,poseP6,poseP7,poseP8,poseP9,poseP10,poseP11,poseP12,poseP13,poseP14,poseP15,poseP16,poseP17,poseP18,poseP19,poseP20,poseP21,poseP22,poseP23,poseP24,poseP25,poseP26,poseP27,poseP28,poseP29,poseP30]);
export const surfaceSemantics = freeze([cleanP1,cleanP2,cleanP3,cleanP4,cleanP5,cleanP6]);
export const placeSemantics=freeze(optionCatalogue.locations.map(x=>{
 const p=getPlaceProfile(x.id);
 return {id:x.id,material:p.ground,gravity:'natural contact and shadows on actual ground',
   contact:p.parking,motion:'only '+p.background+'; no new traffic, wind, rain or objects'};
}));
export const semanticPhysics=Object.freeze({
 clothing:clothingSemantics,expressions:expressionSemantics,hairstyles:hairSemantics,
 poses:poseSemantics,locations:placeSemantics,carConditions:surfaceSemantics
});
export function semanticFor<K extends keyof typeof semanticPhysics>(key:K,id:string):Readonly<SemanticPhysics>{
 const found=semanticPhysics[key].find(x=>x.id===id);
 if(!found)throw new Error('Missing semantic physics: '+key+'/'+id);
 return found;
}
for(const key of Object.keys(semanticPhysics) as Array<keyof typeof semanticPhysics>){
 const models=semanticPhysics[key],options=optionCatalogue[key];
 if(models.length!==options.length)throw new Error('Incomplete semantic physics: '+key);
 for(const [i,p] of models.entries()){
  if(p.id!==options[i]!.id || !p.material || !p.gravity || !p.contact || !p.motion)
    throw new Error('Invalid semantic physics: '+key+'/'+options[i]!.id);
  if(/\\b\\d+(?:gsm|mm|FOV|°|%)\\b/i.test(Object.values(p).join(' ')))
    throw new Error('Fake numeric physics: '+p.id);
 }
}
