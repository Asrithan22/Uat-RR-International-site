# Banner footage

Drop the files in with these exact names and the page picks them up automatically.
Nothing else needs editing.

## Background film — in place

The banner runs two clips, stacked. The upper one fades in and out over the
lower every 7 seconds, so the picture changes without ever cutting.

| File | Shows | Role | Size |
|---|---|---|---|
| `banner-team.mp4` | Meeting room in daylight, people talking | base clip | 2.7 MB |
| `banner-collab.mp4` | The same table from overhead, laptops and notes | crossfades over it | 2.5 MB |

Both Pexels-licensed — free for commercial use, no attribution required.

**Both are 720p, deliberately.** 1080p cuts of the same clips came to 10.2 MB
between them for a banner that sits behind a scrim; 720p halves that and the
softness does not show at the sizes this renders. Do not "upgrade" these to
1080p without a reason.

**Sources are set by JS, not by the markup.** The `<video>` elements carry
`data-src` instead of `src`, and `main.js` assigns it — so a reduced-motion
visitor fetches nothing at all. If a clip ever needs a smaller cut for phones,
add `data-src-sm` alongside it and `main.js` will use it below 980px. If you add
a replacement, set `data-src`: a plain `src` loads on every device and defeats
both of these.

**Specification for replacements — daylight only**

- **Bright, daylight footage.** Night and low-key clips were tried and rejected:
  they read as a black banner no matter how light the scrim over them is.
- 1920×1080, H.264, 24 or 30fps
- 5–15 second seamless loop
- **No audio track** — browsers block autoplay on anything with sound
- Ideally under 4 MB. Compress with:
  `ffmpeg -i source.mp4 -an -vf scale=1920:-2 -crf 28 -preset slow banner-team.mp4`
- The scrim is now only a pool behind the headline on the left; it clears
  completely by mid-frame. Keep the busy part of the shot to the **right**, and
  keep the left third calm so the type has something quiet to sit on.

**Behaviour worth knowing**

- The banner is one screen tall and is no longer pinned — it hands straight over
  to Our Vision, so the clips play at normal speed throughout.
- Phones load only `banner-team.mp4`; the crossfade clip is dropped below 980px.
- `prefers-reduced-motion` drops both and the still behind them carries the banner.
- The CSS lifts colour rather than draining it (`saturate(1.18)`), so whatever
  goes here should already be colourful in camera.

**Subject matter, per the brief:** people meeting, handshakes, community events,
Bengaluru and Electronic City, a Gulf skyline for the India ↔ Kuwait note.

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
