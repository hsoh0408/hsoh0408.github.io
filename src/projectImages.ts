/**
 * Project images live in src/assets/projects/. They're looked up by file name
 * without the extension, so "rashomon-flags-tab.png" in the content notes
 * matches rashomon-flags-tab.png, .jpg, or .webp in that folder.
 *
 * To add a missing image: drop a file with the listed name into
 * src/assets/projects/ and rebuild. Its placeholder is replaced automatically,
 * and the image is resized and converted to WebP at build time.
 */
export type ResolvedImage = {
  src: string
  w: number
  h: number
  srcset?: string
}

const modules = import.meta.glob<ResolvedImage>(
  "./assets/projects/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, import: "default", query: "?as=img" },
)

const imagesByName = new Map(
  Object.entries(modules).map(([filePath, image]) => [
    baseName(filePath),
    image,
  ]),
)

function baseName(file: string) {
  return (file.split("/").pop() ?? file).replace(/\.[^.]+$/, "")
}

export function getProjectImage(file: string): ResolvedImage | undefined {
  return imagesByName.get(baseName(file))
}
