const { request } = require('../../utils/api');

Page({
  data: {
    summary: {
      todayMinutes: 0,
      weeklyMinutes: 0,
      dailyLimitMinutes: 25,
      learningTopics: [],
      weakPoints: [],
      riskAlerts: [],
      privacyNote: '',
    },
  },

  onShow() {
    this.loadSummary();
  },

  async loadSummary() {
    try {
      const result = await request('/api/parent-summary', { role: 'parent' });
      this.setData({ summary: result.summary });
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' });
    }
  },
});
