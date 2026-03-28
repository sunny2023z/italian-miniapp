// utils/audio.js - 意大利语音频播放工具（全走在线 TTS + 会话缓存）

const SERVER = 'https://italian-translate.jellyzen.fun';

let _audioCtx = null;
const _ttsCache = {};

function _play(src) {
  console.log('[audio] _play called, src:', src);

  if (_audioCtx) {
    try { _audioCtx.stop(); } catch (e) {}
    try { _audioCtx.destroy(); } catch (e) {}
    _audioCtx = null;
  }

  const ctx = wx.createInnerAudioContext();
  _audioCtx = ctx;
  ctx.src = src;

  ctx.onCanplay(() => {
    console.log('[audio] onCanplay fired, calling play()');
    ctx.play();
  });

  ctx.onPlay(() => {
    console.log('[audio] onPlay fired — audio is playing');
  });

  ctx.onError((e) => {
    console.error('[audio] onError:', JSON.stringify(e));
  });

  ctx.onEnded(() => {
    console.log('[audio] onEnded');
    try { ctx.destroy(); } catch (e) {}
    if (_audioCtx === ctx) _audioCtx = null;
  });

  // 兜底：500ms 后还没触发 canplay 则强制 play
  setTimeout(() => {
    console.log('[audio] fallback play() after 500ms');
    try { ctx.play(); } catch (e) {
      console.error('[audio] fallback play error:', e);
    }
  }, 500);
}

function playText(text) {
  if (!text || !text.trim()) {
    console.warn('[audio] playText called with empty text');
    return;
  }
  const key = text.trim();
  console.log('[audio] playText:', key);

  if (_ttsCache[key]) {
    console.log('[audio] cache hit, playing local file');
    _play(_ttsCache[key]);
    return;
  }

  const url = `${SERVER}/tts?text=${encodeURIComponent(key)}&lang=it`;
  console.log('[audio] no cache, streaming URL:', url);
  _play(url);

  // 后台缓存
  wx.downloadFile({
    url,
    success: (res) => {
      console.log('[audio] downloadFile success, status:', res.statusCode);
      if (res.statusCode === 200) {
        _ttsCache[key] = res.tempFilePath;
      }
    },
    fail: (e) => {
      console.warn('[audio] downloadFile failed:', JSON.stringify(e));
    },
  });
}

function prefetchTTS(text) {
  if (!text || _ttsCache[text.trim()]) return;
  const key = text.trim();
  const url = `${SERVER}/tts?text=${encodeURIComponent(key)}&lang=it`;
  wx.downloadFile({
    url,
    success: (res) => {
      if (res.statusCode === 200) _ttsCache[key] = res.tempFilePath;
    },
    fail: () => {},
  });
}

function stopAudio() {
  if (_audioCtx) {
    try { _audioCtx.stop(); } catch (e) {}
    try { _audioCtx.destroy(); } catch (e) {}
    _audioCtx = null;
  }
}

function playItalian(text) {
  if (typeof text === 'number') {
    console.warn('[audio] playItalian(id) 已废弃，请改为 playText(italianText)');
    return;
  }
  playText(text);
}

module.exports = { playItalian, playText, prefetchTTS, stopAudio };
