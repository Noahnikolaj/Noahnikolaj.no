import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeviceFrame } from "@/components/site/DeviceFrame";
import { PixelButton } from "@/components/site/PixelButton";
import { getProject, projects } from "@/content/projects";

/*
 * `denji` is excluded: it has its own static route that mounts the playable
 * game. Next resolves the static segment first, but leaving it out of the
 * prerender list keeps the intent explicit.
 */
export function generateStaticParams() {
  return projects
    .filter((project) => project.slug !== "denji")
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Fant ikke prosjektet" };
  return { title: project.title, description: project.tagline };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { image } = project;

  return (
    <main id="hovedinnhold">
      <article className="mx-auto my-10 w-full max-w-3xl border-4 border-foreground bg-background px-5 py-12 sm:my-14 sm:px-10">
        <Link
          href="/prosjekter"
          className="inline-flex min-h-[44px] items-center font-medium underline decoration-2 underline-offset-4"
        >
          Tilbake til alle prosjekter
        </Link>

        <h1 className="mt-8 font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.05]">
          {project.title}
        </h1>

        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Rolle</dt>
            <dd className="font-bold">{project.role}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Når</dt>
            <dd className="font-bold">{project.period}</dd>
          </div>
        </dl>

        {image ? (
          /*
           * Art that is a raw capture gets its drawn device here too, the
           * same one the index and the home tiles use. Without this the
           * project's own page is the one place the screenshot floats
           * unframed.
           */
          image.device ? (
            <div className="mt-10 flex justify-center bg-secondary p-6 sm:p-10">
              <DeviceFrame device={image.device} className="max-w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  priority
                  sizes="(max-width: 768px) 80vw, 32rem"
                  className="block h-auto w-auto max-h-[34rem] max-w-full"
                />
              </DeviceFrame>
            </div>
          ) : image.transparent ? (
            <div className="mt-10 flex justify-center border-4 border-foreground bg-secondary px-4 py-8">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority
                sizes="(max-width: 768px) 92vw, 24rem"
                className="h-auto max-h-[580px] w-auto max-w-full drop-shadow-md"
              />
            </div>
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              sizes="(max-width: 768px) 92vw, 44rem"
              className="mt-10 h-auto w-full border-4 border-foreground"
            />
          )
        ) : (
          <div className="dither-25 mt-10 border-4 border-foreground p-10">
            <p className="text-center font-medium">
              Arbeidet eies av Welcome Workdays, så det kan ikke vises her.
            </p>
          </div>
        )}

        <div className="mt-10 space-y-5 text-lg leading-relaxed">
          {project.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <h2 className="mt-12 font-display text-xl">Laget med</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li
              key={item}
              className="border-4 border-foreground bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground"
            >
              {item}
            </li>
          ))}
        </ul>

        {project.links && project.links.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-4">
            {project.links.map((link) => (
              <PixelButton key={link.href} href={link.href}>
                {link.label}
              </PixelButton>
            ))}
          </div>
        ) : null}
      </article>
    </main>
  );
}
