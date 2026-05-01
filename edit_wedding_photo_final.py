from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw


INPUT_PATH = Path("/Users/sejin/Downloads/CCB02888_1.jpg")
OUTPUT_PATH = Path("/Users/sejin/Downloads/CCB02888_1_wedding_final.jpg")
PREVIEW_PATH = Path("/Users/sejin/Downloads/CCB02888_1_wedding_final_preview.jpg")


def clamp(v: float) -> int:
    return max(0, min(255, int(round(v))))


def merge(base, edited, mask):
    return Image.composite(edited, base, mask)


def mask_from_shapes(size, shapes, blur_radius):
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    for kind, box, fill in shapes:
        if kind == "ellipse":
            draw.ellipse(box, fill=fill)
        elif kind == "rectangle":
            draw.rectangle(box, fill=fill)
    return mask.filter(ImageFilter.GaussianBlur(blur_radius))


def channel_balance(img, r=1.0, g=1.0, b=1.0):
    red, green, blue = img.split()
    red = red.point(lambda v: clamp(v * r))
    green = green.point(lambda v: clamp(v * g))
    blue = blue.point(lambda v: clamp(v * b))
    return Image.merge("RGB", (red, green, blue))


def build_curve():
    lut = []
    for value in range(256):
        x = value / 255.0
        y = x
        if x < 0.42:
            y += 0.03 * (0.42 - x) / 0.42
        if 0.22 < x < 0.78:
            y += 0.018 * (1.0 - abs((x - 0.5) / 0.28))
        if x > 0.82:
            y -= 0.035 * (x - 0.82) / 0.18
        lut.append(clamp(y * 255.0))
    return lut * 3


def edit_photo():
    img = ImageOps.exif_transpose(Image.open(INPUT_PATH).convert("RGB"))
    width, height = img.size

    # Neutral base: reduce the yellow cast and keep whites cleaner.
    img = ImageOps.autocontrast(img, cutoff=0.1)
    img = img.point(build_curve())
    img = ImageEnhance.Brightness(img).enhance(1.012)
    img = ImageEnhance.Contrast(img).enhance(1.01)
    img = ImageEnhance.Color(img).enhance(0.95)
    img = channel_balance(img, r=0.992, g=1.0, b=1.022)

    # Open the background slightly while keeping it airy, not washed out.
    background_layer = ImageEnhance.Brightness(img).enhance(1.03)
    background_layer = ImageEnhance.Color(background_layer).enhance(0.98)
    background_layer = channel_balance(background_layer, r=0.995, g=1.0, b=1.03)
    background_mask = mask_from_shapes(
        img.size,
        [
            ("rectangle", (0, 0, width, int(height * 0.57)), 100),
            ("ellipse", (int(width * 0.10), int(height * 0.08), int(width * 0.90), int(height * 0.88)), 55),
        ],
        170,
    )
    img = merge(img, background_layer, background_mask)

    # Keep attention on the couple with a restrained lift only.
    subject_layer = ImageEnhance.Brightness(img).enhance(1.06)
    subject_layer = ImageEnhance.Contrast(subject_layer).enhance(1.015)
    subject_layer = channel_balance(subject_layer, r=1.003, g=1.0, b=1.008)
    subject_mask = mask_from_shapes(
        img.size,
        [
            ("ellipse", (int(width * 0.31), int(height * 0.56), int(width * 0.69), int(height * 0.95)), 150),
            ("ellipse", (int(width * 0.36), int(height * 0.61), int(width * 0.64), int(height * 0.91)), 195),
        ],
        140,
    )
    img = merge(img, subject_layer, subject_mask)

    # Gentle face recovery for natural detail.
    face_layer = ImageEnhance.Brightness(img).enhance(1.025)
    face_layer = ImageEnhance.Contrast(face_layer).enhance(1.02)
    face_layer = face_layer.filter(ImageFilter.UnsharpMask(radius=0.9, percent=40, threshold=2))
    face_mask = mask_from_shapes(
        img.size,
        [
            ("ellipse", (int(width * 0.425), int(height * 0.61), int(width * 0.505), int(height * 0.68)), 120),
            ("ellipse", (int(width * 0.53), int(height * 0.605), int(width * 0.615), int(height * 0.685)), 120),
        ],
        14,
    )
    img = merge(img, face_layer, face_mask)

    # Very mild clothing cleanup without plastic texture.
    clothing_layer = img.filter(ImageFilter.GaussianBlur(radius=1.0))
    clothing_mask = mask_from_shapes(
        img.size,
        [
            ("ellipse", (int(width * 0.36), int(height * 0.68), int(width * 0.50), int(height * 0.84)), 70),
            ("ellipse", (int(width * 0.36), int(height * 0.77), int(width * 0.50), int(height * 0.97)), 70),
        ],
        24,
    )
    img = merge(img, clothing_layer, clothing_mask)

    # Minimal finishing.
    vignette_layer = ImageEnhance.Brightness(img).enhance(0.98)
    vignette_mask = mask_from_shapes(
        img.size,
        [("ellipse", (int(width * 0.03), int(height * 0.02), int(width * 0.97), int(height * 0.96)), 70)],
        240,
    )
    img = merge(img, vignette_layer, vignette_mask)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.0, percent=35, threshold=3))

    img.save(OUTPUT_PATH, quality=95, subsampling=0)

    preview = img.copy()
    preview.thumbnail((1200, 1200))
    preview.save(PREVIEW_PATH, quality=92)


if __name__ == "__main__":
    edit_photo()
