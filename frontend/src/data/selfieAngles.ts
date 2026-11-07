import { getOptions } from './canonical';
// The default is automatically selected by the deterministic Rule Builder.
export const selfieAngles = [
  { id: 'angle-auto', label: 'تلقائي (موصى به)', prompt: 'automatic physically compatible angle' },
  ...getOptions('selfieAngles')
];
