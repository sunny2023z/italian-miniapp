// pages/index/index.js
const { ALL_PHRASES, CATEGORIES } = require('../../data/phrases');
const { playItalian, playText } = require('../../utils/audio');

const SERVER = 'http://43.162.83.109:3000';
const TRANSLATE_DEBOUNCE = 600; // ms

Page({
  data: {
    categories: CATEGORIES,
    filteredPhrases: [],
    selectedCat: -1,
    searchText: '',
    expandedId: -1,
    learned: {},
    favorites: {},
    learnedCount: 0,
    favCount: 0,
    translateResult: '',
    translateLoading: false,
  },

  _translateTimer: null,

  onLoad() {
    this._loadState();
    this._applyFilter();
  },

  onShow() {
    this._loadState();
    this._applyFilter();
  },

  _loadState() {
    const learned = wx.getStorageSync('italian_learned') || {};
    const favorites = wx.getStorageSync('italian_favorites') || {};
    this.setData({
      learned,
      favorites,
      learnedCount: Object.keys(learned).length,
      favCount: Object.keys(favorites).length,
    });
  },

  // 搜索：中文、意大利语、发音全部模糊匹配
  _applyFilter() {
    const { selectedCat, searchText, learned, favorites } = this.data;
    let list = ALL_PHRASES.map((p) => ({
      ...p,
      isLearned: !!learned[p.id],
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

  // 翻译（防抖）：自动判断方向
  _scheduleTranslate(text) {
    if (this._translateTimer) clearTimeout(this._translateTimer);
    if (!text.trim()) {
      this.setData({ translateResult: '', translateLoading: false });
      return;
    }
    this.setData({ translateLoading: true });
    this._translateTimer = setTimeout(() => {
      const isChinese = /[\u4e00-\u9fa5]/.test(text);
      const from = isChinese ? 'zh-CN' : 'it';
      const to = isChinese ? 'it' : 'zh-CN';
      wx.request({
        url: `${SERVER}/translate`,
        data: { text: text.trim(), from, to },
        success: (res) => {
          if (res.statusCode === 200 && res.data.result) {
            this.setData({ translateResult: res.data.result });
          } else {
            this.setData({ translateResult: '' });
          }
        },
        fail: () => this.setData({ translateResult: '' }),
        complete: () => this.setData({ translateLoading: false }),
      });
    }, TRANSLATE_DEBOUNCE);
  },

  // 输入框变化：搜索 + 翻译同时跑
  onSearchInput(e) {
    const val = e.detail.value;
    this.setData({ searchText: val }, () => this._applyFilter());
    this._scheduleTranslate(val);
  },

  onSearchClear() {
    if (this._translateTimer) clearTimeout(this._translateTimer);
    this.setData({ searchText: '', translateResult: '', translateLoading: false }, () => this._applyFilter());
  },

  onPlayTranslateResult() {
    const text = this.data.translateResult;
    if (!text) return;
    // 如果翻译结果是意大利语就朗读，否则也朗读（用 it 语音）
    const isChinese = /[\u4e00-\u9fa5]/.test(this.data.searchText);
    playText(isChinese ? text : this.data.searchText);
  },

  // ── 速查列表 ──────────────────────────────────────────
  onCatTap(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const selectedCat = this.data.selectedCat === id ? -1 : id;
    this.setData({ selectedCat }, () => this._applyFilter());
  },

  onCardTap(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const expandedId = this.data.expandedId === id ? -1 : id;
    this.setData({ expandedId });
  },

  onMarkLearned(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const learned = { ...this.data.learned };
    if (learned[id]) {
      delete learned[id];
    } else {
      learned[id] = true;
    }
    wx.setStorageSync('italian_learned', learned);
    this.setData({ learned, learnedCount: Object.keys(learned).length }, () => this._applyFilter());
    wx.showToast({ title: learned[id] ? '已标记学会 ✓' : '已取消', icon: 'none', duration: 1500 });
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
    this.setData({ favorites, favCount: Object.keys(favorites).length }, () => this._applyFilter());
    wx.showToast({ title: favorites[id] ? '已收藏 ⭐' : '已取消收藏', icon: 'none', duration: 1500 });
  },

  onTTSTap(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    playItalian(id);
  },
});
