// pages/index/index.js
const { ALL_PHRASES, CATEGORIES } = require('../../data/phrases');
const { playItalian, playText, prefetchTTS } = require('../../utils/audio');

const SERVER = 'https://italian-translate.jellyzen.fun';
const TRANSLATE_DEBOUNCE = 400;

// 冠词列表（蓝色）
const ARTICLES = new Set([
  'il','lo','la','i','gli','le',
  'un','uno','una','un\'',
  'del','dello','della','dei','degli','delle',
  'al','allo','alla','ai','agli','alle',
  'dal','dallo','dalla','dai','dagli','dalle',
  'nel','nello','nella','nei','negli','nelle',
  'sul','sullo','sulla','sui','sugli','sulle',
  'col','con',
]);

// 常用动词列表（红色）
const VERBS = new Set([
  'vorrei','voglio','vuoi','vuole','vogliamo','volete','vogliono',
  'sono','sei','è','siamo','siete','sono',
  'ho','hai','ha','abbiamo','avete','hanno',
  'posso','puoi','può','possiamo','potete','possono',
  'vado','vai','va','andiamo','andate','vanno',
  'parla','parli','parlate','parliamo','parlo',
  'capisco','capisce',
  'giri','gira','vada','vai',
  'ripetere','pagare','chiamare','arrivo','arrivi','arriva',
  'consiglia','consigli',
  'è','mi','ci','si',
]);

/**
 * 把意大利语句子拆成带颜色 type 的 token 数组
 * type: 'verb'(红) | 'article'(蓝) | 'noun'(默认深色)
 */
function tokenize(italian) {
  // 按空格和标点分词，保留标点
  const parts = italian.split(/(\s+|[,!?./…']+)/);
  return parts.map(part => {
    if (!part || /^\s+$/.test(part)) return { text: part, type: 'space' };
    const lower = part.toLowerCase().replace(/[',!?.…]/g, '');
    if (VERBS.has(lower)) return { text: part, type: 'verb' };
    if (ARTICLES.has(lower)) return { text: part, type: 'article' };
    return { text: part, type: 'noun' };
  }).filter(t => t.text !== '');
}

Page({
  data: {
    categories: CATEGORIES,
    filteredPhrases: [],
    selectedCat: -1,
    searchText: '',
    favorites: {},
    translateResult: '',
    translateItalian: '',
    translateChinese: '',
    translateFaved: false,
    translateLoading: false,
  },

  _timer: null,

  onLoad() {
    this._loadState();
    this._applyFilter();
  },

  onShow() {
    this._loadState();
    this._applyFilter();
  },

  _loadState() {
    const favorites = wx.getStorageSync('italian_favorites') || {};
    this.setData({ favorites });
  },

  _applyFilter() {
    const { selectedCat, searchText, favorites } = this.data;
    let list = ALL_PHRASES.map(p => ({
      ...p,
      isFav: !!favorites[p.id],
      tokens: tokenize(p.italian),
    }));
    if (selectedCat >= 0) {
      list = list.filter(p => p.cat === selectedCat);
    }
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      list = list.filter(p =>
        p.italian.toLowerCase().includes(q) ||
        p.chinese.includes(q) ||
        p.pronunciation.toLowerCase().includes(q)
      );
    }
    this.setData({ filteredPhrases: list });
  },

  onSearchInput(e) {
    const val = e.detail.value;
    this.setData({
      searchText: val,
      translateResult: '', translateItalian: '', translateChinese: '', translateFaved: false,
    }, () => this._applyFilter());
    if (this._timer) clearTimeout(this._timer);
    if (!val.trim()) { this.setData({ translateLoading: false }); return; }
    this.setData({ translateLoading: true });
    this._timer = setTimeout(() => this._doTranslate(val.trim()), TRANSLATE_DEBOUNCE);
  },

  onSearchConfirm(e) {
    const val = e.detail.value;
    if (!val.trim()) return;
    if (this._timer) clearTimeout(this._timer);
    this._doTranslate(val.trim());
  },

  onSearchClear() {
    if (this._timer) clearTimeout(this._timer);
    this.setData({
      searchText: '',
      translateResult: '', translateItalian: '', translateChinese: '',
      translateFaved: false, translateLoading: false,
    }, () => this._applyFilter());
  },

  _doTranslate(text) {
    this.setData({ translateLoading: true });
    const isChinese = /[\u4e00-\u9fa5]/.test(text);
    const from = isChinese ? 'zh-CN' : 'it';
    const to = isChinese ? 'it' : 'zh-CN';
    wx.request({
      url: `${SERVER}/translate`,
      data: { text, from, to },
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200 && res.data.result) {
          const result = res.data.result;
          const italian = isChinese ? result : text;
          this.setData({
            translateResult: result,
            translateItalian: italian,
            translateChinese: isChinese ? text : result,
            translateFaved: false,
          });
          prefetchTTS(italian);
        }
      },
      fail: (err) => console.error('[translate] 失败:', err),
      complete: () => this.setData({ translateLoading: false }),
    });
  },

  onPlayTranslateResult() {
    const { translateItalian } = this.data;
    if (translateItalian) playText(translateItalian);
  },

  onFavTranslate() {
    const { translateItalian, translateChinese, translateFaved } = this.data;
    if (!translateItalian) return;
    const key = `custom_${translateItalian}`;
    const customFavs = wx.getStorageSync('italian_custom_favs') || {};
    if (translateFaved) {
      delete customFavs[key];
      this.setData({ translateFaved: false });
      wx.showToast({ title: '已取消收藏', icon: 'none', duration: 1200 });
    } else {
      customFavs[key] = { italian: translateItalian, chinese: translateChinese, custom: true };
      this.setData({ translateFaved: true });
      wx.showToast({ title: '已收藏 ⭐', icon: 'none', duration: 1200 });
    }
    wx.setStorageSync('italian_custom_favs', customFavs);
  },

  onCatTap(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const selectedCat = this.data.selectedCat === id ? -1 : id;
    this.setData({ selectedCat }, () => this._applyFilter());
  },

  onCardTap(e) {
    const text = e.currentTarget.dataset.italian;
    if (text) playText(text);
  },

  onToggleFav(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const favorites = { ...this.data.favorites };
    if (favorites[id]) { delete favorites[id]; } else { favorites[id] = true; }
    wx.setStorageSync('italian_favorites', favorites);
    this.setData({ favorites }, () => this._applyFilter());
    wx.showToast({ title: favorites[id] ? '已收藏 ⭐' : '已取消收藏', icon: 'none', duration: 1200 });
  },
});
