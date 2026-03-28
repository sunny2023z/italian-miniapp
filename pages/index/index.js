// pages/index/index.js
const { ALL_PHRASES, CATEGORIES } = require('../../data/phrases');
const { playItalian, playText } = require('../../utils/audio');

const SERVER = 'http://43.162.83.109:3000';

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

  // 实时输入：只过滤词条，不触发翻译
  onSearchInput(e) {
    const val = e.detail.value;
    this.setData({ searchText: val, translateResult: '' }, () => this._applyFilter());
  },

  // 回车/确认：触发翻译
  onSearchConfirm(e) {
    const val = e.detail.value;
    if (val.trim()) this._doTranslate(val.trim());
  },

  _doTranslate(text) {
    this.setData({ translateLoading: true, translateResult: '' });
    const isChinese = /[\u4e00-\u9fa5]/.test(text);
    wx.request({
      url: `${SERVER}/translate`,
      data: { text, from: isChinese ? 'zh-CN' : 'it', to: isChinese ? 'it' : 'zh-CN' },
      success: (res) => {
        if (res.statusCode === 200 && res.data.result) {
          this.setData({ translateResult: res.data.result });
        }
      },
      fail: () => wx.showToast({ title: '翻译失败，请检查网络', icon: 'none' }),
      complete: () => this.setData({ translateLoading: false }),
    });
  },

  onSearchClear() {
    this.setData({ searchText: '', translateResult: '', translateLoading: false }, () => this._applyFilter());
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
