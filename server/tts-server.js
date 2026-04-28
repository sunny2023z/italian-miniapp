const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;
const ALLOWED_LANGS = ['it', 'en', 'zh-CN', 'fr', 'de', 'es', 'ja', 'ko'];

// ── 内存缓存 ──────────────────────────────────────────────
const translateCache = new Map(); // key: `${from}:${to}:${text}` → result string
const ttsCache = new Map();       // key: `${lang}:${text}` → Buffer

// 通用 HTTPS GET，返回 Promise<{status, body}>
function httpsGet(reqUrl, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://translate.google.com/',
        ...headers,
      }
    };
    https.get(reqUrl, options, (res) => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // ── 健康检查 ──────────────────────────────────────────
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      time: new Date().toISOString(),
      cache: { translate: translateCache.size, tts: ttsCache.size },
    }));
    return;
  }

  // ── TTS 语音合成 ───────────────────────────────────────
  if (pathname === '/tts') {
    const { text, lang = 'it', speed = '0.8' } = parsed.query;

    if (!text) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'text 参数不能为空' }));
      return;
    }
    if (!ALLOWED_LANGS.includes(lang)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '不支持的语言' }));
      return;
    }

    const cacheKey = `${lang}:${text}`;
    // 命中缓存直接返回
    if (ttsCache.has(cacheKey)) {
      const body = ttsCache.get(cacheKey);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'X-Cache': 'HIT',
      });
      res.end(body);
      return;
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=gtx&ttsspeed=${speed}`;
    try {
      const { status, body } = await httpsGet(ttsUrl);
      if (status !== 200) throw new Error(`Google TTS 返回 ${status}`);
      // 存入缓存（限制最大 500 条，超出清最旧的）
      if (ttsCache.size >= 500) ttsCache.delete(ttsCache.keys().next().value);
      ttsCache.set(cacheKey, body);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'X-Cache': 'MISS',
      });
      res.end(body);
    } catch (e) {
      console.error('TTS 失败:', e.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── 翻译接口 ───────────────────────────────────────────
  if (pathname === '/translate') {
    const { text, from = 'zh-CN', to = 'it' } = parsed.query;

    if (!text) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'text 参数不能为空' }));
      return;
    }

    const cacheKey = `${from}:${to}:${text}`;
    // 命中缓存直接返回
    if (translateCache.has(cacheKey)) {
      const result = translateCache.get(cacheKey);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache': 'HIT',
      });
      res.end(JSON.stringify({ result, from, to, original: text }));
      return;
    }

    const translateUrl = `https://translate.google.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    try {
      const { status, body } = await httpsGet(translateUrl);
      if (status !== 200) throw new Error(`Google 翻译返回 ${status}`);
      const data = JSON.parse(body.toString());
      const result = data[0].map(seg => seg[0]).join('');
      // 存入缓存（限制最大 1000 条）
      if (translateCache.size >= 1000) translateCache.delete(translateCache.keys().next().value);
      translateCache.set(cacheKey, result);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache': 'MISS',
      });
      res.end(JSON.stringify({ result, from, to, original: text }));
    } catch (e) {
      console.error('翻译失败:', e.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`🎵 服务已启动，端口 ${PORT}`);
  console.log(`   健康检查:  http://localhost:${PORT}/health`);
  console.log(`   TTS 接口:  http://localhost:${PORT}/tts?text=Ciao&lang=it`);
  console.log(`   翻译接口:  http://localhost:${PORT}/translate?text=你好&from=zh-CN&to=it`);
});
