# Regenerates public/Profpic-depth.png from public/Profpic.png.
#
# Run once, offline, whenever the portrait changes:
#   uv venv .depth-venv && uv pip install --python .depth-venv/bin/python torch transformers pillow numpy
#   .depth-venv/bin/python scripts/portrait-depth.py public/Profpic.png public/Profpic-depth.png
#
# The model (Depth Anything V2, small) is fetched from the Hugging Face hub on first run.

"""Depth Anything V2 (small) over one RGBA portrait -> 8-bit depth PNG.

Transparent pixels are pasted onto mid grey before estimation and zeroed in
the output, and the range is normalised over the opaque region only, so the
figure uses the full 0..255 instead of sharing it with the background.
Bright = near, which is what a displacement map wants.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from transformers import pipeline

src, dst = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGBA")
alpha = np.array(img.split()[3])
rgb = Image.new("RGB", img.size, (128, 128, 128))
rgb.paste(img, mask=img.split()[3])

pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")
depth = np.array(pipe(rgb)["depth"]).astype(np.float32)
if depth.shape != alpha.shape:
    depth = np.array(Image.fromarray(depth).resize(img.size, Image.BILINEAR))

mask = alpha > 16
lo, hi = np.percentile(depth[mask], 1), np.percentile(depth[mask], 99)
norm = np.clip((depth - lo) / max(hi - lo, 1e-6), 0, 1)

# The transparent area is discarded when drawn, but its depth still pulls on
# the triangles along the edge. Left at zero it makes a cliff there, and the
# edge of the picture smears out in streaks as the plane turns. Grow the edge
# values outward instead, so the surface simply carries on past the cutout.
filled = mask.copy()
out = np.where(mask, norm, 0.0)
for _ in range(160):
    if filled.all():
        break
    pad_v = np.pad(out, 1)
    pad_f = np.pad(filled, 1).astype(np.float32)
    total = np.zeros_like(out)
    count = np.zeros_like(out)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            ys = slice(1 + dy, 1 + dy + out.shape[0])
            xs = slice(1 + dx, 1 + dx + out.shape[1])
            total += pad_v[ys, xs] * pad_f[ys, xs]
            count += pad_f[ys, xs]
    grow = (~filled) & (count > 0)
    out[grow] = total[grow] / count[grow]
    filled |= grow
out[~filled] = out[filled].min()

# A light blur takes the remaining small steps (arm against chest) down to
# slopes, which is all a displaced plane can draw cleanly.
img8 = Image.fromarray((out * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(3))
img8.save(dst)
norm = out
print("wrote", dst, img.size, "near/far", float(norm[mask].max()), float(norm[mask].min()))
