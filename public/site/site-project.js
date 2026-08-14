const siteProjects = {
  eden: {
    title: "Eden",
    meta: ["E-commerce", "2026", "Shopify", "Development"],
    image: "assets/site-eden.png",
    url: "https://cdj00s-c6.myshopify.com/",
  },
  vinyl: {
    title: "Vinyl Shop",
    meta: ["E-commerce", "2026", "Shopify", "Development"],
    image: "assets/site-vinyl.png",
    url: "https://vmcmay-pb.myshopify.com/",
  },
  tennis: {
    title: "Tennis",
    meta: ["Landing", "2026", "Wix", "Development"],
    image: "assets/site-tennis.png",
    url: "https://dariialetucha.wixstudio.com/my-site-5",
  },
  sila: {
    title: "Sila Studio",
    meta: ["Website", "2026", "Wix", "Development"],
    image: "assets/site-sila.png",
    url: "https://dariialetucha.wixstudio.com/teklstudio",
  },
  steptravel: {
    title: "Step Travel",
    meta: ["Website", "2026", "HTML CSS", "No-code"],
    image: "assets/site-steptravel.png",
    url: "#",
  },
  tpd: {
    title: "Think Plan Do",
    meta: ["Website", "2025", "Wix", "Development"],
    image: "assets/site-tpd.png",
    url: "https://www.tpdconsulting.ie/",
  },
  solaris: {
    title: "Solaris",
    meta: ["Website", "2025", "Wix", "Development"],
    image: "assets/site-solaris.png",
    url: "https://www.solarisblinds.ie/",
  },
};

const key = window.location.hash.replace("#", "") || "eden";
const project = siteProjects[key] || siteProjects.eden;
const title = document.querySelector("#site-case-title");
const meta = document.querySelector(".site-case-meta");
const preview = document.querySelector(".site-preview-link");
const image = document.querySelector(".site-preview-image");
const click = document.querySelector(".site-click");

document.title = `${project.title} — Dariia Letucha`;
title.textContent = project.title;
meta.innerHTML = project.meta.map((item) => `<span>${item}</span>`).join("");
preview.href = project.url;
click.href = project.url;
image.src = project.image;
image.alt = `${project.title} website preview`;
