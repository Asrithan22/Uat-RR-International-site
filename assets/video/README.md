# Banner footage

Drop the files in with these exact names and the page picks them up automatically.
Nothing else needs editing.

## Background film — in place

The banner runs two clips, stacked. The upper one fades in and out over the
lower every 7 seconds, so the picture changes without ever cutting.

| File | Shows | Role | Size |
|---|---|---|---|
| `banner-business.mp4` | Business district at night, traffic at speed | base clip | 3.6 MB |
| `banner-kuwait.mp4` | Kuwait City skyline from the air, dusk | crossfades over it | 1.8 MB |

Both are Pexels-licensed (free for commercial use, no attribution required):
Kuwait City by Obaid Alajmi, the night district by Peter Fowler.

**Specification for replacements**

- 1920×1080, H.264, 24 or 30fps
- 5–15 second seamless loop
- **No audio track** — browsers block autoplay on anything with sound
- Under 4 MB each. Compress with:
  `ffmpeg -i source.mp4 -an -vf scale=1920:-2 -crf 28 -preset slow banner-kuwait.mp4`
- The scrim over the film sits at 52–90% opacity, so mid-tones survive but fine
  detail does not. Aerials and wide city shots read best.

**Behaviour worth knowing**

- The banner is one screen tall and is no longer pinned — it hands straight over
  to Our Vision, so the clips play at normal speed throughout.
- Phones load only `banner-business.mp4`; the crossfade clip is dropped below 980px.
- `prefers-reduced-motion` drops both and the still behind them carries the banner.

**Subject matter, per the brief:** aerial Bengaluru, Electronic City, people meeting,
handshakes, glass towers, a Gulf skyline for the India ↔ Kuwait note.

## Brand structure slider

The six slides in *Who We Are & Brand Structure* each carry a still, not a clip.
They currently point at Unsplash; swap each `<img src>` in `index.html` for RR's
own photography as it is shot.

| Slide | Subject to shoot |
|---|---|
| 01 RR International Group | The group's own offices or a signature building |
| 02 RR Event Management | A live RR event — audience, stage, delivery |
| 03 Electronic City United | ECU community gathering |
| 04 Bengaluru → Electronic City | The team at work in Electronic City |
| 05 India ↔ Kuwait | Kuwait City |
| 06 GCC & Future Markets | Gulf skyline |

**Specification** — landscape 3:2, 1200px wide is plenty, under 400 KB each after
compression. The slide crops to fill, so keep the subject off dead centre-left,
where the navy wash falls.

## Where to source it

Free and licensed for commercial use — Pexels Videos, Coverr, Mixkit.
Search terms that match the brief: *Bangalore aerial*, *business handshake*,
*corporate meeting*, *city skyline dusk*, *modern office tower*.

For the real launch this should be original footage of RR's own work.
