"""Second stage: web-weight 1080p encodes, masters moved out of /public.

enhance.py writes near-lossless (CRF 17) masters; this re-encodes the playback clips at CRF 20
and moves clips only used to cut scrub frames into media-masters/.
"""
import shutil
import subprocess
from pathlib import Path

FF = r"C:\Users\ssaivenk\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
ROOT = Path(__file__).resolve().parents[2]
VID = ROOT / "public" / "media" / "video"
MASTERS = ROOT / "media-masters"
PLAYBACK = ["hero", "result", "kitchen", "bedroom", "smart", "smart-reverse"]
SCRUB_ONLY = ["build", "enter"]

MASTERS.mkdir(exist_ok=True)
for name in PLAYBACK:
    src = VID / f"{name}.mp4"
    master = MASTERS / f"{name}.mp4"
    if not master.exists():
        shutil.move(src, master)
    subprocess.run([FF, "-y", "-v", "error", "-i", str(master), "-c:v", "libx264", "-preset", "slow", "-crf", "20",
                    "-profile:v", "high", "-pix_fmt", "yuv420p", "-g", "48", "-movflags", "+faststart", "-an", str(src)], check=True)
    print(f"{name}: {src.stat().st_size / 1e6:.1f} MB")
for name in SCRUB_ONLY:
    src = VID / f"{name}.mp4"
    if src.exists():
        shutil.move(src, MASTERS / f"{name}.mp4")
