# Image Prompt Auditor & Photographic Realism Engine · v8

> **ملاحظة v10:** هذا الملف يوثق بنية v8 التاريخية. مسار NVIDIA الذي يخطط المشهد لم يعد مستخدمًا؛ NVIDIA الآن محرر للنص الكامل فقط، وRule Builder وحده يحدد الفيزياء والقياسات الحالية 195 cm / 88 kg. راجع [دليل v10](nvidia-editor-only-v10.md).

This module audits **textual scene instructions**, not the identity image itself. It does not transmit user-uploaded photos to NVIDIA, inspect pixels, generate images or guarantee that an image will reproduce identity exactly.

## Runtime path

1. Validate the eight Arabic UI selections.
2. Resolve a physically valid scene plan and lock identity (193 cm, 83 kg; lean athletic), hair, parked pearl-white 2022 Range Rover Sport and visible factory-correct cabin.
3. Choose exactly one camera profile: **A** = direct Xiaomi 15 Ultra front-camera selfie; **B** = rear-camera reflection in the selected rear-view mirror or car glass. Mirror paths and flash behavior must not be mixed with direct front-camera rules.
4. Derive lighting from scene coverage and selected lighting; front-screen flash applies only to the direct profile, while requested rear LED flash may apply to reflected rear-camera shots.
5. Add causal and *in-frame* material history. Washed paint stays clean; rain follows gravity; dust is localized near road-contact zones; cabin marks follow seat pressure and touch. Never add arbitrary face dirt or a global grime overlay.
6. Apply the same camera/exposure processing to the entire view. Only source-justified noise, shadow loss, glare, compression or catchlights are allowed.
7. Use NVIDIA only to propose a bounded structured **scene plan**; the consistency critic restores locked geometry, identity, cabin and lighting before the deterministic final prompt is compiled.
8. Validate the English prompt (adaptive, 500-word maximum). Return Arabic audit metadata separately: up to five repair notes plus a short scene/camera/material summary.

## Output behavior

- The **English prompt** always begins with `ChatGPT, using the reference image I uploaded, generate an image of the exact same person`. It is the only text copied for image generation.
- The **Arabic repair notes** explain plausible textual conflicts and how the engine prevents them. They are not claims that a generated image has been visually inspected.
- The **Arabic scene summary** identifies assumptions from selected options, including visible material/wear groups.
- If NVIDIA is unavailable, the backend and browser both have a deterministic local prompt and corresponding Arabic audit.

## Locked compatibility

The existing Arabic RTL option flow, fixed vehicle configuration, parking rule, API key handling, and prompt-only application behavior remain intact. No image generation endpoint was added. All optional disorder must be supported by a physical cause and the visible frame.
