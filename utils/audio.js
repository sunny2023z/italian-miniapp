// utils/audio.js - 意大利语音频播放工具（全走在线 TTS + 本地缓存）

const SERVER = 'https://italian-translate.jellyzen.fun';

let _audioCtx = null;

// 持久缓存：text → 本地临时文件路径（会话内有效）
const _ttsCache = {};

function _play(src, onError) {
  if (_audioCtx) {
    try { _audioCtx.stop(); } catch (e) {}
    try { _audioCtx.destroy(); } catch (e) {}
    _audioCtx = null;
  }

  const ctx = wx.createInnerAudioContext();
  _audioCtx = ctx;
  ctx.autoplay = false;
  ctx.src = src;

  ctx.onCanplay(() => {
    ctx.play();
  });

  // 兜底：300ms 后没触发 canplay 则强制 play
  const fallbackTimer = setTimeout(() => {
    try { ctx.play(); } catch (e) {}
  }, 300);

  ctx.onPlay(() => {
    clearTimeout(fallbackTimer);
  });

  ctx.onError((e) => {
    clearTimeout(fallbackTimer);
    console.warn(`音频播放失败 [${src}]:`, e.errMsg || e);
    if (onError) onError(e);
  });

  ctx.onEnded(() => {
    try { ctx.destroy(); } catch (e) {}
    if (_audioCtx === ctx) _audioCtx = null;
  });
}

/**
 * 播放任意意大利语文本
 * 优先命中会话缓存（已下载的 tempFilePath），否则直接用 TTS URL 播放
 * 播放成功后异步下载缓存，下次秒播
 * @param {string} text
 */
function playText(text) {
  if (!text || !text.trim()) return;
  const key = text.trim();

  if (_ttsCache[key]) {
    _play(_ttsCache[key]);
    return;
  }

  const url = `${SERVER}/tts?text=${encodeURIComponent(key)}&lang=it`;
  // 先直接播放（streaming），同时异步下载缓存备用
  _play(url, (e) => {
    console.warn(`TTS 失败 [${key}]:`, e);
  });

  // 后台缓存，下次秒播
  wx.downloadFile({
    url,
    success: (res) => {
      if (res.statusCode === 200) {
        _ttsCache[key] = res.tempFilePath;
      }
    },
    fail: () => {},
  });
}

/**
 * 预加载 TTS 到缓存（翻译完成后调用）
 * @param {string} text
 */
function prefetchTTS(text) {
  if (!text || _ttsCache[text.trim()]) return;
  const key = text.trim();
  const url = `${SERVER}/tts?text=${encodeURIComponent(key)}&lang=it`;
  wx.downloadFile({
    url,
    success: (res) => {
      if (res.statusCode === 200) {
        _ttsCache[key] = res.tempFilePath;
      }
    },
    fail: () => {},
  });
}

/**
 * 停止当前播放
 */
function stopAudio() {
  if (_audioCtx) {
    try { _audioCtx.stop(); } catch (e) {}
    try { _audioCtx.destroy(); } catch (e) {}
    _audioCtx = null;
  }
}

// 兼容旧调用：playItalian 现在也走 TTS
// phrases.js 里每个词条都有 italian 字段，调用方改成传文本即可
// 但为了不改所有调用处，这里保留签名，text 传意大利语文本
function playItalian(text) {
  if (typeof text === 'number') {
    // 旧代码传 id，忽略（预录音频已废弃）
    console.warn('playItalian(id) 已废弃，请改为 playText(italianText)');
    return;
  }
  playText(text);
}

module.exports = { playItalian, playText, prefetchTTS, stopAudio };
