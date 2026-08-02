# Banner footage

Drop the files in with these exact names and the page picks them up automatically.
Nothing else needs editing.

## Background film

| File | Used by |
|---|---|
| `banner.mp4` | Banner background (required) |
| `banner.webm` | Same clip in WebM — optional, loads first where supported and is ~30% smaller |

**Specification**

- 1920×1080, H.264, 24 or 30fps
- 8–15 second seamless loop
- **No audio track** — browsers block autoplay on anything with sound
- Under 6 MB. Compress with: `ffmpeg -i source.mp4 -an -vf scale=1920:-2 -crf 28 -preset slow banner.mp4`
- Keep the action slow and wide. The blue→white scrim sits over it at 60–94% opacity,
  so anything fast or high-contrast turns to mush. Aerials, slow pushes and drifting
  crowds read best.

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
