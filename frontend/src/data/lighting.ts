import { getOptions } from './canonical';
// Only day and night are selectable. Scene fixtures and Kelvin come from the 58 place profiles.
export const lighting = getOptions('lighting').filter(item=>item.id==='light-1'||item.id==='light-7')
  .map(item=>({...item,label:item.id==='light-1'?'نهار':'ليل',prompt:item.id==='light-1'?'day':'night'}));
