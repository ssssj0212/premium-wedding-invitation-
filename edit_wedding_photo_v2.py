from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw, ImageChops


INPUT_PATH = Path("/Users/sejin/Downloads/CCB02888_1.jpg")
OUTPUT_PATH = Path("/Users/sejin/Downloads/CCB02888_1_wedding_invite_edit_v2.jpg")
PREVIEW_PATH = Path("/Users/sejin/Downloads/CCB02888_1_wedding_invite_edit_v2_preview.jpg")


def clamp(value: float) -> int:
    return max(0, min(255, int(round(value))))


def soft_mask(size, boxes_with_fill, blur_radius):
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    for shape, box, fill in boxes_with_fill:
        if shape == "ellipse":
            draw.ellipse(box, fill=fill)
        elif shape == "rectangle":
            draw.rectangle(box, fill=fill)
    return mask.filter(ImageFilter.GaussianBlur(radius=blur_radius))


def merge_with_mask(base, edited, mask):
    return Image.composite(edited, base, mask)


def apply_channel_balance(img, red=1.0, green=1.0, blue=1.0):
    r, g, b = img.split()
    r = r.point(lambda v: clamp(v * red))
    g = g.point(lambda v: clamp(v * green))
    b = b.point(lambda v: clamp(v * blue))
    return Image.merge("RGB", (r, g, b))


def gentle_tone_curve():
    lut = []
    for value in range(256):
        x = value / 255.0
        y = x
        # Airy wedding baseline: lifted mids, protected whites, cleaner shadows.
        y += 0.06 * (1.0 - abs(2.0 * x - 1.0))
        if x < 0.25:
            y += 0.03 * (0.25 - x) / 0.25
        if x > 0.78:
            y -= 0.045 * (x - 0.78) / 0.22
        lut.append(clamp(y * 255.0))
    return lut * 3


def edit_background(base):
    width, height = base.size

    airy = base.point(gentle_tone_curve())
    airy = ImageEnhance.Brightness(airy).enhance(1.035)
    airy = ImageEnhance.Contrast(airy).enhance(0.98)
    airy = ImageEnhance.Color(airy).enhance(1.03)
    airy = apply_channel_balance(airy, red=1.03, green=1.01, blue=0.97)

    sky_layer = ImageEnhance.Color(base).enhance(1.10)
    sky_layer = ImageEnhance.Brightness(sky_layer).enhance(1.045)
    sky_layer = apply_channel_balance(sky_layer, red=0.99, green=1.02, blue=1.04)
    sky_mask = soft_mask(
        base.size,
        [
            ("rectangle", (0, 0, width, int(height * 0.54)), 165),
            ("ellipse", (int(width * 0.05), 0, int(width * 0.95), int(height * 0.62)), 80),
        ],
        blur_radius=170,
    )
    airy = merge_with_mask(airy, sky_layer, sky_mask)

    bridge_layer = ImageEnhance.Color(base).enhance(0.94)
    bridge_layer = ImageEnhance.Contrast(bridge_layer).enhance(1.02)
    bridge_mask = soft_mask(
        base.size,
        [("rectangle", (0, int(height * 0.25), width, int(height * 0.78)), 70)],
        blur_radius=200,
    )
    airy = merge_with_mask(airy, bridge_layer, bridge_mask)

    return airy


def edit_subject(base, original):
    width, height = original.size

    subject_mask = soft_mask(
        original.size,
        [
            ("ellipse", (int(width * 0.28), int(height * 0.54), int(width * 0.72), int(height * 0.96)), 185),
            ("ellipse", (int(width * 0.33), int(height * 0.58), int(width * 0.67), int(height * 0.90)), 230),
        ],
        blur_radius=170,
    )

    subject = ImageEnhance.Brightness(original).enhance(1.04)
    subject = ImageEnhance.Contrast(subject).enhance(1.02)
    subject = apply_channel_balance(subject, red=1.03, green=1.01, blue=0.98)
    subject = merge_with_mask(base, subject, subject_mask)

    # Mild skin cleanup on faces only.
    face_mask = soft_mask(
        original.size,
        [
            ("ellipse", (int(width * 0.425), int(height * 0.61), int(width * 0.505), int(height * 0.675)), 170),
            ("ellipse", (int(width * 0.53), int(height * 0.605), int(width * 0.615), int(height * 0.68)), 170),
        ],
        blur_radius=28,
    )
    smooth_faces = subject.filter(ImageFilter.GaussianBlur(radius=2.3))
    smooth_faces = ImageEnhance.Contrast(smooth_faces).enhance(0.99)
    subject = merge_with_mask(subject, smooth_faces, face_mask)

    face_recovery_mask = soft_mask(
        original.size,
        [
            ("ellipse", (int(width * 0.43), int(height * 0.615), int(width * 0.502), int(height * 0.675)), 120),
            ("ellipse", (int(width * 0.535), int(height * 0.61), int(width * 0.612), int(height * 0.685)), 165),
        ],
        blur_radius=18,
    )
    recovered_faces = apply_channel_balance(original, red=1.02, green=1.01, blue=0.99)
    subject = merge_with_mask(subject, recovered_faces, face_recovery_mask)

    # Sharpen the subject slightly after softening.
    crisp_subject = subject.filter(ImageFilter.UnsharpMask(radius=1.5, percent=95, threshold=2))
    crisp_mask = soft_mask(
        original.size,
        [("ellipse", (int(width * 0.30), int(height * 0.56), int(width * 0.70), int(height * 0.95)), 175)],
        blur_radius=120,
    )
    return merge_with_mask(subject, crisp_subject, crisp_mask)


def smooth_clothes(base):
    width, height = base.size
    # Left subject shirt and trousers.
    clothes_mask = soft_mask(
        base.size,
        [
            ("ellipse", (int(width * 0.36), int(height * 0.68), int(width * 0.50), int(height * 0.85)), 160),
            ("ellipse", (int(width * 0.365), int(height * 0.77), int(width * 0.50), int(height * 0.96)), 160),
        ],
        blur_radius=36,
    )
    softened = base.filter(ImageFilter.GaussianBlur(radius=2.2))
    softened = ImageEnhance.Contrast(softened).enhance(1.01)
    return merge_with_mask(base, softened, clothes_mask)


def refine_jaw(base):
    width, height = base.size
    result = base.copy()

    # Very subtle inward taper on lower face for both subjects.
    face_specs = [
        (0.428, 0.61, 0.505, 0.685, 0.07),
        (0.532, 0.605, 0.615, 0.69, 0.08),
    ]

    for left_r, top_r, right_r, bottom_r, squeeze in face_specs:
        left = int(width * left_r)
        top = int(height * top_r)
        right = int(width * right_r)
        bottom = int(height * bottom_r)
        crop = result.crop((left, top, right, bottom))
        w, h = crop.size
        transformed = crop.transform(
            crop.size,
            Image.Transform.QUAD,
            (
                0, 0,
                w, 0,
                int(w * (1 - squeeze)), h,
                int(w * squeeze), h,
            ),
            resample=Image.Resampling.BICUBIC,
        )

        mask = Image.new("L", crop.size, 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, int(h * 0.08), w, h), fill=165)
        mask = mask.filter(ImageFilter.GaussianBlur(radius=12))

        face_canvas = result.crop((left, top, right, bottom))
        merged = Image.composite(transformed, face_canvas, mask)
        result.paste(merged, (left, top))

    return result


def add_wedding_finish(base):
    width, height = base.size

    glow_mask = soft_mask(
        base.size,
        [
            ("ellipse", (int(width * 0.19), int(height * 0.06), int(width * 0.81), int(height * 0.93)), 110),
        ],
        blur_radius=220,
    )
    edge_dim = ImageEnhance.Brightness(base).enhance(0.96)
    finished = merge_with_mask(base, edge_dim, glow_mask)

    soft_glow = finished.filter(ImageFilter.GaussianBlur(radius=11))
    soft_glow = ImageEnhance.Brightness(soft_glow).enhance(1.005)
    finished = Image.blend(finished, soft_glow, 0.05)

    finished = ImageEnhance.Color(finished).enhance(1.015)
    finished = finished.filter(ImageFilter.UnsharpMask(radius=1.3, percent=70, threshold=3))
    return finished


def main():
    base = ImageOps.exif_transpose(Image.open(INPUT_PATH).convert("RGB"))
    edited = edit_background(base)
    edited = edit_subject(edited, base)
    edited = smooth_clothes(edited)
    edited = refine_jaw(edited)
    edited = add_wedding_finish(edited)

    edited.save(OUTPUT_PATH, quality=95, subsampling=0)

    preview = edited.copy()
    preview.thumbnail((1200, 1200))
    preview.save(PREVIEW_PATH, quality=92)


if __name__ == "__main__":
    main()
