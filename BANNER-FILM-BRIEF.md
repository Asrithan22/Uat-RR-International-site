# RR International Group — Banner Film Brief

Reference the client gave: the popcorn-brand hero video, where raw kernels are
thrown through the air in slow motion and burst open into popcorn. What makes
that work is not the popcorn — it is the **transformation**. One raw thing
becomes one finished thing, in a single unbroken, cinematic move.

This brief translates that idea to RR International Group.

---

## The transformation

| Popcorn film | RR film |
|---|---|
| Raw kernels, scattered | **Separate people**, moving through the city on their own |
| Thrown together, mid-air | Paths **cross and converge** |
| Heat, the burst | The **moment of connection** — a handshake, an introduction, a signed agreement |
| Finished popcorn | **Opportunity** — a business, a community, a bridge between two countries |
| The brand mark lands | The **RR star** forms and holds |

One sentence for the editor:

> Scattered people, moving separately through Bengaluru, are drawn together —
> and where they meet, light gathers into a star.

---

## Shot list — 14 seconds, seamless loop, no audio

| # | Time | Shot | Note |
|---|---|---|---|
| 1 | 0.0–2.5s | Aerial push over Bengaluru at golden hour, Electronic City towers | Slow forward push, never a cut-in |
| 2 | 2.5–4.5s | Separate people in motion — walking, working, on a call | Fast cuts, each 0.5s, deliberately fragmented |
| 3 | 4.5–7.0s | Paths converge: people entering the same lobby, sitting at one table | Motion continues left-to-right through every cut |
| 4 | 7.0–9.0s | **The connection beat** — handshake, close on hands, slow motion | This is the "pop". Hold it longest |
| 5 | 9.0–11.0s | Result: a busy office, a community gathering, a signed page | Warmth rising, gold tones increasing |
| 6 | 11.0–12.5s | India to Kuwait — map dissolve or Gulf skyline at dusk | Keeps the cross-border promise on screen |
| 7 | 12.5–14.0s | Light gathers to a point; the RR star forms and holds | Match this to the star already animating on the page |

Shot 7 must resolve back to the wide, dark tone of shot 1 so the loop is
invisible.

## Grade and treatment

- Deep navy shadows, gold highlights. Push warmth into skin tones and lights.
- Slow motion on the connection beats only (shots 4 and 5) — everything else at speed.
- No on-screen text. The headline sits over the film in HTML.
- Keep the lower third of frame visually quiet and the upper-left calm — the
  page fades the film to white at the bottom and the headline sits centred.

## Technical spec

- **1920×1080**, H.264 MP4 **and** VP9 WebM
- **8–15 seconds**, seamless loop, **no audio track**
- Target **under 6 MB** — this loads before anything else on the page
- Also export a **poster frame** as JPG at 1920×1080

## Where the files go

```
assets/video/banner.mp4     <- primary
assets/video/banner.webm    <- smaller, served first where supported
assets/img/banner-poster.jpg
```

Drop them in and the banner picks them up automatically — no code change. Until
then the page runs a Ken Burns still sequence plus the gold particle field, so
the banner is never empty.

## If footage is being licensed rather than shot

Search terms that match the shot list, on Pexels / Coverr / Artgrid:

- `bengaluru aerial`, `india city drone golden hour`
- `business handshake slow motion`
- `diverse team meeting office`
- `kuwait city skyline dusk`, `gulf skyline aerial`
- `light particles gold bokeh`

Licensed footage must be cleared for commercial web use before launch. Free
stock CDNs must not be hotlinked — download and self-host in `assets/video/`.
