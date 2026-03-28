// pages/index/index.js
const { ALL_PHRASES, CATEGORIES } = require('../../data/phrases');
const { playItalian, playText } = require('../../utils/audio');

const SERVER = 'https://italian-translate.jellyzen.fun';
const TRANSLATE_DEBOUNCE = 800;

Page({
  data: {
    categories: CATEGORIES,
    filteredPhrases: [],
    selectedCat: -1,
    searchText: '',
    favorites: {},
    translateResult: '',
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
    this.setData({ searchText: val, translateResult: '' }, () => this._applyFilter());
    if (this._timer) clearTimeout(this._timer);
    if (!val.trim()) {
      this.setData({ translateLoading: false });
      return;
    }
    this.setData({ translateLoading: true });
    this._timer = setTimeout(() => this._doTranslate(val.trim()), TRANSLATE_DEBOUNCE);
  },

  onSearchClear() {
    if (this._timer) clearTimeout(this._timer);
    this.setData({ searchText: '', translateResult: '', translateLoading: false }, () => this._applyFilter());
  },

  _doTranslate(text) {
    const isChinese = /[\u4e00-\u9fa5]/.test(text);
    const from = isChinese ? 'zh-CN' : 'it';
    const to = isChinese ? 'it' : 'zh-CN';
    console.log('[translate] 请求:', text, from, '->', to);
    wx.request({
      url: `${SERVER}/translate`,
      data: { text, from, to },
      timeout: 10000,
      success: (res) => {
        console.log('[translate] 响应:', res.statusCode, res.data);
        if (res.statusCode === 200 && res.data.result) {
          this.setData({ translateResult: res.data.result });
        }
      },
      fail: (err) => {
        console.error('[translate] 失败:', err);
        wx.showToast({ title: '翻译失败: ' + (err.errMsg || ''), icon: 'none', duration: 3000 });
      },
      complete: () => this.setData({ translateLoading: false }),
    });
  },

  onPlayTranslateResult() {
    const { translateResult, searchText } = this.data;
    if (!translateResult) return;
    const isChinese = /[\u4e00-\u9fa5]/.test(searchText);
    playText(isChinese ? translateResult : searchText);
  },

  onCatTap(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const selectedCat = this.data.selectedCat === id ? -1 : id;
    this.setData({ selectedCat }, () => this._applyFilter());
  },

  onCardTap(e) {
    playItalian(parseInt(e.currentTarget.dataset.id));
  },

  onToggleFav(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const favorites = { ...this.data.favorites };
    if (favorites[id]) {
      delete favorites[id];
    } else {
      favorites[id] = true;
    }
    wx.setStorageSync('italian_favorites', favorites);
    this.setData({ favorites }, () => this._applyFilter());
    wx.showToast({ title: favorites[id] ? '已收藏 ⭐' : '已取消收藏', icon: 'none', duration: 1200 });
  },
});
