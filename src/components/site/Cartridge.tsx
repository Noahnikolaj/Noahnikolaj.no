import Image from "next/image";

import type { Project } from "@/content/projects";

/* Each project's label colour, from its own world. */
const COVERS: Record<string, string> = {
  "guest-food-payment": "linear-gradient(160deg, #FFD9E0, #E4647C)",
  deadwax: "linear-gradient(160deg, #4A1F37, #12070D)",
  bosett: "linear-gradient(160deg, #FFE0D4, #F0907A)",
  pixiworld: "linear-gradient(160deg, #F8EBCF, #D7B47F)",
  denji: "linear-gradient(160deg, #4B3260, #1E1328)",
};
export const coverOf = (slug: string) => COVERS[slug] ?? "linear-gradient(160deg, #FFBCC8, #9B2742)";

/*
 * A handheld game cartridge: a small dark shell with a step in its top
 * edge, a sticker across the front with the site's name along the top and
 * the project as box art, and a product code moulded into the plastic
 * below. Every project's title is set as its own game logo on the art.
 */
const CART: Record<string, { logo: string[]; code: string }> = {
  "guest-food-payment": { logo: ["Guest Food", "Payment"], code: "NNK-GFPM-NOR" },
  deadwax: { logo: ["deadwax"], code: "NNK-DWAX-NOR" },
  bosett: { logo: ["Bosett"], code: "NNK-BSTT-NOR" },
  pixiworld: { logo: ["PixiWorld"], code: "NNK-PIXW-NOR" },
  denji: { logo: ["Finding", "Denji"], code: "NNK-DNJI-NOR" },
};

export function Cartridge({ project }: { project: Project }) {
  const cart = CART[project.slug] ?? {
    logo: [project.title],
    code: `NNK-${project.slug.slice(0, 4).toUpperCase()}-NOR`,
  };
  return (
    <span
      className="cart"
      style={{ ["--cover" as string]: coverOf(project.slug) }}
      aria-hidden="true"
    >
      <span className="cart-sticker">
        <span className="cart-brand">Noah Nikolaj</span>
        <span className="cart-art">
          {project.image ? (
            <Image
              src={project.image.src}
              alt=""
              fill
              sizes="12rem"
              // The whole screenshot, as box art: never cropped or zoomed.
              // The bottom is left clear for the game's logo.
              className="object-contain px-[8%] pb-[34%] pt-[7%]"
            />
          ) : null}
          <span className={`cart-logo logo--${project.slug}`}>
            {cart.logo.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        </span>
      </span>
      <span className="cart-code">{cart.code}</span>
    </span>
  );
}
