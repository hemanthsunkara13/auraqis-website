"""Print-ready AURAQIS business cards (approved design P3-04 · Marble Heritage).

Outputs to deliverables/business-cards/: vector CMYK (Coated FOGRA39) PDFs with 3 mm bleed,
crop-mark versions, a Spot UV plate for the front swirl, a client proof sheet and PNG previews.
Text is converted to outlines and the marble swirl is traced to vector paths.

Usage: python tools/scripts/build_business_cards.py
"""

from __future__ import annotations

import json
import math
import subprocess
from pathlib import Path

import contourpy
import numpy as np
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageCms
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DecodedStreamObject, NameObject
from reportlab.lib.colors import CMYKColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "deliverables" / "business-cards"
MARK_PNG = ROOT / "public" / "brand" / "mark-green.png"
FONTS = ROOT / "node_modules"
FOGRA39 = Path(r"C:\Windows\System32\spool\drivers\color\CoatedFOGRA39.icc")

TRIM_W, TRIM_H = 85.0, 55.0
BLEED = 3.0
SLUG = 10.0
DPI = 600
PT = 0.352778  # mm per point

PEOPLE = [
    {"slug": "01-P-Sai-Subrahmanyam", "name": "P. Sai Subrahmanyam", "role": None, "phone": "+91 75791 99999", "email": "info@auraqis.com"},
    {"slug": "02-Vittoji-Sainath", "name": "Vittoji Sainath", "role": "Principal Designer", "phone": "+91 91779 66523", "email": "sainath@auraqis.com"},
    {"slug": "03-Srujith-Reddy-Maram", "name": "Srujith Reddy Maram", "role": None, "phone": "+91 90521 16603", "email": "info@auraqis.com"},
    {"slug": "04-Suresh-Reddy-Maram", "name": "Suresh Reddy Maram", "role": "Head – Finance & Technology", "phone": "+91 75792 99999", "email": "msr@auraqis.com"},
    {"slug": "05-M-Srinu-Babu", "name": "M. Srinu Babu", "role": None, "phone": None, "email": "info@auraqis.com"},
    {"slug": "06-Anju", "name": "Anju", "role": None, "phone": None, "email": "info@auraqis.com"},
    {"slug": "07-Neelima-Maram", "name": "Neelima Maram", "role": "Director", "phone": "+91 95054 16626", "email": "neelima@auraqis.com"},
]
WEB = "auraqis.com"
CONNECT_URL = "https://auraqis.com/connect"
COMPANY = "AURAQIS PRIVATE LIMITED"
ADDRESS = ["B 32, Journalist Colony,", "Jubilee Hills, Hyderabad.", "Telangana - 500033."]

# ——— Colour: sRGB brand values → Coated FOGRA39 CMYK (relative colorimetric + BPC) ———

_intent = getattr(getattr(ImageCms, "Intent", None), "RELATIVE_COLORIMETRIC", 1)
_bpc = getattr(getattr(ImageCms, "Flags", None), "BLACKPOINTCOMPENSATION", 0x2000)
_to_cmyk = ImageCms.buildTransform(
    ImageCms.createProfile("sRGB"), ImageCms.getOpenProfile(str(FOGRA39)), "RGB", "CMYK", renderingIntent=_intent, flags=_bpc
)


class Ink:
    def __init__(self, name: str, hexv: str):
        self.name = name
        self.hex = hexv
        rgb = tuple(int(hexv[i : i + 2], 16) for i in (1, 3, 5))
        px = ImageCms.applyTransform(Image.new("RGB", (1, 1), rgb), _to_cmyk).getpixel((0, 0))
        self.cmyk = tuple(round(v / 255 * 100) for v in px)
        self.pdf = CMYKColor(*(v / 100 for v in self.cmyk))

    def spec(self) -> str:
        c, m, y, k = self.cmyk
        return f"{self.name}  C{c} M{m} Y{y} K{k}  ({self.hex.upper()})"


IVORY_BG = Ink("Ivory", "#e7e5df")
SAGE_LIGHT = Ink("Sage Light", "#8fae80")
SAGE = Ink("Sage", "#658c55")
FOREST = Ink("Forest", "#2f4530")
FOREST_DEEP = Ink("Forest Deep", "#1f2e20")
BRASS = Ink("Brass", "#a88a58")
IVORY_MARK = Ink("Ivory Mark", "#e3e2dd")
IVORY_TEXT = Ink("Ivory Text", "#eceae5")
SAGE_PALE = Ink("Sage Pale", "#cfdcc6")
TAGLINE = Ink("Tagline", "#dfe8d8")
UV = Ink("Spot UV (100K)", "#000000")
UV.pdf = CMYKColor(0, 0, 0, 1)
REG = Ink("Registration", "#000000")
REG.pdf = CMYKColor(1, 1, 1, 1)
STONE = Ink("Stone", "#8d887c")
CHARCOAL = Ink("Charcoal", "#171916")

# ——— Marble swirl: trace the brand PNG to vector rings (unit square) ———


def _rdp(pts: np.ndarray, eps: float) -> np.ndarray:
    n = len(pts)
    if n < 8:
        return pts
    keep = np.zeros(n, bool)
    keep[0] = keep[-1] = True
    stack = [(0, n - 1)]
    while stack:
        s, e = stack.pop()
        if e <= s + 1:
            continue
        a, b = pts[s], pts[e]
        seg = pts[s + 1 : e]
        dx, dy = b - a
        d = np.abs(dx * (seg[:, 1] - a[1]) - dy * (seg[:, 0] - a[0])) / (np.hypot(dx, dy) or 1.0)
        i = int(np.argmax(d))
        if d[i] > eps:
            m = s + 1 + i
            keep[m] = True
            stack += [(s, m), (m, e)]
    return pts[keep]


def trace_swirl(scale: int = 4) -> list[np.ndarray]:
    alpha = np.asarray(Image.open(MARK_PNG).convert("RGBA"))[..., 3].astype(float) / 255
    up = ndimage.gaussian_filter(ndimage.zoom(alpha, scale, order=3), 1.1)
    up = np.pad(up, 2)
    h, w = up.shape
    points, offsets = contourpy.contour_generator(z=up, fill_type="OuterOffset").filled(0.5, 10.0)
    rings = []
    for pts, offs in zip(points, offsets):
        for a, b in zip(offs[:-1], offs[1:]):
            ring = pts[a:b]
            if np.allclose(ring[0], ring[-1]):
                ring = ring[:-1]
            area = 0.5 * abs(np.dot(ring[:, 0], np.roll(ring[:, 1], 1)) - np.dot(ring[:, 1], np.roll(ring[:, 0], 1)))
            if area < 2.5 * scale * scale:
                continue
            ring = _rdp(ring, 0.28)
            rings.append(np.column_stack(((ring[:, 0] - 2) / (w - 5), (ring[:, 1] - 2) / (h - 5))))
    return rings


def mark_cmds(rings, x: float, y: float, s: float) -> list:
    cmds = []
    for r in rings:
        pts = r * s + (x, y)
        cmds.append(("M", *pts[0]))
        cmds.extend(("L", px, py) for px, py in pts[1:])
        cmds.append(("Z",))
    return cmds


# ——— Fonts: variable woff2 → static instances, text → outlines with GPOS kerning ———


class _Pen(BasePen):
    def __init__(self, gs, fn):
        super().__init__(gs)
        self.fn = fn
        self.cmds = []

    def _moveTo(self, p):
        self.cmds.append(("M", *self.fn(p)))

    def _lineTo(self, p):
        self.cmds.append(("L", *self.fn(p)))

    def _curveToOne(self, a, b, c):
        self.cmds.append(("C", *self.fn(a), *self.fn(b), *self.fn(c)))

    def _closePath(self):
        self.cmds.append(("Z",))

    def _endPath(self):
        pass


def _kerning(tt):
    if "GPOS" not in tt:
        return lambda a, b: 0
    g = tt["GPOS"].table
    idx = sorted({i for fr in g.FeatureList.FeatureRecord if fr.FeatureTag == "kern" for i in fr.Feature.LookupListIndex})
    subs = []
    for i in idx:
        lk = g.LookupList.Lookup[i]
        for st in lk.SubTable:
            if lk.LookupType == 9:
                if st.ExtensionLookupType != 2:
                    continue
                st = st.ExtSubTable
            elif lk.LookupType != 2:
                continue
            cov = {gname: n for n, gname in enumerate(st.Coverage.glyphs)}
            subs.append((st, cov))
    cache: dict = {}

    def kern(a, b):
        if (a, b) in cache:
            return cache[a, b]
        v = 0
        for st, cov in subs:
            if a not in cov:
                continue
            if st.Format == 1:
                rec = next((r for r in st.PairSet[cov[a]].PairValueRecord if r.SecondGlyph == b), None)
                if rec is None:
                    continue
                v = getattr(rec.Value1, "XAdvance", 0) or 0
                break
            c1 = st.ClassDef1.classDefs.get(a, 0)
            c2 = st.ClassDef2.classDefs.get(b, 0)
            val = st.Class1Record[c1].Class2Record[c2].Value1
            v = (getattr(val, "XAdvance", 0) or 0) if val else 0
            break
        cache[a, b] = v
        return v

    return kern


class Font:
    def __init__(self, path: Path, wght: int | None = None):
        tt = TTFont(str(path))
        if wght and "fvar" in tt:
            tt = instantiateVariableFont(tt, {"wght": wght})
        self.tt = tt
        self.gs = tt.getGlyphSet()
        self.cmap = tt.getBestCmap()
        self.upm = tt["head"].unitsPerEm
        self.hmtx = tt["hmtx"]
        self.kern = _kerning(tt)

    def layout(self, text: str, size_pt: float, tracking: float = 0.0):
        size = size_pt * PT
        k = size / self.upm
        names = [self.cmap[ord(ch)] for ch in text]
        xs, x = [], 0.0
        for i, n in enumerate(names):
            xs.append(x)
            x += self.hmtx[n][0] * k
            if i < len(names) - 1:
                x += self.kern(n, names[i + 1]) * k + tracking * size
        return names, xs, x, k

    def width(self, text, size_pt, tracking=0.0):
        return self.layout(text, size_pt, tracking)[2]

    def cmds(self, text: str, size_pt: float, x: float, y: float, tracking: float = 0.0, align: str = "left"):
        names, xs, w, k = self.layout(text, size_pt, tracking)
        x0 = x - w if align == "right" else x - w / 2 if align == "center" else x
        out = []
        for n, gx in zip(names, xs):
            pen = _Pen(self.gs, lambda p, ox=x0 + gx: (ox + p[0] * k, y - p[1] * k))
            self.gs[n].draw(pen)
            out += pen.cmds
        return out


def load_fonts():
    q = FONTS / "@fontsource-variable/quicksand/files/quicksand-latin-wght-normal.woff2"
    m = FONTS / "@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2"
    serif = FONTS / "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2"
    return {
        "serif-italic": Font(serif),
        "quick500": Font(q, 500),
        "quick600": Font(q, 600),
        "man500": Font(m, 500),
        "man600": Font(m, 600),
        "man700": Font(m, 700),
        "man800": Font(m, 800),
    }


# ——— Renderers: identical drawing calls go to a CMYK PDF or an sRGB SVG preview ———


class PDFRenderer:
    def __init__(self, c: canvas.Canvas, page_h: float):
        self.c = c
        self.H = page_h
        self.ox = self.oy = 0.0
        self.k = 1.0

    def origin(self, ox, oy, k=1.0):
        self.ox, self.oy, self.k = ox, oy, k

    def _p(self, x, y):
        return (self.ox + x * self.k) * mm, (self.H - self.oy - y * self.k) * mm

    def _path(self, cmds):
        p = self.c.beginPath()
        for cmd in cmds:
            op = cmd[0]
            if op == "M":
                p.moveTo(*self._p(*cmd[1:3]))
            elif op == "L":
                p.lineTo(*self._p(*cmd[1:3]))
            elif op == "C":
                p.curveTo(*self._p(*cmd[1:3]), *self._p(*cmd[3:5]), *self._p(*cmd[5:7]))
            else:
                p.close()
        return p

    def clip_rect(self, x, y, w, h):
        p = self.c.beginPath()
        p.rect(*self._p(x, y + h), w * self.k * mm, h * self.k * mm)
        self.c.clipPath(p, stroke=0, fill=0)

    def rect(self, x, y, w, h, ink):
        self.c.setFillColor(ink.pdf)
        self.c.rect(*self._p(x, y + h), w * self.k * mm, h * self.k * mm, stroke=0, fill=1)

    def fill(self, cmds, ink, evenodd=False, stroke=0.0):
        self.c.setFillColor(ink.pdf)
        if stroke:
            self.c.setStrokeColor(ink.pdf)
            self.c.setLineWidth(stroke * self.k * mm)
            self.c.setLineJoin(1)
        self.c.drawPath(self._path(cmds), stroke=1 if stroke else 0, fill=1, fillMode=0 if evenodd else 1)

    def gradient(self, cmds, p0, p1, stops):
        self.c.saveState()
        self.c.clipPath(self._path(cmds), stroke=0, fill=0, fillMode=0)
        self.c.linearGradient(*self._p(*p0), *self._p(*p1), [s[1].pdf for s in stops], [s[0] for s in stops], extend=True)
        self.c.restoreState()

    def line(self, x1, y1, x2, y2, ink, width_pt):
        self.c.setStrokeColor(ink.pdf)
        self.c.setLineWidth(width_pt)
        self.c.line(*self._p(x1, y1), *self._p(x2, y2))

    def save(self):
        self.c.saveState()

    def restore(self):
        self.c.restoreState()


class SVGRenderer:
    def __init__(self):
        self.parts: list[str] = []
        self.defs: list[str] = []
        self.n = 0
        self.ox = self.oy = 0.0
        self.k = 1.0
        self.stack: list = []
        self.open = 0

    def origin(self, ox, oy, k=1.0):
        self.ox, self.oy, self.k = ox, oy, k

    def _x(self, v):
        return self.ox + v * self.k

    def _y(self, v):
        return self.oy + v * self.k

    def save(self):
        self.stack.append((self.ox, self.oy, self.k, self.open))

    def restore(self):
        ox, oy, k, opened = self.stack.pop()
        self.parts += ["</g>"] * (self.open - opened)
        self.open = opened
        self.ox, self.oy, self.k = ox, oy, k

    def clip_rect(self, x, y, w, h):
        self.n += 1
        self.defs.append(f'<clipPath id="c{self.n}"><rect x="{self._x(x)}" y="{self._y(y)}" width="{w * self.k}" height="{h * self.k}"/></clipPath>')
        self.parts.append(f'<g clip-path="url(#c{self.n})">')
        self.open += 1

    def _d(self, cmds):
        out = []
        for cmd in cmds:
            op = cmd[0]
            if op == "Z":
                out.append(op)
                continue
            vals = [self._x(v) if i % 2 == 0 else self._y(v) for i, v in enumerate(cmd[1:])]
            out.append(op + " ".join(f"{v:.3f}" for v in vals))
        return "".join(out)

    def rect(self, x, y, w, h, ink):
        self.parts.append(f'<rect x="{self._x(x)}" y="{self._y(y)}" width="{w * self.k}" height="{h * self.k}" fill="{ink.hex}"/>')

    def fill(self, cmds, ink, evenodd=False, stroke=0.0):
        rule = ' fill-rule="evenodd"' if evenodd else ""
        if stroke:
            rule += f' stroke="{ink.hex}" stroke-width="{stroke * self.k}" stroke-linejoin="round"'
        self.parts.append(f'<path d="{self._d(cmds)}" fill="{ink.hex}"{rule}/>')

    def gradient(self, cmds, p0, p1, stops):
        self.n += 1
        st = "".join(f'<stop offset="{o}" stop-color="{i.hex}"/>' for o, i in stops)
        self.defs.append(
            f'<linearGradient id="g{self.n}" gradientUnits="userSpaceOnUse" x1="{self._x(p0[0])}" y1="{self._y(p0[1])}" '
            f'x2="{self._x(p1[0])}" y2="{self._y(p1[1])}">{st}</linearGradient>'
        )
        self.parts.append(f'<path d="{self._d(cmds)}" fill="url(#g{self.n})" fill-rule="evenodd"/>')

    def line(self, x1, y1, x2, y2, ink, width_pt):
        x1, x2, y1, y2 = self._x(x1), self._x(x2), self._y(y1), self._y(y2)
        self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{ink.hex}" stroke-width="{width_pt * PT}"/>')

    def page_svg(self, w_mm: float, h_mm: float, px_width: int) -> str:
        h = round(px_width * h_mm / w_mm)
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{px_width}" height="{h}" viewBox="0 0 {w_mm} {h_mm}">'
            f'<defs>{"".join(self.defs)}</defs>{"".join(self.parts)}</svg>'
        )

    def svg(self, px_width: int) -> str:
        h = round(px_width * TRIM_H / TRIM_W)
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{px_width}" height="{h}" viewBox="0 0 {TRIM_W} {TRIM_H}">'
            f'<defs>{"".join(self.defs)}<clipPath id="trim"><rect width="{TRIM_W}" height="{TRIM_H}"/></clipPath></defs>'
            f'<g clip-path="url(#trim)">{"".join(self.parts)}</g></svg>'
        )


# ——— Card artwork (mm, origin at the top-left of the trim) ———


def draw_front(r, f, rings):
    r.rect(-BLEED, -BLEED, TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED, IVORY_BG)
    sx, sy, s = 36.55, -12.75, 62.9
    swirl = mark_cmds(rings, sx, sy, s)
    # CSS linear-gradient(160deg) across the swirl box
    d = (math.sin(math.radians(160)), -math.cos(math.radians(160)))
    half = s * (abs(d[0]) + abs(d[1])) / 2
    c = (sx + s / 2, sy + s / 2)
    r.gradient(swirl, (c[0] - d[0] * half, c[1] - d[1] * half), (c[0] + d[0] * half, c[1] + d[1] * half), [(0, SAGE_LIGHT), (0.55, SAGE), (1, FOREST)])
    r.fill(f["quick500"].cmds("AURAQIS", 10.6, 6.0, 44.2, tracking=0.52), FOREST)
    r.fill(f["man600"].cmds("CONSTRUCTIONS · INTERIORS", 5.4, 6.05, 49.0, tracking=0.4), BRASS)


def draw_uv(r, rings):
    r.fill(mark_cmds(rings, 36.55, -12.75, 62.9), UV, evenodd=True)


# ——— QR code: matrix from the `qrcode` npm package, drawn as brand artwork ———

_QR: dict = {}
# Centre knock-out radius and swirl diameter, in modules (verified by verify_qr at error level H).
QR_CLEAR, QR_LOGO = 6.2, 11.0


def qr_matrix(url: str) -> list[list[bool]]:
    if url not in _QR:
        js = (
            "const q=require('qrcode').create(process.argv[1],{errorCorrectionLevel:'H'});"
            "console.log(JSON.stringify({n:q.modules.size,d:Array.from(q.modules.data)}))"
        )
        out = json.loads(subprocess.run(["node", "-e", js, url], cwd=ROOT, check=True, capture_output=True, text=True).stdout)
        n = out["n"]
        _QR[url] = [[bool(out["d"][y * n + x]) for x in range(n)] for y in range(n)]
    return _QR[url]


def rrect(x, y, w, h, rad):
    k = 0.5523 * rad
    return [
        ("M", x + rad, y), ("L", x + w - rad, y), ("C", x + w - rad + k, y, x + w, y + rad - k, x + w, y + rad),
        ("L", x + w, y + h - rad), ("C", x + w, y + h - rad + k, x + w - rad + k, y + h, x + w - rad, y + h),
        ("L", x + rad, y + h), ("C", x + rad - k, y + h, x, y + h - rad + k, x, y + h - rad),
        ("L", x, y + rad), ("C", x, y + rad - k, x + rad - k, y, x + rad, y), ("Z",),
    ]  # fmt: skip


def rotate(cmds, cx, cy, deg):
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    out = []
    for cmd in cmds:
        if cmd[0] == "Z":
            out.append(cmd)
            continue
        v = cmd[1:]
        pts = []
        for i in range(0, len(v), 2):
            dx, dy = v[i] - cx, v[i + 1] - cy
            pts += [cx + dx * c - dy * s, cy + dx * s + dy * c]
        out.append((cmd[0], *pts))
    return out


def draw_qr(r, rings, x, y, size, url=CONNECT_URL):
    """Ivory tile with rounded forest modules, rounded finder eyes and the sage swirl at the centre."""
    grid = qr_matrix(url)
    n = len(grid)
    quiet = 2.5
    m = size / (n + 2 * quiet)
    ox, oy = x + quiet * m, y + quiet * m
    r.fill(rrect(x, y, size, size, 1.8), IVORY_TEXT)

    finders = [(0, 0), (n - 7, 0), (0, n - 7)]
    in_finder = lambda cx, cy: any(fx <= cx < fx + 7 and fy <= cy < fy + 7 for fx, fy in finders)  # noqa: E731
    centre, clear = n / 2, QR_CLEAR
    dots = []
    for gy, row in enumerate(grid):
        for gx, dark in enumerate(row):
            if not dark or in_finder(gx, gy) or math.hypot(gx + 0.5 - centre, gy + 0.5 - centre) < clear:
                continue
            dots += rrect(ox + gx * m, oy + gy * m, m, m, m * 0.32)
    r.fill(dots, FOREST_DEEP)

    eyes = []
    for fx, fy in finders:
        px, py = ox + fx * m, oy + fy * m
        eyes += rrect(px, py, 7 * m, 7 * m, 2.1 * m) + rrect(px + m, py + m, 5 * m, 5 * m, 1.45 * m)
        eyes += rrect(px + 2 * m, py + 2 * m, 3 * m, 3 * m, 0.95 * m)
    r.fill(eyes, FOREST_DEEP, evenodd=True)

    logo = QR_LOGO * m
    cx, cy = ox + centre * m, oy + centre * m
    r.fill(mark_cmds(rings, cx - logo / 2, cy - logo / 2, logo), SAGE, evenodd=True)


def verify_qr(pngs: list[Path], url: str = CONNECT_URL):
    """Decode every card back with jsQR at print, screen and low resolution; fail the build if any misreads."""
    js = (
        "const sharp=require('sharp'),jsQR=require('jsqr');(async()=>{const out=[];for(const f of process.argv.slice(1)){"
        "for(const w of [2150,900,560]){const {data,info}=await sharp(f).resize({width:w}).blur(w<900?0.6:0.3).ensureAlpha().raw()"
        ".toBuffer({resolveWithObject:true});const q=jsQR(new Uint8ClampedArray(data),info.width,info.height);"
        "out.push([f,w,q?q.data:null]);}}console.log(JSON.stringify(out))})()"
    )
    res = json.loads(subprocess.run(["node", "-e", js, *map(str, pngs)], cwd=ROOT, check=True, capture_output=True, text=True).stdout)
    bad = [(Path(f).name, w) for f, w, data in res if data != url]
    if bad:
        raise SystemExit(f"QR verification failed: {bad}")
    print(f"QR verified: {len(res)} decodes across {len(pngs)} cards -> {url}")


def draw_back(r, f, rings, person):
    r.rect(-BLEED, -BLEED, TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED, SAGE)
    qs = 19.5
    qx, qy = TRIM_W - 6.0 - qs, 5.2
    draw_qr(r, rings, qx, qy, qs)
    label = f["man700"].cmds("SCAN TO CONNECT", 4.2, qx - 2.0, qy + qs / 2 + 0.52, tracking=0.2, align="center")
    r.fill(rotate(label, qx - 2.0, qy + qs / 2, -90), SAGE_PALE)

    centre = qy + qs / 2
    if person["role"]:
        name_y, role_y = centre - 0.15, centre + 3.45
        r.fill(f["man600"].cmds(person["role"].upper(), 5.6, 6.05, role_y, tracking=0.26), FOREST_DEEP)
    else:
        name_y = centre + 1.35
    r.fill(f["quick600"].cmds(person["name"], 11, 6.0, name_y), IVORY_TEXT)

    tagline = "Where Vision Meets Craftsmanship"
    tag_w = f["serif-italic"].width(tagline, 8.6)
    r.fill(f["serif-italic"].cmds(tagline, 8.6, TRIM_W - 6.0, 28.7, align="right"), TAGLINE)
    r.line(6.0, 27.7, TRIM_W - 6.0 - tag_w - 3.0, 27.7, SAGE_PALE, 0.3)

    rows = [36.0, 40.35, 44.7, 49.0]
    r.fill(f["man700"].cmds("CONTACT", 5.2, 6.0, rows[0], tracking=0.32), SAGE_PALE)
    contacts = [(lbl, val) for lbl, val in zip("TEW", [person["phone"], person["email"], WEB]) if val]
    for (label, value), y in zip(contacts, rows[1:]):
        r.fill(f["man700"].cmds(label, 5.0, 6.0, y, tracking=0.1), SAGE_PALE)
        r.fill(f["man500"].cmds(value, 6.8, 9.6, y), IVORY_TEXT)

    right = TRIM_W - 6.0
    r.fill(f["man800"].cmds(COMPANY, 7.2, right - 0.07, rows[0] - 0.2, tracking=0.12, align="right"), IVORY_TEXT, stroke=0.14)
    for line, y in zip(ADDRESS, rows[1:]):
        r.fill(f["man500"].cmds(line, 6.4, right, y, align="right"), IVORY_TEXT)


# ——— Outputs ———


def strip_default_font(path: Path):
    # reportlab writes an empty "BT /F1 ... ET" per page; remove it so preflight reports zero fonts.
    reader = PdfReader(str(path))
    writer = PdfWriter(clone_from=reader)
    for page in writer.pages:
        data = page.get_contents().get_data().replace(b"BT /F1 12 Tf 14.4 TL ET", b"")
        stream = DecodedStreamObject()
        stream.set_data(data)
        page.replace_contents(stream.flate_encode())
        res = page["/Resources"]
        if "/Font" in res:
            del res[NameObject("/Font")]
    with open(path, "wb") as fh:
        writer.write(fh)


def crop_marks(r, ox, oy):
    for x in (0, TRIM_W):
        for y in (0, TRIM_H):
            sx = -1 if x == 0 else 1
            sy = -1 if y == 0 else 1
            r.line(ox + x + sx * (BLEED + 0.5), oy + y, ox + x + sx * (SLUG - 1), oy + y, REG, 0.25)
            r.line(ox + x, oy + y + sy * (BLEED + 0.5), ox + x, oy + y + sy * (SLUG - 1), REG, 0.25)


def card_pdf(path: Path, pages, marks: bool, f):
    pad = SLUG if marks else BLEED
    pw, ph = TRIM_W + 2 * pad, TRIM_H + 2 * pad
    c = canvas.Canvas(str(path), pagesize=(pw * mm, ph * mm))
    c.setTitle(path.stem)
    c.setAuthor("AURAQIS")
    r = PDFRenderer(c, ph)
    for label, draw in pages:
        trim = (pad * mm, pad * mm, (pad + TRIM_W) * mm, (pad + TRIM_H) * mm)
        bleed = ((pad - BLEED) * mm, (pad - BLEED) * mm, (pad + TRIM_W + BLEED) * mm, (pad + TRIM_H + BLEED) * mm)
        c.setTrimBox(trim)
        c.setBleedBox(bleed)
        r.save()
        r.origin(pad, pad)
        r.clip_rect(-BLEED, -BLEED, TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED)
        draw(r)
        r.restore()
        if marks:
            r.origin(0, 0)
            crop_marks(r, pad, pad)
            info = f"{path.stem} · {label} · 85 × 55 mm trim + 3 mm bleed · CMYK Coated FOGRA39"
            r.fill(f["man500"].cmds(info, 5, pad, ph - 3.2), REG)
        c.showPage()
    c.save()
    strip_default_font(path)


def proof_pdf(path: Path, f, rings):
    c = canvas.Canvas(str(path), pagesize=(420 * mm, 297 * mm))
    c.setTitle("AURAQIS Business Cards · Print Proof")
    draw_proof(PDFRenderer(c, 297.0), f, rings)
    c.showPage()
    c.save()
    strip_default_font(path)


def draw_proof(r, f, rings):
    pw, ph = 420.0, 297.0
    x0, y0, gx, gy = 26.5, 44.0, 9.0, 16.0
    r.rect(0, 0, pw, ph, Ink("Paper", "#f4f3ef"))
    r.fill(f["quick600"].cmds("AURAQIS", 18, x0, 24, tracking=0.42), FOREST)
    r.fill(f["man600"].cmds("BUSINESS CARDS · DESIGN P3-04 MARBLE HERITAGE · PRINT PROOF FOR APPROVAL · ACTUAL SIZE", 7.5, x0, 32, tracking=0.18), BRASS)

    backs = [(f"Back · {p['name']}", lambda q, p=p: draw_back(q, f, rings, p)) for p in PEOPLE]
    uv = ("Spot UV plate · front swirl (gloss)", lambda q: (q.rect(0, 0, TRIM_W, TRIM_H, Ink("White", "#ffffff")), draw_uv(q, rings)))
    cells = [(f"Front · all {len(PEOPLE)} cards", lambda q: draw_front(q, f, rings)), *backs[:3], uv, *backs[3:]]
    for i, (label, draw) in enumerate(cells):
        cx = x0 + (i % 4) * (TRIM_W + gx)
        cy = y0 + (i // 4) * (TRIM_H + gy)
        r.save()
        r.origin(cx, cy)
        r.clip_rect(0, 0, TRIM_W, TRIM_H)
        draw(r)
        r.restore()
        r.origin(0, 0)
        for a, b in (((cx, cy), (cx + TRIM_W, cy)), ((cx + TRIM_W, cy), (cx + TRIM_W, cy + TRIM_H)), ((cx, cy + TRIM_H), (cx + TRIM_W, cy + TRIM_H)), ((cx, cy), (cx, cy + TRIM_H))):
            r.line(*a, *b, STONE, 0.3)
        r.fill(f["man600"].cmds(label.upper(), 5.6, cx, cy + TRIM_H + 4.6, tracking=0.14), CHARCOAL)

    specs = [
        "Size  85 × 55 mm trim · 3 mm bleed on all sides · keep text 5 mm inside the trim (already applied) · actual size on this sheet (print at 100%)",
        "Stock  650 gsm soft-touch laminated duplex (alternative: 400–450 gsm matt art card + soft-touch lamination both sides)",
        "Finish  Spot UV gloss on the front swirl only (separate plate supplied) · square corners, or 2 mm round-corner die if preferred",
        "Colour  CMYK, Coated FOGRA39 · " + " · ".join(i.spec() for i in (IVORY_BG, SAGE, FOREST, BRASS)),
        "Files  print/ + print-with-cropmarks/ (vector PDF, preferred) · tiff-cmyk-600dpi/ (CMYK image) · png-600dpi/ (RGB image) · spot-uv/ · all images include 3 mm bleed",
        "QR  Opens auraqis.com/connect (same for every card). Buttons on that page can be changed any time without reprinting. Do not scale the QR below 16 mm.",
        "Check  Please verify every name, designation, phone number, email and the address before approving. A hard-copy press proof is recommended for colour.",
    ]
    for i, s in enumerate(specs):
        head, rest = s.split("  ", 1)
        y = y0 + -(-len(cells) // 4) * (TRIM_H + gy) + 4 + i * 5.2
        r.fill(f["man700"].cmds(head.upper(), 6.2, x0, y, tracking=0.14), FOREST)
        r.fill(f["man500"].cmds(rest, 7.4, x0 + 22, y), CHARCOAL)


def render_png(svg: str, png: Path, dpi: int | None = None):
    tmp = png.with_suffix(".svg")
    tmp.write_text(svg, encoding="utf-8")
    js = (
        "const s=require('sharp')(process.argv[1]);const d=Number(process.argv[3]);"
        "(d?s.withMetadata({density:d}):s).png().toFile(process.argv[2]).catch(e=>{console.error(e);process.exit(1)})"
    )
    subprocess.run(["node", "-e", js, str(tmp), str(png), str(dpi or 0)], cwd=ROOT, check=True)
    tmp.unlink()


def raster(draw, name: str, grey: bool = False):
    """600 dpi artwork including bleed: an RGB PNG and a FOGRA39 CMYK (or greyscale) TIFF."""
    w, h = TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED
    s = SVGRenderer()
    s.origin(BLEED, BLEED)
    draw(s)
    png = OUT / "png-600dpi" / f"{name}.png"
    render_png(s.page_svg(w, h, round(w / 25.4 * DPI)), png, DPI)
    src = Image.open(png)
    srgb = src.info.get("icc_profile")
    im = src.convert("RGB")
    im.save(png, dpi=(DPI, DPI), icc_profile=srgb)
    tif = OUT / "tiff-cmyk-600dpi" / f"{name}.tif"
    if grey:
        g = im.convert("L")
        g.info.pop("icc_profile", None)
        g.save(tif, compression="tiff_lzw", dpi=(DPI, DPI))
    else:
        ImageCms.applyTransform(im, _to_cmyk).save(tif, compression="tiff_lzw", dpi=(DPI, DPI), icc_profile=FOGRA39.read_bytes())


def main():
    f = load_fonts()
    rings = trace_swirl()
    for sub in ("print", "print-with-cropmarks", "spot-uv", "preview", "png-600dpi", "tiff-cmyk-600dpi"):
        (OUT / sub).mkdir(parents=True, exist_ok=True)

    front = ("Front", lambda r: draw_front(r, f, rings))
    raster(front[1], "AURAQIS-Card-Front")
    raster(lambda r: (r.rect(-BLEED, -BLEED, TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED, Ink("White", "#ffffff")), draw_uv(r, rings)), "AURAQIS-Card-Front-SpotUV", grey=True)
    for p in PEOPLE:
        back = ("Back", lambda r, p=p: draw_back(r, f, rings, p))
        name = f"AURAQIS-Card-{p['slug']}"
        card_pdf(OUT / "print" / f"{name}.pdf", [front, back], False, f)
        card_pdf(OUT / "print-with-cropmarks" / f"{name}-cropmarks.pdf", [front, back], True, f)
        raster(back[1], f"{name}-Back")
        s = SVGRenderer()
        draw_back(s, f, rings, p)
        render_png(s.svg(2008), OUT / "preview" / f"{name}-back.png")
    verify_qr([OUT / "png-600dpi" / f"AURAQIS-Card-{p['slug']}-Back.png" for p in PEOPLE])

    card_pdf(OUT / "spot-uv" / "AURAQIS-Card-Front-SpotUV.pdf", [("Spot UV", lambda r: draw_uv(r, rings))], False, f)
    card_pdf(OUT / "spot-uv" / "AURAQIS-Card-Front-SpotUV-cropmarks.pdf", [("Spot UV", lambda r: draw_uv(r, rings))], True, f)
    s = SVGRenderer()
    draw_front(s, f, rings)
    render_png(s.svg(2008), OUT / "preview" / "AURAQIS-Card-front.png")
    proof_pdf(OUT / "AURAQIS-Business-Cards-Proof.pdf", f, rings)
    s = SVGRenderer()
    draw_proof(s, f, rings)
    render_png(s.page_svg(420, 297, 4961), OUT / "preview" / "AURAQIS-Business-Cards-Proof.png")
    print(f"Swirl rings: {len(rings)}, points: {sum(len(r) for r in rings)}")
    for i in (IVORY_BG, SAGE_LIGHT, SAGE, FOREST, FOREST_DEEP, BRASS, IVORY_MARK, IVORY_TEXT, SAGE_PALE):
        print(i.spec())


if __name__ == "__main__":
    main()
