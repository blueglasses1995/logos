# Logos PWA Icons

## Design Concept

The Logos app icons feature a geometric, logic-themed design representing the core concepts of formal logic:

- **Background**: Circular gradient from light blue (#60a5fa) to theme blue (#3b82f6)
- **Symbols**:
  - `∧` (AND) - Conjunction operator
  - `∨` (OR) - Disjunction operator
  - `→` (IMPLIES) - Implication arrow

## Icon Variants

### Standard Icons
- **Sizes**: 72, 96, 128, 144, 152, 192, 384, 512 pixels
- **Purpose**: General use across platforms
- **Padding**: 10% of size

### Maskable Icons
- **Sizes**: 72, 96, 128, 144, 152, 192, 384, 512 pixels
- **Purpose**: Android adaptive icons
- **Padding**: 20% of size (safe zone for Android masking)

## File Format

All icons are generated as SVG files for:
- **Scalability**: Perfect rendering at any size
- **Small file size**: ~1KB per icon
- **Color accuracy**: Vector-based gradient rendering
- **Browser support**: Modern browsers support SVG icons in PWA manifests

## Regenerating Icons

To regenerate the icons:

```bash
node scripts/generate-icons.mjs
```

This will create all standard and maskable icon variants in the `/public/icons` directory.

## Converting to PNG (Optional)

If PNG icons are needed for legacy browser support:

```bash
# Using ImageMagick
for size in 72 96 128 144 152 192 384 512; do
  convert icons/icon-$size.svg icons/icon-$size.png
  convert icons/icon-maskable-$size.svg icons/icon-maskable-$size.png
done
```

## PWA Manifest

Icons are referenced in `/public/manifest.json` with proper size and purpose declarations for optimal PWA installation experience.
