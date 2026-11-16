/** Public address of the site, used for canonical links, share previews and Google data. */
export const SITE_URL = "https://fenyszoro-doki-petfurdo.lovable.app";
export const SITE_NAME = "Fényszóró Doki Pétfürdő";
/** Town of the workshop and the nearby town customers search for. */
export const SERVICE_AREA = ["Pétfürdő", "Várpalota"] as const;

/** canonical + og:url for one page. */
export function pageUrlTags(path: string) {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [{ property: "og:url", content: url }],
    links: [{ rel: "canonical", href: url }],
  };
}
