# Brand artwork — files to place here

The site looks for these three files. Until each one exists, a coded fallback
shows in its place, so nothing ever appears broken. Drop the files in and they
take over automatically — no code change needed.

| File | Used in | Export spec |
|---|---|---|
| `rr-monogram.png` | Header, on every page | Just the **RR + compass star** mark, no wordmark. Transparent background, 200×200 px, PNG-24 |
| `rr-logo.png` | Banner, footer | The **full lockup** — monogram + "RR INTERNATIONAL GROUP". Transparent background, 900 px wide, PNG-24 |
| `founder.jpg` | Founder section | Portrait, 4:5 crop, 1000×1250 px minimum |

## Important on the transparent background

The versions circulated so far sit on a dark navy panel. **Do not use those.**
Exported with the navy still attached, the mark shows as a navy rectangle
against the site's white sections and looks like a mistake.

Ask the designer for the artwork on a transparent canvas — the gold gradient and
bevel stay exactly as they are, only the background is removed.

If an `.ai`, `.eps` or `.svg` original exists, **SVG is better than PNG here**:
it stays sharp on retina screens, scales to any size, and is a fraction of the
file weight. Save it as `rr-logo.svg` and tell me — it is a one-line change to
point the page at it.

## Also worth generating

- `favicon.png` — 512×512, the monogram alone, for the browser tab
- `og-image.jpg` — 1200×630, the logo on the navy panel, for WhatsApp and
  LinkedIn link previews. This one *should* keep the navy background.

## The coded fallback

Where the artwork is missing, the page draws the **compass star** from the
monogram in SVG — same eight-point geometry, same gold gradient, with a bevel
facet on each point and a specular highlight sweeping across it. It animates in
3D and is used deliberately in the Brand Story section even when the artwork is
present, because it can turn and catch light in a way a flat PNG cannot.
