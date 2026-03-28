// utils/audio.js - 意大利语音频播放工具
// 策略：先 downloadFile 到本地，再播放本地文件，彻底避开真机 src 直接请求远端的问题

const SERVER = 'https://italian-translate.jellyzen.fun';

let _audioCtx = null;
const _ttsCache = {};   // text → 本地 tempFilePath
const _pending = {};    // text → true（正在下载中，防重复）

function _playLocal(filePath) {
  console.log('[audio] _playLocal:', filePath);

  if (_audioCtx) {
    try { _audioCtx.stop(); } catch (e) {}
    try { _audioCtx.destroy(); } catch (e) {}
    _audioCtx = null;
  }

  const ctx = wx.createInnerAudioContext();
  _audioCtx = ctx;
  ctx.src = filePath;

  ctx.onCanplay(() => {
    console.log('[audio] onCanplay, play()');
    ctx.play();
  });

  ctx.onPlay(() => {
    console.log('[audio] playing');
  });

  ctx.onError((e) => {
    console.error('[audio] error:', JSON.stringify(e));
  });

  ctx.onEnded(() => {
    try { ctx.destroy(); } catch (e) {}
    if (_audioCtx === ctx) _audioCtx = null;
  });

  // 兜底
  setTimeout(() => {
    try { ctx.play(); } catch (e) {}
  }, 400);
}

function playText(text) {
  if (!text || !text.trim()) return;
  const key = text.trim();
  console.log('[audio] playText:', key);

  // 已有本地缓存，直接播
  if (_ttsCache[key]) {
    _playLocal(_ttsCache[key]);
    return;
  }

  // 正在下载中，等它
  if (_pending[key]) {
    console.log('[audio] already downloading, waiting...');
    return;
  }

  // 下载到本地再播
  const url = `${SERVER}/tts?text=${encodeURIComponent(key)}&lang=it`;
  console.log('[audio] downloading:', url);
  _pending[key] = true;

  // 先给个 loading 提示（可选）
  wx.showLoading({ title: '加载发音...', mask: false });

  wx.downloadFile({
    url,
    success: (res) => {
      wx.hideLoading();
      console.log('[audio] download success, status:', res.statusCode, 'path:', res.tempFilePath);
      delete _pending[key];
      if (res.statusCode === 200) {
        _ttsCache[key] = res.tempFilePath;
        _playLocal(res.tempFilePath);
      } else {
        console.error('[audio] download status not 200:', res.statusCode);
      }
    },
    fail: (e) => {
      wx.hideLoading();
      delete _pending[key];
      console.error('[audio] downloadFile failed:', JSON.stringify(e));
    },
  });
}

function prefetchTTS(text) {
  if (!text || _ttsCache[text.trim()] || _pending[text.trim()]) return;
  const key = text.trim();
  const url = `${SERVER}/tts?text=${encodeURIComponent(key)}&lang=it`;
  _pending[key] = true;
  wx.downloadFile({
    url,
    success: (res) => {
      delete _pending[key];
      if (res.statusCode === 200) _ttsCache[key] = res.tempFilePath;
    },
    fail: () => { delete _pending[key]; },
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
    console.warn('[audio] playItalian(id) 已废弃');
    return;
  }
  playText(text);
}

module.exports = { playItalian, playText, prefetchTTS, stopAudio };
