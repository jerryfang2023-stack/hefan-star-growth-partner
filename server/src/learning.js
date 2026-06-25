function inferTopic(message, profile) {
  const text = String(message || '');
  const knownPoints = profile.weakPoints || [];
  const matchedPoint = knownPoints.find((point) => text.includes(point));

  if (matchedPoint) return matchedPoint;
  if (/分数|百分数|比例|方程|应用题/.test(text)) return '数学应用题';
  if (/阅读|作文|概括|中心思想/.test(text)) return '语文阅读';
  if (/英语|单词|语法|时态/.test(text)) return '英语语法';
  return '学习问题';
}

function buildPlan(goal, profile) {
  const target = goal || '围绕 Star 的英语、数学和运动兴趣做小步练习';
  const weakPoint = profile.weakPoints?.[0] || '最近卡住的点';

  return [
    {
      day: '今天',
      minutes: 20,
      subject: '英语',
      title: '猜单词和例句练习',
      steps: ['猜 5 个单词', '每个说一个提示', '选 1 个词造句'],
      status: '进行中',
    },
    {
      day: '明天',
      minutes: 18,
      subject: '数学',
      title: `${weakPoint}作业检查`,
      steps: ['圈出已知和要求', '检查计算过程', '试一种不同解法'],
      status: '未开始',
    },
    {
      day: '后天',
      minutes: 15,
      subject: '运动',
      title: `${target}动作复盘`,
      steps: ['热身 3 分钟', '练一组篮球或街舞动作', '记录一个改进点'],
      status: '未开始',
    },
  ];
}

function buildMockReply({ message, profile, safety }) {
  const topic = inferTopic(message, profile);
  const encouragement =
    safety.severity === 'support'
      ? '先别急，这不是你笨，是题目还没变成好入口。'
      : '我们一步一步来。';

  if (/出题|练习|变式|错题/.test(message)) {
    return {
      topic,
      weakPoints: topic.includes('数学') ? ['审题', '等量关系'] : [],
      answer:
        `${encouragement}\n` +
        `我先给你 2 道${topic}练习：\n` +
        '1. 先圈出题目里的“总量”和“部分”。\n' +
        '2. 把条件改一个数字，再判断解法有没有变化。\n' +
        '你先做第 1 题，我只看你的思路，不急着要答案。',
    };
  }

  if (/答案|直接告诉|不会/.test(message)) {
    return {
      topic,
      weakPoints: topic.includes('数学') ? ['独立列式'] : [],
      answer:
        `${encouragement}\n` +
        '我先不给最终答案，给你一个小提示：先找“已知什么、要求什么”。\n' +
        '你可以先写出一个等量关系，哪怕不完整也可以。写完我帮你检查下一步。',
    };
  }

  return {
    topic,
    weakPoints: [],
    answer:
      `${encouragement}\n` +
      `这像是一个${topic}。你先回答我两个小问题：\n` +
      '1. 题目里最关键的一句话是哪一句？\n' +
      '2. 你已经想到的第一步是什么？\n' +
      '你发来第一步，我再给你下一条提示。',
  };
}

function systemPrompt(profile) {
  return [
    '你是面向六年级孩子的成长学习助手“盒饭”，形象开朗、活泼、说话有趣、热爱运动，但不是虚拟伴侣、亲人、恋人或心理治疗师。',
    '回答要简短、温和、启发式，优先用苏格拉底式提问引导孩子自己想。',
    '不要直接给最终答案，除非孩子已经展示了尝试过程。',
    '不要要求孩子提供隐私信息，不安排转账、私聊、线下见面或高风险行为。',
    `孩子画像：名字=${profile.name || 'Star'}，年级=${profile.grade}，教材=${profile.textbook}，薄弱点=${profile.weakPoints.join('、')}，兴趣=${profile.interests.join('、')}，表达偏好=${profile.expressionStyle}。`,
  ].join('\n');
}

module.exports = {
  inferTopic,
  buildPlan,
  buildMockReply,
  systemPrompt,
};
