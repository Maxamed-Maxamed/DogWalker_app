from PIL import Image
import os
import sys

SOURCE = "assets/images/source.png"
OUTPUT_DIR = "assets/images"

ANDROID_SAFE_ZONE = 0.72  # 72% center safe area

def fail(message):
    print(f"\n❌ {message}")
    sys.exit(1)

def ensure_square(img):
    if img.width != img.height:
        fail("Source image must be perfectly square.")
    return img

def create_android_safe_foreground(img):
    size = 1024
    safe_size = int(size * ANDROID_SAFE_ZONE)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    resized = img.resize((safe_size, safe_size), Image.LANCZOS)

    offset = (size - safe_size) // 2
    canvas.paste(resized, (offset, offset), resized)

    return canvas

def main():
    if not os.path.exists(SOURCE):
        fail(f"Missing source file at: {SOURCE}")

    img = Image.open(SOURCE).convert("RGBA")
    ensure_square(img)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # --- Main App Icon ---
    icon = img.resize((1024, 1024), Image.LANCZOS)
    icon.save(f"{OUTPUT_DIR}/icon.png")

    # --- Android Adaptive Foreground ---
    foreground = create_android_safe_foreground(img)
    foreground.save(f"{OUTPUT_DIR}/android-icon-foreground.png")

    # --- Android Adaptive Background ---
    background = Image.new("RGBA", (1024, 1024), (230, 244, 254, 255))
    background.save(f"{OUTPUT_DIR}/android-icon-background.png")

    # --- Android Monochrome ---
    gray = img.convert("L")
    mono = create_android_safe_foreground(gray.convert("RGBA"))
    mono.save(f"{OUTPUT_DIR}/android-icon-monochrome.png")

    # --- Favicon ---
    favicon = img.resize((48, 48), Image.LANCZOS)
    favicon.save(f"{OUTPUT_DIR}/favicon.png")

    # --- Splash Icon ---
    splash = img.resize((512, 512), Image.LANCZOS)
    splash.save(f"{OUTPUT_DIR}/splash-icon.png")

    print("\n✅ Expo assets generated successfully.")

if __name__ == "__main__":
    main()
