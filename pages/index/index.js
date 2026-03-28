// pages/index/index.js
const { ALL_PHRASES, CATEGORIES } = require('../../data/phrases');
const { playItalian, stopAudio } = require('../../utils/audio');

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
    ttsPlaying: false,
  },

  _audioCtx: null,

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
        p.pronunciation.includes(q)
      );
    }

    this.setData({ filteredPhrases: list });
  },

  onCatTap(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const selectedCat = this.data.selectedCat === id ? -1 : id;
    this.setData({ selectedCat }, () => this._applyFilter());
  },

  onSearchInput(e) {
    this.setData({ searchText: e.detail.value }, () => this._applyFilter());
  },

  onSearchClear() {
    this.setData({ searchText: '' }, () => this._applyFilter());
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
    const pronunciation = e.currentTarget.dataset.pronunciation;
    // 播放本地预录音频，id 对应 audio/{id}.mp3
    playItalian(id);
  },
});
