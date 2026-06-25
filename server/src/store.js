const { config } = require('./config');

const state = {
  profile: {
    childId: 'star',
    name: 'Star',
    grade: '六年级',
    textbook: '人教版',
    weakPoints: ['英语词汇练习', '数学作业检查', '多解法思考'],
    interests: ['英语猜单词', '数学作业', '篮球', '街舞', '音乐技巧', '运动计划'],
    expressionStyle: '喜欢短句、先提示再结论、像训练一样拆步骤',
    parentConsent: true,
    dailyLimitMinutes: config.dailyLimitMinutes,
  },
  plan: [
    {
      day: '今天',
      minutes: 20,
      subject: '英语',
      title: '猜单词和表达热身',
      steps: ['猜 5 个核心单词', '说出一个例句', '复盘 1 个易错词'],
      status: '进行中',
    },
    {
      day: '明天',
      minutes: 18,
      subject: '数学',
      title: '作业检查和多解法比较',
      steps: ['圈出已知和要求', '检查计算过程', '尝试另一种解法'],
      status: '未开始',
    },
    {
      day: '周五',
      minutes: 15,
      subject: '运动',
      title: '篮球脚步和街舞节奏练习',
      steps: ['热身 3 分钟', '练一组基础动作', '记录一个要改进的点'],
      status: '未开始',
    },
  ],
  usage: {
    todayMinutes: 0,
    weeklyMinutes: 0,
    topics: ['英语猜单词', '数学作业检查', '篮球训练'],
    weakPoints: ['英语词汇练习', '数学作业检查', '多解法思考'],
    riskAlerts: [],
  },
  conversation: {
    turns: [],
  },
};

function compactText(value, maxLength = 420) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function getProfile() {
  return { ...state.profile };
}

function updateProfile(input) {
  const next = {
    ...state.profile,
    name: input.name || state.profile.name,
    grade: input.grade || state.profile.grade,
    textbook: input.textbook || state.profile.textbook,
    weakPoints: Array.isArray(input.weakPoints) ? input.weakPoints : state.profile.weakPoints,
    interests: Array.isArray(input.interests) ? input.interests : state.profile.interests,
    expressionStyle: input.expressionStyle || state.profile.expressionStyle,
    parentConsent:
      typeof input.parentConsent === 'boolean' ? input.parentConsent : state.profile.parentConsent,
    dailyLimitMinutes:
      typeof input.dailyLimitMinutes === 'number'
        ? Math.max(10, Math.min(60, input.dailyLimitMinutes))
        : state.profile.dailyLimitMinutes,
  };

  state.profile = next;
  return getProfile();
}

function getPlan() {
  return state.plan.map((item) => ({ ...item, steps: [...item.steps] }));
}

function setPlan(plan) {
  state.plan = plan;
  return getPlan();
}

function recordLearningEvent(event) {
  const minutes = event.minutes || 5;
  state.usage.todayMinutes = Math.min(state.profile.dailyLimitMinutes, state.usage.todayMinutes + minutes);
  state.usage.weeklyMinutes += minutes;

  if (event.topic && !state.usage.topics.includes(event.topic)) {
    state.usage.topics.unshift(event.topic);
  }

  for (const point of event.weakPoints || []) {
    if (!state.usage.weakPoints.includes(point)) {
      state.usage.weakPoints.unshift(point);
    }
  }

  if (event.riskAlert) {
    state.usage.riskAlerts.unshift({
      time: new Date().toISOString(),
      level: event.riskAlert.level,
      category: event.riskAlert.category,
      summary: event.riskAlert.summary,
    });
    state.usage.riskAlerts = state.usage.riskAlerts.slice(0, 10);
  }
}

function getConversationContext() {
  return state.conversation.turns.map((turn) => ({ ...turn }));
}

function recordConversationTurn(turn) {
  state.conversation.turns.push({
    at: new Date().toISOString(),
    topic: compactText(turn.topic, 80),
    child: compactText(turn.childMessage),
    assistant: compactText(turn.assistantAnswer),
  });
  state.conversation.turns = state.conversation.turns.slice(-6);
}

function getParentSummary() {
  return {
    childId: state.profile.childId,
    parentConsent: state.profile.parentConsent,
    todayMinutes: state.usage.todayMinutes,
    weeklyMinutes: state.usage.weeklyMinutes,
    dailyLimitMinutes: state.profile.dailyLimitMinutes,
    learningTopics: state.usage.topics.slice(0, 6),
    weakPoints: state.usage.weakPoints.slice(0, 6),
    riskAlerts: state.usage.riskAlerts.slice(0, 5),
    privacyNote: '仅展示学习摘要、薄弱点、使用情况和风险提醒；不展示完整聊天内容。',
  };
}

module.exports = {
  getProfile,
  updateProfile,
  getPlan,
  setPlan,
  recordLearningEvent,
  getConversationContext,
  recordConversationTurn,
  getParentSummary,
};
