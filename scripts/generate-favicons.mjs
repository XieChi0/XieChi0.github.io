//这个脚本用于在更换头像时生成各种尺寸的favicon，以后如果你更换头像，只需要修改 src/assets/images/demo-avatar.png，然后重新运行这个脚本即可更新 favicon。
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const avatarPath = 'f:/zz_blog/astro-boke/src/assets/images/demo-avatar.png';
const outputDir = 'f:/zz_blog/astro-boke/public/favicon';

const sizes = [
  { name: '32', size: 32 },
  { name: '128', size: 128 },
  { name: '180', size: 180 },
  { name: '192', size: 192 },
];

async function generateFavicons() {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Read the avatar
  const avatar = sharp(avatarPath);

  for (const { name, size } of sizes) {
    // Light version
    await avatar
      .clone()
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(path.join(outputDir, `favicon-light-${name}.png`));
    console.log(`Generated favicon-light-${name}.png`);

    // Dark version (with slight brightness boost for dark backgrounds)
    await avatar
      .clone()
      .resize(size, size, { fit: 'cover' })
      .modulate({ brightness: 1.1 })
      .png()
      .toFile(path.join(outputDir, `favicon-dark-${name}.png`));
    console.log(`Generated favicon-dark-${name}.png`);
  }

  // Also generate a favicon.ico (using the 32x32 version)
  await avatar
    .clone()
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(path.join(outputDir, 'favicon.ico'));
  console.log('Generated favicon.ico');

  console.log('\nDone! All favicons generated.');
}

generateFavicons().catch(console.error);
