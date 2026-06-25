const { request } = require('../../utils/api');

const PLAN_STORAGE_KEY = 'hefanStarPlanCenterV1';
const PLAN_TYPES = [
  { key: 'learning', label: '学习', mark: '学' },
  { key: 'sport', label: '运动', mark: '动' },
  { key: 'music', label: '音乐', mark: '乐' },
  { key: 'habit', label: '习惯', mark: '习' },
];

const EXTRA_PLAN_ITEMS = [
  {
    id: 'sport-basketball-footwork',
    type: 'sport',
    title: '篮球脚步 12 分钟',
    minutes: 12,
    status: 'todo',
    reason: '',
    steps: ['热身 2 分钟', '低重心移动 6 组', '记一个今天最稳的动作'],
  },
];

const REMOVED_DEMO_PLAN_IDS = [
  'learning-api-1',
  'learning-api-2',
  'music-rhythm-practice',
  'habit-bedtime-bag',
];

function planTypeByKey(key) {
  return PLAN_TYPES.find((type) => type.key === key) || PLAN_TYPES[0];
}

function defaultPlanSteps(type) {
  if (type === 'sport') return ['热身一下', '练一组动作', '记一个动作感觉'];
  if (type === 'music') return ['慢速来一遍', '卡住处单独练', '录一小段回听'];
  if (type === 'habit') return ['先准备', '做完打勾', '给明天少留一点麻烦'];
  return ['先看目标', '做 15 分钟', '写下一个卡点'];
}

function normalizePlanStatus(value) {
  return ['todo', 'doing', 'done', 'missed'].includes(value) ? value : 'todo';
}

function normalizePlanItem(item, index) {
  const type = item.type || (item.subject === '运动' ? 'sport' : 'learning');
  return {
    id: item.id || `plan-${Date.now()}-${index}`,
    type: planTypeByKey(type).key,
    title: item.title || '小计划',
    minutes: Math.max(1, Number(item.minutes) || 15),
    status: normalizePlanStatus(item.statusKey || item.status),
    reason: item.reason || '',
    steps: Array.isArray(item.steps) && item.steps.length ? item.steps : defaultPlanSteps(type),
  };
}

function planItemsFromApi(apiPlan) {
  const learning = (apiPlan || []).slice(0, 1).map((item, index) => normalizePlanItem({
    id: `learning-api-${index}`,
    type: 'learning',
    title: item.title,
    minutes: item.minutes,
    status: index === 0 ? 'doing' : 'todo',
    steps: item.steps,
  }, index));
  return learning.concat(EXTRA_PLAN_ITEMS.map(normalizePlanItem));
}

function pruneDemoPlanItems(items) {
  return items.filter((item) => (
    !REMOVED_DEMO_PLAN_IDS.includes(item.id) || item.status === 'done' || item.status === 'missed'
  ));
}

function readPlanItems(apiPlan) {
  const saved = wx.getStorageSync(PLAN_STORAGE_KEY);
  if (Array.isArray(saved) && saved.length) return pruneDemoPlanItems(saved.map(normalizePlanItem));
  return planItemsFromApi(apiPlan);
}

function writePlanItems(items) {
  wx.setStorageSync(PLAN_STORAGE_KEY, pruneDemoPlanItems(items));
}

function decoratePlanItems(items) {
  return items.map((item) => {
    const type = planTypeByKey(item.type);
    return {
      ...item,
      typeLabel: type.label,
      typeMark: type.mark,
      statusText: {
        todo: '未开始',
        doing: '进行中',
        done: '已完成',
        missed: '未完成',
      }[item.status] || '未开始',
      cardClass: `card plan-card ${item.status}`,
      showReason: item.status === 'missed' && Boolean(item.reason),
    };
  });
}

function planStats(items) {
  const total = items.length;
  const done = items.filter((item) => item.status === 'done').length;
  const doing = items.filter((item) => item.status === 'doing').length;
  const missed = items.filter((item) => item.status === 'missed').length;
  return {
    total,
    done,
    doing,
    missed,
    rate: total ? Math.round((done / total) * 100) : 0,
  };
}

function splitPlanItems(items) {
  return {
    current: items.filter((item) => item.status !== 'done' && item.status !== 'missed'),
    history: items.filter((item) => item.status === 'done' || item.status === 'missed'),
  };
}

Page({
  data: {
    loading: false,
    currentPlanItems: [],
    historyPlanItems: [],
    stats: planStats([]),
    planTypes: PLAN_TYPES,
    newPlan: {
      title: '',
      typeIndex: 0,
      typeLabel: PLAN_TYPES[0].label,
      minutes: 15,
    },
  },

  onShow() {
    this.loadPlan();
  },

  setPlans(items) {
    const normalized = pruneDemoPlanItems(items.map(normalizePlanItem));
    const groups = splitPlanItems(normalized);
    writePlanItems(normalized);
    this.setData({
      currentPlanItems: decoratePlanItems(groups.current),
      historyPlanItems: decoratePlanItems(groups.history),
      stats: planStats(normalized),
    });
  },

  async loadPlan() {
    try {
      const result = await request('/api/plan');
      this.setPlans(readPlanItems(result.plan));
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' });
    }
  },

  async regeneratePlan() {
    this.setData({ loading: true });
    try {
      const result = await request('/api/plan', {
        method: 'POST',
        data: { goal: '给 Star 生成今天最值得做的一组计划' },
      });
      const generatedItems = planItemsFromApi(result.plan);
      const generatedIds = generatedItems.map((item) => item.id);
      const current = wx.getStorageSync(PLAN_STORAGE_KEY);
      const existingItems = Array.isArray(current) ? current : [];
      const retainedItems = existingItems.filter((item) => (
        !generatedIds.includes(item.id) || item.status === 'done' || item.status === 'missed'
      ));
      this.setPlans(generatedItems.concat(retainedItems));
      wx.showToast({ title: '已生成今日建议', icon: 'success' });
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onNewTitleInput(event) {
    this.setData({ 'newPlan.title': event.detail.value });
  },

  onNewTypeChange(event) {
    const typeIndex = Number(event.detail.value) || 0;
    this.setData({
      'newPlan.typeIndex': typeIndex,
      'newPlan.typeLabel': (PLAN_TYPES[typeIndex] || PLAN_TYPES[0]).label,
    });
  },

  onNewMinutesInput(event) {
    this.setData({ 'newPlan.minutes': Number(event.detail.value) || 15 });
  },

  addPlan() {
    const title = this.data.newPlan.title.trim();
    if (!title) {
      wx.showToast({ title: '先写计划名字', icon: 'none' });
      return;
    }
    const type = PLAN_TYPES[this.data.newPlan.typeIndex] || PLAN_TYPES[0];
    const current = wx.getStorageSync(PLAN_STORAGE_KEY);
    const items = Array.isArray(current) ? current : [];
    items.unshift(normalizePlanItem({
      id: `custom-${Date.now()}`,
      type: type.key,
      title,
      minutes: this.data.newPlan.minutes,
      status: 'todo',
      steps: defaultPlanSteps(type.key),
    }, 0));
    this.setPlans(items);
    this.setData({ 'newPlan.title': '' });
  },

  setPlanStatus(event) {
    const { id, status } = event.currentTarget.dataset;
    const current = wx.getStorageSync(PLAN_STORAGE_KEY);
    const items = Array.isArray(current) ? current : [];
    const item = items.find((plan) => plan.id === id);
    if (!item) return;
    if (status === 'reset') {
      item.status = 'todo';
      item.reason = '';
    } else if (status === 'missed') {
      item.status = 'missed';
      item.reason = item.reason || '这次没有写原因，下次补上。';
    } else {
      item.status = status;
      item.reason = '';
    }
    this.setPlans(items);
  },
});
