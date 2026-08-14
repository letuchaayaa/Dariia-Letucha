"use client";

import { useEffect, useMemo, useRef } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const wrap = (value: number, size: number) => ((value % size) + size) % size;
const easeScale = (value: number) => value < .5 ? 2 * value * value : -1 + (4 - 2 * value) * value;

export function ParallaxProjectCarousel({ images, projectName, className, ringClassName, cardClassName, imageClassName }: {
  images: string[];
  projectName: string;
  className: string;
  ringClassName: string;
  cardClassName: string;
  imageClassName: string;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselImages = useMemo(() => {
    const source = images.length ? images : [""];
    const originals = Array.from({ length: Math.max(5, source.length) }, (_, index) => source[index % source.length]);
    return Array.from({ length: originals.length * 3 }, (_, index) => originals[index % originals.length]);
  }, [images]);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const cards = [...track.querySelectorAll<HTMLElement>("[data-carousel-card]")];
    if (!cards.length) return;

    let itemWidth = 0;
    let totalWidth = 1;
    let visibleCenter = window.innerWidth / 2;
    let position = 0;
    let velocity = 0;
    let smoothPosition = 0;
    let dragging = false;
    let lastX = 0;
    let dragStartX = 0;
    let dragStartTime = 0;
    let frame = 0;

    const measure = () => {
      const gap = parseFloat(getComputedStyle(cards[0]).marginRight || "0");
      itemWidth = cards[0].offsetWidth + gap;
      totalWidth = Math.max(1, itemWidth * cards.length);
      visibleCenter = window.innerWidth / 2;
    };

    const render = () => {
      if (!dragging) {
        position += velocity;
        velocity *= .91;
      }
      smoothPosition += (position - smoothPosition) * .14;

      cards.forEach((card, index) => {
        const baseX = wrap(index * itemWidth - smoothPosition, totalWidth);
        const finalX = baseX - totalWidth / 2 + visibleCenter;
        const cardCenter = finalX + itemWidth / 2;
        const signedDistance = cardCenter - visibleCenter;
        const distance = Math.abs(signedDistance);
        const t = easeScale(clamp(distance / Math.max(window.innerWidth, 900)));
        const scale = 1 - t * .35;
        const rotateY = t * 20 * (signedDistance < 0 ? 1 : -1);
        const rotateX = t * 6 * (signedDistance < 0 ? -1 : 1);
        const z = 120 - t * 180;
        const y = t * 40;
        const brightness = 1 - t * .4;
        const image = card.querySelector<HTMLElement>("[data-carousel-image]");

        card.style.transform = `translate3d(${finalX}px, calc(-50% + ${y}px), ${z}px) scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        card.style.filter = `brightness(${brightness})`;
        card.style.zIndex = String(1000 - Math.round(distance));
        if (image) image.style.transform = "none";
      });
      frame = requestAnimationFrame(render);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      velocity += (event.deltaY + event.deltaX) * .1;
    };
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      dragStartX = event.clientX;
      dragStartTime = performance.now();
      velocity = 0;
      stage.setPointerCapture?.(event.pointerId);
      stage.dataset.dragging = "true";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - lastX;
      position -= delta * .8;
      lastX = event.clientX;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const duration = Math.max(.001, (performance.now() - dragStartTime) / 1000);
      velocity = clamp(-((event.clientX - dragStartX) / duration) * .03, -30, 30);
      delete stage.dataset.dragging;
    };
    measure();
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", measure);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", measure);
    };
  }, [carouselImages.length]);

  return (
    <section ref={stageRef} className={className} aria-label={`${projectName} infinite project gallery`}>
      <div ref={trackRef} className={ringClassName}>
        {carouselImages.map((image, index) => (
          <figure className={cardClassName} data-carousel-card key={`${image}-${index}`}>
            <img className={imageClassName} data-carousel-image src={image} alt={`${projectName} project — image ${(index % images.length) + 1}`} />
          </figure>
        ))}
      </div>
    </section>
  );
}
