// utils/audio.js - 意大利语音频播放工具

let _audioCtx = null;

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
 * @param {number} id
 */
function playItalian(id) {
  _play(`/audio/${id}.mp3`, (e) => {
    console.warn(`音频播放失败 [${id}]:`, e);
  });
}

/**
 * 通过 Google TTS 在线播放任意意大利语文本
 * 用于 learn 页等没有预录音频的场景
 * 注意：需要在小程序后台合法域名添加 https://translate.google.com
 * @param {string} text - 意大利语文本
 */
function playText(text) {
  const encoded = encodeURIComponent(text);
  const url = `https://italian-translate.jellyzen.fun/tts?text=${encoded}&lang=it`;
  _play(url, (e) => {
    console.warn(`在线 TTS 失败 [${text}]:`, e);
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

module.exports = { playItalian, playText, stopAudio };
