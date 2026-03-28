App({
  globalData: {
    userInfo: null,
  },
  onLaunch() {
    if (!wx.getStorageSync('italian_learned')) wx.setStorageSync('italian_learned', {});
    if (!wx.getStorageSync('italian_favorites')) wx.setStorageSync('italian_favorites', {});
    if (!wx.getStorageSync('italian_lessons')) wx.setStorageSync('italian_lessons', { completed: [], current: 0 });

    // 已看过引导页则直接跳主页
    if (wx.getStorageSync('onboarding_done')) {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },
});
