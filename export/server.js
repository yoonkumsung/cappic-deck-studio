const http = require('http');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PORT = 3001;
const srcDir = path.join(__dirname, '..', 'src');
const outputDir = path.join(__dirname, '..', 'output');
const versionsDir = path.join(srcDir, 'versions');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(versionsDir)) fs.mkdirSync(versionsDir, { recursive: true });

// ── Ratio → viewport mapping ──
const VIEWPORTS = {
  '16:9': { width: 1920, height: 1080 },
  '3:4':  { width: 1080, height: 1440 },
  '4:3':  { width: 1440, height: 1080 },
  '1:1':  { width: 1080, height: 1080 },
};

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function sanitizeVersionId(id) {
  // Allow alphanumeric, underscores, hyphens, dots, Korean chars
  return id.replace(/[<>:"/\\|?*]/g, '_');
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // ══════════════════════════════════════
  //  VERSION MANAGEMENT
  // ══════════════════════════════════════

  // ── GET /versions — 전체 버전 목록 + 현재 활성 버전 ──
  if (url.pathname === '/versions' && req.method === 'GET') {
    try {
      const index = readJSON(path.join(versionsDir, 'index.json')) || { current: null, versions: [] };
      const versions = [];
      for (const vId of index.versions) {
        const vFile = path.join(versionsDir, `${sanitizeVersionId(vId)}.json`);
        const vData = readJSON(vFile);
        if (vData) versions.push(vData);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ current: index.current, versions }));
    } catch (e) {
      res.writeHead(500);
      res.end('Failed to load versions: ' + e.message);
    }
    return;
  }

  // ── POST /save-version — 이름 지정 버전 저장 ──
  if (url.pathname === '/save-version' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id, config } = JSON.parse(body);
        if (!id || !config) {
          res.writeHead(400);
          res.end('Missing id or config');
          return;
        }

        const safeId = sanitizeVersionId(id);
        const now = new Date().toISOString();
        const vFile = path.join(versionsDir, `${safeId}.json`);

        // Check if updating existing
        const existing = readJSON(vFile);
        const versionData = {
          id: safeId,
          createdAt: existing ? existing.createdAt : now,
          updatedAt: now,
          config
        };

        writeJSON(vFile, versionData);

        // Update index
        const index = readJSON(path.join(versionsDir, 'index.json')) || { current: null, versions: [] };
        if (!index.versions.includes(safeId)) {
          index.versions.push(safeId);
        }
        index.current = safeId;
        writeJSON(path.join(versionsDir, 'index.json'), index);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, version: versionData }));
      } catch (e) {
        res.writeHead(500);
        res.end('Save version failed: ' + e.message);
      }
    });
    return;
  }

  // ── DELETE /delete-version?id=X — 버전 삭제 ──
  if (url.pathname === '/delete-version' && req.method === 'DELETE') {
    const id = url.searchParams.get('id');
    if (!id) {
      res.writeHead(400);
      res.end('Missing id parameter');
      return;
    }

    try {
      const safeId = sanitizeVersionId(id);
      const vFile = path.join(versionsDir, `${safeId}.json`);
      if (fs.existsSync(vFile)) fs.unlinkSync(vFile);

      const index = readJSON(path.join(versionsDir, 'index.json')) || { current: null, versions: [] };
      index.versions = index.versions.filter(v => v !== safeId);
      if (index.current === safeId) {
        index.current = index.versions[0] || null;
      }
      writeJSON(path.join(versionsDir, 'index.json'), index);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500);
      res.end('Delete version failed: ' + e.message);
    }
    return;
  }

  // ── POST /autosave — 자동저장 (30초 주기) ──
  if (url.pathname === '/autosave' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { config } = JSON.parse(body);
        if (!config) {
          res.writeHead(400);
          res.end('Missing config');
          return;
        }

        const autosaveData = {
          id: '_autosave',
          savedAt: new Date().toISOString(),
          config
        };

        writeJSON(path.join(versionsDir, '_autosave.json'), autosaveData);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, savedAt: autosaveData.savedAt }));
      } catch (e) {
        res.writeHead(500);
        res.end('Autosave failed: ' + e.message);
      }
    });
    return;
  }

  // ── GET /autosave — 자동저장 데이터 로드 ──
  if (url.pathname === '/autosave' && req.method === 'GET') {
    try {
      const data = readJSON(path.join(versionsDir, '_autosave.json'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data || { id: '_autosave', savedAt: null, config: null }));
    } catch (e) {
      res.writeHead(500);
      res.end('Load autosave failed: ' + e.message);
    }
    return;
  }

  // ══════════════════════════════════════
  //  CAPTURE / EXPORT
  // ══════════════════════════════════════

  // ── GET /capture?slide=X&theme=Y&ratio=Z — 슬라이드 PNG 캡처 ──
  if (url.pathname === '/capture') {
    const slideId = url.searchParams.get('slide');
    const theme = url.searchParams.get('theme') || 'dark';
    const ratio = url.searchParams.get('ratio') || '16:9';

    if (!slideId) {
      res.writeHead(400);
      res.end('Missing slide parameter');
      return;
    }

    const viewport = VIEWPORTS[ratio] || VIEWPORTS['16:9'];

    try {
      const browser = await chromium.launch();
      const page = await browser.newPage({
        viewport,
        deviceScaleFactor: 4
      });

      const previewUrl = `http://127.0.0.1:3000/preview.html?slide=${slideId}&theme=${theme}&ratio=${encodeURIComponent(ratio)}`;
      await page.goto(previewUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const ratioTag = ratio.replace(':', 'x');
      const exportSubDir = path.join(outputDir, `${ratioTag}_${theme}`);
      if (!fs.existsSync(exportSubDir)) fs.mkdirSync(exportSubDir, { recursive: true });

      const outputPath = path.join(exportSubDir, `${slideId}.png`);
      await page.screenshot({ path: outputPath, type: 'png' });
      await browser.close();

      const file = fs.readFileSync(outputPath);
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${slideId}_${ratioTag}_${theme}.png"`,
        'Content-Length': file.length
      });
      res.end(file);
    } catch (e) {
      res.writeHead(500);
      res.end('Export failed: ' + e.message);
    }
    return;
  }

  // ── GET /capture-all?version=X&theme=Y&ratio=Z — 전체 덱 일괄 캡처 ──
  if (url.pathname === '/capture-all') {
    const versionId = url.searchParams.get('version');
    const theme = url.searchParams.get('theme') || 'dark';
    const ratio = url.searchParams.get('ratio') || '16:9';

    if (!versionId) {
      res.writeHead(400);
      res.end('Missing version parameter');
      return;
    }

    const viewport = VIEWPORTS[ratio] || VIEWPORTS['16:9'];
    const safeId = sanitizeVersionId(versionId);
    const vData = readJSON(path.join(versionsDir, `${safeId}.json`));

    if (!vData || !vData.config || !vData.config.selected) {
      res.writeHead(404);
      res.end('Version not found');
      return;
    }

    try {
      const browser = await chromium.launch();
      const ratioTag = ratio.replace(':', 'x');
      const exportSubDir = path.join(outputDir, `${safeId}_${ratioTag}_${theme}`);
      if (!fs.existsSync(exportSubDir)) fs.mkdirSync(exportSubDir, { recursive: true });

      const results = [];
      for (let i = 0; i < vData.config.selected.length; i++) {
        const slideId = vData.config.selected[i];
        const page = await browser.newPage({ viewport, deviceScaleFactor: 4 });

        const previewUrl = `http://127.0.0.1:3000/preview.html?slide=${slideId}&theme=${theme}&ratio=${encodeURIComponent(ratio)}`;
        await page.goto(previewUrl, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        const num = String(i + 1).padStart(2, '0');
        const outputPath = path.join(exportSubDir, `${num}_${slideId}.png`);
        await page.screenshot({ path: outputPath, type: 'png' });
        await page.close();
        results.push({ slideId, file: `${num}_${slideId}.png` });
      }

      await browser.close();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, count: results.length, files: results, dir: exportSubDir }));
    } catch (e) {
      res.writeHead(500);
      res.end('Batch export failed: ' + e.message);
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Export server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET  /versions              — 전체 버전 목록');
  console.log('  POST /save-version          — 이름 지정 버전 저장');
  console.log('  DELETE /delete-version?id=X  — 버전 삭제');
  console.log('  POST /autosave              — 자동저장');
  console.log('  GET  /autosave              — 자동저장 로드');
  console.log('  GET  /capture?slide=X&theme=Y&ratio=Z — PNG 캡처');
  console.log('  GET  /capture-all?version=X&theme=Y&ratio=Z — 전체 덱 캡처');
});
