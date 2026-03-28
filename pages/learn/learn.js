// pages/learn/learn.js
const { playText } = require('../../utils/audio');

Page({
  data: {
    activeTab: 0, // 0=字母发音, 1=每日课程

    // Alphabet data
    vowels: [
      { letter: 'A', phonetic: '啊', example: 'Amore（爱）', sound: 'ah' },
      { letter: 'E', phonetic: '哎', example: 'Estate（夏天）', sound: 'eh' },
      { letter: 'I', phonetic: '衣', example: 'Italiano（意大利语）', sound: 'ee' },
      { letter: 'O', phonetic: '哦', example: 'Opera（歌剧）', sound: 'oh' },
      { letter: 'U', phonetic: '乌', example: 'Uva（葡萄）', sound: 'oo' },
    ],

    consonantRules: [
      {
        title: 'C 的发音规则',
        icon: '🔤',
        rules: [
          { pattern: 'C + a/o/u', sound: '克', example: 'Casa（房子）→ 卡扎' },
          { pattern: 'C + e/i', sound: '奇', example: 'Ciao（你好）→ 恰欧' },
          { pattern: 'CH + e/i', sound: '克', example: 'Che（什么）→ 克' },
        ]
      },
      {
        title: 'G 的发音规则',
        icon: '🔤',
        rules: [
          { pattern: 'G + a/o/u', sound: '格', example: 'Grazie（谢谢）→ 格拉兹耶' },
          { pattern: 'G + e/i', sound: '基', example: 'Gelato（冰淇淋）→ 基拉托' },
          { pattern: 'GH + e/i', sound: '格', example: 'Spaghetti（意面）→ 斯帕格提' },
        ]
      },
      {
        title: '特殊组合',
        icon: '✨',
        rules: [
          { pattern: 'GLI', sound: '利（像"扔"的声母）', example: 'Figlio（儿子）→ 费利欧' },
          { pattern: 'GN', sound: '尼（鼻音）', example: 'Bagno（浴室）→ 班诺' },
          { pattern: 'SCH', sound: '斯克', example: 'Schiena（背）→ 斯基纳' },
          { pattern: 'ZZ', sound: '兹或次', example: 'Pizza（披萨）→ 皮萨' },
          { pattern: 'H', sound: '不发音', example: 'Hotel（酒店）→ 奥特尔' },
        ]
      },
    ],

    alphabet: [
      { letter: 'A', name: 'A', phonetic: '啊' },
      { letter: 'B', name: 'Bi', phonetic: '比' },
      { letter: 'C', name: 'Ci', phonetic: '奇' },
      { letter: 'D', name: 'Di', phonetic: '迪' },
      { letter: 'E', name: 'E', phonetic: '哎' },
      { letter: 'F', name: 'Effe', phonetic: '艾费' },
      { letter: 'G', name: 'Gi', phonetic: '基' },
      { letter: 'H', name: 'Acca', phonetic: '啊卡（不发音）' },
      { letter: 'I', name: 'I', phonetic: '衣' },
      { letter: 'L', name: 'Elle', phonetic: '艾勒' },
      { letter: 'M', name: 'Emme', phonetic: '艾梅' },
      { letter: 'N', name: 'Enne', phonetic: '艾内' },
      { letter: 'O', name: 'O', phonetic: '哦' },
      { letter: 'P', name: 'Pi', phonetic: '比（清音）' },
      { letter: 'Q', name: 'Cu', phonetic: '酷' },
      { letter: 'R', name: 'Erre', phonetic: '弹舌R' },
      { letter: 'S', name: 'Esse', phonetic: '艾赛' },
      { letter: 'T', name: 'Ti', phonetic: '提' },
      { letter: 'U', name: 'U', phonetic: '乌' },
      { letter: 'V', name: 'Vi', phonetic: '维' },
      { letter: 'Z', name: 'Zeta', phonetic: '泽塔' },
    ],

    // Lessons data
    lessons: [
      {
        id: 1,
        title: '问候与自我介绍',
        time: '10分钟',
        emoji: '👋',
        desc: '学习最基本的意大利语问候和介绍自己',
        vocab: [
          { italian: 'Ciao', chinese: '你好/再见', pronunciation: '恰欧' },
          { italian: 'Buongiorno', chinese: '早上好', pronunciation: '波诺究诺' },
          { italian: 'Buonasera', chinese: '晚上好', pronunciation: '波诺色拉' },
          { italian: 'Mi chiamo...', chinese: '我叫...', pronunciation: '米 基阿莫' },
          { italian: 'Piacere', chinese: '很高兴认识你', pronunciation: '皮阿切雷' },
          { italian: 'Arrivederci', chinese: '再见（正式）', pronunciation: '阿里维德尔奇' },
        ],
        grammar: '意大利语名词有阴阳性之分。人名后常跟！号表达热情。Ciao既可以问候也可以道别，非常灵活。',
        exercise: {
          question: '你想说"晚上好"，应该说：',
          options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Ciao'],
          answer: 1
        }
      },
      {
        id: 2,
        title: '数字 1-10',
        time: '15分钟',
        emoji: '🔢',
        desc: '掌握意大利语基础数字',
        vocab: [
          { italian: 'Uno', chinese: '一', pronunciation: '乌诺' },
          { italian: 'Due', chinese: '二', pronunciation: '杜埃' },
          { italian: 'Tre', chinese: '三', pronunciation: '特雷' },
          { italian: 'Quattro', chinese: '四', pronunciation: '夸托罗' },
          { italian: 'Cinque', chinese: '五', pronunciation: '清夸' },
          { italian: 'Sei', chinese: '六', pronunciation: '赛伊' },
          { italian: 'Sette', chinese: '七', pronunciation: '赛特' },
          { italian: 'Otto', chinese: '八', pronunciation: '奥托' },
          { italian: 'Nove', chinese: '九', pronunciation: '诺维' },
          { italian: 'Dieci', chinese: '十', pronunciation: '帝耶奇' },
        ],
        grammar: '意大利数字不难！Uno在阴性名词前变成Una。如：un caffè（一杯咖啡），una pizza（一个披萨）。',
        exercise: {
          question: '"五"的意大利语是：',
          options: ['Quattro', 'Sei', 'Cinque', 'Sette'],
          answer: 2
        }
      },
      {
        id: 3,
        title: '餐厅点餐',
        time: '15分钟',
        emoji: '🍝',
        desc: '学会在意大利餐厅点餐和交流',
        vocab: [
          { italian: 'Vorrei...', chinese: '我想要...', pronunciation: '沃雷伊' },
          { italian: 'Il menu', chinese: '菜单', pronunciation: '伊尔 梅努' },
          { italian: 'Il conto', chinese: '账单', pronunciation: '伊尔 孔托' },
          { italian: 'Buon appetito', chinese: '请慢用', pronunciation: '波诺 阿配提托' },
          { italian: 'È delizioso', chinese: '太好吃了', pronunciation: '埃 德利兹沃索' },
          { italian: 'Cameriere', chinese: '服务员', pronunciation: '卡梅利耶雷' },
        ],
        grammar: 'Vorrei是"我想要"的礼貌形式，比Voglio（我要）更客气。在餐厅点餐总是用Vorrei开头，显示礼貌。',
        exercise: {
          question: '想买单时说：',
          options: ['Il menu', 'Il conto, per favore', 'Cameriere', 'Vorrei'],
          answer: 1
        }
      },
      {
        id: 4,
        title: '问路与交通',
        time: '12分钟',
        emoji: '🗺️',
        desc: '学习问路和使用交通工具',
        vocab: [
          { italian: "Dov'è?", chinese: '...在哪里？', pronunciation: '多维' },
          { italian: 'Giri a destra', chinese: '右转', pronunciation: '基利 阿 德斯特拉' },
          { italian: 'Giri a sinistra', chinese: '左转', pronunciation: '基利 阿 西尼斯特拉' },
          { italian: 'Vada dritto', chinese: '直走', pronunciation: '瓦达 德利托' },
          { italian: 'La stazione', chinese: '火车站', pronunciation: '拉 斯塔兹欧内' },
          { italian: 'Il metro', chinese: '地铁', pronunciation: '伊尔 梅托罗' },
        ],
        grammar: 'Dov\'è是问"在哪里"的万能句。后面加任何地点都可以：Dov\'è il bagno?(洗手间在哪里)，Dov\'è l\'aeroporto?(机场在哪里)',
        exercise: {
          question: '"左转"的意大利语是：',
          options: ['Vada dritto', 'Giri a destra', 'Giri a sinistra', 'Tornate indietro'],
          answer: 2
        }
      },
      {
        id: 5,
        title: '购物表达',
        time: '10分钟',
        emoji: '🛍️',
        desc: '学会购物和讨价还价',
        vocab: [
          { italian: 'Quanto costa?', chinese: '多少钱？', pronunciation: '夸恩托 科斯塔' },
          { italian: 'È troppo caro', chinese: '太贵了', pronunciation: '埃 托破破 卡罗' },
          { italian: 'Ha uno sconto?', chinese: '有折扣吗？', pronunciation: '阿 乌诺 斯孔托' },
          { italian: 'Lo prendo', chinese: '我买了', pronunciation: '洛 普雷恩多' },
          { italian: 'Posso provarlo?', chinese: '可以试穿吗？', pronunciation: '破索 普罗瓦尔洛' },
          { italian: 'La cassa', chinese: '收银台', pronunciation: '拉 卡萨' },
        ],
        grammar: 'Quanto costa? 是问单件物品价格；Quanto costano? 是问多件物品。Costa=花费，costano是复数形式。',
        exercise: {
          question: '"太贵了"怎么说：',
          options: ['È delizioso', 'È troppo caro', 'È molto bello', 'Ha uno sconto?'],
          answer: 1
        }
      },
      {
        id: 6,
        title: '酒店住宿',
        time: '12分钟',
        emoji: '🏨',
        desc: '在酒店办理入住和处理各种需求',
        vocab: [
          { italian: 'Ho una prenotazione', chinese: '我有预订', pronunciation: '奥 乌娜 普雷诺塔兹欧内' },
          { italian: 'Camera singola', chinese: '单人间', pronunciation: '卡梅拉 新哥拉' },
          { italian: 'Camera doppia', chinese: '双人间', pronunciation: '卡梅拉 多普亚' },
          { italian: 'Check-in/Check-out', chinese: '入住/退房', pronunciation: '切克因/切克奥特' },
          { italian: "C'è il Wi-Fi?", chinese: '有Wi-Fi吗？', pronunciation: '切 伊尔 威费' },
          { italian: 'La chiave', chinese: '钥匙', pronunciation: '拉 基阿维' },
        ],
        grammar: '酒店用语中Ho...（我有）非常重要。Ho una prenotazione（我有预订）。C\'è是"有...吗/在吗"的意思，超级实用。',
        exercise: {
          question: '"双人间"怎么说：',
          options: ['Camera singola', 'Camera doppia', 'Camera matrimoniale', 'Suite'],
          answer: 1
        }
      },
    ],

    currentLesson: null,
    showLessonModal: false,
    lessonAnswered: false,
    selectedOption: -1,
    lessonProgress: {},
  },

  onLoad() {
    const lessonData = wx.getStorageSync('italian_lessons') || { completed: [], current: 0 };
    const lessonProgress = {};
    lessonData.completed.forEach(id => { lessonProgress[id] = true; });
    this.setData({ lessonProgress });
  },

  onShow() {
    const lessonData = wx.getStorageSync('italian_lessons') || { completed: [], current: 0 };
    const lessonProgress = {};
    lessonData.completed.forEach(id => { lessonProgress[id] = true; });
    this.setData({ lessonProgress });
  },

  onTabSwitch(e) {
    const tab = parseInt(e.currentTarget.dataset.tab);
    this.setData({ activeTab: tab });
  },

  onLetterTap(e) {
    const letter = e.currentTarget.dataset.letter;
    const phonetic = e.currentTarget.dataset.phonetic;
    wx.showToast({ title: letter + ' = ' + phonetic, icon: 'none', duration: 1500 });
  },

  onVowelTap(e) {
    const letter = e.currentTarget.dataset.letter;
    const phonetic = e.currentTarget.dataset.phonetic;
    wx.showToast({ title: '发音：' + phonetic, icon: 'none', duration: 1500 });
  },

  onLessonTap(e) {
    const idx = parseInt(e.currentTarget.dataset.idx);
    const lesson = this.data.lessons[idx];
    if (!this._isLessonUnlocked(idx)) {
      wx.showToast({ title: '请先完成前面的课程', icon: 'none' });
      return;
    }
    this.setData({
      currentLesson: lesson,
      showLessonModal: true,
      lessonAnswered: false,
      selectedOption: -1,
    });
  },

  _isLessonUnlocked(idx) {
    if (idx === 0) return true;
    const prevLesson = this.data.lessons[idx - 1];
    return !!this.data.lessonProgress[prevLesson.id];
  },

  isLessonUnlocked(idx) {
    return this._isLessonUnlocked(idx);
  },

  onCloseLessonModal() {
    this.setData({ showLessonModal: false });
  },

  onAnswerSelect(e) {
    const idx = parseInt(e.currentTarget.dataset.idx);
    this.setData({ selectedOption: idx, lessonAnswered: true });
  },

  onCompleteLesson() {
    const lesson = this.data.currentLesson;
    const lessonData = wx.getStorageSync('italian_lessons') || { completed: [], current: 0 };
    if (!lessonData.completed.includes(lesson.id)) {
      lessonData.completed.push(lesson.id);
    }
    lessonData.current = Math.max(lessonData.current, lesson.id);
    wx.setStorageSync('italian_lessons', lessonData);

    const lessonProgress = { ...this.data.lessonProgress };
    lessonProgress[lesson.id] = true;
    this.setData({ lessonProgress, showLessonModal: false });

    wx.showToast({ title: '🎉 课程完成！', icon: 'success' });
  },

  // 播放词汇卡片发音（Modal 内）
  onVocabTTSTap(e) {
    const text = e.currentTarget.dataset.italian;
    if (text) playText(text);
  },

  // 播放字母发音（字母表）
  onLetterTTSTap(e) {
    const text = e.currentTarget.dataset.letter;
    if (text) playText(text);
  },
});
