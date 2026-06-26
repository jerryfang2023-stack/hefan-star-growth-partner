const learningModule = {
  mark: '学',
  title: '知识闯关',
  actions: [
    {
      kind: 'word',
      label: '猜单词',
      title: '单词猜猜看',
      desc: '听线索，猜英文。',
      image: '/assets/game-english.jpg',
      visual: 'feature',
      mark: 'EN',
      meta: ['英语', '连击加分'],
      prompt: '盒饭，玩一局猜单词。你给我三个提示，我来猜。猜完帮我造个例句。',
    },
    {
      kind: 'idiom',
      label: '猜诗词',
      title: '诗词小侦探',
      desc: '猜作者，接下一句。',
      image: '/assets/game-poetry.jpg',
      visual: 'scroll',
      mark: '诗',
      meta: ['语文', '观察力'],
      prompt: '盒饭，玩一局诗词小侦探。你出作者题或下一句题，我来答。',
    },
    {
      kind: 'math',
      label: '换解法',
      title: '数学换条路',
      desc: '一步一步解开。',
      image: '/assets/game-math.jpg',
      visual: 'split',
      mark: 'π',
      meta: ['数学', '难度上升'],
      prompt: '盒饭，我想把一道数学题换个思路做。你先问我题目，再带我找两种解法。',
    },
    {
      kind: 'mistake',
      label: '翻错题',
      title: '错题翻盘',
      desc: '找错因，再来一题。',
      image: '/assets/game-review.jpg',
      visual: 'note',
      mark: '错',
      meta: ['复盘', '稳一点'],
      prompt: '盒饭，我有一道错题想翻盘。你先问我题目和错在哪里，再给我一道类似的小练习。',
    },
    {
      kind: 'reading',
      label: '找线索',
      title: '课文找线索',
      desc: '找关键词和小秘密。',
      image: '/assets/game-poetry.jpg',
      visual: 'mini',
      mark: '读',
      meta: ['阅读', '找证据'],
      prompt: '盒饭，陪我给课文找线索。你先问我课文名，再带我找关键词、中心句和人物变化。',
    },
    {
      kind: 'preview',
      label: '明天预告',
      title: '明天小预告',
      desc: '复习一点，预习一点。',
      image: '/assets/game-review.jpg',
      visual: 'mini calm',
      mark: '预',
      meta: ['预习', '轻任务'],
      prompt: '盒饭，帮我做一个明天小预告。先问我今天学了什么、明天学什么，再排一个短短的复习预习安排。',
    },
  ],
};

const DAILY_QUEST_STORAGE_KEY = 'hefanStarDailyQuestSeenV1';

const questionBanks = {
  word: [
    {
      kicker: '英语第 1 关',
      title: '家庭成员',
      question: 'Your father’s or mother’s brother is your ___.',
      answers: ['uncle', '叔叔', '舅舅', '伯伯'],
      success: '对，是 uncle。family 主题里这个词很常见。',
      retry: '想想爸爸或妈妈的兄弟，英文怎么说？',
    },
    {
      kicker: '英语第 2 关',
      title: '好朋友',
      question: 'A good friend is usually kind and ___. 线索：愿意帮忙。',
      answers: ['helpful', '乐于助人的', '愿意帮忙的'],
      success: '对，是 helpful。可以说：He is helpful.',
      retry: 'help 是“帮助”，这个形容词怎么变？',
    },
    {
      kicker: '英语第 3 关',
      title: '一天外出',
      question: 'We can see old things and learn history there. It is a ___.',
      answers: ['museum', '博物馆'],
      success: '对，是 museum。spend a day out 可以去 museum。',
      retry: '线索是 old things 和 history。',
    },
    {
      kicker: '英语第 4 关',
      title: '出行方式',
      question: 'If a place is near, we can go there on ___.',
      answers: ['foot', '脚', '步行'],
      success: '对，是 foot。on foot 就是“步行”。',
      retry: '想想“步行”的固定搭配。',
    },
    {
      kicker: '英语第 5 关',
      title: '频率副词',
      question: 'I ___ play basketball after school. 线索：经常。',
      answers: ['often', '经常'],
      success: '对，是 often。它常放在实义动词前面。',
      retry: 'usually、often、always 里，哪个最像“经常”？',
    },
  ],
  idiom: [
    {
      kicker: '语文第 1 关',
      title: '作者是谁',
      question: '《咏鹅》的作者是谁？',
      answers: ['骆宾王'],
      success: '对，是骆宾王。',
      retry: '想想这首诗的作者是唐代小诗人。',
    },
    {
      kicker: '语文第 2 关',
      title: '续写下一句',
      question: '“举头望明月”的下一句是？',
      answers: ['低头思故乡'],
      success: '对，是“低头思故乡”。',
      retry: '这首是《静夜思》，下一句写想家。',
    },
    {
      kicker: '语文第 3 关',
      title: '续写下一句',
      question: '“白日依山尽”的下一句是？',
      answers: ['黄河入海流'],
      success: '对，是“黄河入海流”。',
      retry: '下一句里有“黄河”和“大海”。',
    },
    {
      kicker: '语文第 4 关',
      title: '作者是谁',
      question: '《春晓》的作者是谁？',
      answers: ['孟浩然'],
      success: '对，是孟浩然。',
      retry: '这首诗的作者是唐代诗人，名字三个字。',
    },
    {
      kicker: '语文第 5 关',
      title: '续写下一句',
      question: '“小荷才露尖尖角”的下一句是？',
      answers: ['早有蜻蜓立上头'],
      success: '对，是“早有蜻蜓立上头”。',
      retry: '下一句里有一只小昆虫停在上面。',
    },
    {
      kicker: '语文第 6 关',
      title: '作者是谁',
      question: '“独在异乡为异客，每逢佳节倍思亲。”的作者是谁？',
      answers: ['王维'],
      success: '对，是王维。',
      retry: '这位唐代诗人也写过《山居秋暝》。',
    },
    {
      kicker: '语文第 7 关',
      title: '续写下一句',
      question: '“接天莲叶无穷碧”的下一句是？',
      answers: ['映日荷花别样红'],
      success: '对，是“映日荷花别样红”。',
      retry: '下一句写阳光下的荷花。',
    },
    {
      kicker: '语文第 8 关',
      title: '作者是谁',
      question: '“飞流直下三千尺，疑是银河落九天。”的作者是谁？',
      answers: ['李白', '李太白'],
      success: '对，是李白。',
      retry: '这位诗人被称为“诗仙”。',
    },
    {
      kicker: '语文第 9 关',
      title: '续写下一句',
      question: '“春风又绿江南岸”的下一句是？',
      answers: ['明月何时照我还'],
      success: '对，是“明月何时照我还”。',
      retry: '下一句里有明月，也有归家的意思。',
    },
    {
      kicker: '语文第 10 关',
      title: '作者是谁',
      question: '“横看成岭侧成峰，远近高低各不同。”的作者是谁？',
      answers: ['苏轼', '苏东坡'],
      success: '对，是苏轼。',
      retry: '这位宋代诗人也叫苏东坡。',
    },
    {
      kicker: '语文第 11 关',
      title: '续写下一句',
      question: '“千磨万击还坚劲”的下一句是？',
      answers: ['任尔东西南北风'],
      success: '对，是“任尔东西南北风”。',
      retry: '下一句写东、西、南、北的风。',
    },
    {
      kicker: '语文第 12 关',
      title: '作者是谁',
      question: '《石灰吟》的作者是谁？',
      answers: ['于谦'],
      success: '对，是于谦。',
      retry: '这位明代诗人写下“要留清白在人间”。',
    },
  ],
  math: [
    {
      kicker: '数学第 1 关',
      title: '数轴距离',
      question: '数轴上 -3 到 2 的距离是多少？',
      answers: ['5', '五'],
      success: '对。2 - (-3) = 5，也可以数格子。',
      retry: '从 -3 到 0 是 3 格，从 0 到 2 是 2 格。',
      steps: ['先画数轴。', '分段数：到 0，再到 2。'],
    },
    {
      kicker: '数学第 2 关',
      title: '相反数',
      question: '-7 的相反数是多少？',
      answers: ['7', '+7', '七'],
      success: '对。相反数只看方向相反，距离 0 一样远。',
      retry: '一个在 0 左边 7 格，另一个在右边 7 格。',
    },
    {
      kicker: '数学第 3 关',
      title: '比例未知数',
      question: '2:5 = 8:x，x 等于多少？',
      answers: ['20', '二十'],
      success: '对。2 变 8 是乘 4，所以 5 也乘 4 得 20。',
      retry: '先看 2 到 8 放大了几倍。',
    },
    {
      kicker: '数学第 4 关',
      title: '百分比',
      question: '80 的 25% 是多少？',
      answers: ['20', '二十'],
      success: '对。25% 是四分之一，80 ÷ 4 = 20。',
      retry: '25% 可以先想成 1/4。',
    },
    {
      kicker: '数学第 5 关',
      title: '可能性',
      question: '袋子里有 2 个红球、3 个蓝球，摸到红球的可能性是？',
      answers: ['2/5', '五分之二', '0.4', '40%'],
      success: '对。红球 2 个，总数 5 个，所以是 2/5。',
      retry: '先算总球数，再看红球占几份。',
    },
  ],
  mistake: [
    {
      kicker: '错题第 1 关',
      title: '有理数符号',
      question: '写下这道错题最可能错在：符号、运算顺序、还是抄错数？',
      notePlaceholder: '我这次错在...',
      steps: ['先圈出第一个变错的位置。', '再判断是不是正负号。'],
    },
    {
      kicker: '错题第 2 关',
      title: '百分比单位',
      question: '百分比题先找“单位 1”。把你题里的单位 1 写出来。',
      notePlaceholder: '单位 1 是...',
      steps: ['先找“谁的百分之几”。', '单位 1 通常在“的”前面。'],
    },
    {
      kicker: '错题第 3 关',
      title: '圆的公式',
      question: '这题用的是圆周长还是圆面积？写下你选的公式。',
      notePlaceholder: '我选的公式是...',
      steps: ['问“边上一圈”就是周长。', '问“里面大小”就是面积。'],
    },
  ],
  reading: [
    {
      kicker: '阅读第 1 关',
      title: '一年级字词',
      question: '读一句话，找出里面表示“谁”的词，比如“小猫在睡觉”里的“小猫”。',
      notePlaceholder: '表示谁的词是...',
      steps: ['先问“这句话写谁”。', '找到人、动物或事物。'],
    },
    {
      kicker: '阅读第 2 关',
      title: '一年级标点',
      question: '看到句号“。”时，读句子应该停一下还是继续冲过去？',
      notePlaceholder: '我觉得应该...',
      steps: ['句号表示一句话结束。', '读到这里停一停。'],
    },
    {
      kicker: '阅读第 3 关',
      title: '二年级量词',
      question: '给“鱼”选一个合适的量词：一（ ）鱼。你会填什么？',
      notePlaceholder: '我会填...',
      steps: ['先想生活里怎么说。', '可以说“一条鱼”。'],
    },
    {
      kicker: '阅读第 4 关',
      title: '二年级顺序',
      question: '读一小段故事，找出“先发生”的一件事。',
      notePlaceholder: '先发生的是...',
      steps: ['找“先、然后、接着、最后”。', '没有这些词，就看句子顺序。'],
    },
    {
      kicker: '阅读第 5 关',
      title: '看标题',
      question: '写下课文标题里最重要的一个词，再猜它可能写什么。',
      notePlaceholder: '关键词是...，我猜...',
      steps: ['标题常常藏着中心。', '先找名词或动词。'],
    },
    {
      kicker: '阅读第 6 关',
      title: '找重复词',
      question: '读一段课文，找一个重复出现或反复强调的词。',
      notePlaceholder: '重复词是...',
      steps: ['重复词通常很重要。', '可以是人物、地点、动作或心情。'],
    },
    {
      kicker: '阅读第 7 关',
      title: '抓变化',
      question: '人物或事情前后有什么变化？写一句。',
      notePlaceholder: '变化是...',
      steps: ['先看开头。', '再看结尾。', '比较中间发生了什么。'],
    },
    {
      kicker: '阅读第 8 关',
      title: '诗句画面',
      question: '选一句古诗词，写下你脑子里出现的一个画面。',
      notePlaceholder: '我看到的画面是...',
      steps: ['先找景物词。', '再加颜色、声音或动作。'],
    },
  ],
  preview: [
    {
      kicker: '预习第 1 关',
      title: '语文预习',
      question: '明天的课文标题里，你最不懂或最想问的词是哪一个？',
      notePlaceholder: '我不懂...',
      steps: ['先不急着查答案。', '把问题留下来。'],
    },
    {
      kicker: '预习第 2 关',
      title: '数学预习',
      question: '看一个数学例题，写下它第一步在做什么。',
      notePlaceholder: '第一步是...',
      steps: ['只看第一步。', '看不懂也可以照着描述。'],
    },
    {
      kicker: '预习第 3 关',
      title: '英语预习',
      question: '从明天的英语单词里挑 1 个，写下你猜的中文意思。',
      notePlaceholder: '我猜...是...',
      steps: ['先看图片或例句。', '猜意思。', '上课再验证。'],
    },
  ],
};

const playCards = {
  basketball: {
    kicker: '篮球一招',
    title: '今天练低运球',
    question: '30 秒一组，球不要高过膝盖，眼睛尽量看前方。',
    steps: ['右手 30 秒。', '左手 30 秒。', '左右手各 10 下换一次。'],
  },
  dance: {
    kicker: '街舞一拍',
    title: '先跟 8 拍',
    question: '口令：下、停、上、停，右、左、右、停。',
    steps: ['先只做脚步。', '再加肩膀。', '最后跟着 8 拍连起来。'],
  },
  workout: {
    kicker: '15 分钟动一动',
    title: '轻量运动局',
    question: '今天不拼狠，动起来就赢。',
    steps: ['热身 3 分钟。', '主练 9 分钟。', '收尾拉伸 3 分钟。'],
  },
  guitar: {
    kicker: '音乐小练习',
    title: '吉他换弦慢慢切',
    question: '先用 C 和 G 来回换，慢一点也没关系。',
    steps: ['按好 C，数 1、2、3、4。', '换到 G，手指尽量一起走。', '每换一次，只扫一下弦。'],
  },
  drum: {
    kicker: '节奏口令',
    title: '咚 哒 咚哒',
    question: '先念口令：咚、哒、咚咚、哒。念顺了再敲桌面。',
    steps: ['咚 = 右手敲低音。', '哒 = 左手轻敲。', '先慢 4 遍，再快一点 4 遍。'],
  },
  beat: {
    kicker: '听拍子',
    title: '猜强弱',
    question: '如果节奏是“强 弱 弱，强 弱 弱”，这更像几拍子？',
    answer: '三拍子',
    steps: ['从一个“强”开始数。', '数到下一个“强”。', '三个一组，就是三拍子。'],
  },
  joke: {
    kicker: '笑一笑',
    title: '短短一条',
    question: '为什么数学书总是不开心？因为它有太多问题。',
    steps: [],
  },
  story: {
    kicker: '小段子',
    title: '轻松 20 秒',
    question: '篮球说：“我今天压力好大。”地板说：“没事，你每次都能弹回来。”',
    steps: [],
  },
  riddle: {
    kicker: '急转弯',
    title: '先猜再看',
    question: '什么东西越洗越脏？',
    answer: '水',
    steps: ['想想洗手之后，谁变脏了？'],
  },
};

function normalizeAnswer(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s。！？!?,，.]/g, '');
}

function rewardName(kind) {
  return {
    word: '单词闪电徽章',
    idiom: '诗词侦探徽章',
    math: '数学换路徽章',
    mistake: '错题翻盘徽章',
    reading: '阅读雷达徽章',
    preview: '预习小队长徽章',
  }[kind] || '闯关徽章';
}

function isStoryQuestKind(kind) {
  return kind === 'reading';
}

function questRoundExplanation(kind) {
  if (kind === 'reading') {
    return '\u672c\u8f6e\u8bb2\u89e3\uff1a\u8bfb\u6545\u4e8b\u9898\u65f6\uff0c\u5148\u627e\u4eba\u7269\u548c\u52a8\u4f5c\uff0c\u518d\u770b\u65f6\u95f4\u987a\u5e8f\uff0c\u6700\u540e\u7528\u91cd\u590d\u51fa\u73b0\u7684\u8bcd\u5224\u65ad\u91cd\u70b9\u3002\u9047\u5230\u4e0d\u786e\u5b9a\u7684\u9898\uff0c\u53ef\u4ee5\u5148\u5708\u7ebf\u7d22\uff0c\u518d\u8bf4\u51fa\u81ea\u5df1\u7684\u7406\u7531\u3002';
  }
  return '';
}

function pointsForStreak(streak) {
  return Math.max(1, Math.min(5, streak));
}

function difficultyLabel(card, index) {
  if (card && card.difficulty) return card.difficulty;
  if (index < 2) return '入门';
  if (index < 5) return '进阶';
  return '挑战';
}

function todayQuestDateKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function readDailyQuestSeen() {
  const saved = wx.getStorageSync(DAILY_QUEST_STORAGE_KEY);
  if (saved && saved.date === todayQuestDateKey() && saved.seen) return saved;
  return { date: todayQuestDateKey(), seen: {} };
}

function writeDailyQuestSeen(record) {
  wx.setStorageSync(DAILY_QUEST_STORAGE_KEY, record);
}

function nextDailyQuestionIndex(kind, previousIndex) {
  const bank = questionBanks[kind] || [];
  if (!bank.length) return 0;
  const record = readDailyQuestSeen();
  const seen = Array.isArray(record.seen[kind]) ? record.seen[kind] : [];
  let candidates = bank
    .map((_, index) => index)
    .filter((index) => !seen.includes(index));
  if (!candidates.length) {
    record.seen[kind] = [];
    candidates = bank.map((_, index) => index);
    if (bank.length > 1 && Number.isInteger(previousIndex)) {
      candidates = candidates.filter((index) => index !== previousIndex);
    }
  }
  const nextIndex = candidates[0] || 0;
  record.seen[kind] = Array.from(new Set([...(record.seen[kind] || []), nextIndex]));
  writeDailyQuestSeen(record);
  return nextIndex;
}

function remainingDailyQuestionCount(kind) {
  const bank = questionBanks[kind] || [];
  if (!bank.length) return 0;
  const record = readDailyQuestSeen();
  const seen = Array.isArray(record.seen[kind]) ? record.seen[kind] : [];
  return Math.max(0, bank.length - seen.length);
}

const ACHIEVEMENT_STORAGE_KEY = 'hefanStarAchievementsV2';

function emptyAchievements() {
  return {
    totalScore: 0,
    badges: [],
    records: [],
    bestScores: {},
    scoreByKind: {},
  };
}

function readAchievements() {
  const saved = wx.getStorageSync(ACHIEVEMENT_STORAGE_KEY);
  if (!saved || typeof saved !== 'object') return emptyAchievements();
  return {
    totalScore: Number(saved.totalScore) || 0,
    badges: Array.isArray(saved.badges) ? saved.badges : [],
    records: Array.isArray(saved.records) ? saved.records : [],
    bestScores: saved.bestScores && typeof saved.bestScores === 'object' ? saved.bestScores : {},
    scoreByKind: saved.scoreByKind && typeof saved.scoreByKind === 'object' ? saved.scoreByKind : {},
  };
}

function writeAchievementRecord(kind, mission, game, totalLevels) {
  if (game.saved) return;
  const achievements = readAchievements();
  const badge = rewardName(kind);
  const completedAt = new Date().toISOString();
  const record = {
    kind,
    title: mission.title,
    score: game.score,
    streak: game.streak,
    badge,
    totalLevels,
    completedAt,
  };

  achievements.totalScore += game.score;
  achievements.scoreByKind[kind] = (Number(achievements.scoreByKind[kind]) || 0) + game.score;
  if (!achievements.badges.some((item) => item.name === badge)) {
    achievements.badges.push({ name: badge, kind, earnedAt: completedAt });
  }
  achievements.bestScores[kind] = Math.max(Number(achievements.bestScores[kind]) || 0, game.score);
  achievements.records.unshift(record);
  achievements.records = achievements.records.slice(0, 10);
  wx.setStorageSync(ACHIEVEMENT_STORAGE_KEY, achievements);
  game.saved = true;
}

Page({
  gameState: {},

  data: {
    learningModule,
    selectedMission: learningModule.actions[0],
    playground: null,
    playAnswer: '',
    playNote: '',
    rewardToast: {
      visible: false,
      points: 0,
      note: '积分到账',
    },
  },

  getGame(kind) {
    if (!this.gameState[kind]) {
      const bank = questionBanks[kind] || [];
      if (bank.length && remainingDailyQuestionCount(kind) <= 0) {
        this.gameState[kind] = {
          index: 0,
          level: bank.length,
          score: 0,
          streak: 0,
          answered: false,
          complete: true,
          exhausted: true,
          feedback: '',
          feedbackType: '',
          reward: '',
          explanation: '',
          saved: true,
        };
        return this.gameState[kind];
      }
      this.gameState[kind] = {
        index: nextDailyQuestionIndex(kind),
        level: 0,
        score: 0,
        streak: 0,
        answered: false,
        complete: false,
        feedback: '',
        feedbackType: '',
        reward: '',
        explanation: '',
        saved: false,
      };
    }
    return this.gameState[kind];
  },

  buildPlayground(mission) {
    const bank = questionBanks[mission.kind];
    if (bank) {
      const game = this.getGame(mission.kind);
      if (game.complete) {
        const hasMoreToday = remainingDailyQuestionCount(mission.kind) > 0;
        return {
          mode: 'quest',
          complete: true,
          canRestart: hasMoreToday,
          exhaustedNote: hasMoreToday || game.exhausted ? '' : '这类题今天已经全部出现过了。换一个小游戏，明天再来会刷新。',
          kicker: '闯关完成',
          title: `${rewardName(mission.kind)} 到手`,
          question: game.exhausted
            ? '这类题今天已经全部出现过了。换一个小游戏，明天再来会刷新。'
            : `这轮拿到 ${game.score} 分。${game.reward || '表现很稳，给自己一个轻轻的击掌。'}`,
          level: bank.length,
          total: bank.length,
          score: game.score,
          streak: game.streak,
          progress: 100,
          explanation: game.explanation || '',
        };
      }

      const card = bank[game.index] || bank[0];
      const nextPoints = pointsForStreak(game.streak + 1);
      return {
        mode: 'quest',
        ...card,
        canRestart: remainingDailyQuestionCount(mission.kind) > 0,
        canSkip: isStoryQuestKind(mission.kind),
        difficulty: difficultyLabel(card, game.level || 0),
        nextPoints,
        level: (game.level || 0) + 1,
        total: bank.length,
        score: game.score,
        streak: game.streak,
        progress: Math.round((((game.level || 0) + (game.answered ? 1 : 0)) / bank.length) * 100),
        answered: game.answered,
        feedback: game.feedback,
        feedbackType: game.feedbackType,
        hasAnswer: Array.isArray(card.answers),
        hasNote: Boolean(card.notePlaceholder),
        nextLabel: (game.level || 0) >= bank.length - 1 ? '领奖励' : '下一关',
      };
    }

    return {
      mode: 'card',
      ...(playCards[mission.kind] || playCards.basketball),
      showAnswer: false,
    };
  },

  refreshPlayground() {
    this.setData({
      playground: this.buildPlayground(this.data.selectedMission),
      playAnswer: '',
      playNote: '',
    });
  },

  selectMission(event) {
    const { kind, label, title, desc, prompt, image, visual } = event.currentTarget.dataset;
    const selectedMission = {
      kind,
      label,
      title,
      desc,
      prompt,
      image,
      visual,
      meta: learningModule.actions.find((action) => action.kind === kind)?.meta || [],
    };
    this.setData({ selectedMission }, () => {
      if (this.data.playground) this.refreshPlayground();
    });
  },

  startSelectedMission() {
    this.refreshPlayground();
  },

  onUnload() {
    clearTimeout(this.rewardTimer);
  },

  onAnswerInput(event) {
    this.setData({ playAnswer: event.detail.value });
  },

  onNoteInput(event) {
    this.setData({ playNote: event.detail.value });
  },

  showRewardToast(points, note) {
    clearTimeout(this.rewardTimer);
    this.setData({
      rewardToast: {
        visible: true,
        points,
        note: note || '积分到账',
      },
    });
    this.rewardTimer = setTimeout(() => {
      this.setData({
        'rewardToast.visible': false,
      });
    }, 1350);
  },

  checkPlayAnswer() {
    const mission = this.data.selectedMission;
    const bank = questionBanks[mission.kind];
    if (!bank) return;

    const game = this.getGame(mission.kind);
    const card = bank[game.index];
    const answer = normalizeAnswer(this.data.playAnswer);
    const expected = (card.answers || []).map(normalizeAnswer);

    if (!answer) {
      game.feedback = '先大胆写一个，盒饭看着呢。';
      game.feedbackType = 'try';
      this.refreshPlayground();
      return;
    }

    if (expected.includes(answer)) {
      const nextStreak = game.streak + 1;
      const earnedPoints = pointsForStreak(nextStreak);
      game.score += earnedPoints;
      game.streak = nextStreak;
      game.answered = true;
      game.feedbackType = 'good';
      game.feedback = `${card.success} 连对 ${nextStreak} 题，+${earnedPoints} 分。`;
      this.refreshPlayground();
      this.showRewardToast(earnedPoints, nextStreak > 1 ? '连对升级，奖励变多' : '开局拿下');
      return;
    }

    game.streak = 0;
    game.feedback = `${card.retry} 不扣分，再试一次。`;
    game.feedbackType = 'try';
    this.refreshPlayground();
  },

  savePlayNote() {
    const mission = this.data.selectedMission;
    const game = this.getGame(mission.kind);
    if (!this.data.playNote.trim()) {
      game.feedback = '可以先写一句，不用写很长。';
      game.feedbackType = 'try';
      this.refreshPlayground();
      return;
    }

    const nextStreak = game.streak + 1;
    const earnedPoints = pointsForStreak(nextStreak);
    game.score += earnedPoints;
    game.streak = nextStreak;
    game.answered = true;
    game.feedback = `记下来了，连对 ${nextStreak} 题，+${earnedPoints} 分。这个关卡算你过。`;
    game.feedbackType = 'good';
    this.refreshPlayground();
  },

  nextLevel() {
    const mission = this.data.selectedMission;
    const bank = questionBanks[mission.kind];
    if (!bank) return;

    const game = this.getGame(mission.kind);
    if (!game.answered) {
      game.feedback = '先过这一关，再去下一关。';
      game.feedbackType = 'try';
      this.refreshPlayground();
      return;
    }

    if ((game.level || 0) >= bank.length - 1) {
      game.complete = true;
      game.reward = game.score >= bank.length ? '连续闯完一轮，很有节奏。' : '完成比满分更重要，今天已经推进了。';
      game.explanation = questRoundExplanation(mission.kind);
      writeAchievementRecord(mission.kind, mission, game, bank.length);
      this.refreshPlayground();
      return;
    }

    game.level = (game.level || 0) + 1;
    game.index = nextDailyQuestionIndex(mission.kind, game.index);
    game.answered = false;
    game.feedback = '';
    game.feedbackType = '';
    game.explanation = '';
    this.refreshPlayground();
  },

  skipStoryQuestion() {
    const mission = this.data.selectedMission;
    if (!isStoryQuestKind(mission.kind)) return;
    const game = this.getGame(mission.kind);
    game.answered = true;
    game.feedback = '\u8fd9\u9898\u5148\u653e\u8fc7\uff0c\u7ee7\u7eed\u770b\u4e0b\u4e00\u9898\u3002';
    game.feedbackType = 'try';
    this.nextLevel();
  },

  restartQuest() {
    const kind = this.data.selectedMission.kind;
    const bank = questionBanks[kind] || [];
    if (bank.length && remainingDailyQuestionCount(kind) <= 0) {
      this.gameState[kind] = undefined;
      this.refreshPlayground();
      return;
    }
    const previousIndex = this.gameState[kind] ? this.gameState[kind].index : null;
    this.gameState[kind] = {
      index: nextDailyQuestionIndex(kind, previousIndex),
      level: 0,
      score: 0,
      streak: 0,
      answered: false,
      complete: false,
      feedback: '',
      feedbackType: '',
      reward: '',
      explanation: '',
      saved: false,
    };
    this.refreshPlayground();
  },

  revealPlayAnswer() {
    if (!this.data.playground) return;
    this.setData({
      'playground.showAnswer': true,
    });
  },

  finishPlay() {
    wx.showToast({
      title: '这一小关完成',
      icon: 'none',
    });
  },

  askHefan() {
    const prompt = encodeURIComponent(this.data.selectedMission.prompt);
    wx.navigateTo({ url: `/pages/chat/chat?prompt=${prompt}` });
  },
});
