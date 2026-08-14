"use client";

import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject, WheelEvent as ReactWheelEvent } from "react";
import { DoubleSide, Group, Mesh, Vector3 } from "three";
import styles from "./helmet.module.css";

const projects = [
  { slug: "bonne", name: "Bonne", image: "/site/assets/bonne/01-brand-identity.jpeg" },
  { slug: "pifagor", name: "Pifagor", image: "/site/assets/pifagor-gallery/01-primary-logo.png" },
  { slug: "eden", name: "Eden", image: "/site/assets/helmet/project-03.png" },
  { slug: "agronova", name: "Agronova", image: "/site/assets/agronova-gallery/01-logo-design.jpeg" },
  { slug: "training-workshops", name: "Step Travel", image: "/site/assets/step-travel-4x5.png" },
  { slug: "vinyl", name: "Vinyl", image: "/site/assets/helmet/project-05.png" },
] as const;

type MotionRefs = {
  vertical: MutableRefObject<number>;
  verticalCurrent: MutableRefObject<number>;
  spin: MutableRefObject<number>;
  angle: MutableRefObject<number>;
};

function ProjectTube({ motion, layer, onHover, onSelect }: {
  motion: MotionRefs;
  layer: "back" | "front";
  onHover: (project: (typeof projects)[number] | null, point?: { x: number; y: number }) => void;
  onSelect: (project: (typeof projects)[number]) => void;
}) {
  const group = useRef<Group>(null);
  const rows = useRef<Array<Group | null>>([]);
  const tiles = useRef<Array<Mesh | null>>([]);
  const worldPosition = useMemo(() => new Vector3(), []);
  const textures = useTexture(projects.map((project) => project.image));
  const viewport = useThree((state) => state.viewport);
  const rowCount = 3;
  const copies = 3;
  const columns = 8;
  const mobile = viewport.width < 6;
  const radius = mobile ? 3.1 : 4.2;
  const tileWidth = mobile ? .72 : .9;
  const tileHeight = mobile ? .96 : 1.2;
  const rowGap = 2.25;

  useFrame(() => {
    if (group.current) group.current.position.y = -motion.verticalCurrent.current;
    rows.current.forEach((row, index) => {
      if (row) row.rotation.y = motion.angle.current * (.72 + (index % rowCount) * .18);
    });
    group.current?.updateMatrixWorld();
    tiles.current.forEach((tile) => {
      if (!tile) return;
      tile.getWorldPosition(worldPosition);
      tile.visible = layer === "front" ? worldPosition.z > 0 : worldPosition.z <= 0;
    });
  });

  const pointer = (event: ThreeEvent<PointerEvent>) => ({ x: event.clientX, y: event.clientY });

  return (
    <group ref={group}>
      {Array.from({ length: rowCount * copies }).map((_, rowIndex) => {
        const baseRow = rowIndex % rowCount;
        const y = (rowIndex - (rowCount * copies - 1) / 2) * rowGap;
        const offset = baseRow % 2 ? .5 : 0;
        return (
          <group key={rowIndex} position={[0, y, 0]} ref={(node) => { rows.current[rowIndex] = node; }}>
            {Array.from({ length: columns }).map((__, column) => {
              const theta = ((column + offset) / columns) * Math.PI * 2;
              const projectIndex = (baseRow * columns + column) % projects.length;
              const project = projects[projectIndex];
              return (
                <mesh
                  key={column}
                  ref={(node) => { tiles.current[rowIndex * columns + column] = node; }}
                  position={[Math.cos(theta) * radius, 0, Math.sin(theta) * radius]}
                  rotation={[0, -(theta + Math.PI / 2), 0]}
                  scale={layer === "front" ? [-1, 1, 1] : [1, 1, 1]}
                  onPointerEnter={(event) => { event.stopPropagation(); onHover(project, pointer(event)); }}
                  onPointerMove={(event) => onHover(project, pointer(event))}
                  onPointerLeave={() => onHover(null)}
                  onClick={(event) => { event.stopPropagation(); onSelect(project); }}
                >
                  <planeGeometry args={[tileWidth, tileHeight]} />
                  <meshBasicMaterial map={textures[projectIndex]} toneMapped={false} side={DoubleSide} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

function ExperienceScene({ motion, layer, onHover, onSelect }: {
  motion: MotionRefs;
  layer: "back" | "front";
  onHover: (project: (typeof projects)[number] | null, point?: { x: number; y: number }) => void;
  onSelect: (project: (typeof projects)[number]) => void;
}) {
  return (
    <>
      <ProjectTube motion={motion} layer={layer} onHover={onHover} onSelect={onSelect} />
    </>
  );
}

export function HelmetExperience() {
  const router = useRouter();
  const motion = useMemo<MotionRefs>(() => ({
    vertical: { current: 0 },
    verticalCurrent: { current: 0 },
    spin: { current: 0 },
    angle: { current: 0 },
  }), []);
  const [hovered, setHovered] = useState<(typeof projects)[number] | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ y: number; active: boolean }>({ y: 0, active: false });

  const handleHover = useCallback((project: (typeof projects)[number] | null, point?: { x: number; y: number }) => {
    setHovered(project);
    if (point) setTooltip(point);
  }, []);

  const onWheel = useCallback((event: ReactWheelEvent) => {
    motion.vertical.current += event.deltaY * .0025;
    motion.spin.current += event.deltaY * .0035;
  }, [motion]);

  const openProject = useCallback((project: (typeof projects)[number]) => {
    window.dispatchEvent(new Event("page-transition:start"));
    window.setTimeout(() => router.push(`/projects/${project.slug}`), 620);
  }, [router]);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const loopHeight = 6.75;
    const tick = (now: number) => {
      const delta = Math.min(.05, (now - previous) / 1000);
      previous = now;
      motion.verticalCurrent.current += (motion.vertical.current - motion.verticalCurrent.current) * .09;
      if (motion.verticalCurrent.current > loopHeight / 2) {
        motion.verticalCurrent.current -= loopHeight;
        motion.vertical.current -= loopHeight;
      } else if (motion.verticalCurrent.current < -loopHeight / 2) {
        motion.verticalCurrent.current += loopHeight;
        motion.vertical.current += loopHeight;
      }
      motion.spin.current *= Math.pow(.91, delta * 60);
      motion.angle.current += (.18 + motion.spin.current) * delta;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [motion]);

  useEffect(() => {
    const prevent = (event: TouchEvent) => event.preventDefault();
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => document.removeEventListener("touchmove", prevent);
  }, []);

  return (
    <main
      className={styles.root}
      onWheel={onWheel}
      onPointerDown={(event) => { dragging.current = { y: event.clientY, active: true }; }}
      onPointerMove={(event) => {
        if (!dragging.current.active) return;
        const delta = dragging.current.y - event.clientY;
        dragging.current.y = event.clientY;
        motion.vertical.current += delta * .008;
        motion.spin.current += delta * .01;
      }}
      onPointerUp={() => { dragging.current.active = false; }}
      onPointerCancel={() => { dragging.current.active = false; }}
    >
      <header className={styles.header}>
        <Link className={styles.identity} href="/home"><strong>Dariia Letucha</strong><span>Full-Stack Designer</span></Link>
      </header>

      <Canvas className={`${styles.canvas} ${styles.backCanvas}`} camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ExperienceScene motion={motion} layer="back" onHover={handleHover} onSelect={openProject} />
        </Suspense>
      </Canvas>

      <iframe className={styles.helmetFrame} src="/site/about2-helmet/index.html" title="Dariia helmet" />

      <Canvas className={`${styles.canvas} ${styles.frontCanvas}`} camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ExperienceScene motion={motion} layer="front" onHover={handleHover} onSelect={openProject} />
        </Suspense>
      </Canvas>

      {hovered && (
        <div className={styles.tooltip} style={{ left: tooltip.x + 18, top: tooltip.y + 18 }}>
          <img src={hovered.image} alt="" />
          <span>{hovered.name}</span>
        </div>
      )}

      <nav className={styles.bottomNav} aria-label="Pages">
        <span>Home</span>
        <a href="/site/projects.html">Projects</a>
        <a href="/site/about.html">About</a>
        <a href="/site/lets-talk.html">Contact</a>
      </nav>
    </main>
  );
}
