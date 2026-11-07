import { getPlaceProfile } from './place-profiles/index.js';
import type { CategoryKey, OptionCatalogue, ResolvedSelections, Selections, SelectedOption } from '../types/engine.types.js';

// IDs exactly match the frontend options. All values remain internal English prompts.
const sources: Record<CategoryKey, { prefix: string; labels: string; texts: string }> = {
  locations: {
    prefix:'location',
    labels:'جانب طريق صحراوي|طريق صحراوي ترابي|الصحراء وقت الغروب|طريق صحراوي ليلاً|استراحة صحراوية|بوابة مركز تسوق|مواقف مركز تسوق|مدخل مواقف مركز تسوق|كشك قهوة قرب مركز تسوق|محطة بنزين|مضخة البنزين|مغسلة سيارات|محطة شحن|استراحة طريق|باب فيلا|فيلا بسور|فيلا ليلاً|عمارة سكنية|شقق سكنية|بيت صديق|سوبر ماركت|بقالة الحي|مخبز|سوق خضار|ملحمة|محل ورد|صيدلية|مواقف مفتوحة|مواقف تحت الأرض|مواقف علوية|بين سيارتين|موقف بعيد|مواقف مستشفى|باب نادٍ رياضي|مواقف النادي|بعد التمرين|ملعب حي|حديقة عامة|مقهى|مطعم|مسجد بعد الصلاة|مدرسة|جامعة|حلاق|مغسلة ملابس|ورشة|محل جوالات|محل ملابس|فندق|عيادة أسنان|مكتبة|صراف آلي|جانب طريق سريع|دوار|مزرعة|خيمة بر|كشك شارع|محطة حافلات',
    texts:'on the side of a desert road|on a dusty desert roadside|by a desert road at sunset|beside a desert road at night with headlights on|near a desert rest stop|outside an unnamed shopping center entrance|in a shopping center parking lot|near a shopping center parking ramp|by a coffee kiosk outside a shopping center|at an ordinary gas station|next to a gas pump|at a car wash|at an EV charging station|at a highway service stop|outside an ordinary villa|near a walled villa|outside a villa at night with courtyard lights|outside a residential apartment building|outside residential apartments|outside a friend’s home in an ordinary neighborhood|outside a supermarket|outside a small neighborhood grocery|outside a bakery|outside a vegetable market|outside a butcher shop|outside a flower shop|outside a pharmacy|in an open parking lot|in an underground parking lot|on an upper parking level|between two parked cars|in a distant empty parking space within an active lot|in a hospital parking lot|outside a local gym|in a gym parking lot|outside a gym after exercise|near a neighborhood football field|outside a public park|outside a local cafe|outside a restaurant|outside a neighborhood mosque after prayers|outside a school|outside an unnamed university|outside a barbershop|outside a laundry shop|outside a workshop|outside a mobile phone shop|outside a clothes shop|outside an unnamed hotel|outside a dental clinic|outside a bookshop|near an ATM|on a safe pull-off beside a highway|in a legal parking space near a roundabout|outside a farm|beside a camping tent|outside a roadside kiosk|near a bus stop'
  },
  clothing: {
    prefix:'clothing',
    labels:'ثوب أبيض قطني|ثوب بيج|ثوب سكري|ثوب رمادي فاتح|ثوب أسود|ثوب كحلي|ثوب زيتي|ثوب شتوي صوفي|ثوب أبيض وشماغ أحمر|ثوب أبيض وغترة|تيشيرت أبيض|تيشيرت أسود|تيشيرت رمادي|تيشيرت بيج|قميص أبيض رسمي|قميص جينز|قميص كاروهات|قميص كتان بيج|هودي أسود|هودي رمادي|هودي بيج|جاكيت جينز|جاكيت جلد أسود|جاكيت بومبر|جاكيت رياضي|بدلة سوداء|بدلة رمادية|بدلة كحلية|جينز أزرق وتيشيرت أبيض|جينز أسود وهودي|بنطلون قماش بيج|بنطلون رياضي أسود|ملابس نادي كاملة|بولو أبيض|تيشيرت واسع|قميص مفتوح فوق تيشيرت|جاكيت شتوي ثقيل|فروة شتوية|سترة صوف|قميص أبيض وجاكيت جلد|ثوب أبيض وجاكيت|تيشيرت وشورت صيفي|ملابس عمل|قميص أبيض وكاب|تيشيرت أسود وكاب|هودي وكاب|قميص أسود ونظارة شمسية|ثوب أبيض ونظارة شمسية|تيشيرت أسود ونظارة على الرأس|ثوب بيج وشماغ على الكتف',
    texts:'white cotton thobe|beige cotton thobe|off-white thobe|light gray thobe|black matte thobe|navy thobe|olive thobe|wool winter thobe|white thobe and red shemagh|white thobe and white ghutra|white cotton T-shirt|black cotton T-shirt|gray T-shirt|beige T-shirt|formal white shirt|denim shirt|checkered shirt|beige linen shirt|black hoodie|gray hoodie|beige hoodie|denim jacket over a T-shirt|black leather jacket|bomber jacket|sports jacket|black formal suit|gray formal suit|navy formal suit|blue jeans and white T-shirt|black jeans with hoodie|beige chinos and a simple top|black sweatpants and a simple top|gym shirt and shorts|white polo shirt|oversized T-shirt|open shirt over a T-shirt|heavy winter jacket|winter farwa|wool knit sweater|white shirt and black leather jacket|white thobe and winter jacket|summer T-shirt and shorts|work shirt and work pants|white shirt and cap|black T-shirt and black cap|hoodie with cap|black shirt and sunglasses|white thobe and sunglasses|black T-shirt with sunglasses on head|beige thobe with shemagh on shoulder'
  },
  expressions:{
    prefix:'expression',
    labels:'محايد|ابتسامة خفيفة|ابتسامة عريضة|ضحك|جدي|متفاجئ|حاجب مرفوع|غمزة|نظرة جانبية|تعب|نعسان|واثق|تفكير|غضب خفيف|حزن خفيف|خجل|ملل|تركيز|نظرة مباشرة|فم مفتوح قليلاً|عض الشفة السفلية|رفع حاجب واحد|تضييق العين من الشمس|تثاؤب خفيف|ابتسامة تظهر الأسنان|نظر للأسفل|حواجب مقطبة|عيون واسعة|ضحك مع إغماض العين|ابتسامة جانبية',
    texts:'neutral relaxed face|slight natural smile|broad genuine smile|laughing naturally|serious face|subtly surprised face|one eyebrow lifted|one natural wink|eyes looking sideways|subtle tiredness|sleepy heavy eyes|calm confidence|thoughtful expression|mild frustration|subtle sadness|shy expression|bored relaxed gaze|focused expression|direct calm eye contact|slightly open mouth|light lower-lip bite|single eyebrow raised|squinting in sunlight|small yawn|smiling with visible teeth|looking down toward the phone|slight frown|wide-open eyes|laughing with closed eyes|asymmetric smirk'
  },
  hairstyles:{
    prefix:'hair',
    labels:'فوضوي للأمام|فوضوي مع الهواء يمين|فوضوي مع الهواء يسار|مسحوب للجنب|مرفوع قليلاً من الأمام|منسدل على الجبهة|مبلل قليلاً|غير مرتب بعد النوم|متطاير من الشباك|ملتصق بالجبهة|خصلة على العين|مرفوع بالخلف|فرق في الوسط|فرق جانبي|منسدل مع فراغات طبيعية|تموج طبيعي|متطاير مع الهواء|منسدل مع ميل الرأس|للأمام بسبب الانحناء|متشابك قليلاً|غبار خفيف|قطرات ماء|تحت الكاب جزئياً|خارج الكاب|الجوانب للخارج والوسط للأسفل|متأثر بهواء المكيف|متأثر بالرطوبة|أطراف غير منتظمة|خصلة مفردة للأمام|فوضوي كامل',
    texts:'naturally messy forward strands|existing strands blown right|existing strands blown left|side-swept existing hair|slightly lifted front strands|hair resting on forehead|slightly damp existing strands|naturally tousled bed hair|hair moved by air from open window while parked|damp strands on forehead|a strand near one eye|back strands lightly lifted|natural middle part if possible|natural side part|forward strands with original natural gaps|original wave pattern|wind-tousled hair while parked|hair following a tilted head|hair leaning forward with selfie posture|slightly tangled strands|subtle dust on hair|droplets on hair tips|hair partly hidden by a cap|natural strands under cap|side strands lifted and center relaxed|small movement from air conditioning|humidity-clumped strands|original uneven natural ends|one front strand|loosely tousled original hair'
  },
  selfieAngles:{
    prefix:'angle',
    labels:'من مقعد السائق|من أسفل الذقن|من أعلى الرأس|انعكاس المرآة الداخلية|من جهة الدركسون|من مقعد الراكب|من المقعد الخلفي|من خلال الشباك|قريب جداً|بعيد بذراع ممدودة|مائل كثيراً|بجانب الشباك|مع التفات الرأس|بعد فتح الباب|متكئ على الدركسون|واقف عند باب السائق|متكئ على الكبوت|متكئ على الباب|أمام السيارة|جانب السيارة من الخلف|جالس على الرصيف|أثناء النزول من السيارة|منخفضة قرب الأرض|عالية تُظهر السيارة|يمسك باب السيارة|خلف السيارة|قرب المرآة الجانبية|أثناء المشي قرب السيارة|انعكاس زجاج السيارة|جالس على حافة الرصيف',
    texts:'handheld from the driver seat|low angle just below chin|held high above the head|selfie reflected in rearview mirror|near the steering wheel|handheld from passenger seat|handheld from rear seat|through an open window|very close arm-length angle|at fully reachable arm length|noticeably tilted hand frame|by the side window|with naturally turned head|while opening the parked car door|leaning over the steering wheel|standing by driver door|leaning on hood|leaning on an open door|in front of the parked car|beside rear side of car|while seated on curb|while stepping out of car|from a naturally reachable low angle|from a reachable high angle|holding the car door|behind the parked car|near side mirror with realistic reflection|walking past stationary car|physically plausible reflected selfie in side window|tilted selfie while sitting on curb'
  },
  poses:{
    prefix:'pose',
    labels:'مسترخٍ على مقعد السائق|ركبة مثنية على المقعد|متكئ على الشباك|حزام الأمان|يد على القير|رأس على المسند|ملتفت للمقعد الخلفي|يدتان على الدركسون|الشباك مفتوح|على مقعد الراكب|كوب قهوة|يتحدث بهاتف آخر|يعدل المرآة|شماغ على المقعد|متكئ داخل الباب|واقف عند الباب|واقف أمام السيارة|متكئ بظهره على الكبوت|جالس على الكبوت|يفتح الباب|ينزل من السيارة|جالس على الرصيف|يد على السقف|يغسل السيارة|يفتح الشنطة|قرب المرآة الجانبية|يمشي نحو الباب|متكئ على خلفية السيارة|على الرصيف قرب الإطار|واقف مستنداً للسقف',
    texts:'relaxed in driver seat with free hand on steering wheel|seated with one knee bent safely on seat|leaning on window edge|seated with seat belt gently creasing fabric|free hand near the gear selector|head resting against headrest|torso turning toward rear seat|both hands on wheel with phone safely mounted, vehicle off|window open, one arm at window|relaxed on passenger seat|coffee cup in car holder|using another phone with free hand|adjusting rearview mirror with free hand|shemagh resting on adjacent seat|leaning on inner door|standing leaning against door|standing in front of car with one selfie arm extended|back lightly supported on hood|sitting gently on hood with natural contact|opening door with free hand|stepping out of parked car|sitting on curb with elbow on knee|standing beside car with free hand on roof|washing the parked car with hose in free hand|opening rear hatch with free hand|standing carefully near side mirror|walking toward parked car|leaning against rear car body|sitting beside the tire on curb|standing with one hand on car roof'
  },
  carConditions:{
    prefix:'clean',
    labels:'مغسولة ونظيفة|غبار خفيف|غبار واضح|طين على الإطارات|قطرات مطر|رمل بعد البر',
    texts:'freshly washed with restrained authentic reflections|light road dust on bodywork|visible accumulated dust on paint and glass|natural mud around tires and lower doors|real raindrops on paint and glass|sand on tires and floor mats'
  },
  lighting:{
    prefix:'light',
    labels:'شمس الصباح|شمس الظهيرة|ضوء العصر|وقت الغروب|غائم|ظل المباني|إنارة شارع ليلاً|إنارة محطة ليلاً|ضوء شاشة الهاتف|فلاش الهاتف',
    texts:'morning sunlight|strong midday sunlight with realistic clipping|late-afternoon daylight|sunset illumination|overcast daylight|daylight shaded by adjacent buildings|night light from visible street lamps|night light from visible station fixtures|dim phone-screen illumination with rapid falloff and deep shadows|a phone flash only if the specific phone can physically use it with the front camera'
  }
};
function catalogGroup(key: CategoryKey):SelectedOption[] {
  const {prefix,labels,texts}=sources[key];
  const a=labels.split('|'), b=texts.split('|');
  if(a.length!==b.length) throw new Error('Invalid catalogue mapping: '+key);
  return a.map((label,i)=>({id:prefix+'-'+(i+1),label,text:b[i]!}));
}
export const optionCatalogue:OptionCatalogue={
  locations:catalogGroup('locations'),clothing:catalogGroup('clothing'),
  expressions:catalogGroup('expressions'),hairstyles:catalogGroup('hairstyles'),
  selfieAngles:catalogGroup('selfieAngles'),poses:catalogGroup('poses'),
  carConditions:catalogGroup('carConditions'),lighting:catalogGroup('lighting')
};
export function resolveSelections(selections:Selections):ResolvedSelections {
  const result={} as ResolvedSelections;
  for(const key of Object.keys(optionCatalogue) as CategoryKey[]){
    const requested = key === 'selfieAngles' && selections.selfieAngles === 'angle-auto'
      ? (() => {
          const profile=getPlaceProfile(selections.locations);
          const pose=Number(selections.poses.split('-').at(-1));
          const seated=pose>=1 && pose<=15;
          const angle=seated?'angle-1':profile.automaticAngle==='exterior'?'angle-16':'angle-16';
          return angle;
        })()
      : selections[key];
    const entry=optionCatalogue[key].find(x=>x.id===requested);
    if(!entry) throw new Error('Invalid option: '+key);
    result[key]=entry;
  }
  return result;
}

