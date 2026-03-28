// scripts/generate-audio.js
// 批量从 TTS 服务器下载音频到 audio/{id}.mp3

const https = require('https');
const fs = require('fs');
const path = require('path');
const { ALL_PHRASES } = require('../data/phrases');

const SERVER = 'https://italian-translate.jellyzen.fun';
const OUT_DIR = path.join(__dirname, '../audio');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

let done = 0;
let failed = [];

function download(id, text) {
  return new Promise((resolve) => {
    const url = `${SERVER}/tts?text=${encodeURIComponent(text)}&lang=it`;
    const dest = path.join(OUT_DIR, `${id}.mp3`);

    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        failed.push({ id, text, status: res.statusCode });
        resolve();
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        done++;
        process.stdout.write(`\r[${done}/${ALL_PHRASES.length}] ${text.slice(0, 30)}`);
        resolve();
      });
    }).on('error', (e) => {
      file.close();
      try { fs.unlinkSync(dest); } catch (_) {}
      failed.push({ id, text, error: e.message });
      resolve();
    });
  });
}

async function main() {
  console.log(`开始下载 ${ALL_PHRASES.length} 条音频...\n`);
  // 每次并发 5 个，避免服务器压力过大
  for (let i = 0; i < ALL_PHRASES.length; i += 5) {
    const batch = ALL_PHRASES.slice(i, i + 5);
    await Promise.all(batch.map(p => download(p.id, p.italian)));
    // 每批间隔 300ms
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`\n\n✅ 完成 ${done} 条`);
  if (failed.length) {
    console.log(`❌ 失败 ${failed.length} 条:`);
    failed.forEach(f => console.log(`  id=${f.id} "${f.italian}" - ${f.status || f.error}`));
  }
}

main();
