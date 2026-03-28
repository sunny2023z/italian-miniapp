// pages/learn/learn.js
const { playText } = require('../../utils/audio');

// ─── Data ────────────────────────────────────────────────────────────────────

const VOWELS = [
  { letter: 'A', phonetic: '啊', example: 'Amore（爱）' },
  { letter: 'E', phonetic: '哎', example: 'Estate（夏天）' },
  { letter: 'I', phonetic: '衣', example: 'Italiano（意大利语）' },
  { letter: 'O', phonetic: '哦', example: 'Opera（歌剧）' },
  { letter: 'U', phonetic: '乌', example: 'Uva（葡萄）' },
];

const CONSONANT_RULES = [
  {
    title: 'C 的发音规则', icon: '🔤',
    rules: [
      { pattern: 'C + a/o/u', sound: '克', example: 'Casa（房子）→ 卡扎' },
      { pattern: 'C + e/i',   sound: '奇', example: 'Ciao（你好）→ 恰欧' },
      { pattern: 'CH + e/i',  sound: '克', example: 'Che（什么）→ 克' },
    ]
  },
  {
    title: 'G 的发音规则', icon: '🔤',
    rules: [
      { pattern: 'G + a/o/u', sound: '格', example: 'Grazie（谢谢）→ 格拉兹耶' },
      { pattern: 'G + e/i',   sound: '基', example: 'Gelato（冰淇淋）→ 基拉托' },
      { pattern: 'GH + e/i',  sound: '格', example: 'Spaghetti（意面）→ 斯帕格提' },
    ]
  },
  {
    title: '特殊组合', icon: '✨',
    rules: [
      { pattern: 'GLI', sound: '利（像"扔"的声母）', example: 'Figlio（儿子）→ 费利欧' },
      { pattern: 'GN',  sound: '尼（鼻音）',         example: 'Bagno（浴室）→ 班诺' },
      { pattern: 'SCH', sound: '斯克',               example: 'Schiena（背）→ 斯基纳' },
      { pattern: 'ZZ',  sound: '兹或次',             example: 'Pizza（披萨）→ 皮萨' },
      { pattern: 'H',   sound: '不发音',             example: 'Hotel（酒店）→ 奥特尔' },
    ]
  },
];

const ALPHABET = [
  { letter: 'A', name: 'A',    phonetic: '啊' },
  { letter: 'B', name: 'Bi',   phonetic: '比' },
  { letter: 'C', name: 'Ci',   phonetic: '奇' },
  { letter: 'D', name: 'Di',   phonetic: '迪' },
  { letter: 'E', name: 'E',    phonetic: '哎' },
  { letter: 'F', name: 'Effe', phonetic: '艾费' },
  { letter: 'G', name: 'Gi',   phonetic: '基' },
  { letter: 'H', name: 'Acca', phonetic: '啊卡（不发音）' },
  { letter: 'I', name: 'I',    phonetic: '衣' },
  { letter: 'L', name: 'Elle', phonetic: '艾勒' },
  { letter: 'M', name: 'Emme', phonetic: '艾梅' },
  { letter: 'N', name: 'Enne', phonetic: '艾内' },
  { letter: 'O', name: 'O',    phonetic: '哦' },
  { letter: 'P', name: 'Pi',   phonetic: '比（清音）' },
  { letter: 'Q', name: 'Cu',   phonetic: '酷' },
  { letter: 'R', name: 'Erre', phonetic: '弹舌R' },
  { letter: 'S', name: 'Esse', phonetic: '艾赛' },
  { letter: 'T', name: 'Ti',   phonetic: '提' },
  { letter: 'U', name: 'U',    phonetic: '乌' },
  { letter: 'V', name: 'Vi',   phonetic: '维' },
  { letter: 'Z', name: 'Zeta', phonetic: '泽塔' },
];

const PHONICS_TIPS = [
  '每个元音都要清晰发音，不吞音',
  'R 要弹舌，像漱口的感觉',
  '双辅音（如 PP、TT）要稍微延长',
  '重音通常在倒数第二个音节',
  '多听多读，语感会越来越好！',
];

const LEVEL1_LESSONS = [
  {
    id: 1, title: '问候与自我介绍', time: '10分钟', emoji: '👋',
    desc: '学习最基本的意大利语问候和介绍自己',
    vocab: [
      { italian: 'Ciao',         chinese: '你好/再见',     pronunciation: '恰欧' },
      { italian: 'Buongiorno',   chinese: '早上好',        pronunciation: '波诺究诺' },
      { italian: 'Buonasera',    chinese: '晚上好',        pronunciation: '波诺色拉' },
      { italian: 'Mi chiamo...', chinese: '我叫...',       pronunciation: '米 基阿莫' },
      { italian: 'Piacere',      chinese: '很高兴认识你',  pronunciation: '皮阿切雷' },
      { italian: 'Arrivederci',  chinese: '再见（正式）',  pronunciation: '阿里维德尔奇' },
    ],
    grammar: '意大利语名词有阴阳性之分。Ciao 既可以问候也可以道别，非常灵活。Mi chiamo 后面直接加你的名字。',
    exercise: {
      question: '你想说"晚上好"，应该说：',
      options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Ciao'],
      answer: 1
    }
  },
  {
    id: 2, title: '数字 1-10', time: '15分钟', emoji: '🔢',
    desc: '掌握意大利语基础数字，购物问价必备',
    vocab: [
      { italian: 'Uno',     chinese: '一', pronunciation: '乌诺' },
      { italian: 'Due',     chinese: '二', pronunciation: '杜埃' },
      { italian: 'Tre',     chinese: '三', pronunciation: '特雷' },
      { italian: 'Quattro', chinese: '四', pronunciation: '夸托罗' },
      { italian: 'Cinque',  chinese: '五', pronunciation: '清夸' },
      { italian: 'Sei',     chinese: '六', pronunciation: '赛伊' },
      { italian: 'Sette',   chinese: '七', pronunciation: '赛特' },
      { italian: 'Otto',    chinese: '八', pronunciation: '奥托' },
      { italian: 'Nove',    chinese: '九', pronunciation: '诺维' },
      { italian: 'Dieci',   chinese: '十', pronunciation: '帝耶奇' },
    ],
    grammar: '意大利数字不难！Uno 在阴性名词前变成 Una。如：un caffè（一杯咖啡），una pizza（一个披萨）。',
    exercise: {
      question: '"五"的意大利语是：',
      options: ['Quattro', 'Sei', 'Cinque', 'Sette'],
      answer: 2
    }
  },
  {
    id: 3, title: '餐厅点餐', time: '15分钟', emoji: '🍝',
    desc: '学会在意大利餐厅点餐和交流',
    vocab: [
      { italian: 'Vorrei...',    chinese: '我想要...',  pronunciation: '沃雷伊' },
      { italian: 'Il menu',      chinese: '菜单',       pronunciation: '伊尔 梅努' },
      { italian: 'Il conto',     chinese: '账单',       pronunciation: '伊尔 孔托' },
      { italian: 'Buon appetito',chinese: '请慢用',     pronunciation: '波诺 阿配提托' },
      { italian: 'È delizioso',  chinese: '太好吃了',   pronunciation: '埃 德利兹沃索' },
      { italian: 'Cameriere',    chinese: '服务员',     pronunciation: '卡梅利耶雷' },
    ],
    grammar: 'Vorrei 是"我想要"的礼貌形式，比 Voglio（我要）更客气。在餐厅点餐总是用 Vorrei 开头，显示礼貌。',
    exercise: {
      question: '想买单时说：',
      options: ['Il menu', 'Il conto, per favore', 'Cameriere', 'Vorrei'],
      answer: 1
    }
  },
  {
    id: 4, title: '问路与交通', time: '12分钟', emoji: '🗺️',
    desc: '学习问路和使用交通工具',
    vocab: [
      { italian: "Dov'è?",        chinese: '...在哪里？', pronunciation: '多维' },
      { italian: 'Giri a destra', chinese: '右转',        pronunciation: '基利 阿 德斯特拉' },
      { italian: 'Giri a sinistra',chinese: '左转',       pronunciation: '基利 阿 西尼斯特拉' },
      { italian: 'Vada dritto',   chinese: '直走',        pronunciation: '瓦达 德利托' },
      { italian: 'La stazione',   chinese: '火车站',      pronunciation: '拉 斯塔兹欧内' },
      { italian: 'Il metro',      chinese: '地铁',        pronunciation: '伊尔 梅托罗' },
    ],
    grammar: "Dov'è 是问『在哪里』的万能句。后面加任何地点：Dov'è il bagno?（洗手间在哪里），Dov'è l'aeroporto?（机场在哪里）",
    exercise: {
      question: '"左转"的意大利语是：',
      options: ['Vada dritto', 'Giri a destra', 'Giri a sinistra', 'Tornate indietro'],
      answer: 2
    }
  },
  {
    id: 5, title: '购物表达', time: '10分钟', emoji: '🛍️',
    desc: '学会购物和讨价还价',
    vocab: [
      { italian: 'Quanto costa?', chinese: '多少钱？',    pronunciation: '夸恩托 科斯塔' },
      { italian: 'È troppo caro', chinese: '太贵了',      pronunciation: '埃 托破破 卡罗' },
      { italian: 'Ha uno sconto?',chinese: '有折扣吗？',  pronunciation: '阿 乌诺 斯孔托' },
      { italian: 'Lo prendo',     chinese: '我买了',      pronunciation: '洛 普雷恩多' },
      { italian: 'Posso provarlo?',chinese: '可以试穿吗？',pronunciation: '破索 普罗瓦尔洛' },
      { italian: 'La cassa',      chinese: '收银台',      pronunciation: '拉 卡萨' },
    ],
    grammar: 'Quanto costa? 是问单件物品价格；Quanto costano? 是问多件物品。Costa = 花费，costano 是复数形式。',
    exercise: {
      question: '"太贵了"怎么说：',
      options: ['È delizioso', 'È troppo caro', 'È molto bello', 'Ha uno sconto?'],
      answer: 1
    }
  },
  {
    id: 6, title: '酒店住宿', time: '12分钟', emoji: '🏨',
    desc: '在酒店办理入住和处理各种需求',
    vocab: [
      { italian: 'Ho una prenotazione', chinese: '我有预订',   pronunciation: '奥 乌娜 普雷诺塔兹欧内' },
      { italian: 'Camera singola',      chinese: '单人间',     pronunciation: '卡梅拉 新哥拉' },
      { italian: 'Camera doppia',       chinese: '双人间',     pronunciation: '卡梅拉 多普亚' },
      { italian: 'Check-in/Check-out',  chinese: '入住/退房',  pronunciation: '切克因/切克奥特' },
      { italian: "C'è il Wi-Fi?",       chinese: '有 Wi-Fi 吗？',pronunciation: '切 伊尔 威费' },
      { italian: 'La chiave',           chinese: '钥匙',       pronunciation: '拉 基阿维' },
    ],
    grammar: "Ho...（我有）在酒店非常重要。Ho una prenotazione（我有预订）。C'è 是『有...吗』的意思，超级实用。",
    exercise: {
      question: '"双人间"怎么说：',
      options: ['Camera singola', 'Camera doppia', 'Camera matrimoniale', 'Suite'],
      answer: 1
    }
  },
];

const LEVEL2_LESSONS = [
  {
    id: 101, title: '时间与日期', time: '12分钟', emoji: '🕐',
    desc: '约定时间、问日期，旅行必备',
    vocab: [
      { italian: 'Che ora è?',    chinese: '现在几点？',  pronunciation: '克 欧拉 埃' },
      { italian: 'Sono le tre',   chinese: '现在三点',    pronunciation: '索诺 莱 特雷' },
      { italian: 'Oggi',          chinese: '今天',        pronunciation: '奥基' },
      { italian: 'Domani',        chinese: '明天',        pronunciation: '多马尼' },
      { italian: 'La settimana',  chinese: '这周',        pronunciation: '拉 赛提马纳' },
      { italian: 'Il mese',       chinese: '这个月',      pronunciation: '伊尔 梅赛' },
    ],
    grammar: 'Sono le + 数字 表示几点钟。例如 Sono le due（两点），Sono le cinque（五点）。正午用 Mezzogiorno，午夜用 Mezzanotte。',
    exercise: {
      question: '"明天"怎么说：',
      options: ['Oggi', 'Ieri', 'Domani', 'Dopodomani'],
      answer: 2
    }
  },
  {
    id: 102, title: '天气与季节', time: '10分钟', emoji: '🌤️',
    desc: '聊天气，了解意大利四季',
    vocab: [
      { italian: 'Che tempo fa?', chinese: '天气怎么样？', pronunciation: '克 天破 法' },
      { italian: 'Fa caldo',      chinese: '天气热',       pronunciation: '法 卡多' },
      { italian: 'Fa freddo',     chinese: '天气冷',       pronunciation: '法 弗雷多' },
      { italian: 'Piove',         chinese: '下雨',         pronunciation: '皮欧维' },
      { italian: 'C\'è il sole',  chinese: '出太阳',       pronunciation: '切 伊尔 索莱' },
      { italian: 'La primavera',  chinese: '春天',         pronunciation: '拉 普里马维拉' },
    ],
    grammar: 'Fa + 形容词 是描述天气的常用结构。Fa caldo（热）/ Fa freddo（冷）/ Fa bello（好天气）。天气好时还可以说 Che bella giornata!（多美的一天！）',
    exercise: {
      question: '"下雨"用意大利语怎么说：',
      options: ['Fa caldo', 'Piove', 'Fa freddo', 'Nevica'],
      answer: 1
    }
  },
  {
    id: 103, title: '家庭称谓', time: '10分钟', emoji: '👨‍👩‍👧',
    desc: '介绍家人，拉近与当地人距离',
    vocab: [
      { italian: 'La famiglia',  chinese: '家庭',   pronunciation: '拉 法米利亚' },
      { italian: 'Il padre',     chinese: '父亲',   pronunciation: '伊尔 帕德雷' },
      { italian: 'La madre',     chinese: '母亲',   pronunciation: '拉 马德雷' },
      { italian: 'Il fratello',  chinese: '兄弟',   pronunciation: '伊尔 弗拉特罗' },
      { italian: 'La sorella',   chinese: '姐妹',   pronunciation: '拉 索雷拉' },
      { italian: 'I nonni',      chinese: '祖父母', pronunciation: '伊 诺尼' },
    ],
    grammar: '意大利语名词有阴阳性。阳性名词一般以 -o 结尾（如 padre），阴性名词以 -a 结尾（如 madre）。复数时 -o → -i，-a → -e。',
    exercise: {
      question: '"兄弟"的意大利语是：',
      options: ['La sorella', 'Il fratello', 'Il padre', 'La madre'],
      answer: 1
    }
  },
  {
    id: 104, title: '颜色与尺码', time: '10分钟', emoji: '🎨',
    desc: '购物试衣时的核心词汇',
    vocab: [
      { italian: 'Rosso',         chinese: '红色',    pronunciation: '罗索' },
      { italian: 'Blu',           chinese: '蓝色',    pronunciation: '布鲁' },
      { italian: 'Verde',         chinese: '绿色',    pronunciation: '维尔德' },
      { italian: 'Nero / Bianco', chinese: '黑 / 白', pronunciation: '内罗 / 比安科' },
      { italian: 'Piccolo',       chinese: '小号',    pronunciation: '皮科洛' },
      { italian: 'Grande',        chinese: '大号',    pronunciation: '格兰德' },
    ],
    grammar: '颜色形容词通常放在名词后面：una borsa rossa（一个红色的包）。颜色也要和名词性别数一致：rosso（阳性）/ rossa（阴性）。',
    exercise: {
      question: '"绿色"的意大利语是：',
      options: ['Rosso', 'Blu', 'Verde', 'Giallo'],
      answer: 2
    }
  },
  {
    id: 105, title: '医疗紧急', time: '12分钟', emoji: '🏥',
    desc: '紧急情况下能开口求助',
    vocab: [
      { italian: 'Aiuto!',              chinese: '救命！',      pronunciation: '阿悠托' },
      { italian: 'Ho bisogno di aiuto', chinese: '我需要帮助',  pronunciation: '奥 比索尼约 迪 阿悠托' },
      { italian: 'Chiami un medico!',   chinese: '叫医生！',    pronunciation: '基阿米 乌恩 梅迪科' },
      { italian: 'Mi fa male...',       chinese: '我的...很痛', pronunciation: '米 法 马莱' },
      { italian: "L'ospedale",          chinese: '医院',        pronunciation: '洛斯佩达莱' },
      { italian: 'La farmacia',         chinese: '药店',        pronunciation: '拉 法马恰' },
    ],
    grammar: 'Mi fa male + 身体部位 表示某处疼痛。例如：Mi fa male la testa（我头痛），Mi fa male lo stomaco（我胃痛）。',
    exercise: {
      question: '"救命！"用意大利语怎么说：',
      options: ['Grazie', 'Aiuto!', 'Prego', 'Scusi'],
      answer: 1
    }
  },
  {
    id: 106, title: '交通细节', time: '12分钟', emoji: '🚆',
    desc: '买票、乘车、换乘的实用表达',
    vocab: [
      { italian: 'Un biglietto per...',  chinese: '一张去...的票',  pronunciation: '乌恩 比利耶托 佩' },
      { italian: 'Andata e ritorno',     chinese: '来回票',          pronunciation: '安达塔 埃 里托尔诺' },
      { italian: 'Il binario',           chinese: '站台/轨道',       pronunciation: '伊尔 比纳里欧' },
      { italian: 'In ritardo',           chinese: '晚点',            pronunciation: '因 里塔尔多' },
      { italian: 'Il capolinea',         chinese: '终点站',          pronunciation: '伊尔 卡波利内阿' },
      { italian: 'Devo cambiare?',       chinese: '我需要换乘吗？',  pronunciation: '德伏 坎比阿雷' },
    ],
    grammar: 'Un biglietto per + 目的地 是买票的标准说法。例如：Un biglietto per Roma（一张去罗马的票）。加 andata e ritorno 就是来回票。',
    exercise: {
      question: '"晚点"的意大利语是：',
      options: ['In anticipo', 'In ritardo', 'Il binario', 'Il capolinea'],
      answer: 1
    }
  },
];

// ─── Computed helpers ─────────────────────────────────────────────────────────

function computeStats(lessonProgress, phonicsCompleted) {
  const allLessons = [...LEVEL1_LESSONS, ...LEVEL2_LESSONS];
  let totalCompleted = 0;
  let totalVocab = 0;

  allLessons.forEach(l => {
    if (lessonProgress[l.id]) {
      totalCompleted++;
      totalVocab += l.vocab.length;
    }
  });

  const level1Completed = LEVEL1_LESSONS.filter(l => lessonProgress[l.id]).length;
  const level2Completed = LEVEL2_LESSONS.filter(l => lessonProgress[l.id]).length;
  const allL1Done = level1Completed === LEVEL1_LESSONS.length;

  let currentLevelLabel = '入门';
  if (phonicsCompleted && level1Completed === 0) currentLevelLabel = 'L1';
  if (level1Completed > 0 && level1Completed < LEVEL1_LESSONS.length) currentLevelLabel = 'L1';
  if (allL1Done && level2Completed === 0) currentLevelLabel = 'L2';
  if (level2Completed > 0) currentLevelLabel = 'L2';
  if (level2Completed === LEVEL2_LESSONS.length) currentLevelLabel = 'L3';

  // Pre-compute which lesson IDs are unlocked (for WXML binding)
  const unlockedIds = {};
  LEVEL1_LESSONS.forEach((l, idx) => {
    if (idx === 0 || lessonProgress[LEVEL1_LESSONS[idx - 1].id]) {
      unlockedIds[l.id] = true;
    }
  });
  if (allL1Done) {
    LEVEL2_LESSONS.forEach((l, idx) => {
      if (idx === 0 || lessonProgress[LEVEL2_LESSONS[idx - 1].id]) {
        unlockedIds[l.id] = true;
      }
    });
  }

  return {
    totalCompleted,
    totalVocab,
    level1Completed,
    level2Completed,
    currentLevelLabel,
    unlockedIds,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

Page({
  data: {
    // Phonics sheet data
    vowels: VOWELS,
    consonantRules: CONSONANT_RULES,
    alphabet: ALPHABET,
    phonicsTips: PHONICS_TIPS,

    // Lesson data
    level1Lessons: LEVEL1_LESSONS,
    level2Lessons: LEVEL2_LESSONS,
    level1Total: LEVEL1_LESSONS.length,
    level2Total: LEVEL2_LESSONS.length,

    // State
    showIntro: true,   // 首次打开默认展开
    lessonProgress: {},
    phonicsCompleted: false,
    showPhonics: false,
    showLessonModal: false,
    currentLesson: null,
    lessonAnswered: false,
    selectedOption: -1,

    // Stats (computed on load)
    totalCompleted: 0,
    totalVocab: 0,
    level1Completed: 0,
    level2Completed: 0,
    currentLevelLabel: '入门',
    unlockedIds: {},
  },

  onLoad() {
    this._loadProgress();
  },

  onShow() {
    this._loadProgress();
  },

  _loadProgress() {
    const stored = wx.getStorageSync('italian_lessons') || { completed: [], phonics: false };
    const lessonProgress = {};
    (stored.completed || []).forEach(id => { lessonProgress[id] = true; });
    const phonicsCompleted = !!stored.phonics;

    const stats = computeStats(lessonProgress, phonicsCompleted);
    this.setData({ lessonProgress, phonicsCompleted, ...stats });
  },

  _saveProgress() {
    const { lessonProgress, phonicsCompleted } = this.data;
    const completed = Object.keys(lessonProgress).filter(k => lessonProgress[k]).map(Number);
    wx.setStorageSync('italian_lessons', { completed, phonics: phonicsCompleted });
  },

  onToggleIntro() {
    this.setData({ showIntro: !this.data.showIntro });
  },

  // ── Phonics ──────────────────────────────────────────────────────────────────

  onOpenPhonics() {
    this.setData({ showPhonics: true });
  },

  onClosePhonics() {
    this.setData({ showPhonics: false });
  },

  onCompletePhonics() {
    const { phonicsCompleted, lessonProgress } = this.data;
    if (!phonicsCompleted) {
      this.setData({ phonicsCompleted: true });
      const stats = computeStats(lessonProgress, true);
      this.setData({ ...stats });
      this._saveProgress();
      wx.showToast({ title: '🎉 发音入门完成！', icon: 'success' });
    }
    this.setData({ showPhonics: false });
  },

  onVowelTap(e) {
    const letter = e.currentTarget.dataset.letter;
    const item = VOWELS.find(v => v.letter === letter);
    if (item) {
      playText(item.letter);
      wx.showToast({ title: item.letter + ' → ' + item.phonetic, icon: 'none', duration: 1200 });
    }
  },

  onLetterTTSTap(e) {
    const text = e.currentTarget.dataset.letter;
    if (text) playText(text);
  },

  // ── Lesson modal ─────────────────────────────────────────────────────────────

  onLessonTap(e) {
    const lessonId = parseInt(e.currentTarget.dataset.id);

    if (!this.data.unlockedIds[lessonId]) {
      wx.showToast({ title: '请先完成前面的课程', icon: 'none' });
      return;
    }

    const allLessons = [...LEVEL1_LESSONS, ...LEVEL2_LESSONS];
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    this.setData({
      currentLesson: lesson,
      showLessonModal: true,
      lessonAnswered: false,
      selectedOption: -1,
    });
  },

  onCloseLessonModal() {
    this.setData({ showLessonModal: false });
  },

  onAnswerSelect(e) {
    const idx = parseInt(e.currentTarget.dataset.idx);
    this.setData({ selectedOption: idx, lessonAnswered: true });
  },

  onCompleteLesson() {
    const { currentLesson, lessonProgress, phonicsCompleted } = this.data;
    if (lessonProgress[currentLesson.id]) {
      this.setData({ showLessonModal: false });
      return;
    }

    const newProgress = { ...lessonProgress, [currentLesson.id]: true };
    const stats = computeStats(newProgress, phonicsCompleted);
    this.setData({ lessonProgress: newProgress, ...stats, showLessonModal: false });
    this._saveProgress();
    wx.showToast({ title: '🎉 课程完成！', icon: 'success' });
  },

  onVocabTTSTap(e) {
    const text = e.currentTarget.dataset.italian;
    if (text) playText(text);
  },

  stopPropagation() {},
});
