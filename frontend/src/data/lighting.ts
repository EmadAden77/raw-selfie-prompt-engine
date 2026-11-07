import { getOptions } from './canonical';
// UI exposes only day and night. Legacy IDs remain compatible with the backend catalogue.
export const lighting = getOptions('lighting').filter(x => x.id === 'light-1' || x.id === 'light-7').map(x => ({ ...x, label: x.id === 'light-1' ? 'نهار' : 'ليل' }));
