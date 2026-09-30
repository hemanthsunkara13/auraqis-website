"""Locate static overlays (e.g. a generator watermark) in the delivered AI clips.

A watermark stays fixed while the picture changes, so its pixels have low temporal variance
in clips with camera movement. Prints the bounding box of low-variance, bright-edged pixels
in each corner region.
"""
import subprocess
import sys

import numpy as np

FF = r"C:\Users\ssaivenk\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
W, H = 640, 360


def frames(path, n=40):
    cmd = [FF, "-v", "error", "-i", path, "-vf", f"fps=2,scale={W}:{H}", "-frames:v", str(n), "-f", "rawvideo", "-pix_fmt", "gray", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)


for path in sys.argv[1:]:
    f = frames(path)
    std = f.std(axis=0)
    mean = f.mean(axis=0)
    gx = np.abs(np.diff(mean, axis=1, prepend=mean[:, :1]))
    gy = np.abs(np.diff(mean, axis=0, prepend=mean[:1, :]))
    edges = (gx + gy) > 18
    static = (std < 4) & edges
    print(path.split("\\")[-1], "frames", len(f), "global static-edge px", int(static.sum()))
    for name, (ys, xs) in {
        "TL": (slice(0, H // 4), slice(0, W // 4)),
        "TR": (slice(0, H // 4), slice(3 * W // 4, W)),
        "BL": (slice(3 * H // 4, H), slice(0, W // 4)),
        "BR": (slice(3 * H // 4, H), slice(3 * W // 4, W)),
    }.items():
        m = static[ys, xs]
        if m.sum() < 15:
            continue
        yy, xx = np.nonzero(m)
        y0, x0 = ys.start + yy.min(), xs.start + xx.min()
        y1, x1 = ys.start + yy.max(), xs.start + xx.max()
        print(f"  {name}: {int(m.sum())} px  box x{x0 / W:.3f}-{x1 / W:.3f}  y{y0 / H:.3f}-{y1 / H:.3f}")
