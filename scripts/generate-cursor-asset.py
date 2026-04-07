#!/usr/bin/env python3
"""Genereer kleine cursor-PNG + hotspot uit cursor_thick_outline.png."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parent.parent / "public/images/cursor_thick_outline.png"
OUT = Path(__file__).resolve().parent.parent / "public/images/cursor_thick_outline_cursor.png"
OUT_POINTER = Path(__file__).resolve().parent.parent / "public/images/cursor_thick_outline_pointer.png"
MAX_SIDE = 48
ALPHA_CUT = 90
# Extra rotatie voor “pointer/hand”-staat: zelfde poot, iets andere hoek t.o.v. default
POINTER_EXTRA_DEG_CW = 20


def tip_click_point(im: Image.Image) -> tuple[int, int]:
    """Bovenste band: meest linkse pixel = klikpunt (teen / bolletje)."""
    w, h = im.size
    px = im.load()
    min_y = h
    for y in range(h):
        for x in range(w):
            if px[x, y][3] >= ALPHA_CUT:
                min_y = min(min_y, y)
    if min_y >= h:
        return 0, 0
    band = max(6, int(h * 0.14))
    cands: list[tuple[int, int]] = []
    for y in range(min_y, min(min_y + band, h)):
        for x in range(w):
            if px[x, y][3] >= ALPHA_CUT:
                cands.append((x, y))
    if not cands:
        return 0, min_y
    return min(cands, key=lambda t: (t[1], t[0]))


def centroid(im: Image.Image) -> tuple[float, float]:
    w, h = im.size
    px = im.load()
    sx = sy = n = 0.0
    for y in range(h):
        for x in range(w):
            if px[x, y][3] >= ALPHA_CUT:
                sx += x
                sy += y
                n += 1
    if n < 1:
        return w / 2, h / 2
    return sx / n, sy / n


def score_variant(cropped: Image.Image) -> float:
    """Lager = beter: tip linksboven + tip echt 'voor' het zwaartepunt (zoals een pijl)."""
    cw, ch = cropped.size
    if cw < 2 or ch < 2:
        return 1e9
    tx, ty = tip_click_point(cropped)
    cx, cy = centroid(cropped)
    # Pijl: tip moet links en boven het zwaartepunt liggen
    if tx > cx - 2 or ty > cy - 2:
        return 1e6 + tx + ty
    # Tip dicht bij canvas-hoek linksonder van de 'wijs' hoek = hier linksboven
    geo = tx * 1.0 + ty * 1.05
    compact = (cw + ch) * 0.015
    return geo + compact


def try_best(base: Image.Image) -> tuple[Image.Image, int, bool, float]:
    best: tuple[float, int, bool, Image.Image] | None = None
    for flip in (False, True):
        im0 = base.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if flip else base
        for deg_cw in range(78, 138, 2):
            rot = im0.rotate(
                -deg_cw,
                expand=True,
                resample=Image.Resampling.BICUBIC,
                fillcolor=(0, 0, 0, 0),
            )
            bbox = rot.getbbox()
            if not bbox:
                continue
            cropped = rot.crop(bbox)
            total = score_variant(cropped)
            if best is None or total < best[0]:
                best = (total, deg_cw, flip, cropped.copy())
    assert best is not None
    _, deg, flip, cropped = best
    return cropped, deg, flip, best[0]


def render_at_deg(im0: Image.Image, deg_cw: float) -> Image.Image:
    r = im0.rotate(
        -deg_cw,
        expand=True,
        resample=Image.Resampling.BICUBIC,
        fillcolor=(0, 0, 0, 0),
    )
    bb = r.getbbox()
    assert bb
    return r.crop(bb)


def to_canvas(cropped: Image.Image) -> tuple[Image.Image, int, int]:
    cw2, ch2 = cropped.size
    scale = MAX_SIDE / max(cw2, ch2)
    nw = max(1, int(round(cw2 * scale)))
    nh = max(1, int(round(ch2 * scale)))
    out_im = cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    pad = 2
    canvas = Image.new("RGBA", (nw + pad, nh + pad), (0, 0, 0, 0))
    canvas.paste(out_im, (pad, pad))
    hs_x, hs_y = tip_click_point(canvas)
    hs_x = max(0, min(canvas.size[0] - 1, hs_x))
    hs_y = max(0, min(canvas.size[1] - 1, hs_y))
    return canvas, hs_x, hs_y


def main() -> None:
    base = Image.open(SRC).convert("RGBA")
    # Snel zoeken op verkleinde kopie, winnaar toepassen op volle resolutie
    probe_max = 420
    bw, bh = base.size
    ps = probe_max / max(bw, bh)
    probe = base.resize(
        (max(1, int(bw * ps)), max(1, int(bh * ps))),
        Image.Resampling.BILINEAR,
    )
    _, deg_cw, flip, _ = try_best(probe)
    im0 = base.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if flip else base
    cropped = render_at_deg(im0, float(deg_cw))
    cw2, ch2 = cropped.size

    # Fijnafstelling hoek op volle resolutie (±6°, halve graden)
    best_c = cropped
    best_sc = score_variant(cropped)
    best_deg = float(deg_cw)
    for d in range(-12, 13):
        ddeg = d / 2.0
        c = render_at_deg(im0, deg_cw + ddeg)
        sv = score_variant(c)
        if sv < best_sc:
            best_sc = sv
            best_c = c
            best_deg = deg_cw + ddeg

    cropped = best_c
    sc = best_sc
    deg_final = best_deg
    cw2, ch2 = cropped.size

    canvas, hs_x, hs_y = to_canvas(cropped)
    canvas.save(OUT, optimize=True)
    print(f"default flip={flip} deg_cw={deg_final:.2f} score={sc:.1f} crop={cw2}x{ch2} out={canvas.size[0]}x{canvas.size[1]}")
    print(f"hotspot_default={hs_x},{hs_y}")

    p_deg = deg_final + POINTER_EXTRA_DEG_CW
    cropped_p = render_at_deg(im0, p_deg)
    canvas_p, hpx, hpy = to_canvas(cropped_p)
    canvas_p.save(OUT_POINTER, optimize=True)
    print(f"pointer deg_cw={p_deg:.2f} out={canvas_p.size[0]}x{canvas_p.size[1]} hotspot_pointer={hpx},{hpy}")


if __name__ == "__main__":
    main()
