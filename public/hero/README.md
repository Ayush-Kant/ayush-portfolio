# Hero media assets

The hero scene uses a two-stage video pipeline so the experience actually plays like a tiny product film instead of relying on clipped duplicate still images.

Required files:

- hero-typing-scene.webp — static poster/fallback
- hero-intro.webm — one-time greeting/wave animation
- hero-intro.mp4 — H.264 fallback for the intro
- hero-idle.webm — looping typing/cat-breathing animation
- hero-idle.mp4 — H.264 fallback for the idle loop

Place all five files directly in this folder:

`public/hero/`

Runtime behavior:

1. Poster is shown immediately.
2. Intro video loads and plays muted.
3. Idle loop is preloaded while the intro is running.
4. When the intro ends, the idle loop starts without a second visual transition.
5. If autoplay/video loading fails, the poster remains as a graceful fallback.
6. Reduced-motion users receive the static poster instead of continuous animation.

The generated WebM/MP4 clips are intentionally short and compressed for hero usage.
