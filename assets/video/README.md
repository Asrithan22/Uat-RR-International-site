# Banner footage

Drop the files in with these exact names and the page picks them up automatically.
Nothing else needs editing.

## Background film — in place

The banner runs two clips, stacked. The upper one fades in and out over the
lower every 7 seconds, so the picture changes without ever cutting.

| File | Shows | Size |
|---|---|---|
| `banner-kuwait.mp4` | Kuwait City skyline from the air, dusk | 1.8 MB |
| `banner-business.mp4` | Business district at night, traffic at speed | 3.6 MB |

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

- The clips speed up as the pinned banner is scrolled through — 1× at the top,
  2.4× as it hands over to the next section.
- Phones load only `banner-kuwait.mp4`; the second clip is dropped below 980px.
- `prefers-reduced-motion` drops both and the still carousel carries the banner.

**Subject matter, per the brief:** aerial Bengaluru, Electronic City, people meeting,
handshakes, glass towers, a Gulf skyline for the India ↔ Kuwait note.

## Carousel card clips

Optional. Each lives in `cards/` and its poster image shows until the file exists.

| File | Card |
|---|---|
| `cards/bengaluru.mp4` | Bengaluru |
| `cards/partnerships.mp4` | Partnerships |
| `cards/india-kuwait.mp4` | India ↔ Kuwait |

**Specification**

- Portrait 3:4 — 720×960 is plenty, the cards render at ~260px wide
- 5–10 second loop, no audio, under 2 MB each
- The cards rotate away in 3D at the edges, so keep the subject dead centre

To turn any other card into video, swap its `<img>` for the same `<video>` block used
by the three above and add the file here.

## Where to source it

Free and licensed for commercial use — Pexels Videos, Coverr, Mixkit.
Search terms that match the brief: *Bangalore aerial*, *business handshake*,
*corporate meeting*, *city skyline dusk*, *modern office tower*.

For the real launch this should be original footage of RR's own work.
