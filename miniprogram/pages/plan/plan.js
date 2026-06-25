const { request } = require('../../utils/api');

Page({
  data: {
    loading: false,
    plan: [],
  },

  onShow() {
    this.loadPlan();
  },

  async loadPlan() {
    try {
      const result = await request('/api/plan');
      this.setData({ plan: result.plan });
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' });
    }
  },

  async regeneratePlan() {
    this.setData({ loading: true });
    try {
      const result = await request('/api/plan', {
        method: 'POST',
        data: { goal: '稳住六年级数学和语文薄弱点' },
      });
      this.setData({ plan: result.plan });
      wx.showToast({ title: '计划已更新', icon: 'success' });
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
});
