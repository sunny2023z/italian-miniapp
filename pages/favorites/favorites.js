// pages/favorites/favorites.js
const { ALL_PHRASES } = require('../../data/phrases');
const { playItalian } = require('../../utils/audio');

Page({
  data: {
    phrases: [],
  },

  onShow() {
    this._load();
  },

  _load() {
    const favorites = wx.getStorageSync('italian_favorites') || {};
    const phrases = ALL_PHRASES
      .filter(p => favorites[p.id])
      .map(p => ({ ...p, isFav: true }));
    this.setData({ phrases });
  },

  onCardTap(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    playItalian(id);
  },

  onToggleFav(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const favorites = wx.getStorageSync('italian_favorites') || {};
    delete favorites[id];
    wx.setStorageSync('italian_favorites', favorites);
    this._load();
    wx.showToast({ title: '已取消收藏', icon: 'none', duration: 1200 });
  },
});
