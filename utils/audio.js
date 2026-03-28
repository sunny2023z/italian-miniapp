// utils/audio.js - 意大利语音频播放工具

const SERVER = 'https://italian-translate.jellyzen.fun';

let _audioCtx = null;

// 本地 TTS 缓存：text → 本地临时文件路径
const _ttsCache = {};

function _play(src, onError) {
  // 销毁上一个实例
  if (_audioCtx) {
    try { _audioCtx.stop(); } catch (e) {}
    try { _audioCtx.destroy(); } catch (e) {}
    _audioCtx = null;
  }

  const ctx = wx.createInnerAudioContext();
  _audioCtx = ctx;
  ctx.autoplay = false;
  ctx.src = src;

  // 新版基础库（3.x）需要等 canplay 后再 play，否则静默失败
  ctx.onCanplay(() => {
    ctx.play();
  });

  // 兜底：部分本地 mp3 不触发 canplay，300ms 后强制 play
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
 * 播放指定 id 的本地预录音频（对应 phrases.js 词条）
 */
function playItalian(id) {
  _play(`/audio/${id}.mp3`);
}

/**
 * 播放任意意大利语文本（优先本地缓存，否则实时请求）
 * @param {string} text
 */
function playText(text) {
  if (!text || !text.trim()) return;
  const key = text.trim();
  // 命中本地缓存，直接播放
  if (_ttsCache[key]) {
    _play(_ttsCache[key]);
    return;
  }
  // 未缓存，实时请求
  const url = `${SERVER}/tts?text=${encodeURIComponent(key)}&lang=it`;
  _play(url, (e) => {
    console.warn(`在线 TTS 失败 [${key}]:`, e);
  });
}

/**
 * 预加载 TTS 音频到本地缓存（翻译完成后调用，用户点击前就下载好）
 * @param {string} text - 意大利语文本
 */
function prefetchTTS(text) {
  if (!text || _ttsCache[text]) return;
  const url = `${SERVER}/tts?text=${encodeURIComponent(text)}&lang=it`;
  wx.downloadFile({
    url,
    success: (res) => {
      if (res.statusCode === 200) {
        _ttsCache[text] = res.tempFilePath;
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

module.exports = { playItalian, playText, prefetchTTS, stopAudio };
