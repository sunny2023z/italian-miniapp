// pages/favorites/favorites.js
const { ALL_PHRASES } = require('../../data/phrases');
const { playItalian, playText } = require('../../utils/audio');

Page({
  data: {
    phrases: [],
  },

  onShow() {
    this._load();
  },

  _load() {
    const favorites = wx.getStorageSync('italian_favorites') || {};
    const customFavs = wx.getStorageSync('italian_custom_favs') || {};

    // 预录词条
    const preset = ALL_PHRASES
      .filter(p => favorites[p.id])
      .map(p => ({ ...p, isFav: true, custom: false }));

    // 自定义翻译词条
    const custom = Object.values(customFavs).map(p => ({
      ...p,
      id: `custom_${p.italian}`,
      isFav: true,
    }));

    this.setData({ phrases: [...custom, ...preset] });
  },

  onCardTap(e) {
    const { id, italian, custom } = e.currentTarget.dataset;
    if (custom === 'true' || custom === true) {
      playText(italian);
    } else {
      playItalian(parseInt(id));
    }
  },

  onToggleFav(e) {
    const { id, italian, custom } = e.currentTarget.dataset;
    if (custom === 'true' || custom === true) {
      const customFavs = wx.getStorageSync('italian_custom_favs') || {};
      delete customFavs[`custom_${italian}`];
      wx.setStorageSync('italian_custom_favs', customFavs);
    } else {
      const favorites = wx.getStorageSync('italian_favorites') || {};
      delete favorites[parseInt(id)];
      wx.setStorageSync('italian_favorites', favorites);
    }
    this._load();
    wx.showToast({ title: '已取消收藏', icon: 'none', duration: 1200 });
  },
});
