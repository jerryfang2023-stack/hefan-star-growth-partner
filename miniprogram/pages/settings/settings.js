const { getBaseUrl, request } = require('../../utils/api');

const ACHIEVEMENT_STORAGE_KEY = 'hefanStarAchievementsV2';
const BADGE_FAMILIES = [
  { kind: 'word', title: '单词闪电', icon: '词' },
  { kind: 'idiom', title: '诗词侦探', icon: '诗' },
  { kind: 'math', title: '数学换路', icon: '数' },
  { kind: 'mistake', title: '错题翻盘', icon: '错' },
  { kind: 'reading', title: '阅读雷达', icon: '读' },
  { kind: 'preview', title: '预习小队长', icon: '预' },
];
const BADGE_LEVELS = [
  { key: 'starter', name: '星芽', target: 3 },
  { key: 'bronze', name: '铜星', target: 10 },
  { key: 'silver', name: '银月', target: 25 },
  { key: 'gold', name: '金冠', target: 50 },
  { key: 'crystal', name: '水晶', target: 90 },
  { key: 'galaxy', name: '星耀', target: 150 },
];
const BENTO_STORAGE_KEY = 'hefanStarBentoV1';
const BENTO_INGREDIENTS = [
  { key: 'rice', name: '大米饭', mark: '饭', price: 3, level: 1, asset: '/assets/food-rice.png' },
  { key: 'cabbage', name: '白菜', mark: '菜', price: 8, level: 2, asset: '/assets/food-cabbage.png' },
  { key: 'drumstick', name: '鸡腿', mark: '腿', price: 15, level: 3, asset: '/assets/food-drumstick.png' },
  { key: 'egg', name: '煎蛋', mark: '蛋', price: 28, level: 4, asset: '/assets/food-egg.png' },
  { key: 'corn', name: '玉米', mark: '玉', price: 45, level: 5, asset: '/assets/food-corn.png' },
  { key: 'shrimp', name: '虾仁', mark: '虾', price: 70, level: 6, asset: '/assets/food-shrimp.png' },
];
const BENTO_CUSTOMERS = [
  { key: 'momo', name: '墨墨', request: ['rice', 'cabbage'], rewardCoins: 8, note: '今天想要清爽一点。' },
  { key: 'dada', name: '达达', request: ['rice', 'drumstick'], rewardCoins: 12, note: '练完球，想吃有力气的。' },
  { key: 'nana', name: '娜娜', request: ['rice', 'egg', 'corn'], rewardCoins: 18, note: '想要金色盒饭。' },
];
const BENTO_BASE_CAPACITY = 2;
const BENTO_MAX_CAPACITY_LEVEL = 10;
const BENTO_MAX_CAPACITY = 11;
const BENTO_CAPACITY_UPGRADE_PRICES = [6, 12, 20, 32, 48, 70, 96, 128, 165];

function emptyAchievements() {
  return {
    totalScore: 0,
    badges: [],
    records: [],
    bestScores: {},
    scoreByKind: {},
  };
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
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

function scoreForKind(achievements, kind) {
  const storedTotal = Number(achievements.scoreByKind && achievements.scoreByKind[kind]) || 0;
  if (storedTotal > 0) return storedTotal;
  return achievements.records
    .filter((record) => record.kind === kind)
    .reduce((total, record) => total + (Number(record.score) || 0), 0);
}

function badgeFamiliesFor(achievements) {
  return BADGE_FAMILIES.map((family) => {
    const progressScore = scoreForKind(achievements, family.kind);
    const levels = BADGE_LEVELS.map((level) => {
      return {
        ...level,
        unlocked: progressScore >= level.target,
        statusText: progressScore >= level.target ? '已点亮' : `${level.target} 分点亮`,
        className: `badge-level ${level.key} ${progressScore >= level.target ? 'unlocked' : 'locked'}`,
      };
    });
    return {
      ...family,
      progressScore,
      levels,
    };
  });
}

function unlockedBadgeLevelCount(badgeFamilies) {
  return badgeFamilies.reduce(
    (count, family) => count + family.levels.filter((level) => level.unlocked).length,
    0
  );
}

function decorateAchievements() {
  const achievements = readAchievements();
  const badgeFamilies = badgeFamiliesFor(achievements);
  return {
    ...achievements,
    badgeFamilies,
    unlockedBadgeCount: unlockedBadgeLevelCount(badgeFamilies),
    badges: achievements.badges.map((badge) => ({
      ...badge,
      displayDate: formatDate(badge.earnedAt),
    })),
    records: achievements.records.map((record) => ({
      ...record,
      displayDate: formatDate(record.completedAt),
    })),
  };
}

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function emptyBento() {
  return {
    spentPoints: 0,
    coins: 0,
    capacityLevel: 1,
    unlocked: [],
    lunchbox: [],
    servedToday: [],
    servedDate: todayKey(),
    feedback: '空盒饭准备好了，先用积分解锁大米饭。',
  };
}

function readBento() {
  const saved = wx.getStorageSync(BENTO_STORAGE_KEY);
  if (!saved || typeof saved !== 'object') return emptyBento();
  const currentDay = todayKey();
  const capacityLevel = clampBentoCapacityLevel(saved.capacityLevel);
  return {
    spentPoints: Number(saved.spentPoints) || 0,
    coins: Math.max(0, Number(saved.coins) || 0),
    capacityLevel,
    unlocked: Array.isArray(saved.unlocked) ? saved.unlocked : [],
    lunchbox: Array.isArray(saved.lunchbox) ? saved.lunchbox.slice(0, bentoCapacity(capacityLevel)) : [],
    servedToday: saved.servedDate === currentDay && Array.isArray(saved.servedToday) ? saved.servedToday : [],
    servedDate: currentDay,
    feedback: saved.feedback || '空盒饭准备好了，先用积分解锁大米饭。',
  };
}

function writeBento(bento) {
  wx.setStorageSync(BENTO_STORAGE_KEY, bento);
}

function ingredientByKey(key) {
  return BENTO_INGREDIENTS.find((item) => item.key === key);
}

function clampBentoCapacityLevel(value) {
  const level = Number(value) || 1;
  return Math.max(1, Math.min(BENTO_MAX_CAPACITY_LEVEL, level));
}

function bentoCapacity(level) {
  return Math.min(BENTO_MAX_CAPACITY, BENTO_BASE_CAPACITY + clampBentoCapacityLevel(level) - 1);
}

function bentoUpgradePrice(level) {
  const currentLevel = clampBentoCapacityLevel(level);
  if (currentLevel >= BENTO_MAX_CAPACITY_LEVEL) return 0;
  return BENTO_CAPACITY_UPGRADE_PRICES[currentLevel - 1] || 0;
}

function requestText(request) {
  return request
    .map((key) => {
      const item = ingredientByKey(key);
      return item ? item.name : key;
    })
    .join(' + ');
}

function availableBentoPoints(achievements, bento) {
  return Math.max(0, (Number(achievements.totalScore) || 0) - (Number(bento.spentPoints) || 0));
}

function availableBentoCoins(bento) {
  return Math.max(0, Number(bento.coins) || 0);
}

function customerRewardCoins(customer) {
  return Number(customer.rewardCoins) || customer.request.length * 4;
}

function canUnlockIngredient(bento, item) {
  if (item.level <= 1) return true;
  const previous = BENTO_INGREDIENTS[item.level - 2];
  return Boolean(previous && bento.unlocked.includes(previous.key));
}

function bentoHasRice(bento) {
  return Boolean(bento && Array.isArray(bento.lunchbox) && bento.lunchbox.includes('rice'));
}

function decorateBento(achievements) {
  const bento = readBento();
  const availablePoints = availableBentoPoints(achievements, bento);
  const availableCoins = availableBentoCoins(bento);
  const capacityLevel = clampBentoCapacityLevel(bento.capacityLevel);
  const capacity = bentoCapacity(capacityLevel);
  const upgradePrice = bentoUpgradePrice(capacityLevel);
  const full = bento.lunchbox.length >= capacity;
  const hasRice = bentoHasRice(bento);
  const riceItem = ingredientByKey('rice');
  const riceTiles = riceItem
    ? Array.from({ length: 9 }, (_, index) => ({ id: `rice-${index}`, asset: riceItem.asset }))
    : [];
  const lunchboxItems = bento.lunchbox
    .filter((key) => key !== 'rice')
    .map((key, index) => {
      const item = ingredientByKey(key);
      return item ? { id: `food-${index}-${key}`, key: item.key, asset: item.asset, className: `bento-piece ${item.key}` } : null;
    })
    .filter(Boolean);
  const ingredients = BENTO_INGREDIENTS.map((item) => {
    const unlocked = bento.unlocked.includes(item.key);
    const canStep = canUnlockIngredient(bento, item);
    const affordable = availablePoints >= item.price;
    const isRice = item.key === 'rice';
    const useDisabled = !unlocked || full || !affordable || (isRice && hasRice) || (!isRice && !hasRice);
    return {
      ...item,
      unlocked,
      cardClass: `ingredient-card ${unlocked || (!unlocked && canStep && affordable) ? 'unlocked' : 'locked'}`,
      disabled: unlocked || !canStep || !affordable,
      useDisabled,
      useButtonText: full
        ? '饭盒满了'
        : (isRice && hasRice
          ? '米饭已铺好'
          : (!isRice && !hasRice
            ? '先铺米饭'
            : (affordable ? `${isRice ? '购买铺米饭' : '购买放置'} · ${item.price}分` : '积分不足'))),
      buttonText: unlocked ? '已解锁' : (!canStep ? '先解锁上一级' : (affordable ? `${item.price} 分解锁` : '积分不足')),
    };
  });
  const customers = BENTO_CUSTOMERS.map((customer) => {
    const ready = customer.request.every((key) => bento.lunchbox.includes(key));
    const served = bento.servedToday.includes(customer.key);
    return {
      ...customer,
      initial: customer.name.slice(0, 1),
      requestText: requestText(customer.request),
      rewardCoins: customerRewardCoins(customer),
      served,
      disabled: served || !ready,
      serveButtonText: served ? '已完成' : (ready ? `包装 +${customerRewardCoins(customer)}金币` : '包装'),
      buttonText: served ? '已完成' : '包装',
    };
  });
  return {
    ...bento,
    availablePoints,
    availableCoins,
    capacity: {
      level: capacityLevel,
      value: capacity,
      nextValue: bentoCapacity(capacityLevel + 1),
      maxed: capacityLevel >= BENTO_MAX_CAPACITY_LEVEL,
      price: upgradePrice,
      disabled: capacityLevel >= BENTO_MAX_CAPACITY_LEVEL || availableCoins < upgradePrice,
      upgradeButtonText: capacityLevel >= BENTO_MAX_CAPACITY_LEVEL
        ? '已满级'
        : (availableCoins >= upgradePrice ? `${upgradePrice} 金币升级` : '金币不足'),
      buttonText: capacityLevel >= BENTO_MAX_CAPACITY_LEVEL
        ? '已满级'
        : (availablePoints >= upgradePrice ? `${upgradePrice} 分升级` : '积分不足'),
    },
    hasRice,
    riceTiles,
    lunchboxItems,
    ingredients,
    unlockedIngredients: ingredients.filter((item) => item.unlocked),
    customers,
  };
}

Page({
  data: {
    saving: false,
    apiBaseUrl: '',
    profile: {
      parentConsent: true,
      dailyLimitMinutes: 25,
    },
    achievements: emptyAchievements(),
    bento: decorateBento(emptyAchievements()),
  },

  onShow() {
    const achievements = decorateAchievements();
    this.setData({
      apiBaseUrl: getBaseUrl(),
      achievements,
      bento: decorateBento(achievements),
    });
    this.loadProfile();
  },

  async loadProfile() {
    try {
      const result = await request('/api/profile');
      this.setData({
        profile: result.profile,
      });
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' });
    }
  },

  onLimitInput(event) {
    this.setData({
      profile: {
        ...this.data.profile,
        dailyLimitMinutes: Number.parseInt(event.detail.value || '25', 10),
      },
    });
  },

  onConsentChange(event) {
    this.setData({
      profile: {
        ...this.data.profile,
        parentConsent: event.detail.value,
      },
    });
  },

  onApiBaseInput(event) {
    this.setData({ apiBaseUrl: event.detail.value });
  },

  async save() {
    this.setData({ saving: true });
    wx.setStorageSync('apiBaseUrl', this.data.apiBaseUrl.trim());

    try {
      const result = await request('/api/profile', {
        method: 'PUT',
        role: 'child',
        data: {
          parentConsent: this.data.profile.parentConsent,
          dailyLimitMinutes: this.data.profile.dailyLimitMinutes,
        },
      });
      this.setData({
        profile: result.profile,
      });
      wx.showToast({ title: '已保存', icon: 'success' });
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  },

  refreshBento(nextBento) {
    if (nextBento) writeBento(nextBento);
    const achievements = decorateAchievements();
    this.setData({
      achievements,
      bento: decorateBento(achievements),
    });
  },

  buyBentoIngredient(event) {
    const key = event.currentTarget.dataset.key;
    const item = ingredientByKey(key);
    const achievements = decorateAchievements();
    const bento = readBento();
    if (!item || bento.unlocked.includes(key)) return;
    if (!canUnlockIngredient(bento, item)) {
      bento.feedback = '先把前一级食材解锁，再开这一层。';
    } else if (availableBentoPoints(achievements, bento) < item.price) {
      bento.feedback = '积分还不够，去闯几关再来。';
    } else {
      bento.unlocked.push(key);
      bento.spentPoints += item.price;
      bento.feedback = `${item.name} 解锁了，盒饭更像样了。`;
    }
    this.refreshBento(bento);
  },

  addBentoIngredient(event) {
    const key = event.currentTarget.dataset.key;
    const item = ingredientByKey(key);
    const achievements = decorateAchievements();
    const bento = readBento();
    if (!item || !bento.unlocked.includes(key)) return;
    const capacity = bentoCapacity(bento.capacityLevel);
    const hasRice = bentoHasRice(bento);
    if (bento.lunchbox.length >= capacity) {
      bento.feedback = '盒饭已经满了，升级容量或先包装。';
    } else if (key === 'rice' && hasRice) {
      bento.feedback = '米饭已经铺好了，接下来放食材。';
    } else if (key !== 'rice' && !hasRice) {
      bento.feedback = '先铺一层大米饭，再放其它食材。';
    } else if (availableBentoPoints(achievements, bento) < item.price) {
      bento.feedback = '积分不够购买这个食材，先去闯一关赚分。';
    } else {
      bento.spentPoints += item.price;
      bento.lunchbox.push(key);
      bento.feedback = key === 'rice'
        ? '大米饭铺好了。现在可以放食材。'
        : `${item.name} 购买成功，已经放进盒饭。`;
    }
    this.refreshBento(bento);
  },

  clearBento() {
    const bento = readBento();
    bento.lunchbox = [];
    bento.feedback = '盒饭清空了，可以重新装。';
    this.refreshBento(bento);
  },

  upgradeBentoCapacity() {
    const achievements = decorateAchievements();
    const bento = readBento();
    const level = clampBentoCapacityLevel(bento.capacityLevel);
    if (level >= BENTO_MAX_CAPACITY_LEVEL) {
      bento.feedback = '饭盒已经满级，最多 11 格。';
    } else {
      const price = bentoUpgradePrice(level);
      if (availableBentoCoins(bento) < price) {
        bento.feedback = '升级饭盒的金币还不够，先给顾客包装盒饭。';
      } else {
        bento.coins = availableBentoCoins(bento) - price;
        bento.capacityLevel = level + 1;
        bento.feedback = `花了 ${price} 金币，饭盒升到 Lv.${bento.capacityLevel}，现在有 ${bentoCapacity(bento.capacityLevel)} 格。`;
      }
    }
    this.refreshBento(bento);
  },

  serveBentoCustomer(event) {
    const key = event.currentTarget.dataset.key;
    const customer = BENTO_CUSTOMERS.find((item) => item.key === key);
    const bento = readBento();
    if (!customer || bento.servedToday.includes(key)) return;
    const missing = customer.request.filter((itemKey) => !bento.lunchbox.includes(itemKey));
    if (missing.length) {
      bento.feedback = `${customer.name} 还缺：${requestText(missing)}`;
    } else {
      const reward = customerRewardCoins(customer);
      bento.servedToday.push(key);
      bento.coins = availableBentoCoins(bento) + reward;
      bento.lunchbox = [];
      bento.feedback = `${customer.name} 收到盒饭啦，赚到 ${reward} 金币。`;
    }
    this.refreshBento(bento);
  },
});
