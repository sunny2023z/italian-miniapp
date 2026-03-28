const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

// 允许的语言白名单
const ALLOWED_LANGS = ['it', 'en', 'zh-CN', 'fr', 'de', 'es', 'ja', 'ko'];

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 健康检查
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }

  // 只处理 /tts 路由
  if (!req.url.startsWith('/tts')) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const parsed = url.parse(req.url, true);
  const text = parsed.query.text;
  const lang = parsed.query.lang || 'it';
  const speed = parsed.query.speed || '0.8';

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

  const encoded = encodeURIComponent(text);
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=gtx&ttsspeed=${speed}`;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Referer': 'https://translate.google.com/',
    }
  };

  https.get(ttsUrl, options, (ttsRes) => {
    if (ttsRes.statusCode !== 200) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Google TTS 返回 ${ttsRes.statusCode}` }));
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400', // 音频缓存 1 天
    });
    ttsRes.pipe(res);
  }).on('error', (e) => {
    console.error('TTS 请求失败:', e.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '请求 Google TTS 失败' }));
  });
});

server.listen(PORT, () => {
  console.log(`🎵 TTS 中转服务已启动，端口 ${PORT}`);
  console.log(`   健康检查: http://localhost:${PORT}/health`);
  console.log(`   测试接口: http://localhost:${PORT}/tts?text=Ciao&lang=it`);
});
