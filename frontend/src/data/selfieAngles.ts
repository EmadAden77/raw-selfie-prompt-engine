import { getOptions } from './canonical';
// Auto is the default; manual physical angles remain available for advanced users.
export const selfieAngles = [{id:'angle-auto',label:'تلقائي (الأنسب للمكان والوضعية)',prompt:'automatic scene-safe selfie angle'},...getOptions('selfieAngles')];
