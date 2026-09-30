"""Build a single contact-sheet JPG (rows = clips, columns = evenly spaced timestamps)."""
import io
import subprocess
import sys

from PIL import Image, ImageDraw

FF = r"C:\Users\ssaivenk\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
TW, TH, COLS = 224, 126, 8


def grab(path, t):
    cmd = [FF, "-v", "error", "-ss", f"{t:.2f}", "-i", path, "-frames:v", "1", "-vf", f"scale={TW}:{TH}", "-f", "image2", "-c:v", "png", "-"]
    return Image.open(io.BytesIO(subprocess.run(cmd, capture_output=True, check=True).stdout))


out, clips = sys.argv[1], sys.argv[2:]
sheet = Image.new("RGB", (COLS * TW, len(clips) * (TH + 14)), "black")
d = ImageDraw.Draw(sheet)
for r, (path, dur) in enumerate(c.split("|") for c in clips):
    dur = float(dur)
    for c in range(COLS):
        t = min(dur - 0.05, c * dur / (COLS - 1))
        sheet.paste(grab(path, t), (c * TW, r * (TH + 14) + 14))
        d.text((c * TW + 3, r * (TH + 14) + 1), f"R{r} {t:.1f}s", fill="white")
sheet.save(out, quality=82)
