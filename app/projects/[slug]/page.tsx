import Link from "next/link";
import { notFound } from "next/navigation";
import { projectBySlug, projectData } from "../projectData";
import { ProjectScrollReset } from "./GalleryScroller";
import { ParallaxProjectCarousel } from "./ParallaxProjectCarousel";
import styles from "./project.module.css";

export function generateStaticParams() {
  return projectData.map(({ slug }) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug.get(slug);
  if (!project) notFound();
  const isWebsite = project.category.toLowerCase().includes("web design");

  return (
    <main className={`${styles.page} ${styles[project.tone ?? "white"]} ${!isWebsite ? styles.carouselPage : ""}`}>
      <ProjectScrollReset />
      <header className={styles.projectIdentity}>
        <Link href="/home"><strong>Dariia Letucha</strong><span>Full-Stack Designer</span></Link>
      </header>
      {!isWebsite ? (
        <section className={styles.carouselProject}>
          <div className={styles.carouselHeading}>
            <h1>{project.name}</h1>
            <p>{project.category} · {project.year}</p>
          </div>
          <ParallaxProjectCarousel
            images={project.gallery}
            projectName={project.name}
            className={styles.carouselStage}
            ringClassName={styles.carouselRing}
            cardClassName={styles.carouselCard}
            imageClassName={styles.carouselImage}
          />
          <div className={styles.carouselCaption}>
            <p>{project.description}</p>
            <span>{project.category} · {project.year}</span>
          </div>
        </section>
      ) : (
          <section className={styles.websiteProject}>
            <div className={styles.websiteHeading}>
              <h1>{project.name}</h1>
              <p className={styles.websiteMetaMobile}>{project.category} · {project.year}</p>
            </div>
            <figure className={styles.websiteCover}>
              <a href={project.url ?? project.cover} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} website`}>
                <img src={project.cover} alt={`${project.name} website preview`} />
                <span>Click</span>
              </a>
            </figure>
            <div className={styles.websiteBottom}>
              <p>{project.description}</p>
              <span>{project.category} · {project.year}</span>
            </div>
          </section>
      )}
      <nav className={styles.dock} aria-label="Portfolio pages">
        <Link href="/home">Home</Link>
        <a href="/site/projects.html">Projects</a>
        <a href="/site/about.html">About</a>
        <a href="/site/lets-talk.html">Contact</a>
      </nav>
    </main>
  );
}
