// utils/audio.js - 意大利语音频播放工具
// 策略：优先播放本地打包音频，找不到则走在线 TTS + 缓存

const SERVER = 'https://italian-translate.jellyzen.fun';
const { ALL_PHRASES } = require('../data/phrases');

// 建立 italian文本 → id 的索引（速查页102条 + 学习页83条）
const _textToId = {};
ALL_PHRASES.forEach(p => { _textToId[p.italian.trim()] = p.id; });

// 学习页额外词汇（id 从102起）
const _learnAudioMap = {"Uno":105,"Mi chiamo...":102,"Arrivederci":104,"Piacere":103,"Due":106,"Tre":107,"Sette":111,"Cinque":109,"Quattro":108,"Sei":110,"Nove":113,"Dieci":114,"Buon appetito":115,"È delizioso":116,"Otto":112,"La stazione":119,"Cameriere":117,"La cassa":121,"Il metro":120,"Che ora è?":123,"Check-in/Check-out":122,"La settimana":126,"Domani":125,"Oggi":124,"Fa caldo":129,"Piove":131,"Fa freddo":130,"Il mese":127,"Che tempo fa?":128,"Il fratello":136,"Il padre":134,"La famiglia":133,"La primavera":132,"La madre":135,"Rosso":139,"Blu":140,"La sorella":137,"I nonni":138,"Verde":141,"Piccolo":143,"Ho bisogno di aiuto":145,"Chiami un medico!":146,"Grande":144,"Nero / Bianco":142,"Il binario":150,"In ritardo":151,"Mi fa male...":147,"Andata e ritorno":149,"La farmacia":148,"avere":155,"essere":154,"fare":156,"Devo cambiare?":153,"Il capolinea":152,"potere":159,"andare":157,"la porta":161,"venire":158,"il libro":160,"con":166,"il ragazzo":162,"la ragazza":163,"le porte":165,"i libri":164,"per":167,"dovere":169,"Posso?":171,"sapere":170,"volere":168,"grande":174,"Devo":172,"buono/buona":176,"piccolo/piccola":175,"bello/bella":173,"sono andato":181,"vecchio/vecchia":178,"ho bevuto":180,"nuovo/nuova":177,"ho mangiato":179,"ieri":184,"ho fatto":183,"ho visto":182};
Object.entries(_learnAudioMap).forEach(([text, id]) => { _textToId[text] = id; });

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

  // 1. 本地打包音频（分包内）
  const id = _textToId[key];
  if (id !== undefined) {
    _playLocal(`/audio-pkg/audio/${id}.mp3`);
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
