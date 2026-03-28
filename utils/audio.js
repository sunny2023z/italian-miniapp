// utils/audio.js - 意大利语音频播放工具

const SERVER = 'https://italian-translate.jellyzen.fun';

let _audioCtx = null;

// 本地 TTS 缓存：text → 本地临时文件路径
const _ttsCache = {};

function _play(src, onError) {
  if (_audioCtx) {
    _audioCtx.stop();
    _audioCtx.destroy();
    _audioCtx = null;
  }
  const ctx = wx.createInnerAudioContext();
  _audioCtx = ctx;
  ctx.src = src;
  if (onError) ctx.onError(onError);
  ctx.play();
}

/**
 * 播放指定 id 的本地预录音频（对应 phrases.js 词条）
 */
function playItalian(id) {
  _play(`/audio/${id}.mp3`, (e) => {
    console.warn(`音频播放失败 [${id}]:`, e);
  });
}

/**
 * 播放任意意大利语文本（优先本地缓存，否则实时请求）
 * @param {string} text
 */
function playText(text) {
  if (!text) return;
  // 命中本地缓存，直接播放
  if (_ttsCache[text]) {
    _play(_ttsCache[text]);
    return;
  }
  // 未缓存，实时请求
  const url = `${SERVER}/tts?text=${encodeURIComponent(text)}&lang=it`;
  _play(url, (e) => {
    console.warn(`在线 TTS 失败 [${text}]:`, e);
  });
}

/**
 * 预加载 TTS 音频到本地缓存（翻译完成后调用，用户点击前就下载好）
 * @param {string} text - 意大利语文本
 */
function prefetchTTS(text) {
  if (!text || _ttsCache[text]) return; // 已缓存则跳过
  const url = `${SERVER}/tts?text=${encodeURIComponent(text)}&lang=it`;
  wx.downloadFile({
    url,
    success: (res) => {
      if (res.statusCode === 200) {
        _ttsCache[text] = res.tempFilePath;
      }
    },
    fail: () => {}, // 静默失败，不影响正常播放
  });
}

/**
 * 停止当前播放
 */
function stopAudio() {
  if (_audioCtx) {
    _audioCtx.stop();
    _audioCtx.destroy();
    _audioCtx = null;
  }
}

module.exports = { playItalian, playText, prefetchTTS, stopAudio };
