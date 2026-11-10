export type PortfolioMedia = {
  src: string | null;
  path: string;
  kind: "image" | "video";
  alt: string;
  placeholder: string;
};

// Keep replaceable public asset paths in one place. Set a media item's `src`
// to its matching path below when that file has been added to public/.
export const portfolioMediaPaths = {
  hero: "/images/portfolio/hero/hero.png",
  editorialCase: [
    "/images/portfolio/editorial-case/healed-result-01.jpeg",
    "/images/portfolio/editorial-case/pigment-swatch-02.jpeg",
    "/images/portfolio/editorial-case/mapping-03.jpeg",
    "/images/portfolio/editorial-case/treatment-detail-04.jpeg",
    "/images/portfolio/editorial-case/close-up-05.jpeg",
  ],
  specialties: {
    "Powder Brows": "/images/portfolio/specialties/powder-brows.jpg",
    "Nano Brows": "/images/portfolio/specialties/nano-brows.jpg",
    "Combo Brows": "/images/portfolio/specialties/combo-brows.jpg",
    "Lash Line Enhancement": "/images/portfolio/specialties/lash-line-enhancement.jpg",
    "Classic Eyeliner": "/images/portfolio/specialties/classic-eyeliner.jpg",
    "Smokey Eyeliner": "/images/portfolio/specialties/smokey-eyeliner.jpg",
    "Lip Blush": "/images/portfolio/specialties/lip-blush.jpg",
    "Ombre Lips": "/images/portfolio/specialties/ombre-lips.jpg",
    "Lip Neutralization": "/images/portfolio/specialties/lip-neutralization.jpg",
    "Laser Tattoo Removal": "/images/portfolio/specialties/laser-tattoo-removal.jpg",
    "Permanent Makeup Removal": "/images/portfolio/specialties/permanent-makeup-removal.jpg",
  },
  selectedWork: Array.from({ length: 9 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const isLipBlushCase = index === 0;
    const isSecondCase = index === 1;
    const isThirdCase = index === 2;
    const isFourthCase = index === 3;
    const isFifthCase = index === 4;
    const isSixthCase = index === 5;
    const isSeventhCase = index === 6;
    const isEighthCase = index === 7;
    const isNinthCase = index === 8;
    return {
      before: isLipBlushCase
        ? "/images/portfolio/selected-work/case-01-before.jpeg"
        : `/images/portfolio/selected-work/case-${number}-before.webp`,
      after: isLipBlushCase
        ? "/images/portfolio/selected-work/case-01-after.jpeg"
        : `/images/portfolio/selected-work/case-${number}-after.webp`,
      additional: isLipBlushCase ? [
        { path: "/images/portfolio/selected-work/case-01-detail-01.jpeg", kind: "image" as const, role: "detail" as const, label: "Design detail" },
        { path: "/images/portfolio/selected-work/case-01-detail-02.jpeg", kind: "image" as const, role: "detail" as const, label: "Treatment detail" },
        { path: "/images/portfolio/selected-work/case-01-process-01.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 1" },
        { path: "/images/portfolio/selected-work/case-01-process-02.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 2" },
        { path: "/images/portfolio/selected-work/case-01-process-03.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 3" },
      ] : [],
      orderedMedia: isSecondCase ? [
        { path: "/images/portfolio/selected-work/case-02-detail-01.jpeg", kind: "image" as const, role: "detail" as const, label: "Lip detail" },
        { path: "/images/portfolio/selected-work/case-02-process-01.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 1" },
        { path: "/images/portfolio/selected-work/case-02-process-02.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 2" },
        { path: "/images/portfolio/selected-work/case-02-process-03.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 3" },
        { path: "/images/portfolio/selected-work/case-02-after.jpeg", kind: "image" as const, role: "after" as const, label: "After result" },
        { path: "/images/portfolio/selected-work/case-02-process-04.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 4" },
        { path: "/images/portfolio/selected-work/case-02-process-05.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 5" },
        { path: "/images/portfolio/selected-work/case-02-before.jpeg", kind: "image" as const, role: "before" as const, label: "Before result" },
      ] : isThirdCase ? [
        { path: "/images/portfolio/selected-work/case-03-after.jpeg", kind: "image" as const, role: "after" as const, label: "After result" },
        { path: "/images/portfolio/selected-work/case-03-process-01.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 1" },
        { path: "/images/portfolio/selected-work/case-03-process-02.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 2" },
        { path: "/images/portfolio/selected-work/case-03-process-03.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 3" },
        { path: "/images/portfolio/selected-work/case-03-process-04.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 4" },
        { path: "/images/portfolio/selected-work/case-03-process-05.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 5" },
        { path: "/images/portfolio/selected-work/case-03-process-06.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 6" },
      ] : isFourthCase ? [
        { path: "/images/portfolio/selected-work/case-04-after.jpeg", kind: "image" as const, role: "after" as const, label: "After result" },
        { path: "/images/portfolio/selected-work/case-04-process-01.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 1" },
        { path: "/images/portfolio/selected-work/case-04-process-02.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 2" },
        { path: "/images/portfolio/selected-work/case-04-process-03.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 3" },
        { path: "/images/portfolio/selected-work/case-04-process-04.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 4" },
        { path: "/images/portfolio/selected-work/case-04-process-05.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 5" },
        { path: "/images/portfolio/selected-work/case-04-process-06.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 6" },
      ] : isFifthCase ? [
        { path: "/images/portfolio/selected-work/case-05-after.jpeg", kind: "image" as const, role: "after" as const, label: "After result" },
        { path: "/images/portfolio/selected-work/case-05-process-01.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 1" },
        { path: "/images/portfolio/selected-work/case-05-process-02.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 2" },
        { path: "/images/portfolio/selected-work/case-05-process-03.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 3" },
        { path: "/images/portfolio/selected-work/case-05-process-04.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 4" },
        { path: "/images/portfolio/selected-work/case-05-process-05.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 5" },
      ] : isSixthCase ? [
        { path: "/images/portfolio/selected-work/case-06-after.jpeg", kind: "image" as const, role: "after" as const, label: "After result" },
        { path: "/images/portfolio/selected-work/case-06-process-01.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 1" },
        { path: "/images/portfolio/selected-work/case-06-process-02.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 2" },
        { path: "/images/portfolio/selected-work/case-06-process-03.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 3" },
        { path: "/images/portfolio/selected-work/case-06-process-04.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 4" },
        { path: "/images/portfolio/selected-work/case-06-process-05.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 5" },
        { path: "/images/portfolio/selected-work/case-06-process-06.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 6" },
      ] : isSeventhCase ? [
        { path: "/images/portfolio/selected-work/case-07-after.jpeg", kind: "image" as const, role: "after" as const, label: "After result" },
        { path: "/images/portfolio/selected-work/case-07-process-01.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 1" },
        { path: "/images/portfolio/selected-work/case-07-process-02.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 2" },
        { path: "/images/portfolio/selected-work/case-07-process-03.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 3" },
        { path: "/images/portfolio/selected-work/case-07-process-04.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 4" },
        { path: "/images/portfolio/selected-work/case-07-process-05.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 5" },
        { path: "/images/portfolio/selected-work/case-07-process-06.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 6" },
      ] : isEighthCase ? [
        { path: "/images/portfolio/selected-work/case-08-after.jpeg", kind: "image" as const, role: "after" as const, label: "After result" },
        { path: "/images/portfolio/selected-work/case-08-process-01.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 1" },
        { path: "/images/portfolio/selected-work/case-08-process-02.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 2" },
        { path: "/images/portfolio/selected-work/case-08-process-03.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 3" },
        { path: "/images/portfolio/selected-work/case-08-process-04.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 4" },
      ] : isNinthCase ? [
        { path: "/images/portfolio/selected-work/case-09-after.jpeg", kind: "image" as const, role: "after" as const, label: "After result" },
        { path: "/images/portfolio/selected-work/case-09-process-01.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 1" },
        { path: "/images/portfolio/selected-work/case-09-process-02.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 2" },
        { path: "/images/portfolio/selected-work/case-09-process-03.mp4", kind: "video" as const, role: "process" as const, label: "Treatment video 3" },
      ] : null,
    };
  }),
  behindTreatment: "/images/portfolio/behind-treatment/behind-the-treatment.mp4",
  instagramHighlights: Array.from({ length: 4 }, (_, index) =>
    `/images/portfolio/instagram/highlight-${String(index + 1).padStart(2, "0")}.mp4`),
  methodology: Array.from({ length: 5 }, (_, index) =>
    `/images/portfolio/methodology/step-${String(index + 1).padStart(2, "0")}.mp4`),
  testimonials: [
    { name: "Lucía M.", path: "/images/portfolio/testimonials/lucia-m.jpg" },
    { name: "Daniela G.", path: "/images/portfolio/testimonials/daniela-g.jpg" },
    { name: "Carmen S.", path: "/images/portfolio/testimonials/carmen-s.jpg" },
    { name: "Sheila A.", path: "/images/portfolio/testimonials/sheila-a.jpg" },
    { name: "Laura B.", path: "/images/portfolio/testimonials/laura-b.jpg" },
    { name: "Ana Belén R.", path: "/images/portfolio/testimonials/ana-belen-r.jpg" },
    { name: "Ary T.", path: "/images/portfolio/testimonials/ary-t.jpg" },
    { name: "Noelia C.", path: "/images/portfolio/testimonials/noelia-c.jpg" },
  ],
} as const;

// Enable media only after matching files have been added to public/images/portfolio.
const enabledMediaPaths = new Set<string>([
  portfolioMediaPaths.hero,
  ...portfolioMediaPaths.editorialCase,
  ...Object.values(portfolioMediaPaths.specialties),
  portfolioMediaPaths.behindTreatment,
  portfolioMediaPaths.instagramHighlights[0],
  portfolioMediaPaths.instagramHighlights[1],
  portfolioMediaPaths.instagramHighlights[2],
  portfolioMediaPaths.instagramHighlights[3],
  ...portfolioMediaPaths.methodology,
  ...portfolioMediaPaths.testimonials.map(({ path }) => path),
  ...portfolioMediaPaths.selectedWork.flatMap(({ before, after, additional, orderedMedia }) => [
    before,
    after,
    ...additional.map(({ path }) => path),
    ...(orderedMedia?.map(({ path }) => path) ?? []),
  ]),
]);

const imagePlaceholder = (placeholder: string, alt: string, path: string) : PortfolioMedia => ({
  src: enabledMediaPaths.has(path) ? path : null,
  path,
  kind: "image",
  alt,
  placeholder,
});

const testimonialReviews = [
  "I’ve been getting my brows done by Cris for years, and every touch-up reminds me I wouldn’t go anywhere else. The colour has stayed just as good as ever, and she’s always honest with me about when it’s actually time for a refresh.",
  "I started with my brows and loved them so much that a few months later I decided to get my lips done by Cristina too. I wanted a really natural result, and that’s exactly what I got! Now I know that whenever I want anything else done, I’ll be going to her.",
  "A friend recommended Cris, and now I’m the one bringing my mum, my auntie and pretty much anyone who asks about my brows! She has such a good eye for finding the right shape for each face, and she’s incredibly precise and detail-oriented. When you find someone this good, you have to share!!!!",
  "What I appreciate most about Cristina is that she never rushes you and takes the time to explain everything properly. She talked me through the whole process before we started and designed my brows to suit my face, rather than just using a standard shape.",
  "I’d had my brows done somewhere else and was really unhappy with the result. They were uneven and had turned a really unflattering bluish colour, so I’d been nervous about letting anyone touch them again. Cris explained exactly what could be corrected, and honestly, she gave me my confidence back.",
  "When I lost my eyebrows during chemo, I didn’t recognise myself in the mirror. Cristina made me feel so comfortable, let me take things at my own pace and was incredibly patient with all my questions and worries. She helped me feel a little more like myself again at a time when I really needed it. Love this girl sm...",
  "I was absolutely terrified it would hurt! Cris explained every step as she went along, which made the whole experience so much easier. I actually ended up falling asleep!!! If I could do it, anyone can!",
  "My biggest fear was that my brows would look too obvious or ‘drawn on’. Cristina showed me the design before starting, and I loved how carefully she worked with my skin and how attentive she was throughout the treatment. I love that nobody can tell what I’ve had done, but everyone says I look better!! She’s amazing!",
] as const;

const testimonialItems = portfolioMediaPaths.testimonials.map(({ name, path }, index) => ({
  photo: imagePlaceholder("[CLIENT PHOTO]", `${name} profile photo`, path),
  name,
  review: testimonialReviews[index],
}));

export const portfolioMedia = {
  hero: imagePlaceholder("HERO IMAGE — PLACEHOLDER", "Full-screen hero image to be supplied", portfolioMediaPaths.hero),
  editorialCase: [
    imagePlaceholder("HEALED RESULT — CASE IMAGE 01", "Healed PMU result from the featured case", portfolioMediaPaths.editorialCase[0]),
    imagePlaceholder("PIGMENT SWATCH — CASE IMAGE 02", "Pigment swatch from the featured case", portfolioMediaPaths.editorialCase[1]),
    imagePlaceholder("MAPPING — CASE IMAGE 03", "Brow or lip mapping from the featured case", portfolioMediaPaths.editorialCase[2]),
    imagePlaceholder("TREATMENT DETAIL — CASE IMAGE 04", "Treatment detail from the featured case", portfolioMediaPaths.editorialCase[3]),
    imagePlaceholder("CLOSE-UP — CASE IMAGE 05", "Alternative close-up from the featured case", portfolioMediaPaths.editorialCase[4]),
  ],
  specialties: Object.entries(portfolioMediaPaths.specialties).map(([name, path]) => ({
    name,
    image: imagePlaceholder(`${name.toUpperCase()} — IMAGE PLACEHOLDER`, `${name} treatment image to be supplied`, path),
  })),
  workIntro: { ...imagePlaceholder("BEHIND THE TREATMENT", "Behind the Treatment video", portfolioMediaPaths.behindTreatment), kind: "video" as const },
  selectedWork: {
    cases: portfolioMediaPaths.selectedWork.map((paths, index) => {
      const number = String(index + 1).padStart(2, "0");
      const standardMedia = [
        {
          label: "After result",
          role: "after" as const,
          path: paths.after,
          kind: "image" as const,
        },
        {
          label: "Before result",
          role: "before" as const,
          path: paths.before,
          kind: "image" as const,
        },
        ...paths.additional.map((item) => ({ ...item })),
      ];
      const mediaItems = paths.orderedMedia ?? standardMedia;
      const defaultIndex = Math.max(0, mediaItems.findIndex((item) => item.kind === "image"));
      const hoverIndex = defaultIndex + 1 < mediaItems.length ? defaultIndex + 1 : -1;
      return {
        defaultIndex,
        hoverIndex,
        media: mediaItems.map((item) => ({
            label: item.label,
            role: item.role,
            asset: {
              ...imagePlaceholder(
                `[CASE ${number} — ${item.label.toUpperCase()}]`,
                `Case ${number}: ${item.label.toLowerCase()}`,
                item.path,
              ),
              kind: item.kind,
            },
          })),
      };
    }),
  },
  methodology: portfolioMediaPaths.methodology.map((path, index) => ({
    ...imagePlaceholder(`[METHODOLOGY VIDEO ${String(index + 1).padStart(2, "0")}]`, `${["Consultation", "Design", "Approval", "Treatment", "Retouch"][index]} process video`, path),
    kind: "video" as const,
  })),
  instagramHighlights: portfolioMediaPaths.instagramHighlights.map((path, index) => ({
    ...imagePlaceholder(`[INSTAGRAM VIDEO ${String(index + 1).padStart(2, "0")} — PLACEHOLDER]`, `Instagram video ${index + 1} to be supplied`, path),
    kind: "video" as const,
  })),
  testimonials: {
    topRow: testimonialItems.slice(0, 4),
    bottomRow: testimonialItems.slice(4),
  },
};
