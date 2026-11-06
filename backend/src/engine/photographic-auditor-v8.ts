import type { ResolvedSelections } from '../types/engine.types.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';

// v8 audits selected text, not pixels: reference photos never reach this engine.
// All additions must fit the chosen field of view and have a physical cause.
export type CameraProfile = 'A' | 'B';
export interface PhotographicAudit {
  profile: CameraProfile;
  camera: string;
  physicalConsistency: string;
  surfaceHistory: string;
  exposure: string;
  repairNotes: string[];
  sceneCameraSurface: string;
}

const numberOf = (id: string) => Number(id.split('-').at(-1));
export const isReflectionSelfie = (angleId: string): boolean =>
  [4, 29].includes(numberOf(angleId));

export function auditPhotographicScene(choices: ResolvedSelections): PhotographicAudit {
  const angle = numberOf(choices.selfieAngles.id);
  const location = numberOf(choices.locations.id);
  const light = numberOf(choices.lighting.id);
  const condition = numberOf(choices.carConditions.id);
  const mirror = isReflectionSelfie(choices.selfieAngles.id);
  const close = [2, 3, 9, 10, 11].includes(angle);
  const interior = cabinMayBeVisible(choices.selfieAngles.id, choices.poses.id);
  const covered = [8, 10, 11, 12, 13, 29, 46].includes(location);
  const desert = [1, 2, 3, 4, 5, 53, 55, 56].includes(location);
  const screenOnly = light === 9;
  const flash = light === 10;
  const profile: CameraProfile = mirror ? 'B' : 'A';

  const camera = mirror
    ? 'Camera: Xiaomi 15 Ultra rear-camera reflection selfie, 23 mm-equivalent f/1.63 main camera. Its screen faces the subject and rear lens faces the chosen mirror or glass; the reflected phone, connected grip, optical path and occlusion remain coherent. Reflected scale and focus follow camera-to-surface-to-subject distance; no duplicate reflection or impossible lens viewpoint.'
    : 'Camera: direct Xiaomi 15 Ultra 21 mm-equivalent f/2.0 front-camera selfie at reachable arm length. The phone is outside its own direct view; perspective follows the hand-held viewpoint, not a remote photographer. Portrait Mode and beauty processing are off; no artificial background separation.';
  const physicalConsistency = 'Hands, grip, joints, weight support, seat compression and garment folds obey gravity and contact; show only anatomy and surfaces inside the selected crop.';
  const exposure = screenOnly
    ? 'Exposure: the actual nearby display is the only active light; weak illumination fades down the torso and cannot reveal a bright room or distant road. Deep shadows may lose detail and carry restrained sensor noise; catchlights exist only if that screen reflects at the correct eye angle.'
    : flash
      ? mirror
        ? 'Exposure: only the actual rear LED flash is active, aimed into the reflective path. Any flash glare stays at the reflected LED position with correct occlusion; its brief pulse can freeze motion. No extra fill or forced catchlights.'
        : 'Exposure: use the explicitly enabled front-screen flash, not the rear LED. Light falls off quickly away from the near face, with no extra fill, forced catchlights or automatic motion blur.'
      : 'Exposure: one shared phone-capture pipeline governs skin, hands, clothing, car and background. Shadow noise, retained highlights, sharpening and detail follow real illumination, focus and movement; no invented fill, film grain or stacked defects.';

  // Material history is conditional. A washed vehicle is not forcibly dirty;
  // a close-up cannot reveal off-frame road marks or dashboard details.
  let surfaceHistory: string;
  let groups: string;
  if (close) {
    surfaceHistory = 'Surface history: keep the face and body free of invented grime or blemishes; preserve only reference-consistent texture and natural pose-driven clothing creases. No off-frame dirt decorations.';
    groups = 'نسيج البشرة المرجعي وثنيات القماش المرئية فقط';
  } else if (interior) {
    surfaceHistory = 'Surface history, only where visible: subtle pressure creases in beige leather where someone sits, a partial handling smudge on frequently touched trim at a favorable reflection angle, and gravity-driven clothing folds. Keep clean or hidden cabin surfaces clean.';
    groups = 'انضغاط جلد المقاعد وآثار اللمس الموضعية وثنيات الملابس';
  } else if (condition === 1) {
    surfaceHistory = 'Surface history, only where visible: recently washed pearl-white paint keeps restrained irregular reflections; mild curb or pavement wear is confined to real contact zones, with natural clothing creases. Do not add dirt to a clean vehicle.';
    groups = 'انعكاسات الطلاء النظيف وتآكل الرصيف الموضعي وثنيات الملابس';
  } else if (condition === 5) {
    surfaceHistory = 'Surface history, only where visible: rain droplets adhere to exposed paint and glass; any runoff follows gravity, and local pavement darkening needs actual rainfall or drainage. Avoid uniform water overlays or unrelated dust clouds.';
    groups = 'قطرات المطر ومسارات الجريان وتغيّر لون الأرضية المبتلة';
  } else if (condition === 4 || condition === 6 || desert) {
    surfaceHistory = 'Surface history, only where visible: sand, dry grit or mud collects near tires and lower panels from road contact; exposed road edges may carry uneven settled dust. Avoid identical dirt on unrelated surfaces or airborne specks without backlight.';
    groups = 'رواسب أسفل السيارة وحواف الطريق نتيجة الاحتكاك والغبار';
  } else {
    surfaceHistory = 'Surface history, only where visible: localized road dust on lower body panels, uneven pavement wear at traffic-contact zones and naturally compressed clothing. Dust stays on real surfaces, never as a full-frame filter.';
    groups = 'غبار الألواح السفلية وتآكل الإسفلت وثنيات الملابس';
  }

  const repairNotes: string[] = [];
  if (mirror) repairNotes.push('زاوية انعكاس مع وصف كاميرا أمامية محتمل → العدسة يجب أن تواجه المرآة أو الزجاج → اعتماد الكاميرا الخلفية ومسار انعكاس واحد صحيح.');
  if (covered && [1, 2, 3, 4, 7, 8].includes(light))
    repairNotes.push('إضاءة خارجية مختارة داخل مكان مسقوف → السقف يحجب مصدرها المباشر → الاعتماد على الإنارة الموجودة داخل المكان وانعكاساتها.');
  if (flash)
    repairNotes.push(mirror
      ? 'فلاش مع صورة انعكاس → موضع الوهج مرتبط بفلاش الكاميرا الخلفية → تثبيت الوهج عند انعكاس مصباح LED الحقيقي.'
      : 'فلاش مع كاميرا أمامية → فلاش LED الخلفي لا يضيء الوجه من الأمام → استخدام إضاءة الشاشة فقط عند تفعيلها صراحة.');
  if (screenOnly)
    repairNotes.push('ضوء الشاشة وحده → شدته محدودة ويضعف سريعًا مع المسافة → إبقاء المناطق البعيدة معتمة دون إضاءة مخفية.');
  if (close)
    repairNotes.push('اقتصاص قريب للوجه → الطريق أو المقصورة قد يكونان خارج الكادر → حذف تفاصيل الأسطح غير المرئية بدل توسيع الصورة.');
  if (!repairNotes.length)
    repairNotes.push('احتمال إضافة مؤثرات واقعية بلا سبب → الغبار والتشوهات ليست إلزامية → الاكتفاء بآثار الاستخدام التي تفسرها الخامات والإضاءة وتظهر داخل الكادر.');

  const sceneType = interior ? 'سيلفي في مقصورة سيارة متوقفة' : 'سيلفي قرب سيارة متوقفة';
  const cameraLabel = mirror ? 'انعكاس بالكاميرا الخلفية (B)' : 'كاميرا أمامية مباشرة (A)';
  return {
    profile, camera, physicalConsistency, surfaceHistory, exposure,
    repairNotes: repairNotes.slice(0, 5),
    sceneCameraSurface: `${sceneType} في مكان سعودي يومي؛ ${cameraLabel} بحسب خط الرؤية. تفاصيل مشروطة بالظهور: ${groups}. هذه افتراضات من الخيارات، وليست نتيجة فحص الصورة.`
  };
}
