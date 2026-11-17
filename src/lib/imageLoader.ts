/*
 * next/image without an image server.
 *
 * The site is exported as static files, so nothing can resize a picture
 * when it is asked for. Instead scripts/build-images.mjs makes every size
 * next/image can ask for (the widths in image-sizes.json) ahead of time, as
 * WebP under /_img, and this only has to point at the right file:
 *   /projectphotos/Bosett.png at 640  ->  /_img/projectphotos/Bosett-640.webp
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (!/\.(png|jpe?g)$/i.test(src) || /^https?:/.test(src)) return src;
  return `/_img${src.replace(/\.(png|jpe?g)$/i, "")}-${width}.webp`;
}
