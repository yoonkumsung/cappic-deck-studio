const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const slideId = process.argv[2];
if (!slideId) {
  console.error('Usage: node export/capture.js <slide-id>');
  process.exit(1);
}

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 4  // 4x = 7680x4320 (8K)
  });

  // Load the slide preview page
  const url = `http://127.0.0.1:3000/preview.html?slide=${slideId}`;
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for fonts
  await page.waitForTimeout(2000);

  const outputPath = path.join(outputDir, `${slideId}.png`);
  await page.screenshot({ path: outputPath, type: 'png' });

  console.log(`Exported: ${outputPath}`);
  console.log(`Resolution: 7680x4320 (8K)`);

  await browser.close();
})();
