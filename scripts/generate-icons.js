const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = [192, 512];

async function generateIcons() {
  const svgPath = path.join(__dirname, '../public/icon.svg');
  const outputDir = path.join(__dirname, '../public');

  if (!fs.existsSync(svgPath)) {
    console.error('icon.svg not found!');
    process.exit(1);
  }

  console.log('Generating PWA icons...');

  for (const size of iconSizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to generate icon-${size}x${size}.png:`, error);
    }
  }

  console.log('Icon generation complete!');
}

generateIcons();
