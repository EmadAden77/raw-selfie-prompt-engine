import type { CategoryConfig, OptionCategory } from '../types/options';
import { locations } from './locations';
import { clothing } from './clothing';
import { expressions } from './expressions';
import { hairstyles } from './hairstyles';
import { selfieAngles } from './selfieAngles';
import { poses } from './poses';
import { carConditions } from './carConditions';
import { lighting } from './lighting';

export const categories:CategoryConfig[] = [
  {key:'locations',title:'المكان',description:'أماكن سعودية يومية دون معالم مشهورة',options:locations},
  {key:'poses',title:'الوضعية',description:'حركة جسم طبيعية ومتوازنة',options:poses},
  {key:'selfieAngles',title:'زاوية السيلفي',description:'منظور تصوير يدوي واقعي',options:selfieAngles},
  {key:'clothing',title:'الملابس',description:'أقمشة بثنيات وتجاعيد طبيعية',options:clothing},
  {key:'expressions',title:'تعبير الوجه',description:'تعابير تحافظ على ملامحك',options:expressions},
  {key:'hairstyles',title:'تسريحة الشعر',description:'نفس الكثافة والخط الأصلي',options:hairstyles},
  {key:'carConditions',title:'نظافة السيارة',description:'تفاصيل سطح السيارة الواقعية',options:carConditions},
  {key:'lighting',title:'الإضاءة',description:'إضاءة لها مصدر واضح في المشهد',options:lighting}
];
export const categoryMap = Object.fromEntries(categories.map(item=>[item.key,item])) as Record<OptionCategory,CategoryConfig>;

