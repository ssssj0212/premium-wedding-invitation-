from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw


INPUT_PATH = Path("/Users/sejin/Downloads/CCB02888_1.jpg")
OUTPUT_PATH = Path("/Users/sejin/Downloads/CCB02888_1_wedding_edit.jpg")
PREVIEW_PATH = Path("/Users/sejin/Downloads/CCB02888_1_wedding_edit_preview.jpg")


def clamp(value: float) -> int:
    return max(0, min(255, int(round(value))))


def build_tone_curve():
    lut = []
    for value in range(256):
        x = value / 255.0
        y = x

        # Lift the midtones and shadows a touch while protecting bright areas.
        y += 0.04 * (1.0 - abs(2.0 * x - 1.0))
        if x < 0.35:
            y += 0.025 * (0.35 - x) / 0.35
        if x > 0.72:
            y -= 0.07 * (x - 0.72) / 0.28

        lut.append(clamp(y * 255.0))
    return lut


def apply_warm_balance(img: Image.Image, red_gain=1.02, green_gain=1.0, blue_gain=0.96):
    r, g, b = img.split()
    r = r.point(lambda v: clamp(v * red_gain))
    g = g.point(lambda v: clamp(v * green_gain))
    b = b.point(lambda v: clamp(v * blue_gain))
    return Image.merge("RGB", (r, g, b))


def build_subject_mask(size):
    width, height = size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)

    # Broad, soft selection around the couple.
    main_box = (
        int(width * 0.29),
        int(height * 0.56),
        int(width * 0.71),
        int(height * 0.93),
    )
    glow_box = (
        int(width * 0.23),
        int(height * 0.50),
        int(width * 0.77),
        int(height * 0.98),
    )
    draw.ellipse(glow_box, fill=90)
    draw.ellipse(main_box, fill=165)
    return mask.filter(ImageFilter.GaussianBlur(radius=150))


def build_vignette_mask(size):
    width, height = size
    mask = Image.new("L", size, 155)
    draw = ImageDraw.Draw(mask)
    draw.ellipse(
        (
            int(width * 0.05),
            int(height * 0.02),
            int(width * 0.95),
            int(height * 0.94),
        ),
        fill=0,
    )
    return mask.filter(ImageFilter.GaussianBlur(radius=220))


def main():
    img = ImageOps.exif_transpose(Image.open(INPUT_PATH).convert("RGB"))

    # Keep the image clean and natural rather than punchy.
    img = ImageOps.autocontrast(img, cutoff=0.2)
    img = img.point(build_tone_curve() * 3)
    img = ImageEnhance.Color(img).enhance(0.93)
    img = ImageEnhance.Contrast(img).enhance(1.04)
    img = ImageEnhance.Brightness(img).enhance(1.015)
    img = apply_warm_balance(img)

    subject_mask = build_subject_mask(img.size)
    subject_layer = ImageEnhance.Brightness(img).enhance(1.11)
    subject_layer = ImageEnhance.Contrast(subject_layer).enhance(1.03)
    subject_layer = apply_warm_balance(subject_layer, red_gain=1.025, green_gain=1.0, blue_gain=0.97)
    img = Image.composite(subject_layer, img, subject_mask)

    vignette_mask = build_vignette_mask(img.size)
    edge_layer = ImageEnhance.Brightness(img).enhance(0.94)
    img = Image.composite(edge_layer, img, vignette_mask)

    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=65, threshold=3))

    img.save(OUTPUT_PATH, quality=95, subsampling=0)

    preview = img.copy()
    preview.thumbnail((1200, 1200))
    preview.save(PREVIEW_PATH, quality=92)


if __name__ == "__main__":
    main()
