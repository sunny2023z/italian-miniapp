// pages/onboarding/onboarding.js
Page({
  data: {
    current: 0,
  },

  onSwiperChange(e) {
    this.setData({ current: e.detail.current });
  },

  onNext() {
    const next = this.data.current + 1;
    if (next <= 2) this.setData({ current: next });
  },

  onStart() {
    wx.setStorageSync('onboarding_done', true);
    wx.switchTab({ url: '/pages/index/index' });
  },
});
