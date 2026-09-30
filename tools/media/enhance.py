"""AURAQIS V2 media pipeline.

Enhances the supplied 720p AI clips to 1080p (temporal denoise -> Lanczos upscale ->
contrast-adaptive sharpen -> gentle grade), builds seamless ping-pong loops, 720p fallbacks,
posters, scroll-scrub WebP frame sequences, and web-sized stills.

Run from the project root:  python tools/media/enhance.py
"""
import subprocess
from pathlib import Path

from PIL import Image

FF = r"C:\Users\ssaivenk\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT.parent / "AURAQIS" / "AURAQIS V2"
SRC = ASSETS / "Videoss"
OUT = ROOT / "public" / "media"
VID, FRAMES, STILLS = OUT / "video", OUT / "frames", OUT / "stills"

CLIP = {
    "build": SRC / "V2-VID-01b_construction-10s_gwr_video_mvp.mp4",
    "build20": SRC / "V2-VID-01_construction_gwr_video_mvp.mp4",
    "enter": SRC / "V2-VID-02_step-inside_gwr_video_mvp.mp4",
    "kitchen": SRC / "V2-VID-03_living-to-kitchen_gwr_video_mvp.mp4",
    "bedroom": SRC / "V2-VID-04_master-bedroom_gwr_video_mvp.mp4",
    "smart": SRC / "V2-VID-05_smart-living_gwr_video_mvp.mp4",
}

DENOISE = "hqdn3d=1.6:1.2:4.5:3.5"
UPSCALE = "scale=1920:1080:flags=lanczos+accurate_rnd+full_chroma_int"
FINISH = "cas=strength=0.42,eq=contrast=1.035:saturation=1.04:gamma=0.985"
X264 = ["-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an"]

# The tripod in the first 7.2 s of the build clip sits at x<0.24: hold a 1.33x crop that eases out once it's gone.
ZMAX, L0, T0, E0, E1 = 1.3333, 0.245, 0.10, 7.25, 8.6
EASE = f"(st(0,clip((t-{E0})/({E1}-{E0}),0,1))*0+ld(0)*ld(0)*(3-2*ld(0)))"
BUILD_REFRAME = (
    f"scale=w='trunc(1920*({ZMAX}+(1-{ZMAX})*{EASE})/2)*2':h='trunc(1080*({ZMAX}+(1-{ZMAX})*{EASE})/2)*2'"
    f":eval=frame:flags=lanczos,crop=1920:1080:x='min(iw-1920,{L0}*iw*(1-{EASE}))':y='min(ih-1080,{T0}*ih*(1-{EASE}))'"
)


def run(args):
    subprocess.run([FF, "-y", "-v", "error", *args], check=True)


def enhance(src, dst, scale=UPSCALE, crf=17):
    vf = ",".join([DENOISE, scale, FINISH])
    run(["-i", str(src), "-vf", vf, "-r", "24", "-g", "48", "-crf", str(crf), *X264, str(dst)])


def loop(src, dst, start, end, crf=17):
    """Ping-pong a segment so the loop point is invisible."""
    fc = (
        f"[0:v]trim=start={start}:end={end},setpts=PTS-STARTPTS,{DENOISE},{UPSCALE},{FINISH},split[a][b];"
        "[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]"
    )
    run(["-i", str(src), "-filter_complex", fc, "-map", "[v]", "-r", "24", "-g", "48", "-crf", str(crf), *X264, str(dst)])


def reverse(src, dst):
    run(["-i", str(src), "-vf", "reverse", "-r", "24", "-g", "48", "-crf", "17", *X264, str(dst)])


def mobile(src, dst):
    run(["-i", str(src), "-vf", "scale=1280:720:flags=lanczos", "-g", "48", "-crf", "22", *X264, str(dst)])


def poster(src, dst, t=0.0):
    run(["-ss", f"{t}", "-i", str(src), "-frames:v", "1", "-q:v", "2", str(dst)])


def frames(src, name, fps, sizes=((1600, "d", 74), (960, "m", 70))):
    for width, tag, q in sizes:
        d = FRAMES / name / tag
        d.mkdir(parents=True, exist_ok=True)
        for old in d.glob("*.webp"):
            old.unlink()
        run(["-i", str(src), "-vf", f"fps={fps},scale={width}:-2:flags=lanczos", "-c:v", "libwebp", "-quality", str(q),
             "-compression_level", "6", str(d / "%04d.webp")])
        print(f"  frames {name}/{tag}: {len(list(d.glob('*.webp')))}")


def stills():
    STILLS.mkdir(parents=True, exist_ok=True)
    for png in sorted(ASSETS.glob("*.png")):
        im = Image.open(png).convert("RGB")
        if im.width > 2400:
            im = im.resize((2400, round(im.height * 2400 / im.width)), Image.LANCZOS)
        im.save(STILLS / f"{png.stem.lower()}.jpg", quality=88, optimize=True, progressive=True)
        print("  still", png.stem)


def main():
    for p in (VID, FRAMES, STILLS):
        p.mkdir(parents=True, exist_ok=True)

    print("build (reframed)")
    enhance(CLIP["build"], VID / "build.mp4", scale=BUILD_REFRAME)
    frames(VID / "build.mp4", "build", fps=18)
    poster(VID / "build.mp4", VID / "build.jpg")
    poster(VID / "build.mp4", VID / "build-end.jpg", t=9.9)

    print("hero + result loops")
    loop(CLIP["build20"], VID / "hero.mp4", 9.6, 12.6)
    loop(CLIP["build20"], VID / "result.mp4", 16.0, 19.9)
    for n in ("hero", "result"):
        mobile(VID / f"{n}.mp4", VID / f"{n}-720.mp4")
        poster(VID / f"{n}.mp4", VID / f"{n}.jpg")

    print("step inside")
    enhance(CLIP["enter"], VID / "enter.mp4")
    frames(VID / "enter.mp4", "enter", fps=10)
    poster(VID / "enter.mp4", VID / "enter.jpg")

    for n in ("kitchen", "bedroom", "smart"):
        print(n)
        enhance(CLIP[n], VID / f"{n}.mp4")
        mobile(VID / f"{n}.mp4", VID / f"{n}-720.mp4")
        poster(VID / f"{n}.mp4", VID / f"{n}.jpg")
    reverse(VID / "smart.mp4", VID / "smart-reverse.mp4")
    poster(VID / "smart.mp4", VID / "smart-end.jpg", t=9.9)

    print("stills")
    stills()


if __name__ == "__main__":
    main()
