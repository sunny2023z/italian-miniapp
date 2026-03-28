// pages/index/index.js
const { ALL_PHRASES, CATEGORIES } = require('../../data/phrases');
const { playItalian, playText, prefetchTTS } = require('../../utils/audio');

const SERVER = 'https://italian-translate.jellyzen.fun';
const TRANSLATE_DEBOUNCE = 400;
const HISTORY_KEY = 'italian_search_history';
const HISTORY_MAX = 10;

Page({
  data: {
    categories: CATEGORIES,
    filteredPhrases: [],
    selectedCat: -1,
    searchText: '',
    favorites: {},
    // 历史搜索
    searchHistory: [],
    showHistory: false,
    // 翻译结果
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
    const searchHistory = wx.getStorageSync(HISTORY_KEY) || [];
    this.setData({ favorites, searchHistory });
  },

  _applyFilter() {
    const { selectedCat, searchText, favorites } = this.data;
    let list = ALL_PHRASES.map(p => ({ ...p, isFav: !!favorites[p.id] }));
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

  // 保存搜索词到历史（去重，最新的排最前）
  _saveHistory(text) {
    if (!text.trim()) return;
    let history = wx.getStorageSync(HISTORY_KEY) || [];
    history = history.filter(h => h !== text);
    history.unshift(text);
    if (history.length > HISTORY_MAX) history = history.slice(0, HISTORY_MAX);
    wx.setStorageSync(HISTORY_KEY, history);
    this.setData({ searchHistory: history });
  },

  // 输入框获取焦点：显示历史
  onSearchFocus() {
    this.setData({ showHistory: true });
  },

  // 输入框失去焦点：延迟隐藏（留出点击历史的时间）
  onSearchBlur() {
    setTimeout(() => this.setData({ showHistory: false }), 200);
  },

  onSearchInput(e) {
    const val = e.detail.value;
    // 有输入时隐藏历史下拉，显示搜索结果
    this.setData({
      searchText: val,
      showHistory: !val,
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
    this._saveHistory(val.trim());
    this.setData({ showHistory: false });
    this._doTranslate(val.trim());
  },

  onSearchClear() {
    if (this._timer) clearTimeout(this._timer);
    this.setData({
      searchText: '', showHistory: true,
      translateResult: '', translateItalian: '', translateChinese: '',
      translateFaved: false, translateLoading: false,
    }, () => this._applyFilter());
  },

  // 点击历史词条
  onHistoryTap(e) {
    const text = e.currentTarget.dataset.text;
    this.setData({ searchText: text, showHistory: false,
      translateResult: '', translateItalian: '', translateChinese: '', translateFaved: false,
    }, () => this._applyFilter());
    this._saveHistory(text);
    this._doTranslate(text);
  },

  // 删除单条历史
  onHistoryDelete(e) {
    const text = e.currentTarget.dataset.text;
    let history = (wx.getStorageSync(HISTORY_KEY) || []).filter(h => h !== text);
    wx.setStorageSync(HISTORY_KEY, history);
    this.setData({ searchHistory: history });
  },

  // 清空所有历史
  onHistoryClear() {
    wx.setStorageSync(HISTORY_KEY, []);
    this.setData({ searchHistory: [] });
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
    playItalian(parseInt(e.currentTarget.dataset.id));
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
