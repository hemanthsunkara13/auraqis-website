"""Print-ready AURAQIS stationery (approved identity P1-01 · Sage Heritage).

Outputs to deliverables/stationery/: CMYK (Coated FOGRA39) vector PDFs with 3 mm bleed, crop-mark
versions, outlined SVG artwork, a Word letterhead template, HTML email signatures, PNG previews
and a client proof. Shares the vector swirl, outlined fonts and colour pipeline with the business cards.

Usage: python tools/scripts/build_stationery.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from docx.shared import Mm, Pt, RGBColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

sys.path.insert(0, str(Path(__file__).parent))
import build_business_cards as bc  # noqa: E402
from build_business_cards import (  # noqa: E402
    BRASS,
    CHARCOAL,
    FOREST,
    PT,
    REG,
    SAGE,
    SAGE_PALE,
    STONE,
    Ink,
    PDFRenderer,
    SVGRenderer,
    load_fonts,
    mark_cmds,
    render_png,
    strip_default_font,
    trace_swirl,
)

OUT = bc.ROOT / "deliverables" / "stationery"
BLEED, SLUG = 3.0, 10.0

COMPANY = "AURAQIS PRIVATE LIMITED"
ADDRESS = "B 32, Journalist Colony, Jubilee Hills, Hyderabad, Telangana - 500033"
ADDRESS_LINES = ["B 32, Journalist Colony, Jubilee Hills,", "Hyderabad, Telangana - 500033"]
PHONES = ["+91 75791 99999", "+91 75792 99999"]
EMAIL, WEB = "info@auraqis.com", "auraqis.com"
TAGLINE = "Where Vision Meets Craftsmanship"
DOT = "   ·   "
DESC = "CONSTRUCTIONS · INTERIORS"


def tint(base: Ink, t: float, name: str) -> Ink:
    rgb = [int(base.hex[i : i + 2], 16) for i in (1, 3, 5)]
    mixed = "#" + "".join(f"{round(255 - (255 - v) * t):02x}" for v in rgb)
    return Ink(name, mixed)


WATERMARK = tint(SAGE, 0.09, "Watermark (Sage 9%)")
WATERMARK_SOFT = tint(SAGE, 0.06, "Watermark (Sage 6%)")
RULE_LINE = tint(SAGE, 0.3, "Ruled line (Sage 30%)")
PAPER_SIM = Ink("Natural stock (preview only)", "#f6f4ee")

PEOPLE = [
    {"slug": "01-P-Sai-Subrahmanyam", "name": "P. Sai Subrahmanyam", "role": None, "phone": "+91 75791 99999", "email": "info@auraqis.com"},
    {"slug": "02-Vittoji-Sainath", "name": "Vittoji Sainath", "role": "Principal Designer", "phone": "+91 91779 66523", "email": "sainath@auraqis.com"},
    {"slug": "03-Srujith-Reddy-Maram", "name": "Srujith Reddy Maram", "role": None, "phone": "+91 90521 16603", "email": "info@auraqis.com"},
    {"slug": "04-Suresh-Reddy-Maram", "name": "Suresh Reddy Maram", "role": "Head – Finance & Technology", "phone": "+91 75792 99999", "email": "msr@auraqis.com"},
]

# ——— Lockups (P1-01: sage swirl, Quicksand 500 forest wordmark, Manrope 600 brass descriptor) ———


def stack(r, F, rings, cx, top, mark, word_pt, desc_pt):
    r.fill(mark_cmds(rings, cx - mark / 2, top, mark), SAGE, evenodd=True)
    wmm = word_pt * PT
    wy = top + mark * 1.2 + wmm * 0.7
    r.fill(F["quick500"].cmds("AURAQIS", word_pt, cx, wy, tracking=0.52, align="center"), FOREST)
    dy = wy + wmm * 0.55 + desc_pt * PT * 1.3
    r.fill(F["man600"].cmds(DESC, desc_pt, cx, dy, tracking=0.42, align="center"), BRASS)
    return dy


def row(r, F, rings, x, top, mark, word_pt, desc_pt):
    r.fill(mark_cmds(rings, x, top, mark), SAGE, evenodd=True)
    wmm, dmm = word_pt * PT, desc_pt * PT
    cap_w, cap_d, gap = wmm * 0.7, dmm * 0.72, wmm * 0.5
    t = top + mark / 2 - (cap_w + gap + cap_d) / 2
    wy = t + cap_w
    tx = x + mark * 1.28
    r.fill(F["quick500"].cmds("AURAQIS", word_pt, tx, wy, tracking=0.52), FOREST)
    r.fill(F["man600"].cmds(DESC, desc_pt, tx + 0.1, wy + gap + cap_d, tracking=0.42), BRASS)


def watermark(r, rings, x, y, s, ink=WATERMARK):
    paper = getattr(r, "paper", None)
    if paper is not None:
        # Preview only: printed ink multiplies with the stock colour.
        ch = lambda h, i: int(h[i : i + 2], 16)  # noqa: E731
        ink = Ink(ink.name, "#" + "".join(f"{ch(ink.hex, i) * ch(paper.hex, i) // 255:02x}" for i in (1, 3, 5)))
    r.fill(mark_cmds(rings, x, y, s), ink, evenodd=True)


# ——— Artwork (mm, origin at top-left of the trim) ———


def letterhead_footer(r, F, w, h):
    cx = w / 2
    r.fill(F["serif-italic"].cmds(TAGLINE, 9.5, cx, h - 29.0, align="center"), SAGE)
    r.line(25, h - 24.6, w - 25, h - 24.6, SAGE_PALE, 0.4)
    r.fill(F["man500"].cmds(ADDRESS, 7, cx, h - 19.2, align="center"), FOREST)
    r.fill(F["man500"].cmds(DOT.join([*PHONES, EMAIL, WEB]), 7, cx, h - 15.0, align="center"), FOREST)
    r.fill(F["man700"].cmds(COMPANY, 5.4, cx, h - 9.6, tracking=0.34, align="center"), BRASS)


def letterhead(r, F, rings):
    watermark(r, rings, 116, 192, 160)
    d = stack(r, F, rings, 105, 15, 15, 12.5, 5.6)
    r.line(100, d + 5.2, 110, d + 5.2, BRASS, 0.5)
    letterhead_footer(r, F, 210, 297)


def continuation(r, F, rings):
    watermark(r, rings, 116, 192, 160)
    r.fill(mark_cmds(rings, 100, 12, 10), SAGE, evenodd=True)
    r.line(25, 297 - 16.6, 185, 297 - 16.6, SAGE_PALE, 0.4)
    r.fill(F["man700"].cmds(f"{COMPANY}   ·   {WEB.upper()}", 5.4, 105, 297 - 10.8, tracking=0.34, align="center"), BRASS)


def compliment(r, F, rings):
    watermark(r, rings, 128, 18, 118)
    row(r, F, rings, 16, 14, 14, 11, 5.2)
    r.fill(F["serif-italic"].cmds("With Compliments", 21, 194, 27.5, align="right"), FOREST)
    r.line(16, 80.5, 194, 80.5, SAGE_PALE, 0.4)
    r.fill(F["man500"].cmds(ADDRESS, 6.6, 16, 86.4), FOREST)
    r.fill(F["man500"].cmds(DOT.join([PHONES[0], EMAIL, WEB]), 6.6, 16, 90.6), FOREST)
    r.fill(F["man700"].cmds(COMPANY, 5.2, 194, 90.6, tracking=0.34, align="right"), BRASS)


def envelope_dl(r, F, rings):
    watermark(r, rings, -24, 58, 78)
    row(r, F, rings, 14, 12, 12, 10, 5.2)
    for i, line in enumerate(ADDRESS_LINES):
        r.fill(F["man500"].cmds(line, 6.4, 14, 33.5 + i * 3.6), FOREST)


def envelope_c4(r, F, rings):
    watermark(r, rings, -34, 128, 136)
    row(r, F, rings, 20, 18, 16, 13, 6)
    for i, line in enumerate(ADDRESS_LINES):
        r.fill(F["man500"].cmds(line, 7.4, 20, 46.5 + i * 4.1), FOREST)


def notepad(r, F, rings):
    watermark(r, rings, 84, 146, 100, WATERMARK_SOFT)
    stack(r, F, rings, 74, 11, 10, 9, 5)
    for i in range(20):
        y = 42 + i * 8
        r.line(14, y, 134, y, RULE_LINE, 0.3)
    r.fill(F["man700"].cmds(WEB.upper(), 5, 74, 203, tracking=0.34, align="center"), BRASS)


ITEMS = [
    ("Letterhead-A4", "Letterhead · A4", (210, 297), letterhead),
    ("Continuation-Sheet-A4", "Continuation sheet · A4", (210, 297), continuation),
    ("Compliment-Slip-DL", "Compliment slip · DL 210 × 99", (210, 99), compliment),
    ("Envelope-DL", "Envelope · DL 220 × 110", (220, 110), envelope_dl),
    ("Envelope-C4", "Envelope · C4 324 × 229", (324, 229), envelope_c4),
    ("Notepad-A5", "Notepad · A5", (148, 210), notepad),
]

# ——— Outputs ———


def doc_pdf(path: Path, size, draw, label, marks, F):
    w, h = size
    pad = SLUG if marks else BLEED
    pw, ph = w + 2 * pad, h + 2 * pad
    c = canvas.Canvas(str(path), pagesize=(pw * mm, ph * mm))
    c.setTitle(path.stem)
    c.setAuthor("AURAQIS")
    c.setTrimBox((pad * mm, pad * mm, (pad + w) * mm, (pad + h) * mm))
    c.setBleedBox(((pad - BLEED) * mm, (pad - BLEED) * mm, (pad + w + BLEED) * mm, (pad + h + BLEED) * mm))
    r = PDFRenderer(c, ph)
    r.save()
    r.origin(pad, pad)
    r.clip_rect(-BLEED, -BLEED, w + 2 * BLEED, h + 2 * BLEED)
    draw(r)
    r.restore()
    if marks:
        r.origin(0, 0)
        for x in (0, w):
            for y in (0, h):
                sx, sy = (-1 if x == 0 else 1), (-1 if y == 0 else 1)
                r.line(pad + x + sx * (BLEED + 0.5), pad + y, pad + x + sx * (SLUG - 1), pad + y, REG, 0.25)
                r.line(pad + x, pad + y + sy * (BLEED + 0.5), pad + x, pad + y + sy * (SLUG - 1), REG, 0.25)
        info = f"AURAQIS · {label} · trim {w:g} × {h:g} mm + 3 mm bleed · CMYK Coated FOGRA39"
        r.fill(F["man500"].cmds(info, 5, pad, ph - 3.2), REG)
    c.showPage()
    c.save()
    strip_default_font(path)


def art_svg(size, draw, paper: bool, px: int) -> str:
    w, h = size
    s = SVGRenderer()
    if paper:
        s.rect(0, 0, w, h, PAPER_SIM)
        s.paper = PAPER_SIM
    draw(s)
    return s.page_svg(w, h, px)


def proof_pdf(path: Path, F, rings):
    c = canvas.Canvas(str(path), pagesize=(420 * mm, 297 * mm))
    c.setTitle("AURAQIS Stationery · Print Proof")
    r = PDFRenderer(c, 297.0)
    for page in (proof_page_1, proof_page_2):
        page(r, F, rings)
        c.showPage()
    c.save()
    strip_default_font(path)


def _header(r, F, subtitle):
    r.origin(0, 0)
    r.rect(0, 0, 420, 297, Ink("Board", "#e9e7e1"))
    r.fill(F["quick600"].cmds("AURAQIS", 16, 14, 20, tracking=0.42), FOREST)
    r.fill(F["man600"].cmds(subtitle, 7, 14, 27, tracking=0.18), BRASS)


def _place(r, F, rings, draw, size, x, y, k, caption):
    w, h = size
    r.save()
    r.origin(x, y, k)
    r.clip_rect(0, 0, w, h)
    r.rect(0, 0, w, h, PAPER_SIM)
    r.paper = PAPER_SIM
    draw(r)
    r.paper = None
    r.restore()
    r.origin(0, 0)
    for a, b in (((x, y), (x + w * k, y)), ((x + w * k, y), (x + w * k, y + h * k)), ((x, y + h * k), (x + w * k, y + h * k)), ((x, y), (x, y + h * k))):
        r.line(*a, *b, STONE, 0.3)
    r.fill(F["man600"].cmds(caption.upper(), 5.8, x, y + h * k + 5, tracking=0.14), CHARCOAL)


def proof_page_1(r, F, rings):
    _header(r, F, "STATIONERY · IDENTITY P1-01 SAGE HERITAGE · PRINT PROOF 1 / 2")
    k = 0.76
    _place(r, F, rings, lambda q: letterhead(q, F, rings), (210, 297), 14, 36, k, f"Letterhead · A4 210 × 297 mm · shown at {k:.0%}")
    _place(r, F, rings, lambda q: continuation(q, F, rings), (210, 297), 14 + 210 * k + 14, 36, k, f"Continuation sheet · A4 · shown at {k:.0%}")
    x = 14 + 2 * (210 * k + 14)
    notes = [
        ("LETTERHEAD", ["Centred Sage Heritage lockup, brass rule,", "tagline and full contact footer. A large", "sage watermark at 9% bleeds off the", "bottom-right corner."]),
        ("CONTINUATION", ["Swirl at the top and a one-line footer,", "for page 2 onwards."]),
        ("WRITING AREA", ["25 mm side margins. Letter text starts", "about 52 mm from the top and ends 38 mm", "from the bottom (set in the Word template)."]),
        ("PAPER", ["120 gsm natural-white uncoated,", "laser and inkjet compatible."]),
        ("PRINT", ["Offset or digital, CMYK. Artwork is white-", "paper based: the natural stock gives the", "ivory tone shown here."]),
    ]
    y = 44
    for head, lines in notes:
        r.fill(F["man700"].cmds(head, 5.6, x, y, tracking=0.14), FOREST)
        for ln in lines:
            y += 4.1
            r.fill(F["man500"].cmds(ln, 6.6, x, y), CHARCOAL)
        y += 8


def proof_page_2(r, F, rings):
    _header(r, F, "STATIONERY · IDENTITY P1-01 SAGE HERITAGE · PRINT PROOF 2 / 2")
    _place(r, F, rings, lambda q: compliment(q, F, rings), (210, 99), 14, 36, 0.85, "Compliment slip · DL 210 × 99 mm · shown at 85%")
    _place(r, F, rings, lambda q: envelope_dl(q, F, rings), (220, 110), 206.5, 36, 0.85, "Envelope · DL 220 × 110 mm · shown at 85%")
    _place(r, F, rings, lambda q: envelope_c4(q, F, rings), (324, 229), 14, 146, 0.5, "Envelope · C4 324 × 229 mm · shown at 50%")
    _place(r, F, rings, lambda q: notepad(q, F, rings), (148, 210), 190, 146, 0.55, "Notepad · A5 148 × 210 mm · shown at 55%")
    x = 290
    specs = [
        ("COMPLIMENT SLIP", ["300 gsm, same stock as letterhead"]),
        ("ENVELOPES", ["DL and C4, matching stock,", "printed on the front only"]),
        ("NOTEPAD", ["A5, 90 gsm, 50 sheets,", "glued at the top"]),
        ("COLOUR · CMYK FOGRA39", [i.spec() for i in (SAGE, FOREST, BRASS)] + [WATERMARK.spec()]),
        ("TYPE (OUTLINED)", ["Quicksand · Manrope · Instrument Serif"]),
        ("FILES", ["print/ · print-with-cropmarks/", "vector-svg/ · editable/ (Word)", "email-signature/"]),
        ("CHECK", ["Verify address, phone numbers", "and email before printing."]),
    ]
    y = 150
    for head, lines in specs:
        r.fill(F["man700"].cmds(head, 5.6, x, y, tracking=0.14), FOREST)
        for ln in lines:
            y += 3.9
            r.fill(F["man500"].cmds(ln, 6.2, x, y), CHARCOAL)
        y += 6.2


# ——— Word letterhead template: artwork as a page-anchored picture behind the text ———


def _float_behind(run, picture_path: Path, w_mm: float, h_mm: float, pic_id: int):
    inline = run.add_picture(str(picture_path), width=Mm(w_mm), height=Mm(h_mm))._inline
    graphic = inline.find(qn("a:graphic"))
    anchor = parse_xml(
        f'<wp:anchor {nsdecls("wp", "a", "pic", "r")} distT="0" distB="0" distL="0" distR="0" simplePos="0" '
        f'relativeHeight="0" behindDoc="1" locked="1" layoutInCell="1" allowOverlap="1">'
        f'<wp:simplePos x="0" y="0"/>'
        f'<wp:positionH relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionH>'
        f'<wp:positionV relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionV>'
        f'<wp:extent cx="{Mm(w_mm)}" cy="{Mm(h_mm)}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapNone/>'
        f'<wp:docPr id="{pic_id}" name="AURAQIS letterhead {pic_id}"/><wp:cNvGraphicFramePr/></wp:anchor>'
    )
    anchor.append(graphic)
    inline.getparent().replace(inline, anchor)


def word_template(path: Path, first_png: Path, cont_png: Path):
    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Mm(210), Mm(297)
    sec.left_margin = sec.right_margin = Mm(25)
    sec.top_margin, sec.bottom_margin = Mm(30), Mm(38)
    sec.header_distance, sec.footer_distance = Mm(10), Mm(10)
    sec.different_first_page_header_footer = True

    first = sec.first_page_header.paragraphs[0]
    _float_behind(first.add_run(), first_png, 210, 297, 101)
    # The first-page header is taller than the margin, which pushes the letter below the logo.
    first.paragraph_format.space_before = Mm(36)
    _float_behind(sec.header.paragraphs[0].add_run(), cont_png, 210, 297, 102)

    normal = doc.styles["Normal"]
    # Calibri ships with every Office install, so letters look identical on any PC.
    normal.font.name = "Calibri"
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor(0x2B, 0x2E, 0x29)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.25

    def para(text="", bold=False, after=None, color=None):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.bold = bold
        if color:
            run.font.color.rgb = color
        if after is not None:
            p.paragraph_format.space_after = Pt(after)
        return p

    para("[Date]", after=14)
    for ln in ["[Recipient name]", "[Designation]", "[Company]", "[Address line 1]", "[City, State PIN]"]:
        para(ln, after=0)
    para("", after=6)
    para("Subject: [Subject of the letter]", bold=True, after=12, color=RGBColor(0x2F, 0x45, 0x30))
    para("Dear [Name],", after=10)
    para("[Start typing your letter here. This template keeps the AURAQIS letterhead on the first page and the continuation design on every following page, so you can write as many pages as you need.]")
    para("[Second paragraph.]", after=18)
    para("Warm regards,", after=30)
    para("[Your name]", bold=True, after=0)
    para("[Designation]", after=0)
    para("AURAQIS Private Limited", after=0, color=RGBColor(0xA8, 0x8A, 0x58))

    settings = doc.settings.element
    if settings.find(qn("w:doNotAutoCompressPictures")) is None:
        # CT_Settings is an ordered sequence: this flag must precede these elements.
        later = {qn(t) for t in ("w:forceUpgrade", "w:captions", "w:readModeInkLockDown", "w:smartTagType", "w:shapeDefaults", "w:doNotEmbedSmartTags", "w:decimalSymbol", "w:listSeparator")}
        flag = OxmlElement("w:doNotAutoCompressPictures")
        anchor = next((el for el in settings if el.tag in later or el.tag.endswith("}schemaLibrary")), None)
        if anchor is not None:
            anchor.addprevious(flag)
        else:
            settings.append(flag)
    doc.core_properties.title = "AURAQIS Letterhead"
    doc.core_properties.author = "AURAQIS"
    doc.save(str(path))


# ——— Email signatures ———


def signature_html(p) -> str:
    role = f'<tr><td style="padding:2px 0 0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#a88a58;font-weight:600;">{p["role"]}</td></tr>' if p["role"] else ""
    tel = p["phone"].replace(" ", "")
    link = "color:#2f4530;text-decoration:none;"
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>AURAQIS email signature · {p["name"]}</title></head>
<body style="margin:24px;background:#ffffff;">
<!-- Open in a browser, select the signature, copy and paste into Outlook / Gmail signature settings. -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2f4530;border-collapse:collapse;">
  <tr>
    <td style="padding:0 18px 0 0;vertical-align:middle;border-right:1px solid #cfdcc6;">
      <img src="images/auraqis-signature-mark.png" width="72" height="72" alt="AURAQIS" style="display:block;border:0;">
    </td>
    <td style="padding:0 0 0 18px;vertical-align:middle;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr><td style="font-size:16px;font-weight:600;color:#2f4530;">{p["name"]}</td></tr>
        {role}
        <tr><td style="padding:10px 0 6px;"><img src="images/auraqis-signature-wordmark.png" width="170" height="22" alt="AURAQIS · Constructions · Interiors" style="display:block;border:0;"></td></tr>
        <tr><td style="font-size:12px;line-height:18px;color:#2f4530;">
          <a href="tel:{tel}" style="{link}">{p["phone"]}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="mailto:{p["email"]}" style="{link}">{p["email"]}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://{WEB}" style="{link}">{WEB}</a>
        </td></tr>
        <tr><td style="font-size:11px;line-height:17px;color:#6d7869;">{ADDRESS}</td></tr>
        <tr><td style="padding-top:6px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:13px;color:#658c55;">{TAGLINE}</td></tr>
      </table>
    </td>
  </tr>
</table>
</body></html>
"""


def signature_assets(F, rings, folder: Path):
    folder.mkdir(parents=True, exist_ok=True)
    s = SVGRenderer()
    s.fill(mark_cmds(rings, 0, 0, 72), SAGE, evenodd=True)
    render_png(s.page_svg(72, 72, 216), folder / "auraqis-signature-mark.png")
    s = SVGRenderer()
    s.fill(F["quick500"].cmds("AURAQIS", 30, 0, 9.2, tracking=0.52), FOREST)
    s.fill(F["man600"].cmds(DESC, 14.5, 0.2, 20.6, tracking=0.42), BRASS)
    render_png(s.page_svg(170, 22, 510), folder / "auraqis-signature-wordmark.png")


# ——— Main ———


def main():
    F = load_fonts()
    rings = trace_swirl()
    for sub in ("print", "print-with-cropmarks", "vector-svg", "preview", "editable", "email-signature"):
        (OUT / sub).mkdir(parents=True, exist_ok=True)

    for key, label, size, fn in ITEMS:
        draw = lambda r, fn=fn: fn(r, F, rings)  # noqa: E731
        doc_pdf(OUT / "print" / f"AURAQIS-{key}.pdf", size, draw, label, False, F)
        doc_pdf(OUT / "print-with-cropmarks" / f"AURAQIS-{key}-cropmarks.pdf", size, draw, label, True, F)
        (OUT / "vector-svg" / f"AURAQIS-{key}.svg").write_text(art_svg(size, draw, False, round(size[0] / 25.4 * 96)), encoding="utf-8")
        render_png(art_svg(size, draw, True, round(size[0] / 25.4 * 200)), OUT / "preview" / f"AURAQIS-{key}.png")

    # 450 ppi page artwork for Word; transparent so the paper shows through
    art = OUT / "editable" / "_art"
    art.mkdir(exist_ok=True)
    px = round(210 / 25.4 * 450)
    render_png(art_svg((210, 297), lambda r: letterhead(r, F, rings), False, px), art / "letterhead-first.png")
    render_png(art_svg((210, 297), lambda r: continuation(r, F, rings), False, px), art / "letterhead-continuation.png")
    word_template(OUT / "editable" / "AURAQIS-Letterhead-Template.docx", art / "letterhead-first.png", art / "letterhead-continuation.png")
    for f in art.iterdir():
        f.unlink()
    art.rmdir()

    signature_assets(F, rings, OUT / "email-signature" / "images")
    for p in PEOPLE:
        (OUT / "email-signature" / f"AURAQIS-Signature-{p['slug']}.html").write_text(signature_html(p), encoding="utf-8")

    proof_pdf(OUT / "AURAQIS-Stationery-Proof.pdf", F, rings)
    for i, page in enumerate((proof_page_1, proof_page_2), 1):
        s = SVGRenderer()
        page(s, F, rings)
        render_png(s.page_svg(420, 297, 4200), OUT / "preview" / f"AURAQIS-Stationery-Proof-{i}.png")
    print("Stationery written to", OUT.relative_to(bc.ROOT))


if __name__ == "__main__":
    main()
