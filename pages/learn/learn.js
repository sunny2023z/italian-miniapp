// pages/learn/learn.js
const { playText } = require('../../utils/audio');

// ─── Phonics Data ─────────────────────────────────────────────────────────────

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

// ─── 第一阶段：语言基础 ───────────────────────────────────────────────────────

const FOUNDATION_LESSONS = [
  {
    id: 301, title: '人称代词', time: '8分钟', emoji: '👤',
    desc: '我、你、他、她——开口说话的主语',
    vocab: [
      { italian: 'io',       chinese: '我',    pronunciation: '伊欧' },
      { italian: 'tu',       chinese: '你',    pronunciation: '图' },
      { italian: 'lui',      chinese: '他',    pronunciation: '路伊' },
      { italian: 'lei',      chinese: '她',    pronunciation: '蕾伊' },
      { italian: 'noi',      chinese: '我们',  pronunciation: '诺伊' },
      { italian: 'voi',      chinese: '你们',  pronunciation: '沃伊' },
      { italian: 'loro',     chinese: '他们',  pronunciation: '洛罗' },
    ],
    grammar: '意大利语的主语代词通常可以省略，因为动词变位本身就能表明是谁在说话。Io parlo（我说）可以直接说 parlo，意思一样。但在强调或对比时加上主语：io voglio questo, tu vuoi quello（我要这个，你要那个）。',
    conjugation: null,
    exercise: {
      question: '"她"的意大利语是：',
      options: ['lui', 'lei', 'loro', 'tu'],
      answer: 1,
    }
  },
  {
    id: 302, title: 'essere：我是/在', time: '12分钟', emoji: '🔵',
    desc: '最重要的动词，会说"我是谁"',
    vocab: [
      { italian: 'sono',    chinese: '我是 / 我在',   pronunciation: '索诺' },
      { italian: 'sei',     chinese: '你是 / 你在',   pronunciation: '赛伊' },
      { italian: 'è',       chinese: '他/她是 / 在',  pronunciation: '埃' },
      { italian: 'siamo',   chinese: '我们是',        pronunciation: '夏莫' },
      { italian: 'siete',   chinese: '你们是',        pronunciation: '夏特' },
      { italian: 'sono',    chinese: '他们是',        pronunciation: '索诺' },
    ],
    grammar: 'essere 是意大利语最重要的动词，相当于英语的 "be"。用法：① 介绍自己：Sono Marco（我是马可）② 描述状态：Sei stanco?（你累了吗？）③ 表示国籍：Siamo cinesi（我们是中国人）④ 构成过去时：Sono andato（我去了）。',
    conjugation: {
      title: 'essere 变位表',
      rows: [
        { person: 'io',   form: 'sono',   meaning: '我是' },
        { person: 'tu',   form: 'sei',    meaning: '你是' },
        { person: 'lui/lei', form: 'è',   meaning: '他/她是' },
        { person: 'noi',  form: 'siamo',  meaning: '我们是' },
        { person: 'voi',  form: 'siete',  meaning: '你们是' },
        { person: 'loro', form: 'sono',   meaning: '他们是' },
      ]
    },
    exercise: {
      question: '"你是中国人吗？"应该用哪个形式：',
      options: ['sono cinese?', 'sei cinese?', 'è cinese?', 'siamo cinesi?'],
      answer: 1,
    }
  },
  {
    id: 303, title: 'avere：我有', time: '12分钟', emoji: '🟢',
    desc: '"我有预订" "我有问题" 全靠它',
    vocab: [
      { italian: 'ho',      chinese: '我有',    pronunciation: '奥' },
      { italian: 'hai',     chinese: '你有',    pronunciation: '阿伊' },
      { italian: 'ha',      chinese: '他/她有', pronunciation: '阿' },
      { italian: 'abbiamo', chinese: '我们有',  pronunciation: '阿比阿莫' },
      { italian: 'avete',   chinese: '你们有',  pronunciation: '阿维特' },
      { italian: 'hanno',   chinese: '他们有',  pronunciation: '安诺' },
    ],
    grammar: 'avere 的用法：① 拥有：Ho una macchina（我有一辆车）② 年龄：Ho venticinque anni（我25岁）③ 感受：Ho fame（我饿了）/ Ho sete（我渴了）/ Ho freddo（我冷）④ 构成过去时：Ho mangiato（我吃了）。注意：avere 的 h 不发音！',
    conjugation: {
      title: 'avere 变位表',
      rows: [
        { person: 'io',   form: 'ho',      meaning: '我有' },
        { person: 'tu',   form: 'hai',     meaning: '你有' },
        { person: 'lui/lei', form: 'ha',   meaning: '他/她有' },
        { person: 'noi',  form: 'abbiamo', meaning: '我们有' },
        { person: 'voi',  form: 'avete',   meaning: '你们有' },
        { person: 'loro', form: 'hanno',   meaning: '他们有' },
      ]
    },
    exercise: {
      question: '"我有预订"怎么说：',
      options: ['Sono una prenotazione', 'Ho una prenotazione', 'Hai una prenotazione', 'Ha una prenotazione'],
      answer: 1,
    }
  },
  {
    id: 304, title: '名词性别与冠词', time: '15分钟', emoji: '🏷️',
    desc: '每个名词都属于「阳性」或「阴性」——这决定了前面跟什么词',
    concept: '意大利语里每个名词都有一个「性别」——阳性（maschile）或阴性（femminile）。这跟物体本身没有关系，只是一种分类系统，就像给东西贴 A 类或 B 类的标签。阳性名词前用 il/un，阴性名词前用 la/una。冠词、形容词、物主代词都要跟这个「类别」保持一致，配错了意大利人能一眼听出来。',
    conceptTip: '💡 记新单词时，连同冠词一起记：不要只记 libro，要记 il libro。这样阴阳性就自然进脑子了。',
    vocab: [
      { italian: 'il / lo / l\'', chinese: '定冠词（阳性）= the', pronunciation: '伊尔 / 洛 / 尔' },
      { italian: 'la / l\'',      chinese: '定冠词（阴性）= the', pronunciation: '拉 / 尔' },
      { italian: 'un / uno',      chinese: '不定冠词（阳性）= a', pronunciation: '乌恩 / 乌诺' },
      { italian: 'una / un\'',    chinese: '不定冠词（阴性）= a', pronunciation: '乌娜 / 乌恩' },
      { italian: 'il libro',      chinese: '书（阳性）',          pronunciation: '伊尔 利布罗' },
      { italian: 'la borsa',      chinese: '包（阴性）',          pronunciation: '拉 博尔萨' },
    ],
    grammar: '判断规律：名词以 -o 结尾通常是阳性（il libro 书），以 -a 结尾通常是阴性（la borsa 包）。以 -e 结尾需要靠记忆（il ristorante 阳性，la stazione 阴性）。复数变化：阳性 -o→-i（libri 书们），阴性 -a→-e（borse 包们）。注意：阴阳性和物体本身无关，pizza 是阴性不是因为它"女性化"，纯粹是历史沿革。',
    conjugation: null,
    exercise: {
      question: '"一杯咖啡"的正确说法是：',
      options: ['il caffè', 'la caffè', 'un caffè', 'una caffè'],
      answer: 2,
    }
  },
  {
    id: 305, title: '物主代词', time: '12分钟', emoji: '👐',
    desc: '我的、你的、他的——形式跟「所属物」的性别走，不跟主语走',
    concept: '物主代词（我的/你的/他的）在意大利语里要和「被拥有的东西」的阴阳性匹配，不是和说话人匹配。这一点和中文很不同：中文的「我的」永远是「我的」，但意大利语里「我的书」和「我的包」用的是不同形式。',
    conceptTip: '💡 口诀：物主代词跟着「物」走，不跟着「人」走。',
    vocab: [
      { italian: 'mio / mia',       chinese: '我的（阳性物/阴性物）',    pronunciation: '米欧 / 米阿' },
      { italian: 'tuo / tua',       chinese: '你的（阳性物/阴性物）',    pronunciation: '图欧 / 图阿' },
      { italian: 'suo / sua',       chinese: '他的/她的（阳性物/阴性物）',pronunciation: '苏欧 / 苏阿' },
      { italian: 'nostro / nostra', chinese: '我们的（阳性物/阴性物）',  pronunciation: '诺斯特罗 / 诺斯特拉' },
      { italian: 'vostro / vostra', chinese: '你们的（阳性物/阴性物）',  pronunciation: '沃斯特罗 / 沃斯特拉' },
      { italian: 'loro',            chinese: '他们的（阴阳同形，不变）', pronunciation: '洛罗' },
    ],
    grammar: '例子：il mio libro（我的书，libro 阳性→mio）/ la mia borsa（我的包，borsa 阴性→mia）。不管说话人是男是女，决定用 mio 还是 mia 的是「书/包」，不是「我」。家庭成员单数时省略冠词：mio padre（我爸爸）/ mia madre（我妈妈）。复数加冠词：i miei genitori（我的父母）。',
    conjugation: null,
    exercise: {
      question: '"我的包"怎么说（borsa 阴性）：',
      options: ['il mio borsa', 'la mia borsa', 'il mia borsa', 'la mio borsa'],
      answer: 1,
    }
  },
  {
    id: 306, title: '形容词变形', time: '10分钟', emoji: '✏️',
    desc: '形容词要和名词的性别数一致',
    vocab: [
      { italian: 'bello / bella',     chinese: '美丽的（阳/阴）',   pronunciation: '贝洛 / 贝拉' },
      { italian: 'belli / belle',     chinese: '美丽的（阳复/阴复）',pronunciation: '贝利 / 贝莱' },
      { italian: 'buono / buona',     chinese: '好的（阳/阴）',     pronunciation: '波诺 / 波娜' },
      { italian: 'grande',            chinese: '大的（阴阳同形）',  pronunciation: '格兰德' },
      { italian: 'grandi',            chinese: '大的（复数同形）',  pronunciation: '格兰迪' },
      { italian: 'nuovo / nuova',     chinese: '新的（阳/阴）',     pronunciation: '诺沃 / 诺瓦' },
    ],
    grammar: '形容词规律：① -o/-a/-i/-e 型（bello/bella/belli/belle）② -e/-i 型（grande/grandi，阴阳同形）。形容词通常放名词后：una ragazza bella（一个漂亮的女孩）。但常用形容词 bello、buono、grande、nuovo 可以放前面，意思略有变化：un buon vino（一瓶好酒，放前面常去掉词尾）。',
    conjugation: null,
    exercise: {
      question: '"两个漂亮的女孩"是：',
      options: ['due ragazze bello', 'due ragazze belle', 'due ragazze belli', 'due ragazza bella'],
      answer: 1,
    }
  },
];

// ─── 第二阶段：核心动词 ───────────────────────────────────────────────────────

const VERBS_LESSONS = [
  {
    id: 401, title: 'fare：做 / 制作', time: '10分钟', emoji: '🛠️',
    desc: '超高频动词，能造出无数日常句子',
    vocab: [
      { italian: 'faccio',  chinese: '我做',    pronunciation: '法乔' },
      { italian: 'fai',     chinese: '你做',    pronunciation: '法伊' },
      { italian: 'fa',      chinese: '他/她做', pronunciation: '法' },
      { italian: 'facciamo',chinese: '我们做',  pronunciation: '法乔莫' },
      { italian: 'fate',    chinese: '你们做',  pronunciation: '法特' },
      { italian: 'fanno',   chinese: '他们做',  pronunciation: '范诺' },
    ],
    grammar: 'fare 的常用搭配：fare colazione（吃早饭）/ fare una passeggiata（散步）/ fare la doccia（洗澡）/ fare spese（购物）/ fare foto（拍照）/ fare tardi（迟到）/ fare caldo/freddo（天热/冷，主语是天气，不是人）。',
    conjugation: {
      title: 'fare 变位表',
      rows: [
        { person: 'io',      form: 'faccio',   meaning: '我做' },
        { person: 'tu',      form: 'fai',      meaning: '你做' },
        { person: 'lui/lei', form: 'fa',       meaning: '他/她做' },
        { person: 'noi',     form: 'facciamo', meaning: '我们做' },
        { person: 'voi',     form: 'fate',     meaning: '你们做' },
        { person: 'loro',    form: 'fanno',    meaning: '他们做' },
      ]
    },
    exercise: {
      question: '"我在拍照"怎么说：',
      options: ['Faccio foto', 'Fai foto', 'Fare foto', 'Fanno foto'],
      answer: 0,
    }
  },
  {
    id: 402, title: 'andare：去', time: '10分钟', emoji: '🚶',
    desc: '旅行第一动词——我去哪里',
    vocab: [
      { italian: 'vado',    chinese: '我去',    pronunciation: '瓦多' },
      { italian: 'vai',     chinese: '你去',    pronunciation: '瓦伊' },
      { italian: 'va',      chinese: '他/她去', pronunciation: '瓦' },
      { italian: 'andiamo', chinese: '我们去',  pronunciation: '安迪阿莫' },
      { italian: 'andate',  chinese: '你们去',  pronunciation: '安达特' },
      { italian: 'vanno',   chinese: '他们去',  pronunciation: '万诺' },
    ],
    grammar: 'andare + a/in 表示去某地。去城市用 a：Vado a Roma（我去罗马）/ Vado a Milano（我去米兰）。去国家/地区用 in：Vado in Italia（我去意大利）/ Vado in Toscana（我去托斯卡纳）。Andiamo!（我们走吧！）是旅行中最常用的短语之一。',
    conjugation: {
      title: 'andare 变位表',
      rows: [
        { person: 'io',      form: 'vado',    meaning: '我去' },
        { person: 'tu',      form: 'vai',     meaning: '你去' },
        { person: 'lui/lei', form: 'va',      meaning: '他/她去' },
        { person: 'noi',     form: 'andiamo', meaning: '我们去' },
        { person: 'voi',     form: 'andate',  meaning: '你们去' },
        { person: 'loro',    form: 'vanno',   meaning: '他们去' },
      ]
    },
    exercise: {
      question: '"我去罗马"是：',
      options: ['Vado in Roma', 'Vado a Roma', 'Vai a Roma', 'Andiamo Roma'],
      answer: 1,
    }
  },
  {
    id: 403, title: 'venire：来', time: '10分钟', emoji: '🤝',
    desc: '"我来了" "你来哪里的" 旅行必用',
    vocab: [
      { italian: 'vengo',   chinese: '我来',    pronunciation: '文哥' },
      { italian: 'vieni',   chinese: '你来',    pronunciation: '维耶尼' },
      { italian: 'viene',   chinese: '他/她来', pronunciation: '维耶内' },
      { italian: 'veniamo', chinese: '我们来',  pronunciation: '维尼阿莫' },
      { italian: 'venite',  chinese: '你们来',  pronunciation: '维尼特' },
      { italian: 'vengono', chinese: '他们来',  pronunciation: '文哥诺' },
    ],
    grammar: 'venire 常用搭配：Da dove vieni?（你从哪里来？）/ Vengo dalla Cina（我来自中国）/ Vieni con me?（你跟我来吗？）/ Vengo subito（我马上来）。注意 da + 国家表示来源：vengo dalla Cina（中国），vengo dal Giappone（日本）。',
    conjugation: {
      title: 'venire 变位表',
      rows: [
        { person: 'io',      form: 'vengo',   meaning: '我来' },
        { person: 'tu',      form: 'vieni',   meaning: '你来' },
        { person: 'lui/lei', form: 'viene',   meaning: '他/她来' },
        { person: 'noi',     form: 'veniamo', meaning: '我们来' },
        { person: 'voi',     form: 'venite',  meaning: '你们来' },
        { person: 'loro',    form: 'vengono', meaning: '他们来' },
      ]
    },
    exercise: {
      question: '"你从哪里来？"是：',
      options: ['Dove vai?', 'Da dove vieni?', 'Da dove viene?', 'Dove vieni?'],
      answer: 1,
    }
  },
  {
    id: 404, title: 'volere：想要', time: '10分钟', emoji: '💭',
    desc: '点餐、购物、表达愿望的核心',
    vocab: [
      { italian: 'voglio',  chinese: '我想要',    pronunciation: '沃利欧' },
      { italian: 'vuoi',    chinese: '你想要',    pronunciation: '沃伊' },
      { italian: 'vuole',   chinese: '他/她想要', pronunciation: '沃莱' },
      { italian: 'vogliamo',chinese: '我们想要',  pronunciation: '沃利阿莫' },
      { italian: 'volete',  chinese: '你们想要',  pronunciation: '沃莱特' },
      { italian: 'vogliono',chinese: '他们想要',  pronunciation: '沃利诺' },
    ],
    grammar: 'Voglio 是直接表达想要，Vorrei（我想要，条件式）更礼貌，餐厅购物首选 Vorrei。volere + 动词原形：Voglio dormire（我想睡觉）/ Voglio andare a Venezia（我想去威尼斯）/ Vuoi venire con me?（你想和我一起来吗？）',
    conjugation: {
      title: 'volere 变位表',
      rows: [
        { person: 'io',      form: 'voglio',   meaning: '我想要' },
        { person: 'tu',      form: 'vuoi',     meaning: '你想要' },
        { person: 'lui/lei', form: 'vuole',    meaning: '他/她想要' },
        { person: 'noi',     form: 'vogliamo', meaning: '我们想要' },
        { person: 'voi',     form: 'volete',   meaning: '你们想要' },
        { person: 'loro',    form: 'vogliono', meaning: '他们想要' },
      ]
    },
    exercise: {
      question: '"我想去威尼斯"是：',
      options: ['Voglio andare a Venezia', 'Vuoi andare a Venezia', 'Voglio vai a Venezia', 'Vorrei vai Venezia'],
      answer: 0,
    }
  },
  {
    id: 405, title: 'potere：能 / 可以', time: '10分钟', emoji: '✅',
    desc: '礼貌请求和询问许可的万能钥匙',
    vocab: [
      { italian: 'posso',   chinese: '我可以',    pronunciation: '破索' },
      { italian: 'puoi',    chinese: '你可以',    pronunciation: '破伊' },
      { italian: 'può',     chinese: '他/她可以', pronunciation: '破' },
      { italian: 'possiamo',chinese: '我们可以',  pronunciation: '破夏莫' },
      { italian: 'potete',  chinese: '你们可以',  pronunciation: '破特特' },
      { italian: 'possono', chinese: '他们可以',  pronunciation: '破索诺' },
    ],
    grammar: 'Posso + 动词原形 是最常用的礼貌请求句型：Posso avere il conto?（可以给我账单吗？）/ Posso entrare?（我可以进来吗？）/ Posso pagare con carta?（可以刷卡吗？）。Può ripetere?（您能重复一遍吗？）是和意大利人交流时的救命句。',
    conjugation: {
      title: 'potere 变位表',
      rows: [
        { person: 'io',      form: 'posso',    meaning: '我可以' },
        { person: 'tu',      form: 'puoi',     meaning: '你可以' },
        { person: 'lui/lei', form: 'può',      meaning: '他/她可以' },
        { person: 'noi',     form: 'possiamo', meaning: '我们可以' },
        { person: 'voi',     form: 'potete',   meaning: '你们可以' },
        { person: 'loro',    form: 'possono',  meaning: '他们可以' },
      ]
    },
    exercise: {
      question: '"可以刷卡吗？"是：',
      options: ['Voglio pagare con carta', 'Posso pagare con carta?', 'Puoi pagare con carta?', 'Può pagare con carta?'],
      answer: 1,
    }
  },
  {
    id: 406, title: 'dovere：必须 / 应该', time: '10分钟', emoji: '⚠️',
    desc: '表达义务和必要性',
    vocab: [
      { italian: 'devo',    chinese: '我必须',    pronunciation: '德沃' },
      { italian: 'devi',    chinese: '你必须',    pronunciation: '德维' },
      { italian: 'deve',    chinese: '他/她必须', pronunciation: '德维' },
      { italian: 'dobbiamo',chinese: '我们必须',  pronunciation: '多比阿莫' },
      { italian: 'dovete',  chinese: '你们必须',  pronunciation: '多维特' },
      { italian: 'devono',  chinese: '他们必须',  pronunciation: '德沃诺' },
    ],
    grammar: 'Devo + 动词原形：Devo andare（我得走了）/ Devo cambiare treno?（我需要换车吗？）/ Devo prendere una medicina（我需要吃药）。在紧急情况和交通询问中特别有用。也可以表示应当：Devi provare la pizza napoletana!（你应该尝尝那不勒斯披萨！）',
    conjugation: {
      title: 'dovere 变位表',
      rows: [
        { person: 'io',      form: 'devo',     meaning: '我必须' },
        { person: 'tu',      form: 'devi',     meaning: '你必须' },
        { person: 'lui/lei', form: 'deve',     meaning: '他/她必须' },
        { person: 'noi',     form: 'dobbiamo', meaning: '我们必须' },
        { person: 'voi',     form: 'dovete',   meaning: '你们必须' },
        { person: 'loro',    form: 'devono',   meaning: '他们必须' },
      ]
    },
    exercise: {
      question: '"我需要换车吗？"是：',
      options: ['Posso cambiare treno?', 'Voglio cambiare treno?', 'Devo cambiare treno?', 'Devi cambiare treno?'],
      answer: 2,
    }
  },
  {
    id: 407, title: 'sapere：知道 / 会', time: '10分钟', emoji: '🧠',
    desc: '问信息、表达会不会做某事',
    vocab: [
      { italian: 'so',      chinese: '我知道/会', pronunciation: '索' },
      { italian: 'sai',     chinese: '你知道/会', pronunciation: '赛伊' },
      { italian: 'sa',      chinese: '他/她知道', pronunciation: '萨' },
      { italian: 'sappiamo',chinese: '我们知道',  pronunciation: '萨皮阿莫' },
      { italian: 'sapete',  chinese: '你们知道',  pronunciation: '萨皮特' },
      { italian: 'sanno',   chinese: '他们知道',  pronunciation: '桑诺' },
    ],
    grammar: 'sapere 有两个核心用法：① sapere + 从句（知道某事）：Sai dove è la stazione?（你知道车站在哪里吗？）② sapere + 动词原形（会做某事）：Sai parlare italiano?（你会说意大利语吗？）/ Non so guidare（我不会开车）。Non lo so 是"我不知道"，旅行中超实用的诚实表达。',
    conjugation: {
      title: 'sapere 变位表',
      rows: [
        { person: 'io',      form: 'so',       meaning: '我知道' },
        { person: 'tu',      form: 'sai',      meaning: '你知道' },
        { person: 'lui/lei', form: 'sa',       meaning: '他/她知道' },
        { person: 'noi',     form: 'sappiamo', meaning: '我们知道' },
        { person: 'voi',     form: 'sapete',   meaning: '你们知道' },
        { person: 'loro',    form: 'sanno',    meaning: '他们知道' },
      ]
    },
    exercise: {
      question: '"你知道车站在哪里吗？"是：',
      options: ['Sai dove è la stazione?', 'So dove è la stazione?', 'Sa dove è la stazione?', 'Sapete la stazione?'],
      answer: 0,
    }
  },
  {
    id: 408, title: 'stare：状态 / 停留', time: '10分钟', emoji: '🌡️',
    desc: '"你好吗？" 背后的动词',
    vocab: [
      { italian: 'sto',     chinese: '我（状态）',    pronunciation: '斯托' },
      { italian: 'stai',    chinese: '你（状态）',    pronunciation: '斯塔伊' },
      { italian: 'sta',     chinese: '他/她（状态）', pronunciation: '斯塔' },
      { italian: 'stiamo',  chinese: '我们（状态）',  pronunciation: '斯迪阿莫' },
      { italian: 'state',   chinese: '你们（状态）',  pronunciation: '斯塔特' },
      { italian: 'stanno',  chinese: '他们（状态）',  pronunciation: '斯坦诺' },
    ],
    grammar: 'stare 和 essere 容易混淆：essere 表示本质属性（我是中国人），stare 表示当下状态（我现在很好）。Come stai?（你好吗？）/ Sto bene（我很好）/ Sto male（我不舒服）。stare + 现在分词构成进行时：Sto mangiando（我正在吃）/ Sto aspettando（我在等）。',
    conjugation: {
      title: 'stare 变位表',
      rows: [
        { person: 'io',      form: 'sto',    meaning: '我（状态）' },
        { person: 'tu',      form: 'stai',   meaning: '你（状态）' },
        { person: 'lui/lei', form: 'sta',    meaning: '他/她（状态）' },
        { person: 'noi',     form: 'stiamo', meaning: '我们（状态）' },
        { person: 'voi',     form: 'state',  meaning: '你们（状态）' },
        { person: 'loro',    form: 'stanno', meaning: '他们（状态）' },
      ]
    },
    exercise: {
      question: '"我正在等"（进行时）是：',
      options: ['Sono aspettando', 'Sto aspettando', 'Stai aspettando', 'Sta aspettando'],
      answer: 1,
    }
  },
];

// ─── 原有场景词汇阶段（保留）────────────────────────────────────────────────

const SCENE_L1_LESSONS = [
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
    conjugation: null,
    exercise: { question: '你想说"晚上好"，应该说：', options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Ciao'], answer: 1 }
  },
  {
    id: 2, title: '数字 1-10', time: '15分钟', emoji: '🔢',
    desc: '掌握意大利语基础数字，购物问价必备',
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
    grammar: '意大利数字不难！Uno 在阴性名词前变成 Una。如：un caffè（一杯咖啡），una pizza（一个披萨）。',
    conjugation: null,
    exercise: { question: '"五"的意大利语是：', options: ['Quattro', 'Sei', 'Cinque', 'Sette'], answer: 2 }
  },
  {
    id: 3, title: '餐厅点餐', time: '15分钟', emoji: '🍝',
    desc: '学会在意大利餐厅点餐和交流',
    vocab: [
      { italian: 'Vorrei...',     chinese: '我想要...',  pronunciation: '沃雷伊' },
      { italian: 'Il menu',       chinese: '菜单',       pronunciation: '伊尔 梅努' },
      { italian: 'Il conto',      chinese: '账单',       pronunciation: '伊尔 孔托' },
      { italian: 'Buon appetito', chinese: '请慢用',     pronunciation: '波诺 阿配提托' },
      { italian: 'È delizioso',   chinese: '太好吃了',   pronunciation: '埃 德利兹沃索' },
      { italian: 'Cameriere',     chinese: '服务员',     pronunciation: '卡梅利耶雷' },
    ],
    grammar: 'Vorrei 是"我想要"的礼貌形式，比 Voglio（我要）更客气。在餐厅点餐总是用 Vorrei 开头，显示礼貌。',
    conjugation: null,
    exercise: { question: '想买单时说：', options: ['Il menu', 'Il conto, per favore', 'Cameriere', 'Vorrei'], answer: 1 }
  },
  {
    id: 4, title: '问路与交通', time: '12分钟', emoji: '🗺️',
    desc: '学习问路和使用交通工具',
    vocab: [
      { italian: "Dov'è?",         chinese: '...在哪里？', pronunciation: '多维' },
      { italian: 'Giri a destra',  chinese: '右转',        pronunciation: '基利 阿 德斯特拉' },
      { italian: 'Giri a sinistra',chinese: '左转',        pronunciation: '基利 阿 西尼斯特拉' },
      { italian: 'Vada dritto',    chinese: '直走',        pronunciation: '瓦达 德利托' },
      { italian: 'La stazione',    chinese: '火车站',      pronunciation: '拉 斯塔兹欧内' },
      { italian: 'Il metro',       chinese: '地铁',        pronunciation: '伊尔 梅托罗' },
    ],
    grammar: "Dov'è 是问『在哪里』的万能句。后面加任何地点：Dov'è il bagno?（洗手间在哪里），Dov'è l'aeroporto?（机场在哪里）",
    conjugation: null,
    exercise: { question: '"左转"的意大利语是：', options: ['Vada dritto', 'Giri a destra', 'Giri a sinistra', 'Tornate indietro'], answer: 2 }
  },
  {
    id: 5, title: '购物表达', time: '10分钟', emoji: '🛍️',
    desc: '学会购物和讨价还价',
    vocab: [
      { italian: 'Quanto costa?',  chinese: '多少钱？',    pronunciation: '夸恩托 科斯塔' },
      { italian: 'È troppo caro', chinese: '太贵了',      pronunciation: '埃 托破破 卡罗' },
      { italian: 'Ha uno sconto?',chinese: '有折扣吗？',  pronunciation: '阿 乌诺 斯孔托' },
      { italian: 'Lo prendo',     chinese: '我买了',      pronunciation: '洛 普雷恩多' },
      { italian: 'Posso provarlo?',chinese: '可以试穿吗？',pronunciation: '破索 普罗瓦尔洛' },
      { italian: 'La cassa',      chinese: '收银台',      pronunciation: '拉 卡萨' },
    ],
    grammar: 'Quanto costa? 是问单件物品价格；Quanto costano? 是问多件物品。Costa = 花费，costano 是复数形式。',
    conjugation: null,
    exercise: { question: '"太贵了"怎么说：', options: ['È delizioso', 'È troppo caro', 'È molto bello', 'Ha uno sconto?'], answer: 1 }
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
    conjugation: null,
    exercise: { question: '"双人间"怎么说：', options: ['Camera singola', 'Camera doppia', 'Camera matrimoniale', 'Suite'], answer: 1 }
  },
];

const SCENE_L2_LESSONS = [
  {
    id: 101, title: '时间与日期', time: '12分钟', emoji: '🕐',
    desc: '约定时间、问日期，旅行必备',
    vocab: [
      { italian: 'Che ora è?',   chinese: '现在几点？',  pronunciation: '克 欧拉 埃' },
      { italian: 'Sono le tre',  chinese: '现在三点',    pronunciation: '索诺 莱 特雷' },
      { italian: 'Oggi',         chinese: '今天',        pronunciation: '奥基' },
      { italian: 'Domani',       chinese: '明天',        pronunciation: '多马尼' },
      { italian: 'La settimana', chinese: '这周',        pronunciation: '拉 赛提马纳' },
      { italian: 'Il mese',      chinese: '这个月',      pronunciation: '伊尔 梅赛' },
    ],
    grammar: 'Sono le + 数字 表示几点钟。例如 Sono le due（两点），Sono le cinque（五点）。正午用 Mezzogiorno，午夜用 Mezzanotte。',
    conjugation: null,
    exercise: { question: '"明天"怎么说：', options: ['Oggi', 'Ieri', 'Domani', 'Dopodomani'], answer: 2 }
  },
  {
    id: 102, title: '天气与季节', time: '10分钟', emoji: '🌤️',
    desc: '聊天气，了解意大利四季',
    vocab: [
      { italian: 'Che tempo fa?',chinese: '天气怎么样？', pronunciation: '克 天破 法' },
      { italian: 'Fa caldo',     chinese: '天气热',       pronunciation: '法 卡多' },
      { italian: 'Fa freddo',    chinese: '天气冷',       pronunciation: '法 弗雷多' },
      { italian: 'Piove',        chinese: '下雨',         pronunciation: '皮欧维' },
      { italian: "C'è il sole",  chinese: '出太阳',       pronunciation: '切 伊尔 索莱' },
      { italian: 'La primavera', chinese: '春天',         pronunciation: '拉 普里马维拉' },
    ],
    grammar: 'Fa + 形容词 是描述天气的常用结构。Fa caldo（热）/ Fa freddo（冷）/ Fa bello（好天气）。',
    conjugation: null,
    exercise: { question: '"下雨"用意大利语怎么说：', options: ['Fa caldo', 'Piove', 'Fa freddo', 'Nevica'], answer: 1 }
  },
  {
    id: 103, title: '家庭称谓', time: '10分钟', emoji: '👨‍👩‍👧',
    desc: '介绍家人，拉近与当地人距离',
    vocab: [
      { italian: 'La famiglia', chinese: '家庭',   pronunciation: '拉 法米利亚' },
      { italian: 'Il padre',    chinese: '父亲',   pronunciation: '伊尔 帕德雷' },
      { italian: 'La madre',    chinese: '母亲',   pronunciation: '拉 马德雷' },
      { italian: 'Il fratello', chinese: '兄弟',   pronunciation: '伊尔 弗拉特罗' },
      { italian: 'La sorella',  chinese: '姐妹',   pronunciation: '拉 索雷拉' },
      { italian: 'I nonni',     chinese: '祖父母', pronunciation: '伊 诺尼' },
    ],
    grammar: '意大利语名词有阴阳性。阳性名词一般以 -o 结尾（如 padre），阴性名词以 -a 结尾（如 madre）。',
    conjugation: null,
    exercise: { question: '"兄弟"的意大利语是：', options: ['La sorella', 'Il fratello', 'Il padre', 'La madre'], answer: 1 }
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
    grammar: '颜色形容词通常放在名词后面：una borsa rossa（一个红色的包）。颜色也要和名词性别数一致。',
    conjugation: null,
    exercise: { question: '"绿色"的意大利语是：', options: ['Rosso', 'Blu', 'Verde', 'Giallo'], answer: 2 }
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
    grammar: 'Mi fa male + 身体部位 表示某处疼痛。例如：Mi fa male la testa（我头痛）。',
    conjugation: null,
    exercise: { question: '"救命！"用意大利语怎么说：', options: ['Grazie', 'Aiuto!', 'Prego', 'Scusi'], answer: 1 }
  },
  {
    id: 106, title: '交通细节', time: '12分钟', emoji: '🚆',
    desc: '买票、乘车、换乘的实用表达',
    vocab: [
      { italian: 'Un biglietto per...',chinese: '一张去...的票',  pronunciation: '乌恩 比利耶托 佩' },
      { italian: 'Andata e ritorno',   chinese: '来回票',          pronunciation: '安达塔 埃 里托尔诺' },
      { italian: 'Il binario',         chinese: '站台/轨道',       pronunciation: '伊尔 比纳里欧' },
      { italian: 'In ritardo',         chinese: '晚点',            pronunciation: '因 里塔尔多' },
      { italian: 'Il capolinea',       chinese: '终点站',          pronunciation: '伊尔 卡波利内阿' },
      { italian: 'Devo cambiare?',     chinese: '我需要换乘吗？',  pronunciation: '德伏 坎比阿雷' },
    ],
    grammar: 'Un biglietto per + 目的地 是买票的标准说法。例如：Un biglietto per Roma（一张去罗马的票）。',
    conjugation: null,
    exercise: { question: '"晚点"的意大利语是：', options: ['In anticipo', 'In ritardo', 'Il binario', 'Il capolinea'], answer: 1 }
  },
];

// ─── Computed helpers ─────────────────────────────────────────────────────────

function computeStats(lessonProgress, phonicsCompleted) {
  const allLessons = [
    ...FOUNDATION_LESSONS,
    ...VERBS_LESSONS,
    ...SCENE_L1_LESSONS,
    ...SCENE_L2_LESSONS,
  ];
  let totalCompleted = 0;
  let totalVocab = 0;

  allLessons.forEach(l => {
    if (lessonProgress[l.id]) {
      totalCompleted++;
      totalVocab += l.vocab.length;
    }
  });

  const foundationCompleted = FOUNDATION_LESSONS.filter(l => lessonProgress[l.id]).length;
  const verbsCompleted      = VERBS_LESSONS.filter(l => lessonProgress[l.id]).length;
  const sceneL1Completed    = SCENE_L1_LESSONS.filter(l => lessonProgress[l.id]).length;
  const sceneL2Completed    = SCENE_L2_LESSONS.filter(l => lessonProgress[l.id]).length;

  let currentLevelLabel = '入门';
  if (foundationCompleted > 0) currentLevelLabel = '基础';
  if (foundationCompleted === FOUNDATION_LESSONS.length) currentLevelLabel = '进阶';
  if (verbsCompleted > 0) currentLevelLabel = '进阶';
  if (sceneL1Completed > 0) currentLevelLabel = '旅行';

  const unlockedIds = {};
  allLessons.forEach(l => { unlockedIds[l.id] = true; });

  return {
    totalCompleted,
    totalVocab,
    foundationCompleted,
    verbsCompleted,
    sceneL1Completed,
    sceneL2Completed,
    foundationTotal: FOUNDATION_LESSONS.length,
    verbsTotal: VERBS_LESSONS.length,
    sceneL1Total: SCENE_L1_LESSONS.length,
    sceneL2Total: SCENE_L2_LESSONS.length,
    currentLevelLabel,
    unlockedIds,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

Page({
  data: {
    vowels: VOWELS,
    consonantRules: CONSONANT_RULES,
    alphabet: ALPHABET,
    phonicsTips: PHONICS_TIPS,

    foundationLessons: FOUNDATION_LESSONS,
    verbsLessons: VERBS_LESSONS,
    sceneL1Lessons: SCENE_L1_LESSONS,
    sceneL2Lessons: SCENE_L2_LESSONS,

    foundationTotal: FOUNDATION_LESSONS.length,
    verbsTotal: VERBS_LESSONS.length,
    sceneL1Total: SCENE_L1_LESSONS.length,
    sceneL2Total: SCENE_L2_LESSONS.length,

    showIntro: false,
    showFoundation: false,
    showVerbs: false,
    showSceneL1: false,
    showSceneL2: false,
    lessonProgress: {},
    phonicsCompleted: false,
    showPhonics: false,
    showLessonModal: false,
    currentLesson: null,
    lessonAnswered: false,
    selectedOption: -1,

    totalCompleted: 0,
    totalVocab: 0,
    foundationCompleted: 0,
    verbsCompleted: 0,
    sceneL1Completed: 0,
    sceneL2Completed: 0,
    currentLevelLabel: '入门',
    unlockedIds: {},
  },

  onLoad() { this._loadProgress(); },
  onShow() { this._loadProgress(); },

  _loadProgress() {
    const stored = wx.getStorageSync('italian_lessons') || { completed: [], phonics: false };
    const lessonProgress = {};
    (stored.completed || []).forEach(id => { lessonProgress[id] = true; });
    const phonicsCompleted = !!stored.phonics;

    const collapseState = wx.getStorageSync('italian_learn_collapse') || {};
    const showIntro      = collapseState.intro      !== undefined ? collapseState.intro      : false;
    const showFoundation = collapseState.foundation !== undefined ? collapseState.foundation : false;
    const showVerbs      = collapseState.verbs      !== undefined ? collapseState.verbs      : false;
    const showSceneL1    = collapseState.sceneL1    !== undefined ? collapseState.sceneL1    : false;
    const showSceneL2    = collapseState.sceneL2    !== undefined ? collapseState.sceneL2    : false;

    const stats = computeStats(lessonProgress, phonicsCompleted);
    this.setData({ lessonProgress, phonicsCompleted, showIntro, showFoundation, showVerbs, showSceneL1, showSceneL2, ...stats });
  },

  _saveCollapseState() {
    const { showIntro, showFoundation, showVerbs, showSceneL1, showSceneL2 } = this.data;
    wx.setStorageSync('italian_learn_collapse', { intro: showIntro, foundation: showFoundation, verbs: showVerbs, sceneL1: showSceneL1, sceneL2: showSceneL2 });
  },

  _saveProgress() {
    const { lessonProgress, phonicsCompleted } = this.data;
    const completed = Object.keys(lessonProgress).filter(k => lessonProgress[k]).map(Number);
    wx.setStorageSync('italian_lessons', { completed, phonics: phonicsCompleted });
  },

  onToggleIntro()      { this.setData({ showIntro:      !this.data.showIntro      }, () => this._saveCollapseState()); },
  onToggleFoundation() { this.setData({ showFoundation: !this.data.showFoundation }, () => this._saveCollapseState()); },
  onToggleVerbs()      { this.setData({ showVerbs:      !this.data.showVerbs      }, () => this._saveCollapseState()); },
  onToggleSceneL1()    { this.setData({ showSceneL1:    !this.data.showSceneL1    }, () => this._saveCollapseState()); },
  onToggleSceneL2()    { this.setData({ showSceneL2:    !this.data.showSceneL2    }, () => this._saveCollapseState()); },

  onOpenPhonics()  { this.setData({ showPhonics: true }); },
  onClosePhonics() { this.setData({ showPhonics: false }); },

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

  onLessonTap(e) {
    const lessonId = parseInt(e.currentTarget.dataset.id);
    const allLessons = [...FOUNDATION_LESSONS, ...VERBS_LESSONS, ...SCENE_L1_LESSONS, ...SCENE_L2_LESSONS];
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;
    this.setData({ currentLesson: lesson, showLessonModal: true, lessonAnswered: false, selectedOption: -1 });
  },

  onCloseLessonModal() { this.setData({ showLessonModal: false }); },

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
    const idx = parseInt(e.currentTarget.dataset.idx);
    const vocab = this.data.currentLesson && this.data.currentLesson.vocab;
    if (vocab && vocab[idx]) {
      const text = vocab[idx].italian.split('/')[0].trim();
      if (text) playText(text);
    }
  },

  stopPropagation() {},
});
