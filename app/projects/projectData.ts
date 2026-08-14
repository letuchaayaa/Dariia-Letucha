export type Project = {
  slug: string;
  name: string;
  category: string;
  year: string;
  description: string;
  cover: string;
  gallery: string[];
  url?: string;
  tone?: "white" | "gray" | "sky";
};

export const projectData: Project[] = [
  {
    slug: "bonne",
    name: "Bonne",
    category: "Brand identity",
    year: "2024",
    description: "A playful bakery brand identity built around appetite, tactility and bold product imagery. The system extends across packaging, signage, social media, Instagram stories and promotional print, creating a consistent voice across physical and digital touchpoints.",
    cover: "/site/assets/bonne-new.png",
    gallery: [
      "/site/assets/bonne/01-brand-identity.jpeg",
      "/site/assets/bonne/02-social-media.jpeg",
      "/site/assets/bonne/03-social-grid.jpeg",
      "/site/assets/bonne/04-plate.jpeg",
      "/site/assets/bonne/05-cup.jpeg",
      "/site/assets/bonne/06-packaging.jpeg",
      "/site/assets/bonne/07-bag.jpeg",
      "/site/assets/bonne/08-sign.jpeg",
      "/site/assets/bonne/09-postcard-blue.jpeg",
      "/site/assets/bonne/10-postcard-pink.jpeg",
      "/site/assets/bonne/11-postcard-brown.jpeg",
      "/site/assets/bonne/12-stories.jpeg",
    ],
  },
  {
    slug: "pifagor",
    name: "Pifagor",
    category: "Brand identity",
    year: "2026",
    description: "A complete identity for an education platform, combining a classical symbol with a direct modern typographic system. The visual language extends across the website, social media pages, Instagram content, educational materials, covers and a character-led sticker system. A cloud-based production workflow supported by AI-assisted tools speeds up iteration and content adaptation.",
    cover: "/site/assets/helmet/project-02.png",
    gallery: [
      "/site/assets/pifagor-gallery/01-primary-logo.png",
      "/site/assets/pifagor-gallery/02-logo-system-a.png",
      "/site/assets/pifagor-gallery/03-logo-system-b.png",
      "/site/assets/pifagor-gallery/04-typography.png",
      "/site/assets/pifagor-gallery/05-main-colors.png",
      "/site/assets/pifagor-gallery/06-color-system.png",
      "/site/assets/pifagor-gallery/07-mascot-system.png",
      "/site/assets/pifagor-gallery/08-social-media-covers.png",
      "/site/assets/pifagor-gallery/09-social-media-posts.png",
      "/site/assets/pifagor-gallery/10-information-guide.png",
    ],
    tone: "gray",
  },
  { slug: "eden", name: "Eden", category: "Web design / E-commerce / Shopify", year: "2026", description: "An e-commerce website for a contemporary skincare brand, combining UX and visual design with Shopify development. The build uses no-code tools alongside custom HTML, CSS and JavaScript to create a polished, responsive shopping experience.", cover: "/site/assets/site-eden.png", gallery: ["/site/assets/site-eden.png"], url: "https://cdj00s-c6.myshopify.com/" },
  {
    slug: "agronova",
    name: "Agronova",
    category: "Brand identity",
    year: "2024",
    description: "A flexible brand identity for smart agriculture, connecting technology with the physical landscape. The system scales across the website, vehicles, flags, stationery, printed materials and social media while keeping the brand clear and recognizable.",
    cover: "/site/assets/helmet/project-04.png",
    gallery: [
      "/site/assets/agronova-gallery/01-logo-design.jpeg",
      "/site/assets/agronova-gallery/02-branding-system.jpeg",
      "/site/assets/agronova-gallery/03-branded-van.jpeg",
      "/site/assets/agronova-gallery/04-flags.jpeg",
      "/site/assets/agronova-gallery/05-field-logo.jpeg",
      "/site/assets/agronova-gallery/06-brand-tape.jpeg",
      "/site/assets/agronova-gallery/07-van-front.jpeg",
    ],
    tone: "gray",
  },
  { slug: "vinyl", name: "Vinyl", category: "Web design / E-commerce / Shopify", year: "2026", description: "A music-led Shopify storefront with a crisp editorial rhythm and tactile product presentation. The project combines e-commerce UX, no-code development and custom HTML, CSS and JavaScript for responsive interactions and a distinctive shopping experience.", cover: "/site/assets/site-vinyl.png", gallery: ["/site/assets/site-vinyl.png"], url: "https://vmcmay-pb.myshopify.com/" },
  { slug: "tennis-club", name: "Tennis Club", category: "Web design / Development / Wix", year: "2025", description: "A bright, energetic Wix website for a tennis club, designed for players of every age and level. The project covers information architecture, responsive web design and no-code development with clear programme navigation and a strong visual personality.", cover: "/site/assets/site-tennis.png", gallery: ["/site/assets/site-tennis.png"], url: "https://dariialetucha.wixstudio.com/my-site-5" },
  { slug: "training-workshops", name: "Step Travel", category: "Web design / Content", year: "2026", description: "A structured website and content system for children’s travel, language and IT camps in Ukraine and abroad. The design makes programmes, destinations and schedules easy for parents to explore while keeping the experience lively and accessible.", cover: "/site/assets/site-steptravel.png", gallery: ["/site/assets/site-steptravel.png"], tone: "sky" },
  { slug: "klaries", name: "Klaries", category: "Brand identity", year: "2024", description: "A confident brand identity for a golf-focused project, developed as a recognizable visual system for product, packaging, social media and digital communication.", cover: "/site/assets/helmet/project-08.png", gallery: ["/site/assets/case-klaries-01.png", "/site/assets/case-klaries-02.png", "/site/assets/case-klaries-03.png", "/site/assets/case-klaries-04.png", "/site/assets/case-klaries-05.png", "/site/assets/case-klaries-06.png", "/site/assets/case-klaries-07.png"], tone: "gray" },
  { slug: "white-dent", name: "White Dent", category: "Logotype design", year: "2025", description: "A focused logotype design for a dental brand, created for clear recognition across social media, profile imagery and everyday digital communication.", cover: "/site/assets/helmet/project-09.png", gallery: ["/site/assets/case-white-dent-01.png", "/site/assets/case-white-dent-02.png", "/site/assets/case-white-dent-03.png", "/site/assets/case-white-dent-04.png", "/site/assets/case-white-dent-05.png", "/site/assets/case-white-dent-06.png"] },
  { slug: "sila-studio", name: "Sila Studio", category: "Web design / Development / Wix", year: "2026", description: "A responsive Wix website for a creative studio, shaped around its services, atmosphere and approachable visual identity. The project includes UX structure, web design and no-code development from concept through launch.", cover: "/site/assets/site-sila.png", gallery: ["/site/assets/site-sila.png"], url: "https://dariialetucha.wixstudio.com/teklstudio" },
  { slug: "think-plan-do", name: "Think Plan Do", category: "Web design / Development / Wix", year: "2026", description: "A focused consulting website developed in Wix together with Viral Media. The project translates complex expertise into a clear digital experience through structured content, responsive layouts and straightforward service navigation.", cover: "/site/assets/site-tpd.png", gallery: ["/site/assets/site-tpd.png"], url: "https://www.tpdconsulting.ie/" },
  { slug: "solaris", name: "Solaris", category: "Web design / Development / Wix", year: "2026", description: "A product-led Wix website for a specialist blinds and curtains brand, created in collaboration with Viral Studio. The design balances product clarity, practical navigation and a confident visual system across desktop and mobile.", cover: "/site/assets/site-solaris.png", gallery: ["/site/assets/site-solaris.png"], url: "https://www.solarisblinds.ie/" },
  { slug: "payrollbien", name: "PayrollBien", category: "Web design / No-code development", year: "2026", description: "A professional payroll services website combining UX structure, responsive web design and no-code development. Custom HTML, CSS and JavaScript support the interactive experience, while the visual system makes complex services feel clear, approachable and trustworthy.", cover: "/site/assets/payrollbien-cover.png", gallery: ["/site/assets/payrollbien-cover.png"], url: "/payrollbien" },
];

export const projectBySlug = new Map(projectData.map((project) => [project.slug, project]));
