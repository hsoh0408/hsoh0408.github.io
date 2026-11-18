/**
 * Build variant. The default site is the general portfolio; the "gensler"
 * build (`npm run build:gensler`, served at /gensler/) is identical except
 * that it also links the Gensler cover letter.
 */
export const IS_GENSLER = import.meta.env.MODE === "gensler"
