"use client";

import { useEffect, useRef } from "react";

export function ProjectScrollReset() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove("page-is-leaving");
    root.classList.add("project-scroll-enabled");
    body.classList.add("project-scroll-enabled");
    window.history.scrollRestoration = "auto";

    const unlock = () => root.classList.remove("page-is-leaving");
    window.addEventListener("pageshow", unlock);
    return () => {
      window.removeEventListener("pageshow", unlock);
      root.classList.remove("project-scroll-enabled", "page-is-leaving");
      body.classList.remove("project-scroll-enabled");
    };
  }, []);

  return null;
}

export function GalleryScroller({ images, projectName, className, trackClassName, figureClassName }: {
  images: string[];
  projectName: string;
  className: string;
  trackClassName: string;
  figureClassName: string;
}) {
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const onWheel = (event: WheelEvent) => {
      if (gallery.scrollWidth <= gallery.clientWidth || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const atStart = gallery.scrollLeft <= 1;
      const atEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1;
      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;
      event.preventDefault();
      gallery.scrollLeft += event.deltaY * 1.15;
    };
    gallery.addEventListener("wheel", onWheel, { passive: false });
    return () => gallery.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section ref={galleryRef} className={className} aria-label={`${projectName} horizontal gallery`}>
      <div className={trackClassName}>
        {images.map((image, imageIndex) => (
          <figure className={figureClassName} key={image}>
            <a href={image} target="_blank" rel="noreferrer" aria-label={`Open ${projectName} image ${imageIndex + 1}`}>
              <img src={image} alt={`${projectName} project — image ${imageIndex + 1}`} />
            </a>
          </figure>
        ))}
      </div>
    </section>
  );
}
