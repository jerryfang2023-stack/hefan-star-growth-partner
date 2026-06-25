const severeRiskRules = [
  {
    category: 'self_harm',
    pattern: /(不想活|自杀|轻生|死了算了|伤害自己|割腕|跳楼)/i,
    summary: '出现极端或自我伤害表达',
  },
  {
    category: 'violence',
    pattern: /(杀了|打死|报复|伤害别人)/i,
    summary: '出现伤害他人的表达',
  },
];

const cautionRules = [
  {
    category: 'privacy',
    pattern: /(身份证|家庭住址|详细地址|手机号|电话号码|密码|验证码|银行卡|微信号|QQ号)/i,
    summary: '可能涉及个人隐私',
  },
  {
    category: 'money',
    pattern: /(转账|借钱|付款|支付|买.*账号|充值|打赏)/i,
    summary: '可能涉及金钱或交易',
  },
  {
    category: 'social',
    pattern: /(私聊|加微信|加好友|线下见面|单独见面|发照片)/i,
    summary: '可能涉及不安全社交',
  },
  {
    category: 'body_or_medical',
    pattern: /(减肥药|吃药|用药|身体隐私|性|怀孕|流血|严重疼痛)/i,
    summary: '可能涉及身体、医疗或性相关内容',
  },
];

const frustrationRules = [
  {
    category: 'frustration',
    pattern: /(我太笨|我真笨|学不会|不想学|烦死了|放弃|崩溃|讨厌学习)/i,
    summary: '出现学习挫败或逃避表达',
  },
];

function withReview(result) {
  return {
    ...result,
    reviewers: ['rules', 'model-mock'],
  };
}

function matchRules(text, rules) {
  return rules.filter((rule) => rule.pattern.test(text));
}

const personaBoundaryPattern =
  /(主人|宝贝|亲爱的|小可爱|乖乖|老公|老婆|男朋友|女朋友|恋人|三花娘娘|三花|娘娘|心理治疗师|心理咨询师)/i;

function normalizeChildLearningAnswer(answer) {
  return String(answer || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\uFE0E\uFE0F\u20E3]/g, '')
    .replace(/三花娘娘|三花|娘娘/g, '盒饭')
    .replace(/主人|宝贝|亲爱的|小可爱|乖乖/g, '同学')
    .replace(/老公|老婆|男朋友|女朋友|恋人/g, '学习伙伴')
    .replace(/心理治疗师|心理咨询师/g, '学习助手')
    .replace(/喵[~～。！!]?/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function checkSafety(text, direction = 'input') {
  const value = String(text || '').trim();

  if (!value) {
    return withReview({
      allowed: false,
      severity: 'block',
      action: 'ask_clarify',
      categories: ['empty'],
      parentAlert: false,
      message: '可以先写一句你想问的问题。',
    });
  }

  const severeMatches = matchRules(value, severeRiskRules);
  if (severeMatches.length > 0) {
    return withReview({
      allowed: false,
      severity: 'critical',
      action: 'comfort_and_parent_alert',
      categories: severeMatches.map((match) => match.category),
      parentAlert: true,
      message:
        '我听到你现在很难受。先把手边可能伤到自己的东西放远一点，去找家长、老师或身边可信任的大人说一声。我们可以先做一次慢呼吸：吸气 4 秒，呼气 4 秒。',
      summary: severeMatches[0].summary,
    });
  }

  const cautionMatches = matchRules(value, cautionRules);
  if (cautionMatches.length > 0) {
    return withReview({
      allowed: direction === 'output' ? false : true,
      severity: 'caution',
      action: 'redirect_to_safe_learning',
      categories: cautionMatches.map((match) => match.category),
      parentAlert: cautionMatches.some((match) => ['privacy', 'social'].includes(match.category)),
      message:
        '这类内容需要先保护隐私和安全。我们不要分享个人信息，也不做转账、私聊或线下见面的安排。可以把问题改成学习相关的问题。',
      summary: cautionMatches[0].summary,
    });
  }

  if (direction === 'output' && personaBoundaryPattern.test(value)) {
    return withReview({
      allowed: false,
      severity: 'caution',
      action: 'rewrite_child_learning_style',
      categories: ['persona_boundary'],
      parentAlert: false,
      message: '回答需要保持学习助手边界，不能使用亲密、人设或治疗师称呼。',
      summary: '输出出现不适合儿童学习助手的称呼或身份边界',
    });
  }

  const frustrationMatches = matchRules(value, frustrationRules);
  if (frustrationMatches.length > 0) {
    return withReview({
      allowed: true,
      severity: 'support',
      action: 'encourage_then_guide',
      categories: frustrationMatches.map((match) => match.category),
      parentAlert: false,
      message: '先肯定情绪，再把任务拆小，用提示帮助孩子继续尝试。',
      summary: frustrationMatches[0].summary,
    });
  }

  return withReview({
    allowed: true,
    severity: 'ok',
    action: 'continue',
    categories: [],
    parentAlert: false,
    message: '通过安全检查。',
  });
}

function safeOutputFallback() {
  return '这个问题我们先换成安全的学习方式来处理：你可以把题目中最不懂的一句话发给我，我先给你一个小提示。';
}

module.exports = {
  checkSafety,
  normalizeChildLearningAnswer,
  safeOutputFallback,
};
