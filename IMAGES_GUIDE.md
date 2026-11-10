# Portfolio image guide

All image and video locations for the homepage are listed in `src/content/portfolioMedia.ts`, under `portfolioMediaPaths`. Keep the filenames below so you can replace assets without editing the section components.

## Add an asset

1. Copy the image or video into the matching folder under `public/images/portfolio/` using the exact filename below. Public files are served from the site root, so `/images/portfolio/...` is the matching URL.
2. In `src/content/portfolioMedia.ts`, add that path to the `enabledMediaPaths` set. For example:

   ```ts
   const enabledMediaPaths = new Set<string>([
     portfolioMediaPaths.hero,
   ]);
   ```

   Add one path per asset. Until a path is enabled, the designed placeholder remains visible. You can enable only some assets while keeping placeholders for the rest.
3. Reload the page. No component edits are needed.

## Files and image requirements

| Section | Folder and filenames | Recommended format and framing |
| --- | --- | --- |
| Hero | `public/images/portfolio/hero/hero.webp` | WebP, landscape, ideally 1920×1080 or larger. |
| Five-image editorial showcase | `public/images/portfolio/editorial-case/healed-result-01.webp`, `pigment-swatch-02.webp`, `mapping-03.webp`, `treatment-detail-04.webp`, `close-up-05.webp` | WebP. Use five views from the same PMU case. Image 01 is the central healed result; 02–05 are pigment, mapping, treatment detail, and close-up. The composition crops with `object-fit: cover`, so keep each subject near the center. |
| Specialties | `public/images/portfolio/specialties/powder-brows.webp`, `nano-brows.webp`, `combo-brows.webp`, `lash-line-enhancement.webp`, `classic-eyeliner.webp`, `smokey-eyeliner.webp`, `lip-blush.webp`, `ombre-lips.webp`, `lip-neutralization.webp`, `laser-tattoo-removal.webp`, `permanent-makeup-removal.webp` | WebP, portrait 4:5. Each filename matches the treatment card. |
| Selected Work / Before & After | `public/images/portfolio/selected-work/case-01-before.webp` and `case-01-after.webp`, continuing through `case-09-before.webp` and `case-09-after.webp` | WebP, portrait 4:5. Keep each numbered before/after pair from the same client and treatment, with matching crop, lighting, and camera angle. |
| Behind the Treatment | `public/images/portfolio/behind-treatment/behind-the-treatment.mp4` | MP4/H.264, landscape. The player loops muted and inline. |
| Instagram / Recent Highlights | `public/images/portfolio/instagram/highlight-01.mp4` through `highlight-04.mp4` | MP4/H.264, vertical 9:19.5 (phone-video framing). Clips loop muted and inline. |
| Methodology | `public/images/portfolio/methodology/step-01.webp` through `step-05.webp` | WebP, portrait or square; keep the subject centered for the current crop. |
| Client testimonials | `public/images/portfolio/testimonials/client-01.webp` through `client-04.webp` | WebP, square portrait. |

The Selected Work filenames must retain the same case number and `before` / `after` suffix so the existing toggle shows the matching pair. The five editorial images should also remain numbered and in their listed order.

The older demo project gallery has separate source imports in `src/components/Work/projectDetails.ts` and `src/assets/`; those files are not used by the current homepage sections above.
