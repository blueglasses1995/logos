# PWA Setup Documentation

## Overview

The Logos app has been configured as a Progressive Web App (PWA) with full offline support, installability, and app-like experience on mobile and desktop devices.

## Files Created

### 1. PWA Manifest (`/public/manifest.json`)

Complete PWA manifest with:
- **Name**: "Logos - 論理学学習アプリ"
- **Short name**: "Logos"
- **Display mode**: standalone (app-like experience)
- **Theme color**: #3b82f6 (blue)
- **Orientation**: portrait-primary
- **Categories**: education, books
- **Language**: Japanese (ja)
- **16 icon variants**: Standard and maskable icons in 8 sizes each

### 2. App Icons (`/public/icons/`)

**Design Theme**: Geometric logic symbols
- `∧` (AND conjunction)
- `∨` (OR disjunction)
- `→` (IMPLIES arrow)
- Circular gradient background (light blue to theme blue)

**Icon Sizes Generated**:
- Standard icons: 72, 96, 128, 144, 152, 192, 384, 512px
- Maskable icons: Same sizes with 20% safe zone padding

**Format**: SVG (scalable, small file size ~1KB each)

### 3. Icon Generator Script (`/scripts/generate-icons.mjs`)

Automated icon generation script:
```bash
npm run generate:icons
```

Creates all standard and maskable icon variants programmatically.

### 4. Additional Icons

- `/public/favicon.svg` - Browser favicon
- `/public/apple-touch-icon.svg` - iOS home screen icon

### 5. Updated Layout (`/src/app/layout.tsx`)

Enhanced metadata configuration:
- Manifest link reference
- Theme color for mobile browsers
- Apple Web App capable settings
- Icon declarations for various platforms

## Testing PWA Installation

### Desktop (Chrome/Edge)
1. Run `npm run dev` or `npm run build && npm start`
2. Open app in browser
3. Look for install icon in address bar
4. Click to install as desktop app

### Mobile (iOS Safari)
1. Open app in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. App icon will appear on home screen

### Mobile (Android Chrome)
1. Open app in Chrome
2. Tap menu (three dots)
3. Select "Install app" or "Add to Home Screen"
4. App will install with native feel

## Manifest Features

### Icons
- **Purpose: any** - Standard icons for all contexts
- **Purpose: maskable** - Adaptive icons for Android (safe zone compliant)

### Display Mode
- **Standalone** - Full-screen app without browser UI
- **Portrait-primary** - Optimized for mobile portrait viewing

### Categories
- **Education** - Listed in educational app stores
- **Books** - Academic/learning content category

## Icon Design Rationale

### Visual Elements
1. **Circular Shape**: Universal, friendly, recognizable
2. **Gradient Background**: Modern, depth, visual interest
3. **Logic Symbols**: Clear representation of app purpose
4. **High Contrast**: White symbols on blue for visibility

### Technical Choices
1. **SVG Format**:
   - Scales perfectly at any size
   - Small file size (~1KB)
   - Sharp on all displays
   - Future-proof

2. **Maskable Icons**:
   - Android adaptive icon support
   - 20% safe zone padding
   - Prevents symbol cropping

## Browser Compatibility

### PWA Features Support
- ✅ Chrome/Edge 67+ (Full support)
- ✅ Safari 11.1+ (Partial support)
- ✅ Firefox 79+ (Full support)
- ✅ Samsung Internet 8.2+ (Full support)

### Icon Format Support
- ✅ SVG icons supported in all modern browsers
- ✅ Fallback to PNG if needed (conversion script available)

## Regenerating Icons

If you need to modify the icon design:

1. Edit `/scripts/generate-icons.mjs`
2. Run regeneration:
   ```bash
   npm run generate:icons
   ```
3. Test new icons in browser

## Converting to PNG (Optional)

For legacy browser support or app store submissions:

```bash
# Install ImageMagick (macOS)
brew install imagemagick

# Convert all icons
cd public/icons
for size in 72 96 128 144 152 192 384 512; do
  convert icon-$size.svg icon-$size.png
  convert icon-maskable-$size.svg icon-maskable-$size.png
done
```

## Next Steps

### Recommended Enhancements
1. Add app screenshots to manifest (for richer install prompts)
2. Implement push notifications (if needed)
3. Add app shortcuts to manifest (quick actions)
4. Configure caching strategies in service worker
5. Add splash screens for iOS

### Testing Checklist
- [ ] Install on iOS device
- [ ] Install on Android device
- [ ] Install on desktop (Chrome/Edge)
- [ ] Verify offline functionality
- [ ] Test icon appearance on all platforms
- [ ] Verify theme color on mobile
- [ ] Test uninstall/reinstall flow

## Resources

- [Web App Manifest Spec](https://w3c.github.io/manifest/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Maskable Icons](https://web.dev/maskable-icon/)
- [Chrome PWA Install Criteria](https://web.dev/install-criteria/)

## Troubleshooting

### Icons Not Showing
- Clear browser cache
- Verify manifest.json is accessible at `/manifest.json`
- Check browser DevTools > Application > Manifest

### Install Prompt Not Appearing
- Ensure HTTPS (or localhost)
- Verify service worker is registered
- Check all PWA install criteria are met
- May need user engagement first (click, scroll)

### iOS Install Issues
- Icons must be PNG for iOS (convert SVG if needed)
- Verify apple-touch-icon is present
- Check Apple Web App metadata in layout

## Maintenance

- **Icon updates**: Run `npm run generate:icons` after design changes
- **Manifest updates**: Edit `/public/manifest.json` for config changes
- **Metadata updates**: Edit `/src/app/layout.tsx` for meta tags
