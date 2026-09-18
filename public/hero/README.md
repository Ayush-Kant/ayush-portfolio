# Hero artwork assets

The hero implementation expects two optimized WebP scene assets:

- /public/hero/hero-typing.webp
- /public/hero/hero-wave.webp

The files are the pixel-art scene variants used by the hero animation:
1. typing/resting scene
2. initial waving pose

Keep both at the same aspect ratio (1024×710 source composition) so the animated hand clip stays aligned.

The generated artwork is intentionally kept outside the TypeScript bundle; it is loaded through next/image for efficient browser delivery.
