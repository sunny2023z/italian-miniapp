// utils/audio.js - 意大利语音频播放工具
// 策略：优先播放本地打包音频，找不到则走在线 TTS + 缓存

const SERVER = 'https://italian-translate.jellyzen.fun';
const { ALL_PHRASES } = require('../data/phrases');

// 建立 italian文本 → id 的索引，用于快速查本地文件
const _textToId = {};
ALL_PHRASES.forEach(p => { _textToId[p.italian.trim()] = p.id; });

let _audioCtx = null;
const _ttsCache = {};  // text → downloadFile 缓存的 tempFilePath
const _pending = {};

function _playLocal(filePath) {
  if (_audioCtx) {
    try { _audioCtx.stop(); } catch (e) {}
    try { _audioCtx.destroy(); } catch (e) {}
    _audioCtx = null;
  }

  try {
    wx.setInnerAudioOption({ speakerOn: true, obeyMuteSwitch: false });
  } catch (e) {}

  const ctx = wx.createInnerAudioContext();
  _audioCtx = ctx;
  ctx.obeyMuteSwitch = false;
  ctx.src = filePath;

  ctx.onCanplay(() => { ctx.play(); });

  ctx.onError((e) => {
    console.error('[audio] error:', JSON.stringify(e));
  });

  ctx.onEnded(() => {
    try { ctx.destroy(); } catch (e) {}
    if (_audioCtx === ctx) _audioCtx = null;
  });

  // 兜底
  setTimeout(() => { try { ctx.play(); } catch (e) {} }, 400);
}

function _downloadAndPlay(key) {
  if (_pending[key]) return;
  _pending[key] = true;
  const url = `${SERVER}/tts?text=${encodeURIComponent(key)}&lang=it`;
  wx.downloadFile({
    url,
    success: (res) => {
      delete _pending[key];
      if (res.statusCode === 200) {
        _ttsCache[key] = res.tempFilePath;
        _playLocal(res.tempFilePath);
      }
    },
    fail: (e) => {
      delete _pending[key];
      console.error('[audio] downloadFile failed:', JSON.stringify(e));
    },
  });
}

/**
 * 播放意大利语文本
 * 优先级：本地打包音频 > 会话缓存 > 在线 TTS 下载
 */
function playText(text) {
  if (!text || !text.trim()) return;
  const key = text.trim();

  // 1. 本地打包音频（速查词条）
  const id = _textToId[key];
  if (id !== undefined) {
    _playLocal(`/audio/${id}.mp3`);
    return;
  }

  // 2. 会话缓存（翻译结果等动态内容）
  if (_ttsCache[key]) {
    _playLocal(_ttsCache[key]);
    return;
  }

  // 3. 在线 TTS 下载
  _downloadAndPlay(key);
}

/**
 * 预加载到会话缓存（用于动态翻译结果）
 */
function prefetchTTS(text) {
  if (!text) return;
  const key = text.trim();
  // 本地有包就不需要预加载
  if (_textToId[key] !== undefined) return;
  if (_ttsCache[key] || _pending[key]) return;
  _pending[key] = true;
  const url = `${SERVER}/tts?text=${encodeURIComponent(key)}&lang=it`;
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
    console.warn('[audio] playItalian(id) 已废弃，请传意大利语文本');
    return;
  }
  playText(text);
}

module.exports = { playItalian, playText, prefetchTTS, stopAudio };
