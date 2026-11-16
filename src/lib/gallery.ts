import ref1Before from "@/assets/ref-1-before.jpg";
import ref1After from "@/assets/ref-1-after.jpg";
import ref2Before from "@/assets/ref-2-before.jpg";
import ref2After from "@/assets/ref-2-after.jpg";

/**
 * Before/after photo pairs shown in the homepage gallery.
 * To add the workshop's own work: put the two photos in src/assets, import them here
 * and add a new entry at the TOP of the list. `sample: true` marks illustration images
 * (not real customer jobs) so the page labels them honestly.
 */
export type GalleryPair = {
  id: string;
  title: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  sample?: boolean;
};

export const GALLERY: GalleryPair[] = [
  {
    id: "minta-1",
    title: "Sárgult, matt búra",
    before: ref1Before,
    after: ref1After,
    beforeAlt: "Sárgult, matt fényszóró búra felújítás előtt",
    afterAlt: "Átlátszó fényszóró búra gőzöléses felújítás után",
    sample: true,
  },
  {
    id: "minta-2",
    title: "Erősen oxidálódott búra",
    before: ref2Before,
    after: ref2After,
    beforeAlt: "Erősen oxidálódott polikarbonát fényszóró felújítás előtt",
    afterAlt: "Tiszta polikarbonát fényszóró gőzölés után",
    sample: true,
  },
];
