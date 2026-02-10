#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const iconsDir = path.join(publicDir, 'icons');

console.log('🔍 Verifying PWA Setup...\n');

const checks = {
  passed: [],
  failed: [],
};

function check(name, condition, errorMessage) {
  if (condition) {
    checks.passed.push(name);
    console.log(`✅ ${name}`);
  } else {
    checks.failed.push(name);
    console.log(`❌ ${name}`);
    if (errorMessage) console.log(`   ${errorMessage}`);
  }
}

// Check manifest.json exists and is valid
const manifestPath = path.join(publicDir, 'manifest.json');
const manifestExists = fs.existsSync(manifestPath);
check('manifest.json exists', manifestExists);

if (manifestExists) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    check('manifest.json is valid JSON', true);
    check('manifest has name', !!manifest.name);
    check('manifest has short_name', !!manifest.short_name);
    check('manifest has start_url', !!manifest.start_url);
    check('manifest has display', !!manifest.display);
    check('manifest has theme_color', !!manifest.theme_color);
    check('manifest has icons', manifest.icons && manifest.icons.length > 0, 'No icons found in manifest');

    if (manifest.icons) {
      const requiredSizes = ['192x192', '512x512'];
      requiredSizes.forEach(size => {
        const hasSize = manifest.icons.some(icon => icon.sizes === size);
        check(`manifest has ${size} icon`, hasSize);
      });

      const hasMaskable = manifest.icons.some(icon => icon.purpose === 'maskable');
      check('manifest has maskable icons', hasMaskable);
    }
  } catch (error) {
    check('manifest.json is valid JSON', false, error.message);
  }
}

// Check icon files exist
const requiredIcons = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsExist = fs.existsSync(iconsDir);
check('icons directory exists', iconsExist);

if (iconsExist) {
  requiredIcons.forEach(size => {
    const standardIcon = path.join(iconsDir, `icon-${size}.svg`);
    const maskableIcon = path.join(iconsDir, `icon-maskable-${size}.svg`);

    check(`icon-${size}.svg exists`, fs.existsSync(standardIcon));
    check(`icon-maskable-${size}.svg exists`, fs.existsSync(maskableIcon));
  });
}

// Check additional required files
check('favicon.svg exists', fs.existsSync(path.join(publicDir, 'favicon.svg')));
check('apple-touch-icon.svg exists', fs.existsSync(path.join(publicDir, 'apple-touch-icon.svg')));

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${checks.passed.length}`);
console.log(`❌ Failed: ${checks.failed.length}`);

if (checks.failed.length === 0) {
  console.log('\n🎉 All PWA setup checks passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review the issues above.');
  process.exit(1);
}
