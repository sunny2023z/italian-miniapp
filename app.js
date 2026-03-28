App({
  globalData: {
    userInfo: null,
  },
  onLaunch() {
    // Init storage defaults if not exists
    if (!wx.getStorageSync('italian_learned')) wx.setStorageSync('italian_learned', {});
    if (!wx.getStorageSync('italian_favorites')) wx.setStorageSync('italian_favorites', {});
    if (!wx.getStorageSync('italian_lessons')) wx.setStorageSync('italian_lessons', { completed: [], current: 0 });
  },
});
