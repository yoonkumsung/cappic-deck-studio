const http = require('http');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PORT = 3001;
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/capture') {
    const slideId = url.searchParams.get('slide');
    if (!slideId) {
      res.writeHead(400);
      res.end('Missing slide parameter');
      return;
    }

    try {
      const browser = await chromium.launch();
      const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 4
      });

      await page.goto(`http://127.0.0.1:3000/preview.html?slide=${slideId}`, {
        waitUntil: 'networkidle'
      });
      await page.waitForTimeout(2000);

      const outputPath = path.join(outputDir, `${slideId}.png`);
      await page.screenshot({ path: outputPath, type: 'png' });
      await browser.close();

      // Send file as download
      const file = fs.readFileSync(outputPath);
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${slideId}.png"`,
        'Content-Length': file.length
      });
      res.end(file);
    } catch (e) {
      res.writeHead(500);
      res.end('Export failed: ' + e.message);
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Export server running on http://localhost:${PORT}`);
  console.log('Ready to capture slides');
});
