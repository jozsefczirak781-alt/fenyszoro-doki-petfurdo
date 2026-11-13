// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // Pre-bundle the browser deps the pages use, so the dev server never re-optimizes them
    // mid-session (that loads a second React copy and blanks the preview).
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "@supabase/supabase-js",
        "lucide-react",
        "sonner",
        "@radix-ui/react-slot",
        "@radix-ui/react-label",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "date-fns",
        "date-fns/locale",
        "react-day-picker",
        "zod",
        "@tanstack/router-core",
        "@tanstack/router-core/isServer",
        "@tanstack/router-core/ssr/client",
        "seroval",
      ],
    },
  },
});
