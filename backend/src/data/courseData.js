/**
 * courseData.js
 *
 * The canonical bilingual course catalog for the Faculty of Business,
 * Alexandria University — derived directly from the Arabic regulation document.
 *
 * Each entry maps to one Course document.
 * Prerequisites are referenced by CODE (set during seed).
 *
 * Codes follow the pattern:  DEPT + LEVEL + INDEX
 *   GEN  = General (Levels 1–2)
 *   ACC  = Accounting
 *   CUS  = Customs
 *   BA   = Business Administration
 *   MIS  = Management Information Systems
 *   STAT = Statistics
 *   MKT  = Marketing
 *   FIN  = Finance
 *   HR   = Human Resources
 */

const courseData = [

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 1 — GENERAL (All departments)
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "GEN101",
    arabicName: "مبادئ الإدارة",
    englishName: "Principles of Management",
    aliases: ["مبادئ إدارة", "Principles of Management", "principles of management"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN102",
    arabicName: "مبادئ المحاسبة المالية",
    englishName: "Principles of Financial Accounting",
    aliases: ["مبادئ محاسبه", "Principles of Financial Accounting", "financial accounting principles"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN103",
    arabicName: "الرياضيات البحتة والمالية",
    englishName: "Pure and Financial Mathematics",
    aliases: ["رياضيات", "Pure and Financial Mathematics", "mathematics"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN104",
    arabicName: "اقتصاد جزئي",
    englishName: "Microeconomics",
    aliases: ["اقتصاد جزئى", "Microeconomics", "micro economics"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN105",
    arabicName: "لغة اجنبية للأعمال",
    englishName: "Foreign Language for Business",
    aliases: ["لغه اجنبيه للاعمال", "Foreign Language for Business", "business language"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Fall",
    credits: 2
  },
  {
    code: "GEN106",
    arabicName: "مقدمة في العلوم السياسية",
    englishName: "Introduction to Political Science",
    aliases: ["علوم سياسيه", "Introduction to Political Science", "political science"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Fall",
    credits: 2
  },
  {
    code: "GEN107",
    arabicName: "قضايا مجتمعية",
    englishName: "Societal Issues",
    aliases: ["قضايا مجتمعيه", "Societal Issues", "community issues"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Fall",
    credits: 2
  },

  // Level 1 — Spring
  {
    code: "GEN111",
    arabicName: "سلوك تنظيمي",
    englishName: "Organizational Behavior",
    aliases: ["سلوك تنظيمى", "Organizational Behavior", "OB"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Spring",
    credits: 3
  },
  {
    code: "GEN112",
    arabicName: "مبادئ المحاسبة الإدارية",
    englishName: "Principles of Managerial Accounting",
    aliases: ["مبادئ المحاسبه الإدارية", "Principles of Managerial Accounting", "managerial accounting principles"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Spring",
    credits: 3
  },
  {
    code: "GEN113",
    arabicName: "إحصاء وصفي",
    englishName: "Descriptive Statistics",
    aliases: ["احصاء وصفى", "Descriptive Statistics", "descriptive stats"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Spring",
    credits: 3
  },
  {
    code: "GEN114",
    arabicName: "اقتصاد كلي",
    englishName: "Macroeconomics",
    aliases: ["اقتصاد كلى", "Macroeconomics", "macro economics"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Spring",
    credits: 3
  },
  {
    code: "GEN115",
    arabicName: "مهارات اللغة والاتصال",
    englishName: "Language and Communication Skills",
    aliases: ["مهارات اللغه والاتصال", "Language and Communication Skills", "communication skills"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Spring",
    credits: 2
  },
  {
    code: "GEN116",
    arabicName: "قانون الاعمال",
    englishName: "Business Law",
    aliases: ["قانون الأعمال", "Business Law", "business law"],
    prerequisites: [],
    department: "General",
    level: 1,
    semester: "Spring",
    credits: 2
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 2 — GENERAL (All departments)
  // ══════════════════════════════════════════════════════════════════════

  // Level 2 — Fall
  {
    code: "GEN201",
    arabicName: "محاسبة متوسطة (1)",
    englishName: "Intermediate Accounting 1",
    aliases: ["محاسبه متوسطه 1", "Intermediate Accounting 1", "intermediate accounting i"],
    prerequisites: ["GEN102"],
    department: "General",
    level: 2,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN202",
    arabicName: "مبادئ تسويق",
    englishName: "Principles of Marketing",
    aliases: ["مبادئ التسويق", "Principles of Marketing", "marketing principles"],
    prerequisites: ["GEN101"],
    department: "General",
    level: 2,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN203",
    arabicName: "استدلال احصائي",
    englishName: "Statistical Inference",
    aliases: ["استدلال إحصائى", "Statistical Inference", "statistical inference"],
    prerequisites: ["GEN103"],
    department: "General",
    level: 2,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN204",
    arabicName: "مقدمة في المالية العامة",
    englishName: "Introduction to Public Finance",
    aliases: ["مقدمه في الماليه العامه", "Introduction to Public Finance", "public finance"],
    prerequisites: [],
    department: "General",
    level: 2,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN205",
    arabicName: "مقدمة في نظم وتكنولوجيا المعلومات",
    englishName: "Introduction to Information Systems and Technology",
    aliases: [
      "مقدمه في نظم وتكنولوجيا المعلومات",
      "Introduction to Information Systems and Technology",
      "intro to IS",
      "IIST"
    ],
    prerequisites: [],
    department: "General",
    level: 2,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN206",
    arabicName: "نقود وبنوك وتجارة دولية",
    englishName: "Money, Banking, and International Trade",
    aliases: ["نقود وبنوك وتجاره دوليه", "Money, Banking, and International Trade", "money and banking"],
    prerequisites: [],
    department: "General",
    level: 2,
    semester: "Fall",
    credits: 3
  },
  {
    code: "GEN207",
    arabicName: "إدارة الموارد البشرية",
    englishName: "Human Resources Management",
    aliases: ["إدارة الموارد البشريه", "Human Resources Management", "HRM"],
    prerequisites: ["GEN101"],
    department: "General",
    level: 2,
    semester: "Fall",
    credits: 3
  },

  // Level 2 — Spring
  {
    code: "GEN211",
    arabicName: "محاسبة متوسطة (2)",
    englishName: "Intermediate Accounting 2",
    aliases: ["محاسبه متوسطه 2", "Intermediate Accounting 2", "intermediate accounting ii"],
    prerequisites: ["GEN102"],
    department: "General",
    level: 2,
    semester: "Spring",
    credits: 3
  },
  {
    code: "GEN212",
    arabicName: "المحاسبة في الوحدات الحكومية",
    englishName: "Governmental Accounting",
    aliases: ["المحاسبه في الوحدات الحكوميه", "Governmental Accounting", "government accounting"],
    prerequisites: ["GEN102"],
    department: "General",
    level: 2,
    semester: "Spring",
    credits: 3
  },
  {
    code: "GEN213",
    arabicName: "التحليل الكلي لموازنة الدولة",
    englishName: "Macro Analysis of the State Budget",
    aliases: ["التحليل الكلى لموازنه الدوله", "Macro Analysis of the State Budget", "state budget analysis"],
    prerequisites: ["GEN114"],
    department: "General",
    level: 2,
    semester: "Spring",
    credits: 3
  },
  {
    code: "GEN214",
    arabicName: "تمويل",
    englishName: "Finance",
    aliases: ["تمويل", "Finance", "corporate finance"],
    prerequisites: ["GEN101"],
    department: "General",
    level: 2,
    semester: "Spring",
    credits: 3
  },
  {
    code: "GEN215",
    arabicName: "مقدمة في الخطر والتأمين",
    englishName: "Introduction to Risk and Insurance",
    aliases: ["مقدمه في الخطر والتامين", "Introduction to Risk and Insurance", "risk and insurance"],
    prerequisites: ["GEN103"],
    department: "General",
    level: 2,
    semester: "Spring",
    credits: 3
  },

  // ══════════════════════════════════════════════════════════════════════
  // ACCOUNTING — LEVEL 3
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "ACC301",
    arabicName: "محاسبة شركات (1)",
    englishName: "Companies Accounting 1",
    aliases: ["محاسبه شركات 1", "Companies Accounting 1", "companies accounting i"],
    prerequisites: ["GEN102"],
    department: "Accounting",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC302",
    arabicName: "تحليل القوائم المالية",
    englishName: "Financial Statements Analysis",
    aliases: ["تحليل القوائم الماليه", "Financial Statements Analysis", "financial analysis"],
    prerequisites: [],
    department: "Accounting",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC303",
    arabicName: "مبادئ محاسبة التكاليف",
    englishName: "Cost Accounting Principles",
    aliases: ["مبادئ محاسبه التكاليف", "Cost Accounting Principles", "cost accounting"],
    prerequisites: ["GEN112"],
    department: "Accounting",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC304",
    arabicName: "أصول النظم الضريبية",
    englishName: "Principles of Tax Systems",
    aliases: ["اصول النظم الضريبيه", "Principles of Tax Systems", "tax systems"],
    prerequisites: ["GEN204"],
    department: "Accounting",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC305",
    arabicName: "إدارة الإنتاج والعمليات",
    englishName: "Production and Operations Management",
    aliases: ["إداره الإنتاج والعمليات", "Production and Operations Management", "POM", "operations management"],
    prerequisites: ["GEN101"],
    department: "Accounting",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC306",
    arabicName: "التفكير الناقد",
    englishName: "Critical Thinking",
    aliases: ["التفكير الناقد", "Critical Thinking"],
    prerequisites: [],
    department: "Accounting",
    level: 3,
    semester: "Fall",
    credits: 2
  },
  {
    code: "ACC311",
    arabicName: "أنظمة محاسبية متخصصة",
    englishName: "Specialized Accounting Systems",
    aliases: ["انظمه محاسبيه متخصصه", "Specialized Accounting Systems"],
    prerequisites: ["GEN102"],
    department: "Accounting",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC312",
    arabicName: "رقابة ومراجعة داخلية",
    englishName: "Internal Audit and Control",
    aliases: ["رقابه ومراجعه داخليه", "Internal Audit and Control", "auditing and internal control"],
    prerequisites: [],
    department: "Accounting",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC313",
    arabicName: "محاسبة شركات (2)",
    englishName: "Companies Accounting 2",
    aliases: ["محاسبه شركات 2", "Companies Accounting 2", "companies accounting ii"],
    prerequisites: [],
    department: "Accounting",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC314",
    arabicName: "نظم معلومات محاسبية",
    englishName: "Accounting Information Systems",
    aliases: ["نظم معلومات محاسبيه", "Accounting Information Systems", "AIS"],
    prerequisites: [],
    department: "Accounting",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC315",
    arabicName: "بحوث العمليات في المحاسبة",
    englishName: "Operations Research in Accounting",
    aliases: ["بحوث العمليات في المحاسبه", "Operations Research in Accounting"],
    prerequisites: [],
    department: "Accounting",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC316",
    arabicName: "الابتكار وريادة الاعمال",
    englishName: "Innovation and Entrepreneurship",
    aliases: ["الابتكار وريادة الأعمال", "Innovation and Entrepreneurship", "entrepreneurship"],
    prerequisites: [],
    department: "Accounting",
    level: 3,
    semester: "Spring",
    credits: 2
  },

  // ══════════════════════════════════════════════════════════════════════
  // ACCOUNTING — LEVEL 4
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "ACC401",
    arabicName: "محاسبة مالية متقدمة",
    englishName: "Advanced Financial Accounting",
    aliases: ["محاسبه ماليه متقدمه", "Advanced Financial Accounting"],
    prerequisites: ["GEN211"],
    department: "Accounting",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC402",
    arabicName: "محاسبة ضريبية (1)",
    englishName: "Tax Accounting 1",
    aliases: ["محاسبه ضريبيه 1", "Tax Accounting 1", "tax accounting i"],
    prerequisites: [],
    department: "Accounting",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC403",
    arabicName: "مراجعة",
    englishName: "Auditing",
    aliases: ["مراجعه", "Auditing", "auditing"],
    prerequisites: [],
    department: "Accounting",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC404",
    arabicName: "أنظمة قياس التكاليف",
    englishName: "Cost Measurement Systems",
    aliases: ["انظمه قياس التكاليف", "Cost Measurement Systems"],
    prerequisites: ["ACC303"],
    department: "Accounting",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC405",
    arabicName: "استثمار",
    englishName: "Investment",
    aliases: ["استثمار", "Investment"],
    prerequisites: ["GEN214"],
    department: "Accounting",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "ACC406",
    arabicName: "الانسان والبيئة",
    englishName: "Human and Environment",
    aliases: ["الإنسان والبيئه", "Human and Environment"],
    prerequisites: [],
    department: "Accounting",
    level: 4,
    semester: "Fall",
    credits: 2
  },
  {
    code: "ACC411",
    arabicName: "محاسبة إدارية متقدمة",
    englishName: "Advanced Managerial Accounting",
    aliases: ["محاسبه إداريه متقدمه", "Advanced Managerial Accounting"],
    prerequisites: ["GEN112"],
    department: "Accounting",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC412",
    arabicName: "محاسبة ضريبية (2)",
    englishName: "Tax Accounting 2",
    aliases: ["محاسبه ضريبيه 2", "Tax Accounting 2", "tax accounting ii"],
    prerequisites: ["GEN211"],
    department: "Accounting",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC413",
    arabicName: "مراجعة نظم المحاسبة الالكترونية",
    englishName: "Electronic Accounting Systems Review",
    aliases: ["مراجعه نظم المحاسبه الالكترونيه", "Electronic Accounting Systems Review"],
    prerequisites: ["ACC312"],
    department: "Accounting",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC414",
    arabicName: "محاسبة تكاليف متقدمة",
    englishName: "Advanced Cost Accounting",
    aliases: ["محاسبه تكاليف متقدمه", "Advanced Cost Accounting"],
    prerequisites: ["ACC303"],
    department: "Accounting",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC415",
    arabicName: "إدارة استراتيجية",
    englishName: "Strategic Management",
    aliases: ["إداره استراتيجيه", "Strategic Management", "strategy"],
    prerequisites: ["GEN101"],
    department: "Accounting",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "ACC416",
    arabicName: "الاتجاهات الحديثة في السياحة",
    englishName: "Modern Trends in Tourism",
    aliases: ["الاتجاهات الحديثه في السياحه", "Modern Trends in Tourism"],
    prerequisites: [],
    department: "Accounting",
    level: 4,
    semester: "Spring",
    credits: 2
  },

  // ══════════════════════════════════════════════════════════════════════
  // CUSTOMS — LEVEL 3
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "CUS301",
    arabicName: "أصول النظم الضريبية",
    englishName: "Principles of Tax Systems",
    aliases: ["اصول النظم الضريبيه", "Principles of Tax Systems", "tax systems"],
    prerequisites: ["GEN204"],
    department: "Customs",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS302",
    arabicName: "اقتصاديات المشروعات العامة",
    englishName: "Economics of Public Projects",
    aliases: ["اقتصاديات المشروعات العامه", "Economics of Public Projects"],
    prerequisites: [],
    department: "Customs",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS303",
    arabicName: "اقتصاديات النقل والشحن الدولي",
    englishName: "Economics of International Shipping and Transport",
    aliases: ["اقتصاديات النقل والشحن الدولى", "Economics of International Shipping and Transport", "shipping economics"],
    prerequisites: [],
    department: "Customs",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS304",
    arabicName: "اقتصاديات الأسواق المالية",
    englishName: "Economics of Financial Markets",
    aliases: ["اقتصاديات الاسواق الماليه", "Economics of Financial Markets", "financial markets economics"],
    prerequisites: ["GEN114"],
    department: "Customs",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS305",
    arabicName: "مبادئ محاسبة التكاليف",
    englishName: "Cost Accounting Principles",
    aliases: ["مبادئ محاسبه التكاليف", "Cost Accounting Principles", "cost accounting"],
    prerequisites: ["GEN112"],
    department: "Customs",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS306",
    arabicName: "التفكير الناقد",
    englishName: "Critical Thinking",
    aliases: ["التفكير الناقد", "Critical Thinking"],
    prerequisites: [],
    department: "Customs",
    level: 3,
    semester: "Fall",
    credits: 2
  },
  {
    code: "CUS311",
    arabicName: "مقدمة في السياسات المالية",
    englishName: "Introduction to Financial Policies",
    aliases: ["مقدمه في السياسات الماليه", "Introduction to Financial Policies"],
    prerequisites: ["GEN204"],
    department: "Customs",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS312",
    arabicName: "دراسة الجدوى الاقتصادية والاجتماعية",
    englishName: "Economic and Social Feasibility Study",
    aliases: ["دراسه الجدوى الاقتصاديه والاجتماعيه", "Economic and Social Feasibility Study", "feasibility study"],
    prerequisites: [],
    department: "Customs",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS313",
    arabicName: "النظام الضريبي المصري",
    englishName: "Egyptian Tax System",
    aliases: ["النظام الضريبى المصرى", "Egyptian Tax System"],
    prerequisites: ["GEN213"],
    department: "Customs",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS314",
    arabicName: "محاسبة شركات",
    englishName: "Companies Accounting",
    aliases: ["محاسبه شركات", "Companies Accounting"],
    prerequisites: ["GEN102"],
    department: "Customs",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS315",
    arabicName: "استثمار",
    englishName: "Investment",
    aliases: ["استثمار", "Investment"],
    prerequisites: ["GEN214"],
    department: "Customs",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS316",
    arabicName: "الابتكار وريادة الاعمال",
    englishName: "Innovation and Entrepreneurship",
    aliases: ["الابتكار وريادة الأعمال", "Innovation and Entrepreneurship"],
    prerequisites: [],
    department: "Customs",
    level: 3,
    semester: "Spring",
    credits: 2
  },

  // ══════════════════════════════════════════════════════════════════════
  // CUSTOMS — LEVEL 4
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "CUS401",
    arabicName: "السياسات المالية الداخلية",
    englishName: "Domestic Financial Policies",
    aliases: ["السياسات الماليه الداخليه", "Domestic Financial Policies"],
    prerequisites: ["GEN204"],
    department: "Customs",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS402",
    arabicName: "جدوى الخدمات والمرافق العامة",
    englishName: "Public Services Feasibility",
    aliases: ["جدوى الخدمات والمرافق العامه", "Public Services Feasibility"],
    prerequisites: [],
    department: "Customs",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS403",
    arabicName: "نظم الرقابة على المال العام",
    englishName: "Control Systems on Public Money",
    aliases: ["نظم الرقابه على المال العام", "Control Systems on Public Money"],
    prerequisites: ["GEN213"],
    department: "Customs",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS404",
    arabicName: "قضايا مالية وجمركية معاصرة",
    englishName: "Contemporary Financial and Customs Issues",
    aliases: ["قضايا ماليه وجمركيه معاصره", "Contemporary Financial and Customs Issues"],
    prerequisites: ["CUS301"],
    department: "Customs",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS405",
    arabicName: "اقتصاديات الموانئ والجمارك",
    englishName: "Economics of Ports and Customs",
    aliases: ["اقتصاديات الموانئ والجمارك", "Economics of Ports and Customs"],
    prerequisites: ["CUS303"],
    department: "Customs",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "CUS406",
    arabicName: "الانسان والبيئة",
    englishName: "Human and Environment",
    aliases: ["الإنسان والبيئه", "Human and Environment"],
    prerequisites: [],
    department: "Customs",
    level: 4,
    semester: "Fall",
    credits: 2
  },
  {
    code: "CUS411",
    arabicName: "النظم الجمركية ونظم الاستيراد والتصدير",
    englishName: "Customs Systems and Import/Export Regulations",
    aliases: ["النظم الجمركيه ونظم الاستيراد والتصدير", "Customs Systems and Import/Export Regulations"],
    prerequisites: ["CUS303"],
    department: "Customs",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS412",
    arabicName: "حسابات الضريبة الجمركية",
    englishName: "Customs Tariff Calculations",
    aliases: ["حسابات الضريبه الجمركيه", "Customs Tariff Calculations"],
    prerequisites: [],
    department: "Customs",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS413",
    arabicName: "النظام المالي الإسلامي",
    englishName: "Islamic Financial System",
    aliases: ["النظام المالى الإسلامى", "Islamic Financial System"],
    prerequisites: ["CUS301"],
    department: "Customs",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS414",
    arabicName: "سياسات مالية دولية",
    englishName: "International Financial Policies",
    aliases: ["سياسات ماليه دوليه", "International Financial Policies"],
    prerequisites: ["CUS311"],
    department: "Customs",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS415",
    arabicName: "تحليل القوائم المالية",
    englishName: "Financial Statements Analysis",
    aliases: ["تحليل القوائم الماليه", "Financial Statements Analysis", "financial analysis"],
    prerequisites: ["GEN102"],
    department: "Customs",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "CUS416",
    arabicName: "الاتجاهات الحديثة في السياحة",
    englishName: "Modern Trends in Tourism",
    aliases: ["الاتجاهات الحديثه في السياحه", "Modern Trends in Tourism"],
    prerequisites: [],
    department: "Customs",
    level: 4,
    semester: "Spring",
    credits: 2
  },

  // ══════════════════════════════════════════════════════════════════════
  // BUSINESS ADMINISTRATION — LEVEL 3
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "BA301",
    arabicName: "إدارة الإنتاج والعمليات",
    englishName: "Production and Operations Management",
    aliases: ["إداره الإنتاج والعمليات", "Production and Operations Management", "POM", "operations management"],
    prerequisites: ["GEN101"],
    department: "Business Administration",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA302",
    arabicName: "تطبيقات ريادة الاعمال والمشروعات",
    englishName: "Small Business and Entrepreneurship Applications",
    aliases: ["تطبيقات ريادة الأعمال والمشروعات", "Small Business and Entrepreneurship Applications"],
    prerequisites: [],
    department: "Business Administration",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA303",
    arabicName: "نظم معلومات إدارية",
    englishName: "Management Information Systems",
    aliases: ["نظم معلومات إداريه", "Management Information Systems", "MIS course"],
    prerequisites: [],
    department: "Business Administration",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA304",
    arabicName: "مبادئ محاسبة التكاليف",
    englishName: "Cost Accounting Principles",
    aliases: ["مبادئ محاسبه التكاليف", "Cost Accounting Principles", "cost accounting"],
    prerequisites: ["GEN112"],
    department: "Business Administration",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA305",
    arabicName: "استثمار",
    englishName: "Investment",
    aliases: ["استثمار", "Investment"],
    prerequisites: ["GEN214"],
    department: "Business Administration",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA306",
    arabicName: "التفكير الناقد",
    englishName: "Critical Thinking",
    aliases: ["التفكير الناقد", "Critical Thinking"],
    prerequisites: [],
    department: "Business Administration",
    level: 3,
    semester: "Fall",
    credits: 2
  },
  {
    code: "BA311",
    arabicName: "اخلاقيات الاعمال",
    englishName: "Business Ethics",
    aliases: ["اخلاقيات الأعمال", "Business Ethics"],
    prerequisites: ["GEN101"],
    department: "Business Administration",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA312",
    arabicName: "إدارة سلاسل التوريد",
    englishName: "Supply Chain Management",
    aliases: ["إداره سلاسل التوريد", "Supply Chain Management", "SCM"],
    prerequisites: [],
    department: "Business Administration",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA313",
    arabicName: "أساليب كمية في الإدارة",
    englishName: "Quantitative Methods in Management",
    aliases: ["اساليب كميه في الإداره", "Quantitative Methods in Management"],
    prerequisites: [],
    department: "Business Administration",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA314",
    arabicName: "إدارة الجودة",
    englishName: "Quality Management",
    aliases: ["إداره الجوده", "Quality Management", "TQM"],
    prerequisites: [],
    department: "Business Administration",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA315",
    arabicName: "محاسبة شركات",
    englishName: "Companies Accounting",
    aliases: ["محاسبه شركات", "Companies Accounting"],
    prerequisites: ["GEN102"],
    department: "Business Administration",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA316",
    arabicName: "الابتكار وريادة الاعمال",
    englishName: "Innovation and Entrepreneurship",
    aliases: ["الابتكار وريادة الأعمال", "Innovation and Entrepreneurship"],
    prerequisites: [],
    department: "Business Administration",
    level: 3,
    semester: "Spring",
    credits: 2
  },

  // ══════════════════════════════════════════════════════════════════════
  // BUSINESS ADMINISTRATION — LEVEL 4
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "BA401",
    arabicName: "إدارة اعمال دولية",
    englishName: "International Business Management",
    aliases: ["إداره اعمال دوليه", "International Business Management"],
    prerequisites: ["GEN101"],
    department: "Business Administration",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA402",
    arabicName: "نظرية وتصميم المنظمة",
    englishName: "Organization Theory and Design",
    aliases: ["نظريه وتصميم المنظمه", "Organization Theory and Design"],
    prerequisites: ["GEN111"],
    department: "Business Administration",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA403",
    arabicName: "موارد بشرية استراتيجية",
    englishName: "Strategic Human Resources",
    aliases: ["موارد بشريه استراتيجيه", "Strategic Human Resources", "strategic HRM"],
    prerequisites: ["GEN207"],
    department: "Business Administration",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA404",
    arabicName: "إدارة المشروعات",
    englishName: "Project Management",
    aliases: ["إداره المشروعات", "Project Management"],
    prerequisites: ["BA301"],
    department: "Business Administration",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA405",
    arabicName: "محاسبة إدارية متقدمة",
    englishName: "Advanced Managerial Accounting",
    aliases: ["محاسبه إداريه متقدمه", "Advanced Managerial Accounting"],
    prerequisites: ["GEN112"],
    department: "Business Administration",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "BA406",
    arabicName: "الانسان والبيئة",
    englishName: "Human and Environment",
    aliases: ["الإنسان والبيئه", "Human and Environment"],
    prerequisites: [],
    department: "Business Administration",
    level: 4,
    semester: "Fall",
    credits: 2
  },
  {
    code: "BA411",
    arabicName: "إدارة استراتيجية",
    englishName: "Strategic Management",
    aliases: ["إداره استراتيجيه", "Strategic Management"],
    prerequisites: ["GEN101"],
    department: "Business Administration",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA412",
    arabicName: "إدارة المعرفة والابتكار",
    englishName: "Knowledge and Innovation Management",
    aliases: ["إداره المعرفه والابتكار", "Knowledge and Innovation Management"],
    prerequisites: [],
    department: "Business Administration",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA413",
    arabicName: "بحوث تسويق",
    englishName: "Marketing Research",
    aliases: ["بحوث التسويق", "Marketing Research"],
    prerequisites: ["GEN202"],
    department: "Business Administration",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA414",
    arabicName: "أسواق ومؤسسات مالية",
    englishName: "Financial Markets and Institutions",
    aliases: ["اسواق ومؤسسات ماليه", "Financial Markets and Institutions"],
    prerequisites: ["GEN214"],
    department: "Business Administration",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA415",
    arabicName: "تجارة واعمال الكترونية",
    englishName: "E-Commerce and Digital Business",
    aliases: ["تجاره واعمال الكترونيه", "E-Commerce and Digital Business", "e-commerce"],
    prerequisites: ["GEN205"],
    department: "Business Administration",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA416",
    arabicName: "الاتجاهات الحديثة في السياحة",
    englishName: "Modern Trends in Tourism",
    aliases: ["الاتجاهات الحديثه في السياحه", "Modern Trends in Tourism"],
    prerequisites: [],
    department: "Business Administration",
    level: 4,
    semester: "Spring",
    credits: 2
  },
  {
    code: "BA417",
    arabicName: "الاتصالات التسويقية المتكاملة",
    englishName: "Integrated Marketing Communications",
    aliases: ["الاتصالات التسويقيه المتكامله", "Integrated Marketing Communications", "IMC"],
    prerequisites: [],
    department: "Business Administration",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "BA418",
    arabicName: "التسويق الدولي",
    englishName: "International Marketing",
    aliases: ["التسويق الدولى", "International Marketing"],
    prerequisites: [],
    department: "Business Administration",
    level: 4,
    semester: "Spring",
    credits: 3
  },

  // ══════════════════════════════════════════════════════════════════════
  // MIS — LEVEL 3
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "MIS301",
    arabicName: "مقدمة في برمجة الحاسب",
    englishName: "Introduction to Computer Programming",
    aliases: [
      "مقدمه في برمجه الحاسب",
      "Introduction to Computer Programming",
      "intro to programming",
      "computer programming"
    ],
    prerequisites: ["GEN205"],
    department: "MIS",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS302",
    arabicName: "البنية التحتية لتكنولوجيا المعلومات",
    englishName: "IT Infrastructure",
    aliases: [
      "البنيه التحتيه لتكنولوجيا المعلومات",
      "IT Infrastructure",
      "IT infrastructure"
    ],
    prerequisites: [],
    department: "MIS",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS303",
    arabicName: "تحليل كمي باستخدام البرمجيات",
    englishName: "Quantitative Analysis Using Programming",
    aliases: [
      "تحليل كمى باستخدام البرمجيات",
      "Quantitative Analysis Using Programming",
      "quantitative analysis"
    ],
    prerequisites: [],
    department: "MIS",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS304",
    arabicName: "مبادئ محاسبة التكاليف",
    englishName: "Cost Accounting Principles",
    aliases: ["مبادئ محاسبه التكاليف", "Cost Accounting Principles", "cost accounting"],
    prerequisites: ["GEN112"],
    department: "MIS",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS305",
    arabicName: "إدارة الإنتاج والعمليات",
    englishName: "Production and Operations Management",
    aliases: ["إداره الإنتاج والعمليات", "Production and Operations Management", "POM"],
    prerequisites: ["GEN101"],
    department: "MIS",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS306",
    arabicName: "التفكير الناقد",
    englishName: "Critical Thinking",
    aliases: ["التفكير الناقد", "Critical Thinking"],
    prerequisites: [],
    department: "MIS",
    level: 3,
    semester: "Fall",
    credits: 2
  },
  {
    code: "MIS311",
    arabicName: "تصميم وإدارة قواعد البيانات",
    englishName: "Database Design and Management",
    aliases: [
      "تصميم وإداره قواعد البيانات",
      "Database Design and Management",
      "database management",
      "DBMS"
    ],
    prerequisites: ["GEN205"],
    department: "MIS",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS312",
    arabicName: "تطبيقات في برمجة الحاسب",
    englishName: "Applications in Computer Programming",
    aliases: [
      "تطبيقات في برمجه الحاسب",
      "Applications in Computer Programming",
      "computer programming applications"
    ],
    prerequisites: [],
    department: "MIS",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS313",
    arabicName: "إدارة التكنولوجيا",
    englishName: "Technology Management",
    aliases: ["إداره التكنولوجيا", "Technology Management"],
    prerequisites: [],
    department: "MIS",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS314",
    arabicName: "تحليل وتصميم نظم المعلومات",
    englishName: "Information Systems Analysis and Design",
    aliases: [
      "تحليل وتصميم نظم المعلومات",
      "Information Systems Analysis and Design",
      "ISAD",
      "systems analysis"
    ],
    prerequisites: [],
    department: "MIS",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS315",
    arabicName: "البرامج الإحصائية الجاهزة",
    englishName: "Ready-Made Statistical Programs",
    aliases: ["البرامج الإحصائيه الجاهزه", "Ready-Made Statistical Programs", "SPSS"],
    prerequisites: ["GEN203"],
    department: "MIS",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS316",
    arabicName: "الابتكار وريادة الاعمال",
    englishName: "Innovation and Entrepreneurship",
    aliases: ["الابتكار وريادة الأعمال", "Innovation and Entrepreneurship"],
    prerequisites: [],
    department: "MIS",
    level: 3,
    semester: "Spring",
    credits: 2
  },

  // ══════════════════════════════════════════════════════════════════════
  // MIS — LEVEL 4
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "MIS401",
    arabicName: "نظم المعلومات المتقدمة وتطبيقاتها",
    englishName: "Advanced Information Systems and Applications",
    aliases: [
      "نظم المعلومات المتقدمه وتطبيقاتها",
      "Advanced Information Systems and Applications",
      "advanced IS"
    ],
    prerequisites: ["MIS302"],
    department: "MIS",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS402",
    arabicName: "نظم دعم القرار",
    englishName: "Decision Support Systems",
    aliases: [
      "نظم دعم القرار",
      "Decision Support Systems",
      "DSS",
      "E نظم دعم القرار"
    ],
    prerequisites: ["MIS303"],
    department: "MIS",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS403",
    arabicName: "استخبارات وتنقيب البيانات",
    englishName: "Data Mining and Intelligence",
    aliases: [
      "استخبارات وتنقيب البيانات",
      "Data Mining and Intelligence",
      "data mining",
      "business intelligence",
      "BI"
    ],
    prerequisites: ["MIS311"],
    department: "MIS",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS404",
    arabicName: "مراجعة النظم الالكترونية",
    englishName: "Electronic Systems Review",
    aliases: [
      "مراجعه النظم الالكترونيه",
      "Electronic Systems Review",
      "e-systems review"
    ],
    prerequisites: ["MIS301", "MIS314"],
    department: "MIS",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS405",
    arabicName: "إدارة استراتيجية",
    englishName: "Strategic Management",
    aliases: ["إداره استراتيجيه", "Strategic Management", "strategy"],
    prerequisites: ["GEN101"],
    department: "MIS",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "MIS406",
    arabicName: "الانسان والبيئة",
    englishName: "Human and Environment",
    aliases: ["الإنسان والبيئه", "Human and Environment"],
    prerequisites: [],
    department: "MIS",
    level: 4,
    semester: "Fall",
    credits: 2
  },
  {
    code: "MIS411",
    arabicName: "تجارة واعمال الكترونية",
    englishName: "E-Commerce and Digital Business",
    aliases: ["تجاره واعمال الكترونيه", "E-Commerce and Digital Business", "e-commerce"],
    prerequisites: ["GEN205"],
    department: "MIS",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS412",
    arabicName: "نظم المعلومات المتكاملة",
    englishName: "Integrated Information Systems",
    aliases: [
      "نظم المعلومات المتكامله",
      "Integrated Information Systems",
      "ERP",
      "integrated IS"
    ],
    prerequisites: ["MIS314"],
    department: "MIS",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS413",
    arabicName: "النظم الذكية لدعم القرار",
    englishName: "Intelligent Systems for Decision Support",
    aliases: [
      "النظم الذكيه لدعم القرار",
      "Intelligent Systems for Decision Support",
      "intelligent DSS",
      "AI for decision support"
    ],
    prerequisites: ["MIS312"],
    department: "MIS",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS414",
    arabicName: "مشروع تخرج",
    englishName: "Graduation Project",
    aliases: ["مشروع تخرج", "Graduation Project", "capstone"],
    prerequisites: ["MIS311", "MIS314"],
    department: "MIS",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS415",
    arabicName: "نظم معلومات محاسبية متقدمة",
    englishName: "Advanced Accounting Information Systems",
    aliases: [
      "نظم معلومات محاسبيه متقدمه",
      "Advanced Accounting Information Systems",
      "advanced AIS"
    ],
    prerequisites: ["GEN211"],
    department: "MIS",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "MIS416",
    arabicName: "الاتجاهات الحديثة في السياحة",
    englishName: "Modern Trends in Tourism",
    aliases: ["الاتجاهات الحديثه في السياحه", "Modern Trends in Tourism"],
    prerequisites: [],
    department: "MIS",
    level: 4,
    semester: "Spring",
    credits: 2
  },

  // ══════════════════════════════════════════════════════════════════════
  // STATISTICS — LEVEL 3
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "STAT301",
    arabicName: "الإحصاء السكاني",
    englishName: "Population Statistics",
    aliases: ["الإحصاء السكانى", "Population Statistics"],
    prerequisites: ["GEN203"],
    department: "Statistics",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT302",
    arabicName: "طرق البحث الاحصائي",
    englishName: "Statistical Research Methods",
    aliases: ["طرق البحث الإحصائى", "Statistical Research Methods"],
    prerequisites: [],
    department: "Statistics",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT303",
    arabicName: "الرياضيات المتقدمة",
    englishName: "Advanced Mathematics",
    aliases: ["الرياضيات المتقدمه", "Advanced Mathematics"],
    prerequisites: ["GEN103"],
    department: "Statistics",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT304",
    arabicName: "مقدمة في برمجة الحاسب",
    englishName: "Introduction to Computer Programming",
    aliases: ["مقدمه في برمجه الحاسب", "Introduction to Computer Programming"],
    prerequisites: ["GEN205"],
    department: "Statistics",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT305",
    arabicName: "مبادئ محاسبة التكاليف",
    englishName: "Cost Accounting Principles",
    aliases: ["مبادئ محاسبه التكاليف", "Cost Accounting Principles", "cost accounting"],
    prerequisites: ["GEN112"],
    department: "Statistics",
    level: 3,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT306",
    arabicName: "التفكير الناقد",
    englishName: "Critical Thinking",
    aliases: ["التفكير الناقد", "Critical Thinking"],
    prerequisites: [],
    department: "Statistics",
    level: 3,
    semester: "Fall",
    credits: 2
  },
  {
    code: "STAT311",
    arabicName: "البرامج الإحصائية الجاهزة",
    englishName: "Ready-Made Statistical Programs",
    aliases: ["البرامج الإحصائيه الجاهزه", "Ready-Made Statistical Programs", "SPSS"],
    prerequisites: [],
    department: "Statistics",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT312",
    arabicName: "مقدمة في الإحصاءات اللامعلمية",
    englishName: "Introduction to Non-Parametric Statistics",
    aliases: ["مقدمه في الإحصاءات اللامعلميه", "Introduction to Non-Parametric Statistics", "non-parametric statistics"],
    prerequisites: ["GEN203"],
    department: "Statistics",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT313",
    arabicName: "نظرية المعاينة الإحصائية",
    englishName: "Statistical Sampling Theory",
    aliases: ["نظريه المعاينه الإحصائيه", "Statistical Sampling Theory"],
    prerequisites: [],
    department: "Statistics",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT314",
    arabicName: "الجبر الخطي",
    englishName: "Linear Algebra",
    aliases: ["الجبر الخطى", "Linear Algebra"],
    prerequisites: ["GEN103"],
    department: "Statistics",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT315",
    arabicName: "اقتصاد رياضي",
    englishName: "Mathematical Economics",
    aliases: ["اقتصاد رياضى", "Mathematical Economics"],
    prerequisites: [],
    department: "Statistics",
    level: 3,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT316",
    arabicName: "الابتكار وريادة الاعمال",
    englishName: "Innovation and Entrepreneurship",
    aliases: ["الابتكار وريادة الأعمال", "Innovation and Entrepreneurship"],
    prerequisites: [],
    department: "Statistics",
    level: 3,
    semester: "Spring",
    credits: 2
  },

  // ══════════════════════════════════════════════════════════════════════
  // STATISTICS — LEVEL 4
  // ══════════════════════════════════════════════════════════════════════

  {
    code: "STAT401",
    arabicName: "بحوث العمليات",
    englishName: "Operations Research",
    aliases: ["بحوث العمليات", "Operations Research", "OR"],
    prerequisites: ["STAT303"],
    department: "Statistics",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT402",
    arabicName: "نظرية الإحصاء (1)",
    englishName: "Statistical Theory 1",
    aliases: ["نظريه الإحصاء 1", "Statistical Theory 1", "statistical theory i"],
    prerequisites: [],
    department: "Statistics",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT403",
    arabicName: "سلاسل زمنية",
    englishName: "Time Series",
    aliases: ["سلاسل زمنيه", "Time Series"],
    prerequisites: ["STAT302"],
    department: "Statistics",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT404",
    arabicName: "تجارة واعمال الكترونية",
    englishName: "E-Commerce and Digital Business",
    aliases: ["تجاره واعمال الكترونيه", "E-Commerce and Digital Business", "e-commerce"],
    prerequisites: ["GEN205"],
    department: "Statistics",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT405",
    arabicName: "دراسة الجدوى الاقتصادية والاجتماعية",
    englishName: "Economic and Social Feasibility Study",
    aliases: ["دراسه الجدوى الاقتصاديه والاجتماعيه", "Economic and Social Feasibility Study", "feasibility study"],
    prerequisites: ["GEN204"],
    department: "Statistics",
    level: 4,
    semester: "Fall",
    credits: 3
  },
  {
    code: "STAT406",
    arabicName: "الانسان والبيئة",
    englishName: "Human and Environment",
    aliases: ["الإنسان والبيئه", "Human and Environment"],
    prerequisites: [],
    department: "Statistics",
    level: 4,
    semester: "Fall",
    credits: 2
  },
  {
    code: "STAT411",
    arabicName: "نظرية الإحصاء (2)",
    englishName: "Statistical Theory 2",
    aliases: ["نظريه الإحصاء 2", "Statistical Theory 2", "statistical theory ii"],
    prerequisites: ["STAT303"],
    department: "Statistics",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT412",
    arabicName: "تحليل الانحدار",
    englishName: "Regression Analysis",
    aliases: ["تحليل الانحدار", "Regression Analysis"],
    prerequisites: ["STAT302"],
    department: "Statistics",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT413",
    arabicName: "اقتصاد قياسي",
    englishName: "Econometrics",
    aliases: ["اقتصاد قياسى", "Econometrics"],
    prerequisites: ["STAT302", "STAT311"],
    department: "Statistics",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT414",
    arabicName: "تصميم التجارب",
    englishName: "Experimental Design",
    aliases: ["تصميم التجارب", "Experimental Design", "DOE"],
    prerequisites: ["STAT314"],
    department: "Statistics",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT415",
    arabicName: "تأمين متقدم",
    englishName: "Advanced Insurance",
    aliases: ["تامين متقدم", "Advanced Insurance"],
    prerequisites: ["GEN215"],
    department: "Statistics",
    level: 4,
    semester: "Spring",
    credits: 3
  },
  {
    code: "STAT416",
    arabicName: "الاتجاهات الحديثة في السياحة",
    englishName: "Modern Trends in Tourism",
    aliases: ["الاتجاهات الحديثه في السياحه", "Modern Trends in Tourism"],
    prerequisites: [],
    department: "Statistics",
    level: 4,
    semester: "Spring",
    credits: 2
  }
]

export default courseData
