import { identityRules } from '../rules/identity.rules.js';
import { hairRules } from '../rules/hair.rules.js';
import { carRules } from '../rules/car.rules.js';
import { selfieRules } from '../rules/selfie.rules.js';
import { realismRules } from '../rules/realism.rules.js';
import { physicsRules } from '../rules/physics.rules.js';
import { locationRules } from '../rules/locations.rules.js';
import { BODY_RULE, BODY_FRAMING_RULE } from '../rules/body.rules.js';
import { COMPOSITION_RULE } from '../rules/composition.rules.js';
import { INTERIOR_RULE, INTERIOR_VISIBILITY_RULE, cabinMayBeVisible } from '../rules/cabin.rules.js';
import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import type { ResolvedSelections } from '../types/engine.types.js';

export function buildRulePrompt(selections:ResolvedSelections):string{
  const selected=[
    'Setting: '+selections.locations.text+' in an unnamed everyday Saudi area, with the subject vehicle safely parked',
    'Body pose: '+selections.poses.text,
    'Selfie angle: '+selections.selfieAngles.text,
    'Clothing: '+selections.clothing.text+', with gravity-consistent wrinkles and fabric weight',
    'Expression: '+selections.expressions.text+' without altering facial identity',
    'Hair direction: '+selections.hairstyles.text+' only within the reference hair\'s existing characteristics',
    'Vehicle surface condition: '+selections.carConditions.text,
    'Lighting: '+selections.lighting.text+' with physically consistent exposure and shadows'
  ];
  const interior=cabinMayBeVisible(selections.selfieAngles.id,selections.poses.id)
    ? [INTERIOR_RULE,INTERIOR_VISIBILITY_RULE] : [];
  const fixed=[
    ...identityRules,BODY_RULE,BODY_FRAMING_RULE,COMPOSITION_RULE,...hairRules,
    ...carRules,...interior,...selfieRules,...realismRules,...physicsRules,...locationRules
  ];
  return [REQUIRED_PREFIX+'.',...fixed,...selected].join(' ').replace(/\s+/g,' ').trim();
}
