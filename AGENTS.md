<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Mobile-app shell: `__root.tsx` wraps every page in a `max-w-md` column with a fixed bottom tab bar (`src/components/app/BottomNav.tsx`); new top-level pages need a tab or a link from an existing page. Why: the product is used as a phone app.
- Price list and services live in `src/lib/services.ts`; opening hours and bookable slots live in `src/lib/schedule.ts` (dates as `YYYY-MM-DD` in Europe/Budapest), covered by `schedule.test.ts`. Why: booking page, price page and server validation must share one source.
- Quote requests and bookings are written only by server functions in `src/lib/workshop.functions.ts` using the admin client; the tables have RLS on with no public policies, and photos go to the private `quote-photos` bucket. Why: visitors must never read other customers' data.
- Appointments are booked by phone only: the booking page is a call screen, and the number lives in `src/lib/contact.ts`. The online booking server function and tables are kept but unused. Why: the owner wants to agree times personally.
- Taken booking times are read through the `get_booked_times(date)` database function, which exposes times only. A unique (date, time) constraint prevents double booking.
- Browser deps used by pages are listed in vite.config.ts optimizeDeps.include. Why: lazy re-optimization in dev loads a second React copy and blanks the preview.
