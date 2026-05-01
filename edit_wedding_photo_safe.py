from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw


INPUT_PATH = Path("/Users/sejin/Downloads/CCB02888_1.jpg")
OUTPUT_FULL = Path("/Users/sejin/Downloads/CCB02888_1_wedding_safe_full.jpg")
OUTPUT_CROP = Path("/Users/sejin/Downloads/CCB02888_1_wedding_safe_crop.jpg")
PREVIEW_FULL = Path("/Users/sejin/Downloads/CCB02888_1_wedding_safe_full_preview.jpg")
PREVIEW_CROP = Path("/Users/sejin/Downloads/CCB02888_1_wedding_safe_crop_preview.jpg")


def clamp(v: float) -> int:
    return max(0, min(255, int(round(v))))


def blur_mask(size, shapes, radius):
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    for kind, box, fill in shapes:
        if kind == "ellipse":
            draw.ellipse(box, fill=fill)
        elif kind == "rectangle":
            draw.rectangle(box, fill=fill)
    return mask.filter(ImageFilter.GaussianBlur(radius))


def merge(base, edited, mask):
    return Image.composite(edited, base, mask)


def channel_balance(img, r_gain=1.0, g_gain=1.0, b_gain=1.0):
    r, g, b = img.split()
    r = r.point(lambda v: clamp(v * r_gain))
    g = g.point(lambda v: clamp(v * g_gain))
    b = b.point(lambda v: clamp(v * b_gain))
    return Image.merge("RGB", (r, g, b))


def subtle_global(img):
    img = ImageOps.autocontrast(img, cutoff=0.15)
    img = ImageEnhance.Brightness(img).enhance(1.02)
    img = ImageEnhance.Contrast(img).enhance(1.01)
    img = ImageEnhance.Color(img).enhance(0.98)
    img = channel_balance(img, r_gain=1.015, g_gain=1.005, b_gain=0.985)
    return img


def brighten_background(base):
    width, height = base.size
    layer = ImageEnhance.Brightness(base).enhance(1.055)
    layer = ImageEnhance.Color(layer).enhance(1.03)
    layer = channel_balance(layer, r_gain=1.01, g_gain=1.01, b_gain=1.03)
    mask = blur_mask(
        base.size,
        [
            ("rectangle", (0, 0, width, int(height * 0.60)), 115),
            ("ellipse", (int(width * 0.10), 0, int(width * 0.90), int(height * 0.72)), 70),
        ],
        radius=160,
    )
    return merge(base, layer, mask)


def brighten_subject(base):
    width, height = base.size
    layer = ImageEnhance.Brightness(base).enhance(1.085)
    layer = ImageEnhance.Contrast(layer).enhance(1.02)
    layer = channel_balance(layer, r_gain=1.02, g_gain=1.01, b_gain=0.99)
    mask = blur_mask(
        base.size,
        [
            ("ellipse", (int(width * 0.31), int(height * 0.56), int(width * 0.69), int(height * 0.95)), 165),
            ("ellipse", (int(width * 0.36), int(height * 0.60), int(width * 0.64), int(height * 0.91)), 215),
        ],
        radius=140,
    )
    return merge(base, layer, mask)


def refine_faces(base):
    width, height = base.size
    face_mask = blur_mask(
        base.size,
        [
            ("ellipse", (int(width * 0.425), int(height * 0.61), int(width * 0.505), int(height * 0.68)), 150),
            ("ellipse", (int(width * 0.53), int(height * 0.605), int(width * 0.615), int(height * 0.685)), 150),
        ],
        radius=16,
    )
    face_layer = ImageEnhance.Brightness(base).enhance(1.04)
    face_layer = ImageEnhance.Contrast(face_layer).enhance(1.03)
    face_layer = face_layer.filter(ImageFilter.UnsharpMask(radius=1.0, percent=60, threshold=2))
    return merge(base, face_layer, face_mask)


def smooth_clothes(base):
    width, height = base.size
    shirt_pants_mask = blur_mask(
        base.size,
        [
            ("ellipse", (int(width * 0.36), int(height * 0.68), int(width * 0.50), int(height * 0.84)), 120),
            ("ellipse", (int(width * 0.36), int(height * 0.77), int(width * 0.50), int(height * 0.97)), 120),
        ],
        radius=26,
    )
    layer = base.filter(ImageFilter.GaussianBlur(radius=1.2))
    layer = ImageEnhance.Contrast(layer).enhance(1.01)
    return merge(base, layer, shirt_pants_mask)


def finish(base):
    width, height = base.size
    vignette_mask = blur_mask(
        base.size,
        [("ellipse", (int(width * 0.03), int(height * 0.02), int(width * 0.97), int(height * 0.96)), 96)],
        radius=220,
    )
    edge_dim = ImageEnhance.Brightness(base).enhance(0.97)
    out = merge(base, edge_dim, vignette_mask)
    out = out.filter(ImageFilter.UnsharpMask(radius=1.1, percent=45, threshold=3))
    return out


def make_crop(img):
    width, height = img.size
    crop_w = 3000
    crop_h = 4500
    left = (width - crop_w) // 2
    top = 1100
    right = left + crop_w
    bottom = top + crop_h
    return img.crop((left, top, right, bottom))


def save_preview(img, path):
    preview = img.copy()
    preview.thumbnail((1200, 1200))
    preview.save(path, quality=92)


def main():
    original = ImageOps.exif_transpose(Image.open(INPUT_PATH).convert("RGB"))
    edited = subtle_global(original)
    edited = brighten_background(edited)
    edited = brighten_subject(edited)
    edited = refine_faces(edited)
    edited = smooth_clothes(edited)
    edited = finish(edited)

    edited.save(OUTPUT_FULL, quality=95, subsampling=0)
    save_preview(edited, PREVIEW_FULL)

    cropped = make_crop(edited)
    cropped.save(OUTPUT_CROP, quality=95, subsampling=0)
    save_preview(cropped, PREVIEW_CROP)


if __name__ == "__main__":
    main()
