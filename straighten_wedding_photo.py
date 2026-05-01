from pathlib import Path
from PIL import Image, ImageOps


INPUT_PATH = Path("/Users/sejin/Downloads/CCB02888_1_wedding_final.jpg")
OUTPUT_PATH = Path("/Users/sejin/Downloads/CCB02888_1_wedding_final_straight.jpg")
PREVIEW_PATH = Path("/Users/sejin/Downloads/CCB02888_1_wedding_final_straight_preview.jpg")

# Slight counterclockwise correction based on the deck lines and overall frame balance.
ROTATE_DEGREES = 0.8


def main():
    img = ImageOps.exif_transpose(Image.open(INPUT_PATH).convert("RGB"))
    width, height = img.size

    rotated = img.rotate(
        ROTATE_DEGREES,
        resample=Image.Resampling.BICUBIC,
        expand=True,
        fillcolor=(245, 245, 245),
    )

    left = (rotated.width - width) // 2
    top = (rotated.height - height) // 2
    cropped = rotated.crop((left, top, left + width, top + height))
    cropped = cropped.crop((55, 55, width - 55, height - 55)).resize((width, height), Image.Resampling.LANCZOS)

    cropped.save(OUTPUT_PATH, quality=95, subsampling=0)

    preview = cropped.copy()
    preview.thumbnail((1200, 1200))
    preview.save(PREVIEW_PATH, quality=92)


if __name__ == "__main__":
    main()
