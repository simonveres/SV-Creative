const SITE_CONTACT = Object.freeze({
  email: 'simonveressianturi160203@gmail.com',
  instagram: 'https://www.instagram.com/simonveres_/',
  instagramHandle: '@simonveres_',
  tiktok: 'https://www.tiktok.com/@simonveres2_/',
  tiktokHandle: '@simonveres2_'
});

const WHATSAPP_NUMBER = '6285284150827';
window.SVCreativeConfig = Object.freeze({ whatsappNumber: WHATSAPP_NUMBER });
document.documentElement.classList.add('js');

const languages = [
  { code: 'id', name: 'Indonesia' },
  { code: 'en', name: 'Inggris' },
  { code: 'zh', name: 'Mandarin' },
  { code: 'ja', name: 'Jepang' },
  { code: 'ko', name: 'Korea' },
  { code: 'es', name: 'Spanyol' },
  { code: 'fr', name: 'Prancis' },
  { code: 'de', name: 'Jerman' },
  { code: 'ar', name: 'Arab' },
  { code: 'pt', name: 'Portugis' }
];

const translations = {
  id: {
    navHome: 'Beranda',
    navWork: 'Karya',
    navServices: 'Layanan',
    navPortfolio: 'Portofolio',
    navClients: 'Klien',
    navAbout: 'Tentang',
    navContact: 'Kontak',
    languageLabel: 'Bahasa',
    welcomeGreeting: 'Selamat Datang di SV Creative',
    welcomeDescriptor: 'Digital · Creative · Visual',
    clientsPageEyebrow: 'Kolaborasi',
    clientsPageTitle: 'Klien & Kolaborasi',
    clientsPageText: 'SV Creative terbuka untuk bekerja bersama individu, organisasi, UMKM, bisnis, komunitas, dan institusi.',
    clientsPageAction: 'Jadi Klien',
    clientsPagePlaceholder: 'Nama organisasi Anda',
    bookNow: 'Mari Bicara',
    navToggleLabel: 'Buka atau tutup menu navigasi',
    heroEyebrow: 'Digital • Kreatif • Visual',
    heroTitle: 'Dibuat untuk brand yang ingin tampak premium.',
    heroDesc: 'SV Creative menggabungkan solusi digital, layanan kreatif, dan storytelling visual untuk membantu individu, organisasi, UMKM, dan bisnis membangun identitas serta kehadiran digital yang profesional.',
    heroStat1: 'Digital',
    heroStat1Title: 'Digital Solutions',
    heroStat1Text: 'Website, platform, dan solusi digital untuk kebutuhan bisnis.',
    heroStat2: 'Visual',
    heroStat2Title: 'Creative Visual',
    heroStat2Text: 'Branding, desain, foto, dan video untuk membangun identitas yang kuat.',
    heroPrimary: 'Lihat Karya',
    heroSecondary: 'Mari Bicara',
    proofWebsite: 'Website',
    proofPortfolio: 'Portofolio',
    proofPhotography: 'Fotografi',
    proofVideography: 'Videografi',
    proofDesign: 'Desain',
    sectionServices: 'Apa yang Kami Lakukan',
    sectionServicesSub: 'Solusi kreatif untuk pertumbuhan.',
    serviceWebsiteTitle: 'Website & landing page',
    serviceWebsiteDesc: 'Profil perusahaan, portofolio, website bisnis, dan halaman yang fokus pada konversi.',
    servicePortfolioTitle: 'CV & portfolio',
    servicePortfolioDesc: 'Dokumen personal brand profesional agar terasa lebih rapi, kredibel, dan berkesan.',
    servicePhotographyTitle: 'Fotografi',
    servicePhotographyDesc: 'Dokumentasi dan storytelling untuk acara, wisuda, personal branding, dan momen penting.',
    serviceVideographyTitle: 'Videografi',
    serviceVideographyDesc: 'Video highlight, reels, dan storytelling visual untuk kanal digital.',
    serviceDesignTitle: 'Desain kreatif',
    serviceDesignDesc: 'Desain poster, kit media sosial, pitch deck, dan aset visual sesuai pesan Anda.',
    portfolioHome1Title: 'Refresh website brand',
    portfolioHome1Desc: 'Storytelling produk yang modern untuk bisnis yang terus tumbuh.',
    portfolioHome2Title: 'Portfolio profesional',
    portfolioHome2Desc: 'Presentasi brand personal yang rapi untuk kesan pertama yang kuat.',
    portfolioHome3Title: 'Cakupan wisuda',
    portfolioHome3Desc: 'Potret dan dokumentasi yang kaya cerita dengan gaya hangat dan elegan.',
    learnMore: 'Selengkapnya',
    sectionPortfolio: 'Cuplikan Portofolio',
    portfolioTitle: 'Portofolio pilihan',
    whyUs: 'Kenapa memilih kami',
    whyUsTitle: 'Kita gabungkan strategi, estetika, dan kejelasan.',
    whyUsText: 'Setiap proyek dimulai dengan memahami audiens dan tujuan Anda. Dari situ, kami membangun sistem visual yang konsisten, terpercaya, dan memorable.',
    check1: 'Komunikasi yang jelas dari konsep sampai akhir',
    check2: 'Arahan kreatif yang sesuai dengan audiens',
    check3: 'Desain yang matang dengan tujuan bisnis yang jelas',
    strategy: 'Strategi',
    strategyText: 'Perencanaan berbasis tujuan',
    design: 'Desain',
    designText: 'Kehadiran visual yang konsisten',
    delivery: 'Delivery',
    deliveryText: 'Output siap pakai',
    testimonials: 'Untuk siapa',
    testimonialsTitle: 'Siapa yang Kami Dukung',
    audienceBusiness: 'Bisnis & tim',
    audienceBusinessText: 'Website dan komunikasi visual untuk memperkenalkan usaha dengan jelas.',
    audiencePersonal: 'Personal brand',
    audiencePersonalText: 'Portofolio, CV, dan aset media yang dibangun dari cerita Anda.',
    audienceOrganization: 'Organisasi',
    audienceOrganizationText: 'Dukungan kreatif untuk program, kampanye, acara, dan kanal digital.',
    footerNav: 'Navigasi',
    footerExplore: 'Jelajahi',
    footerContact: 'Kontak',
    footerSocial: 'Sosial & kontak',
    footerWhatsApp: 'WhatsApp: 0852-8415-0827',
    footerCopy: 'Mitra digital kreatif untuk brand modern, organisasi, dan individu.',
    footerRights: 'Digital • Kreatif • Visual',
    footerHome: 'Beranda',
    footerServices: 'Layanan',
    footerPortfolio: 'Portofolio',
    footerAbout: 'Tentang',
    footerFAQ: 'FAQ',
    footerInstagram: 'Instagram',
    footerEmail: 'Email',
    footerChat: 'Chat via WhatsApp',
    contactName: 'Nama',
    contactEmail: 'Email',
    contactService: 'Layanan',
    contactMessage: 'Detail proyek',
    contactSend: 'Kirim via WhatsApp',
    contactStart: 'Mulai Chat WhatsApp',
    contactQuick: 'Kontak cepat',
    contactProject: 'Mulai proyek Anda',
    contactText: 'Butuh website, portofolio yang lebih kuat, dokumentasi media, atau paket visual kreatif yang lebih rapi? Kami siap membantu.',
    faqTitle: 'Pertanyaan Umum',
    faqSubtitle: 'Pertanyaan umum tentang lingkup, timeline, komunikasi, dan cara kerja kami.',
    faq1Q: 'Bagaimana prosesnya dimulai?',
    faq1A: 'Kami mulai dengan percakapan tentang tujuan, timeline, dan jenis output yang Anda butuhkan.',
    faq2Q: 'Apakah proyek bisa disesuaikan?',
    faq2A: 'Ya. Setiap proyek dibuat berdasarkan audiens, pesan, dan gaya yang Anda inginkan.',
    faq3Q: 'Apakah Anda bekerja dengan bisnis dan individu?',
    faq3A: 'Ya. Kami mendukung personal brand, bisnis, organisasi, mahasiswa, dan tim acara.',
    faq4Q: 'Berapa lama biasanya proyek selesai?',
    faq4A: 'Tergantung pada kompleksitas dan jumlah revisi. Namun timeline akan dijelaskan sejak awal.',
    aboutTitle: 'Tetap fokus pada tujuan.',
    aboutText1: 'SV Creative menggabungkan strategi, desain visual, dan storytelling untuk membantu brand komunikasi dengan jelas dan percaya diri.',
    aboutText2: 'Kami bekerja dengan founder, organisasi, mahasiswa, dan pemilik bisnis untuk memperkuat kehadiran digital mereka dengan proses kreatif yang matang dan modern.',
    aboutValues: 'Nilai Kami',
    aboutValuesTitle: 'Apa yang paling kami pentingkan',
    aboutValue1: 'Kejelasan pesan',
    aboutValue2: 'Konsistensi bahasa visual',
    aboutValue3: 'Eksekusi profesional',
    aboutValue4: 'Komunikasi yang matang',
    servicesTagline: 'Layanan kreatif yang dibuat untuk tumbuh.',
    servicesIntro: 'Kami membantu brand, bisnis, dan individu menampilkan diri dengan jelas, stylish, dan percaya diri.',
    servicesCore: 'Layanan utama',
    servicesCoreTitle: 'Semua yang Anda butuhkan agar terlihat kuat di dunia online.',
    processTitle: 'Proses Kerja',
    process1: '1. Brief & riset',
    process2: '2. Konsep & arahan visual',
    process3: '3. Eksekusi & penyempurnaan',
    process4: '4. Final delivery',
    portfolioTitlePage: 'Proyek terpilih dan karya kreatif kami.',
    portfolioIntro: 'Contoh dari desain website, storytelling media, personal branding, dan komunikasi visual.',
    portfolioW1: 'Website profil bisnis',
    portfolioW2: 'Branding personal profesional',
    portfolioW3: 'Storytelling acara dan wisuda',
    portfolioW4: 'Produksi video highlight',
    portfolioW5: 'Visual campaign kreatif',
    portfolioP1: 'Halaman landing modern yang dirancang untuk menyampaikan nilai, kredibilitas, dan kejelasan layanan.',
    portfolioP2: 'Sistem portfolio dan CV yang disesuaikan untuk mahasiswa, profesional, dan pencari kerja yang ingin tampil lebih kuat.',
    portfolioP3: 'Dokumentasi visual hangat dan elegan untuk menyimpan emosi dan kenangan dalam bentuk yang rapi.',
    portfolioP4: 'Storytelling bergerak untuk acara, campaign, dan promosi digital dengan daya tarik audiens yang lebih baik.',
    portfolioP5: 'Poster, kit Instagram, dan desain media sosial yang dibuat agar pesan lebih jelas dan lebih mudah diingat.',
    contactHeaderTitle: 'Mari Berkarya Bersama',
    contactHeaderText: 'Punya proyek? Mari ciptakan sesuatu yang bermakna bersama.',
    contactEmailAction: 'KIRIM EMAIL',
    contactInstagramAction: 'LIHAT INSTAGRAM',
    contactTikTokAction: 'LIHAT TIKTOK',
    contactBookAction: 'BOOK VIA WHATSAPP',
    faqPageTitle: 'Pertanyaan yang Sering Diajukan',
    faqPageText: 'Jawaban umum seputar ruang lingkup, timeline, komunikasi, dan cara kerja kami.',
    navHomeShort: 'Home',
    navServicesShort: 'Services',
    navPortfolioShort: 'Portfolio',
    navAboutShort: 'About',
    navContactShort: 'Contact' 
  },
  en: {
    navHome: 'Home',
    navWork: 'Work',
    navServices: 'Services',
    navPortfolio: 'Portfolio',
    navClients: 'Clients',
    navAbout: 'About',
    navContact: 'Contact',
    languageLabel: 'Language',
    welcomeGreeting: 'Welcome to SV Creative',
    welcomeDescriptor: 'Digital · Creative · Visual',
    clientsPageEyebrow: 'Collaboration',
    clientsPageTitle: 'Clients & Collaborations',
    clientsPageText: 'SV Creative welcomes projects with individuals, organizations, UMKM, businesses, communities, and institutions.',
    clientsPageAction: 'Become a Client',
    clientsPagePlaceholder: 'Your Organization Here',
    bookNow: 'Let\'s Talk',
    navToggleLabel: 'Toggle navigation menu',
    heroEyebrow: 'Digital • Creative • Visual',
    heroTitle: 'Built for brands that want to look premium.',
    heroDesc: 'SV Creative brings together digital solutions, creative services, and visual storytelling to help individuals, organizations, UMKM, and businesses build professional identities and digital presence.',
    heroStat1: 'Digital',
    heroStat1Title: 'Digital Solutions',
    heroStat1Text: 'Websites, platforms, and digital solutions for business needs.',
    heroStat2: 'Visual',
    heroStat2Title: 'Creative Visual',
    heroStat2Text: 'Branding, design, photography, and video to build a strong identity.',
    heroPrimary: 'Explore Work',
    heroSecondary: 'Let\'s Talk',
    proofWebsite: 'Website',
    proofPortfolio: 'Portfolio',
    proofPhotography: 'Photography',
    proofVideography: 'Videography',
    proofDesign: 'Design',
    sectionServices: 'What We Do',
    sectionServicesSub: 'Creative solutions for growth.',
    serviceWebsiteTitle: 'Website & landing page',
    serviceWebsiteDesc: 'Company profile, portfolio, business website, and conversion-focused pages.',
    servicePortfolioTitle: 'CV & portfolio',
    servicePortfolioDesc: 'Professional personal brand documents designed to feel polished and credible.',
    servicePhotographyTitle: 'Photography',
    servicePhotographyDesc: 'Documentation and storytelling for events, graduation, personal branding, and meaningful moments.',
    serviceVideographyTitle: 'Videography',
    serviceVideographyDesc: 'Highlight videos, reels, and visual storytelling for digital channels.',
    serviceDesignTitle: 'Creative design',
    serviceDesignDesc: 'Poster design, social media kits, pitch decks, and visual assets that align with your message.',
    portfolioHome1Title: 'Brand website refresh',
    portfolioHome1Desc: 'Modern product storytelling for a growing business.',
    portfolioHome2Title: 'Professional portfolio',
    portfolioHome2Desc: 'Clean personal brand presentation for a strong first impression.',
    portfolioHome3Title: 'Graduation coverage',
    portfolioHome3Desc: 'Story-rich portraits and documentation with warm, elegant styling.',
    learnMore: 'Learn more',
    sectionPortfolio: 'Portfolio Snapshot',
    portfolioTitle: 'Selected projects',
    whyUs: 'Why choose us',
    whyUsTitle: 'We blend strategy, aesthetics, and clarity.',
    whyUsText: 'Every project begins by understanding your audience and goals. From there, we shape a visual system that is consistent, trustworthy, and memorable.',
    check1: 'Clear communication from concept to delivery',
    check2: 'Creative direction tailored to your audience',
    check3: 'Thoughtful design with clear business intent',
    strategy: 'Strategy',
    strategyText: 'Goal-focused planning',
    design: 'Design',
    designText: 'Consistent visual presence',
    delivery: 'Delivery',
    deliveryText: 'Ready-to-use final output',
    testimonials: 'Who we support',
    testimonialsTitle: 'Who We Work With',
    audienceBusiness: 'Businesses & teams',
    audienceBusinessText: 'Websites and visual communication to present your business clearly.',
    audiencePersonal: 'Personal brands',
    audiencePersonalText: 'Portfolios, CVs, and media assets shaped around your story.',
    audienceOrganization: 'Organizations',
    audienceOrganizationText: 'Creative support for programs, campaigns, events, and digital channels.',
    footerNav: 'Navigation',
    footerExplore: 'Explore',
    footerContact: 'Contact',
    footerSocial: 'Social & contact',
    footerWhatsApp: 'WhatsApp: 0852-8415-0827',
    footerCopy: 'Creative digital partner for modern brands, organizations, and individuals.',
    footerRights: 'Digital • Creative • Visual',
    footerHome: 'Home',
    footerServices: 'Services',
    footerPortfolio: 'Portfolio',
    footerAbout: 'About',
    footerFAQ: 'FAQ',
    footerInstagram: 'Instagram',
    footerEmail: 'Email',
    footerChat: 'Chat via WhatsApp',
    contactName: 'Name',
    contactEmail: 'Email',
    contactService: 'Service',
    contactMessage: 'Project details',
    contactSend: 'Send via WhatsApp',
    contactStart: 'Start WhatsApp chat',
    contactQuick: 'Quick contact',
    contactProject: 'Start your project',
    contactText: 'Need a website, stronger portfolio, better media coverage, or a polished creative asset package? We are ready to help.',
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'Common questions about scope, timeline, communication, and how we work.',
    faq1Q: 'How does the process start?',
    faq1A: 'We begin with a conversation about your goals, timeline, and the kind of output you need.',
    faq2Q: 'Can the project be customized?',
    faq2A: 'Yes. Each project is shaped around your audience, message, and preferred style.',
    faq3Q: 'Do you work with businesses and individuals?',
    faq3A: 'Yes. We support personal brands, businesses, organizations, students, and event teams.',
    faq4Q: 'How long does a project usually take?',
    faq4A: 'It depends on complexity and revision needs, but we guide the timeline clearly from the beginning.',
    aboutTitle: 'Creative direction with purpose.',
    aboutText1: 'SV Creative brings together strategy, visual design, and storytelling to help brands communicate clearly and confidently.',
    aboutText2: 'We partner with founders, organizations, students, and business owners to elevate their digital presence with a thoughtful and modern creative process.',
    aboutFocus: 'Our focus is simple: create solutions that are clear, visually strong, and aligned with your goals.',
    aboutValues: 'Our values',
    aboutValuesTitle: 'What matters to us',
    aboutValue1: 'Clarity in message',
    aboutValue2: 'Consistency in visual language',
    aboutValue3: 'Professional execution',
    aboutValue4: 'Thoughtful communication',
    servicesTagline: 'Creative services built for growth.',
    servicesIntro: 'We help brands, businesses, and individuals present themselves with clarity, style, and confidence.',
    servicesCore: 'Core services',
    servicesCoreTitle: 'Everything you need to look strong online.',
    processTitle: 'How we work',
    process1: '1. Brief & discovery',
    process2: '2. Concept & visual direction',
    process3: '3. Execution & refinement',
    process4: '4. Final delivery',
    portfolioTitlePage: 'Selected projects and creative work.',
    portfolioIntro: 'Examples across website design, media storytelling, personal branding, and visual communication.',
    portfolioW1: 'Business profile website',
    portfolioW2: 'Professional personal branding',
    portfolioW3: 'Event and graduation storytelling',
    portfolioW4: 'Highlight video production',
    portfolioW5: 'Creative campaign visuals',
    portfolioP1: 'Modern landing page and structure designed to communicate value, credibility, and service clarity.',
    portfolioP2: 'Portfolio and CV system tailored for students, professionals, and job-seekers seeking stronger first impressions.',
    portfolioP3: 'Warm, elegant visual documentation designed to preserve emotion and memory in a polished way.',
    portfolioP4: 'Motion storytelling used for events, campaigns, and digital promotion with stronger audience retention.',
    portfolioP5: 'Poster, Instagram kit, and social media design created to clarify messaging and increase recognition.',
    contactHeaderTitle: 'Let\'s Work Together',
    contactHeaderText: 'Have a project in mind? Let\'s create something meaningful together.',
    contactEmailAction: 'SEND AN EMAIL',
    contactInstagramAction: 'VIEW INSTAGRAM',
    contactTikTokAction: 'VIEW TIKTOK',
    contactBookAction: 'BOOK VIA WHATSAPP',
    faqPageTitle: 'Frequently asked questions',
    faqPageText: 'Common questions about scope, timeline, communication, and how we work.'
  },
  'zh-CN': {
    navHome: '首页', navWork: '作品', navServices: '服务', navPortfolio: '作品集', navClients: '客户', navAbout: '关于我们', navContact: '联系', languageLabel: '语言', welcomeGreeting: '欢迎来到 SV Creative', welcomeDescriptor: '数字 · 创意 · 视觉',
    clientsPageEyebrow: '合作', clientsPageTitle: '客户与合作', clientsPageText: 'SV Creative 欢迎与个人、组织、中小企业、公司、社群及机构合作。', clientsPageAction: '成为客户', clientsPagePlaceholder: '您的组织名称',
    bookNow: '立即洽谈', navToggleLabel: '展开或收起导航菜单',
    heroEyebrow: '数字 · 创意 · 视觉', heroTitle: '为追求高品质形象的品牌而打造。', heroDesc: 'SV Creative 结合数字解决方案、创意服务与视觉叙事，帮助个人、组织、中小企业及公司建立专业形象与数字影响力。',
    heroStat1: '数字', heroStat1Title: '数字解决方案', heroStat1Text: '面向业务需求的网站、平台与数字化解决方案。', heroStat2: '视觉', heroStat2Title: '创意视觉', heroStat2Text: '通过品牌塑造、设计、摄影与视频构建鲜明形象。', heroPrimary: '查看作品', heroSecondary: '聊一聊',
    proofWebsite: '网站', proofPortfolio: '作品集', proofPhotography: '摄影', proofVideography: '摄像', proofDesign: '设计',
    sectionServices: '我们的服务', sectionServicesSub: '助力成长的创意解决方案。', serviceWebsiteTitle: '网站与落地页', serviceWebsiteDesc: '企业介绍、作品集、商业网站及以转化为目标的页面。',
    servicePortfolioTitle: '简历与作品集', servicePortfolioDesc: '专业的个人品牌资料，呈现更清晰、可信且令人印象深刻的形象。', servicePhotographyTitle: '摄影', servicePhotographyDesc: '活动、毕业、个人品牌及重要时刻的记录与叙事。',
    serviceVideographyTitle: '摄像', serviceVideographyDesc: '为数字平台制作精彩集锦、短视频及视觉叙事。', serviceDesignTitle: '创意设计', serviceDesignDesc: '海报、社交媒体素材、提案演示文稿及符合您品牌信息的视觉素材。',
    portfolioHome1Title: '品牌网站焕新', portfolioHome1Desc: '为持续成长的企业打造现代产品叙事。', portfolioHome2Title: '专业作品集', portfolioHome2Desc: '简洁呈现个人品牌，留下良好的第一印象。',
    portfolioHome3Title: '毕业纪实', portfolioHome3Desc: '以温暖优雅的风格记录充满故事的肖像与瞬间。', learnMore: '了解更多', sectionPortfolio: '作品精选', portfolioTitle: '精选项目',
    whyUs: '为何选择我们', whyUsTitle: '融合策略、美感与清晰表达。', whyUsText: '每个项目都从了解受众与目标开始，并据此打造一致、可信且令人难忘的视觉体系。',
    check1: '从创意构思到交付，沟通清晰', check2: '根据目标受众制定创意方向', check3: '兼顾商业目标的成熟设计', strategy: '策略', strategyText: '以目标为导向的规划', design: '设计', designText: '一致的视觉形象', delivery: '交付', deliveryText: '可直接使用的成果',
    testimonials: '服务对象', testimonialsTitle: '我们支持谁', audienceBusiness: '企业与团队', audienceBusinessText: '通过网站和视觉沟通，清晰展示您的业务。', audiencePersonal: '个人品牌', audiencePersonalText: '围绕您的故事打造作品集、简历及媒体素材。',
    audienceOrganization: '组织', audienceOrganizationText: '为项目、活动、宣传及数字平台提供创意支持。', footerNav: '导航', footerExplore: '探索', footerContact: '联系', footerSocial: '社交媒体与联系',
    footerWhatsApp: 'WhatsApp：0852-8415-0827', footerCopy: '现代品牌、组织与个人的创意数字合作伙伴。', footerRights: '数字 · 创意 · 视觉', footerHome: '首页', footerServices: '服务', footerPortfolio: '作品集', footerAbout: '关于我们', footerFAQ: '常见问题', footerInstagram: 'Instagram', footerEmail: '电子邮箱', footerChat: '通过 WhatsApp 联系',
    contactName: '姓名', contactEmail: '电子邮箱', contactService: '服务项目', contactMessage: '项目详情', contactSend: '通过 WhatsApp 发送', contactStart: '开始 WhatsApp 对话', contactQuick: '快速联系', contactProject: '开启您的项目', contactText: '需要网站、更出色的作品集、媒体记录或完整的创意视觉素材吗？我们随时为您提供帮助。',
    faqTitle: '常见问题', faqSubtitle: '关于项目范围、时间安排、沟通及合作方式的常见问题。', faq1Q: '项目如何开始？', faq1A: '我们会先沟通您的目标、时间安排及所需成果。', faq2Q: '项目可以定制吗？', faq2A: '可以。每个项目都会根据您的受众、信息和偏好风格量身设计。', faq3Q: '你们服务企业和个人吗？', faq3A: '是的。我们服务个人品牌、企业、组织、学生及活动团队。', faq4Q: '项目通常需要多长时间？', faq4A: '时间取决于项目复杂度与修改需求，我们会在开始前清楚说明进度安排。',
    aboutTitle: '始终聚焦目标。', aboutText1: 'SV Creative 融合策略、视觉设计与叙事，帮助品牌清晰、自信地传达信息。', aboutText2: '我们与创办人、组织、学生及企业主合作，通过周密现代的创意流程提升数字形象。', aboutFocus: '我们的目标很简单：打造清晰、有视觉力量并符合您目标的解决方案。',
    aboutValues: '我们的价值观', aboutValuesTitle: '我们重视什么', aboutValue1: '清晰的信息表达', aboutValue2: '一致的视觉语言', aboutValue3: '专业执行', aboutValue4: '用心沟通',
    servicesTagline: '助力成长的创意服务。', servicesIntro: '我们帮助品牌、企业与个人清晰、自信且有风格地展现自己。', servicesCore: '核心服务', servicesCoreTitle: '助您在线上展现实力的一站式服务。',
    processTitle: '合作流程', process1: '1. 需求沟通与调研', process2: '2. 概念与视觉方向', process3: '3. 执行与完善', process4: '4. 最终交付',
    portfolioTitlePage: '精选项目与创意作品。', portfolioIntro: '涵盖网站设计、媒体叙事、个人品牌及视觉沟通。', portfolioW1: '企业介绍网站', portfolioW2: '专业个人品牌', portfolioW3: '活动与毕业纪实', portfolioW4: '精彩视频制作', portfolioW5: '创意宣传视觉',
    portfolioP1: '以现代落地页传达价值、可信度与清晰的服务内容。', portfolioP2: '为学生、专业人士及求职者量身打造作品集与简历系统。', portfolioP3: '以温暖优雅的视觉记录保存情感与回忆。', portfolioP4: '为活动、宣传及数字推广打造动态叙事。', portfolioP5: '通过海报、Instagram 素材及社交媒体设计，让信息更清晰、更易记。',
    contactHeaderTitle: '携手创作', contactHeaderText: '有项目想法吗？让我们一起创造有意义的作品。', contactEmailAction: '发送电子邮件', contactInstagramAction: '查看 Instagram', contactTikTokAction: '查看 TikTok', contactBookAction: '通过 WhatsApp 预约',
    faqPageTitle: '常见问题', faqPageText: '关于项目范围、时间安排、沟通及合作方式的常见问题。', navHomeShort: '首页', navServicesShort: '服务', navPortfolioShort: '作品集', navAboutShort: '关于', navContactShort: '联系'
  }
};

const aboutTranslations = {
  id: {
    aboutEyebrow: 'Digital · Kreatif · Visual',
    aboutWhoTitle: 'Siapa Kami',
    aboutWhoText: 'SV Creative adalah perusahaan layanan kreatif dan digital yang membantu individu, organisasi, UMKM, dan bisnis membangun identitas, kehadiran digital, serta visual yang profesional. Kami memadukan solusi digital, layanan kreatif, dan storytelling visual melalui pendekatan modern yang disesuaikan dengan kebutuhan setiap klien.',
    aboutDisciplinesLabel: 'Bidang layanan SV Creative',
    aboutDigitalSolutions: 'Solusi digital',
    aboutCreativeServices: 'Layanan kreatif',
    aboutVisualStorytelling: 'Storytelling visual',
    aboutWorkspaceAlt: 'Ruang kerja kreatif dengan meja dan jendela studio',
    aboutWorkspaceCaption: 'Ruang yang mendukung ide, fokus, dan proses kreatif.',
    aboutStoryEyebrow: 'Perjalanan Kami',
    aboutStoryTitle: 'Dari rasa ingin tahu menjadi brand layanan kreatif.',
    aboutBeginningTitle: 'Awal Mula',
    aboutBeginningText: 'Ketertarikan pada dunia digital tumbuh melalui eksplorasi desain, fotografi, videografi, dan cara cerita visual membantu orang saling terhubung.',
    aboutGrowthTitle: 'Perkembangan',
    aboutGrowthText: 'Minat kreatif tersebut berkembang menjadi sebuah brand layanan yang menyatukan solusi digital praktis dan karya kreatif yang dipikirkan dengan matang.',
    aboutStoryVisionTitle: 'Visi ke Depan',
    aboutStoryVisionText: 'Terus berkembang di setiap proyek, memahami setiap brief dengan saksama, dan menghasilkan karya digital serta visual yang berguna.',
    aboutVisionMissionEyebrow: 'Arah Kami',
    aboutVisionMissionTitle: 'Visi & Misi',
    aboutVisionLabel: 'Visi',
    aboutVisionText: 'Menjadi mitra kreatif tepercaya yang membantu individu, organisasi, dan bisnis menciptakan pengalaman digital dan visual yang bermakna.',
    aboutMissionLabel: 'Misi',
    aboutMission1: 'Menghadirkan solusi digital yang efektif dan dipikirkan dengan matang.',
    aboutMission2: 'Menciptakan konten visual yang profesional dan bermakna.',
    aboutMission3: 'Membantu klien mengomunikasikan identitas mereka dengan jelas.',
    aboutMission4: 'Memadukan kreativitas, teknologi, dan strategi.',
    aboutMission5: 'Membangun hubungan jangka panjang dengan klien.',
    aboutServicesEyebrow: 'Kapabilitas',
    aboutServicesTitle: 'Yang Kami Kerjakan',
    aboutWebsiteDesc: 'Fondasi digital yang membantu audiens memahami dan menemukan layanan Anda.',
    aboutWebsite1: 'Company Profile',
    aboutWebsite2: 'Website Portofolio',
    aboutWebsite3: 'Website UMKM',
    aboutWebsite4: 'Landing Page',
    aboutCvDesc: 'Profil profesional yang jelas dan tertata untuk membuka peluang berikutnya.',
    aboutCv1: 'CV ATS',
    aboutCv2: 'CV Profesional',
    aboutCv3: 'Portofolio',
    aboutCv4: 'Profil LinkedIn',
    aboutPhotoDesc: 'Fotografi people-focused untuk momen penting, kebersamaan, dan cerita personal.',
    aboutPhoto1: 'Wisuda',
    aboutPhoto2: 'Acara',
    aboutPhoto3: 'Organisasi',
    aboutPhoto4: 'Personal',
    aboutPhoto5: 'Potret',
    aboutPhoto6: 'Personal Branding',
    aboutVideoDesc: 'Video yang berfokus pada manusia, suasana, momen, dan cerita.',
    aboutVideo1: 'Dokumentasi Acara',
    aboutVideo2: 'Wisuda',
    aboutVideo3: 'Organisasi',
    aboutVideo4: 'Aftermovie',
    aboutVideo5: 'Konten Personal',
    aboutDesignDesc: 'Aset desain terarah agar pesan tampil konsisten dan mudah dikenali.',
    aboutDesign1: 'Poster',
    aboutDesign2: 'Desain Media Sosial',
    aboutDesign3: 'Presentasi',
    aboutDesign4: 'Desain Digital',
    aboutExploreService: 'Jelajahi Layanan',
    aboutApproachEyebrow: 'Proses Kami',
    aboutApproachTitle: 'Pendekatan Kami',
    aboutDiscoverTitle: 'Pahami',
    aboutDiscoverText: 'Memahami kebutuhan, tujuan, audiens, dan arah yang diinginkan klien.',
    aboutPlanTitle: 'Rencanakan',
    aboutPlanText: 'Menentukan konsep, struktur, arahan kreatif, dan kebutuhan proyek.',
    aboutCreateTitle: 'Ciptakan',
    aboutCreateText: 'Mewujudkan ide menjadi solusi digital, visual, dan kreatif.',
    aboutRefineTitle: 'Sempurnakan',
    aboutRefineText: 'Meninjau dan menyempurnakan hasil agar sesuai dengan tujuan proyek.',
    aboutDeliverTitle: 'Serahkan',
    aboutDeliverText: 'Menyerahkan proyek akhir secara profesional beserta dukungan yang diperlukan.',
    aboutWhyEyebrow: 'Yang Kami Utamakan',
    aboutWhyTitle: 'Mengapa SV Creative',
    aboutWhyCreativeTitle: 'Pemikiran Kreatif',
    aboutWhyCreativeText: 'Setiap proyek dimulai dari ide yang relevan dengan tujuan klien.',
    aboutWhyExecutionTitle: 'Eksekusi Profesional',
    aboutWhyExecutionText: 'Berfokus pada kualitas, struktur, detail, dan konsistensi.',
    aboutWhyPersonalTitle: 'Pendekatan Personal',
    aboutWhyPersonalText: 'Setiap klien memiliki kebutuhan berbeda, sehingga pendekatan disesuaikan untuk tiap proyek.',
    aboutWhyDigitalTitle: 'Digital & Visual',
    aboutWhyDigitalText: 'Memadukan solusi digital dengan komunikasi kreatif dan visual.',
    aboutWhyMeaningfulTitle: 'Hasil yang Bermakna',
    aboutWhyMeaningfulText: 'Tujuannya bukan sekadar membuat sesuatu yang menarik, tetapi juga berguna dan bermakna.',
    aboutFounderEyebrow: 'Sosok di Balik Karya',
    aboutFounderTitle: 'Tim / Founder',
    aboutFounderRole: 'Founder & Creative Lead',
    aboutFounderBio: 'Simon Veres Sianturi adalah pendiri SV Creative yang berkarya di bidang proyek digital, kreatif, dan visual, dengan fokus pada solusi profesional dan bermakna bagi individu, organisasi, dan bisnis.',
    aboutFounderPhotoLabel: 'Placeholder foto founder',
    aboutFounderPhotoPlaceholder: 'Placeholder foto founder',
    aboutClientsEyebrow: 'Terbuka untuk Kolaborasi',
    aboutClientsTitle: 'Klien & Kolaborasi',
    aboutClientsText: 'Kami terbuka untuk proyek bersama organisasi, bisnis, komunitas, individu, dan institusi.',
    aboutClientPlaceholder: 'Placeholder Logo Klien',
    aboutClientOrganization: 'Organisasi',
    aboutClientBusiness: 'Bisnis',
    aboutClientCommunity: 'Komunitas',
    aboutClientIndividual: 'Individu',
    aboutClientInstitution: 'Institusi',
    aboutBecomeClient: 'Jadi Klien',
    aboutStartProject: 'MULAI PROYEK'
  },
  en: {
    aboutEyebrow: 'Digital · Creative · Visual',
    aboutWhoTitle: 'Who We Are',
    aboutWhoText: 'SV Creative is a creative and digital service company helping individuals, organizations, UMKM, and businesses build professional identities, digital presence, and visual communication. We bring together digital solutions, creative services, and visual storytelling with a professional, modern approach shaped around each client\'s needs.',
    aboutDisciplinesLabel: 'SV Creative disciplines',
    aboutDigitalSolutions: 'Digital solutions',
    aboutCreativeServices: 'Creative services',
    aboutVisualStorytelling: 'Visual storytelling',
    aboutWorkspaceAlt: 'Bright creative workspace with desks and studio windows',
    aboutWorkspaceCaption: 'A considered space for ideas, focus, and creative work.',
    aboutStoryEyebrow: 'Our Story',
    aboutStoryTitle: 'From curiosity to a creative service brand.',
    aboutBeginningTitle: 'The Beginning',
    aboutBeginningText: 'An interest in the digital world grew through hands-on exploration of design, photography, videography, and the ways visual stories help people connect.',
    aboutGrowthTitle: 'The Growth',
    aboutGrowthText: 'Those creative interests came together as a service brand: bringing practical digital solutions and thoughtful creative work into one clear experience.',
    aboutStoryVisionTitle: 'The Vision',
    aboutStoryVisionText: 'Keep growing with each project, listen closely to every brief, and make useful digital and visual work with care.',
    aboutVisionMissionEyebrow: 'Our Direction',
    aboutVisionMissionTitle: 'Vision & Mission',
    aboutVisionLabel: 'Vision',
    aboutVisionText: 'To become a trusted creative partner that helps individuals, organizations, and businesses create meaningful digital and visual experiences.',
    aboutMissionLabel: 'Mission',
    aboutMission1: 'Deliver thoughtful and effective digital solutions.',
    aboutMission2: 'Create professional and meaningful visual content.',
    aboutMission3: 'Help clients communicate their identity clearly.',
    aboutMission4: 'Combine creativity, technology, and strategy.',
    aboutMission5: 'Build long-term relationships with clients.',
    aboutServicesEyebrow: 'Capabilities',
    aboutServicesTitle: 'What We Do',
    aboutWebsiteDesc: 'Digital foundations that make your offer easy to understand and explore.',
    aboutWebsite1: 'Company Profile',
    aboutWebsite2: 'Portfolio Website',
    aboutWebsite3: 'UMKM Website',
    aboutWebsite4: 'Landing Page',
    aboutCvDesc: 'Clear, well-structured professional profiles for the next opportunity.',
    aboutCv1: 'ATS CV',
    aboutCv2: 'Professional CV',
    aboutCv3: 'Portfolio',
    aboutCv4: 'LinkedIn Profile',
    aboutPhotoDesc: 'People-focused photography for milestones, gatherings, and personal stories.',
    aboutPhoto1: 'Graduation',
    aboutPhoto2: 'Events',
    aboutPhoto3: 'Organization',
    aboutPhoto4: 'Personal',
    aboutPhoto5: 'Portrait',
    aboutPhoto6: 'Personal Branding',
    aboutVideoDesc: 'People-led moving images that capture atmosphere, moments, and stories.',
    aboutVideo1: 'Event Documentation',
    aboutVideo2: 'Graduation',
    aboutVideo3: 'Organization',
    aboutVideo4: 'Aftermovie',
    aboutVideo5: 'Personal Content',
    aboutDesignDesc: 'Purposeful design assets that make messages more consistent and recognizable.',
    aboutDesign1: 'Posters',
    aboutDesign2: 'Social Media Design',
    aboutDesign3: 'Presentation',
    aboutDesign4: 'Digital Design',
    aboutExploreService: 'Explore Service',
    aboutApproachEyebrow: 'The Process',
    aboutApproachTitle: 'Our Approach',
    aboutDiscoverTitle: 'Discover',
    aboutDiscoverText: 'Understand the client\'s needs, goals, audience, and direction.',
    aboutPlanTitle: 'Plan',
    aboutPlanText: 'Define the concept, structure, creative direction, and project requirements.',
    aboutCreateTitle: 'Create',
    aboutCreateText: 'Turn ideas into digital, visual, and creative solutions.',
    aboutRefineTitle: 'Refine',
    aboutRefineText: 'Review, improve, and ensure the final result meets the project goals.',
    aboutDeliverTitle: 'Deliver',
    aboutDeliverText: 'Deliver the final project professionally and provide the necessary support.',
    aboutWhyEyebrow: 'The Difference',
    aboutWhyTitle: 'Why SV Creative',
    aboutWhyCreativeTitle: 'Creative Thinking',
    aboutWhyCreativeText: 'Every project starts with ideas that are relevant to the client\'s goals.',
    aboutWhyExecutionTitle: 'Professional Execution',
    aboutWhyExecutionText: 'Focus on quality, structure, detail, and consistency.',
    aboutWhyPersonalTitle: 'Personalized Approach',
    aboutWhyPersonalText: 'Every client has different needs, so every project is approached accordingly.',
    aboutWhyDigitalTitle: 'Digital & Visual',
    aboutWhyDigitalText: 'Combining digital solutions with creative and visual communication.',
    aboutWhyMeaningfulTitle: 'Meaningful Results',
    aboutWhyMeaningfulText: 'The goal is not simply to create something attractive, but something useful and meaningful.',
    aboutFounderEyebrow: 'The Person Behind the Work',
    aboutFounderTitle: 'Team / Founder',
    aboutFounderRole: 'Founder & Creative Lead',
    aboutFounderBio: 'Simon Veres Sianturi is the founder of SV Creative, working across digital, creative, and visual projects with a focus on creating professional and meaningful solutions for individuals, organizations, and businesses.',
    aboutFounderPhotoLabel: 'Founder photo placeholder',
    aboutFounderPhotoPlaceholder: 'Founder photo placeholder',
    aboutClientsEyebrow: 'Open to Collaboration',
    aboutClientsTitle: 'Clients & Collaborations',
    aboutClientsText: 'We welcome projects with organizations, businesses, communities, individuals, and institutions.',
    aboutClientPlaceholder: 'Client Logo Placeholder',
    aboutClientOrganization: 'Organization',
    aboutClientBusiness: 'Business',
    aboutClientCommunity: 'Community',
    aboutClientIndividual: 'Individual',
    aboutClientInstitution: 'Institution',
    aboutBecomeClient: 'Become a Client',
    aboutStartProject: 'START A PROJECT'
  },
  'zh-CN': {
    aboutEyebrow: '数字 · 创意 · 视觉', aboutWhoTitle: '关于我们', aboutWhoText: 'SV Creative 是一家创意与数字服务公司，帮助个人、组织、中小企业及公司建立专业形象、数字影响力与视觉沟通。我们结合数字解决方案、创意服务及视觉叙事，以现代专业的方式满足每位客户的需求。',
    aboutDisciplinesLabel: 'SV Creative 服务领域', aboutDigitalSolutions: '数字解决方案', aboutCreativeServices: '创意服务', aboutVisualStorytelling: '视觉叙事', aboutWorkspaceAlt: '明亮的创意工作室，配有办公桌与落地窗', aboutWorkspaceCaption: '为灵感、专注与创意工作而打造的空间。',
    aboutStoryEyebrow: '我们的故事', aboutStoryTitle: '从好奇心出发，成长为创意服务品牌。', aboutBeginningTitle: '起点', aboutBeginningText: '我们通过设计、摄影、摄像的实践探索，以及视觉故事连接人们的方式，逐渐培养起对数字世界的兴趣。',
    aboutGrowthTitle: '成长', aboutGrowthText: '这些创意兴趣汇聚成一个服务品牌，将实用的数字解决方案与用心打造的创意作品融为一体。', aboutStoryVisionTitle: '愿景', aboutStoryVisionText: '在每个项目中持续成长，认真聆听需求，并用心创作实用的数字与视觉作品。',
    aboutVisionMissionEyebrow: '我们的方向', aboutVisionMissionTitle: '愿景与使命', aboutVisionLabel: '愿景', aboutVisionText: '成为值得信赖的创意伙伴，帮助个人、组织与企业打造有意义的数字及视觉体验。', aboutMissionLabel: '使命',
    aboutMission1: '提供周全有效的数字解决方案。', aboutMission2: '创作专业且有意义的视觉内容。', aboutMission3: '帮助客户清晰传达自身形象。', aboutMission4: '融合创意、科技与策略。', aboutMission5: '与客户建立长期合作关系。',
    aboutServicesEyebrow: '专业能力', aboutServicesTitle: '我们的工作', aboutWebsiteDesc: '打造数字基础，让受众轻松了解并找到您的服务。', aboutWebsite1: '企业介绍', aboutWebsite2: '作品集网站', aboutWebsite3: '中小企业网站', aboutWebsite4: '落地页',
    aboutCvDesc: '清晰有序的专业资料，助您把握下一个机会。', aboutCv1: 'ATS 简历', aboutCv2: '专业简历', aboutCv3: '作品集', aboutCv4: 'LinkedIn 主页', aboutPhotoDesc: '以人物为核心，记录重要时刻、相聚与个人故事。',
    aboutPhoto1: '毕业', aboutPhoto2: '活动', aboutPhoto3: '组织', aboutPhoto4: '个人', aboutPhoto5: '肖像', aboutPhoto6: '个人品牌', aboutVideoDesc: '以人物为主角，记录氛围、瞬间与故事。', aboutVideo1: '活动记录', aboutVideo2: '毕业', aboutVideo3: '组织', aboutVideo4: '活动后期影片', aboutVideo5: '个人内容',
    aboutDesignDesc: '通过有方向的设计素材，让信息保持一致且易于识别。', aboutDesign1: '海报', aboutDesign2: '社交媒体设计', aboutDesign3: '演示文稿', aboutDesign4: '数字设计', aboutExploreService: '浏览服务', aboutApproachEyebrow: '合作流程', aboutApproachTitle: '我们的方式',
    aboutDiscoverTitle: '了解', aboutDiscoverText: '了解客户的需求、目标、受众及期望方向。', aboutPlanTitle: '规划', aboutPlanText: '确定概念、结构、创意方向及项目需求。', aboutCreateTitle: '创作', aboutCreateText: '将想法转化为数字、视觉与创意解决方案。', aboutRefineTitle: '完善', aboutRefineText: '检查并优化成果，确保符合项目目标。', aboutDeliverTitle: '交付', aboutDeliverText: '专业交付最终项目，并提供所需支持。',
    aboutWhyEyebrow: '我们的优势', aboutWhyTitle: '选择 SV Creative 的理由', aboutWhyCreativeTitle: '创意思维', aboutWhyCreativeText: '每个项目都从符合客户目标的创意出发。', aboutWhyExecutionTitle: '专业执行', aboutWhyExecutionText: '注重质量、结构、细节与一致性。',
    aboutWhyPersonalTitle: '个性化服务', aboutWhyPersonalText: '每位客户的需求各不相同，因此我们会为每个项目量身定制方案。', aboutWhyDigitalTitle: '数字与视觉', aboutWhyDigitalText: '将数字解决方案与创意视觉沟通相结合。', aboutWhyMeaningfulTitle: '有意义的成果', aboutWhyMeaningfulText: '我们的目标不只是打造吸引人的作品，更要让成果实用且有意义。',
    aboutFounderEyebrow: '创作背后的人', aboutFounderTitle: '团队 / 创办人', aboutFounderRole: '创办人兼创意负责人', aboutFounderBio: 'Simon Veres Sianturi 是 SV Creative 的创办人，专注于数字、创意及视觉项目，为个人、组织与企业打造专业且有意义的解决方案。', aboutFounderPhotoLabel: '创办人照片占位图', aboutFounderPhotoPlaceholder: '创办人照片占位图',
    aboutClientsEyebrow: '欢迎合作', aboutClientsTitle: '客户与合作', aboutClientsText: '欢迎与组织、企业、社群、个人及机构开展合作。', aboutClientPlaceholder: '客户标志占位图', aboutClientOrganization: '组织', aboutClientBusiness: '企业', aboutClientCommunity: '社群', aboutClientIndividual: '个人', aboutClientInstitution: '机构', aboutBecomeClient: '成为客户', aboutStartProject: '开启项目'
  }
};

const additionalTranslations = {
  es: {
    navHome: 'Inicio', navWork: 'Proyectos', navServices: 'Servicios', navPortfolio: 'Portafolio', navClients: 'Clientes', navAbout: 'Nosotros', navContact: 'Contacto', footerFAQ: 'Preguntas frecuentes',
    welcomeGreeting: 'Bienvenido a SV Creative', welcomeDescriptor: 'Digital · Creativo · Visual', bookNow: 'Hablemos', navToggleLabel: 'Abrir o cerrar el menú de navegación',
    heroEyebrow: 'Digital • Creativo • Visual', heroTitle: 'Creado para marcas que quieren proyectar calidad.', heroDesc: 'SV Creative combina soluciones digitales, servicios creativos y narrativa visual para ayudar a personas, organizaciones y empresas a construir una identidad y presencia digital profesional.', heroPrimary: 'Ver proyectos', heroSecondary: 'Hablemos',
    sectionServices: 'Qué hacemos', sectionServicesSub: 'Soluciones creativas para crecer.', serviceWebsiteTitle: 'Sitios web y páginas de destino', serviceWebsiteDesc: 'Perfiles de empresa, portafolios, sitios comerciales y páginas enfocadas en conversiones.', servicePortfolioTitle: 'CV y portafolio', servicePhotographyTitle: 'Fotografía', serviceVideographyTitle: 'Videografía', serviceDesignTitle: 'Diseño creativo',
    sectionPortfolio: 'Selección de proyectos', portfolioTitle: 'Proyectos destacados', portfolioTitlePage: 'Proyectos y trabajos creativos seleccionados.', portfolioIntro: 'Diseño web, narrativa audiovisual, marca personal y comunicación visual.',
    whyUs: 'Por qué elegirnos', whyUsTitle: 'Unimos estrategia, estética y claridad.', testimonials: 'A quién apoyamos', testimonialsTitle: 'Con quién trabajamos',
    clientsPageEyebrow: 'Colaboraciones', clientsPageTitle: 'Clientes y colaboraciones', clientsPageAction: 'Convertirse en cliente',
    contactHeaderTitle: 'Creemos juntos', contactHeaderText: '¿Tienes un proyecto? Creemos algo significativo juntos.', faqPageTitle: 'Preguntas frecuentes', faqPageText: 'Respuestas sobre alcance, plazos, comunicación y nuestra forma de trabajar.',
    aboutEyebrow: 'Digital · Creativo · Visual', aboutWhoTitle: 'Quiénes somos', aboutStoryEyebrow: 'Nuestra historia', aboutStoryTitle: 'De la curiosidad a una marca de servicios creativos.', aboutVisionMissionEyebrow: 'Nuestra dirección', aboutVisionMissionTitle: 'Visión y misión', aboutServicesEyebrow: 'Lo que hacemos', aboutServicesTitle: 'Servicios creativos y digitales', aboutFounderTitle: 'Equipo / Fundador'
  },
  fr: {
    navHome: 'Accueil', navWork: 'Réalisations', navServices: 'Services', navPortfolio: 'Portfolio', navClients: 'Clients', navAbout: 'À propos', navContact: 'Contact', footerFAQ: 'FAQ',
    welcomeGreeting: 'Bienvenue chez SV Creative', welcomeDescriptor: 'Numérique · Créatif · Visuel', bookNow: 'Parlons de votre projet', navToggleLabel: 'Ouvrir ou fermer le menu de navigation',
    heroEyebrow: 'Numérique • Créatif • Visuel', heroTitle: 'Pensé pour les marques qui veulent une image premium.', heroDesc: 'SV Creative réunit des solutions numériques, des services créatifs et du storytelling visuel pour aider les personnes, les organisations et les entreprises à construire une identité et une présence numériques professionnelles.', heroPrimary: 'Voir les réalisations', heroSecondary: 'Parlons de votre projet',
    sectionServices: 'Nos services', sectionServicesSub: 'Des solutions créatives pour grandir.', serviceWebsiteTitle: 'Sites web et pages de destination', serviceWebsiteDesc: 'Sites d’entreprise, portfolios et pages conçues pour favoriser les conversions.', servicePortfolioTitle: 'CV et portfolio', servicePhotographyTitle: 'Photographie', serviceVideographyTitle: 'Vidéographie', serviceDesignTitle: 'Design créatif',
    sectionPortfolio: 'Aperçu du portfolio', portfolioTitle: 'Projets sélectionnés', portfolioTitlePage: 'Projets et créations sélectionnés.', portfolioIntro: 'Design web, storytelling média, marque personnelle et communication visuelle.',
    whyUs: 'Pourquoi nous choisir', whyUsTitle: 'Nous associons stratégie, esthétique et clarté.', testimonials: 'Pour qui', testimonialsTitle: 'Avec qui nous travaillons',
    clientsPageEyebrow: 'Collaboration', clientsPageTitle: 'Clients et collaborations', clientsPageAction: 'Devenir client',
    contactHeaderTitle: 'Créons ensemble', contactHeaderText: 'Un projet en tête ? Créons quelque chose qui a du sens.', faqPageTitle: 'Questions fréquentes', faqPageText: 'Réponses sur le périmètre, les délais, la communication et notre méthode.',
    aboutEyebrow: 'Numérique · Créatif · Visuel', aboutWhoTitle: 'Qui sommes-nous ?', aboutStoryEyebrow: 'Notre histoire', aboutStoryTitle: 'De la curiosité à une marque de services créatifs.', aboutVisionMissionEyebrow: 'Notre direction', aboutVisionMissionTitle: 'Vision et mission', aboutServicesEyebrow: 'Notre expertise', aboutServicesTitle: 'Nos services créatifs et numériques', aboutFounderTitle: 'Équipe / Fondateur'
  },
  de: {
    navHome: 'Startseite', navWork: 'Arbeiten', navServices: 'Leistungen', navPortfolio: 'Portfolio', navClients: 'Kunden', navAbout: 'Über uns', navContact: 'Kontakt', footerFAQ: 'FAQ',
    welcomeGreeting: 'Willkommen bei SV Creative', welcomeDescriptor: 'Digital · Kreativ · Visuell', bookNow: 'Projekt besprechen', navToggleLabel: 'Navigationsmenü öffnen oder schließen',
    heroEyebrow: 'Digital • Kreativ • Visuell', heroTitle: 'Für Marken mit einem hochwertigen Auftritt.', heroDesc: 'SV Creative verbindet digitale Lösungen, kreative Leistungen und visuelles Storytelling, damit Menschen, Organisationen und Unternehmen eine professionelle Identität und digitale Präsenz aufbauen können.', heroPrimary: 'Arbeiten ansehen', heroSecondary: 'Projekt besprechen',
    sectionServices: 'Was wir tun', sectionServicesSub: 'Kreative Lösungen für Wachstum.', serviceWebsiteTitle: 'Websites und Landingpages', serviceWebsiteDesc: 'Unternehmensprofile, Portfolios und conversionorientierte Webseiten.', servicePortfolioTitle: 'Lebenslauf und Portfolio', servicePhotographyTitle: 'Fotografie', serviceVideographyTitle: 'Videografie', serviceDesignTitle: 'Kreatives Design',
    sectionPortfolio: 'Portfolio-Einblick', portfolioTitle: 'Ausgewählte Projekte', portfolioTitlePage: 'Ausgewählte Projekte und kreative Arbeiten.', portfolioIntro: 'Webdesign, visuelles Storytelling, Personal Branding und visuelle Kommunikation.',
    whyUs: 'Warum wir', whyUsTitle: 'Wir verbinden Strategie, Ästhetik und Klarheit.', testimonials: 'Für wen wir arbeiten', testimonialsTitle: 'Wen wir unterstützen',
    clientsPageEyebrow: 'Zusammenarbeit', clientsPageTitle: 'Kunden und Zusammenarbeit', clientsPageAction: 'Kunde werden',
    contactHeaderTitle: 'Gemeinsam gestalten', contactHeaderText: 'Ein Projekt geplant? Lassen Sie uns etwas Bedeutungsvolles schaffen.', faqPageTitle: 'Häufig gestellte Fragen', faqPageText: 'Antworten zu Umfang, Zeitplan, Kommunikation und unserer Arbeitsweise.',
    aboutEyebrow: 'Digital · Kreativ · Visuell', aboutWhoTitle: 'Wer wir sind', aboutStoryEyebrow: 'Unsere Geschichte', aboutStoryTitle: 'Von Neugier zu einer kreativen Servicemarke.', aboutVisionMissionEyebrow: 'Unsere Richtung', aboutVisionMissionTitle: 'Vision und Mission', aboutServicesEyebrow: 'Unser Können', aboutServicesTitle: 'Unsere kreativen und digitalen Leistungen', aboutFounderTitle: 'Team / Gründer'
  },
  pt: {
    navHome: 'Início', navWork: 'Trabalhos', navServices: 'Serviços', navPortfolio: 'Portfólio', navClients: 'Clientes', navAbout: 'Sobre', navContact: 'Contato', footerFAQ: 'Perguntas frequentes',
    welcomeGreeting: 'Bem-vindo à SV Creative', welcomeDescriptor: 'Digital · Criativo · Visual', bookNow: 'Vamos conversar', navToggleLabel: 'Abrir ou fechar o menu de navegação',
    heroEyebrow: 'Digital • Criativo • Visual', heroTitle: 'Feito para marcas que querem transmitir qualidade.', heroDesc: 'A SV Creative reúne soluções digitais, serviços criativos e narrativa visual para ajudar pessoas, organizações e empresas a construir uma identidade e presença digital profissional.', heroPrimary: 'Ver trabalhos', heroSecondary: 'Vamos conversar',
    sectionServices: 'O que fazemos', sectionServicesSub: 'Soluções criativas para crescer.', serviceWebsiteTitle: 'Sites e páginas de destino', serviceWebsiteDesc: 'Sites institucionais, portfólios e páginas focadas em conversão.', servicePortfolioTitle: 'Currículo e portfólio', servicePhotographyTitle: 'Fotografia', serviceVideographyTitle: 'Videografia', serviceDesignTitle: 'Design criativo',
    sectionPortfolio: 'Destaques do portfólio', portfolioTitle: 'Projetos selecionados', portfolioTitlePage: 'Projetos e trabalhos criativos selecionados.', portfolioIntro: 'Design de sites, narrativa audiovisual, marca pessoal e comunicação visual.',
    whyUs: 'Por que escolher a gente', whyUsTitle: 'Unimos estratégia, estética e clareza.', testimonials: 'Para quem trabalhamos', testimonialsTitle: 'Quem apoiamos',
    clientsPageEyebrow: 'Colaboração', clientsPageTitle: 'Clientes e colaborações', clientsPageAction: 'Torne-se cliente',
    contactHeaderTitle: 'Vamos criar juntos', contactHeaderText: 'Tem um projeto em mente? Vamos criar algo significativo.', faqPageTitle: 'Perguntas frequentes', faqPageText: 'Respostas sobre escopo, prazos, comunicação e nosso processo de trabalho.',
    aboutEyebrow: 'Digital · Criativo · Visual', aboutWhoTitle: 'Quem somos', aboutStoryEyebrow: 'Nossa história', aboutStoryTitle: 'Da curiosidade a uma marca de serviços criativos.', aboutVisionMissionEyebrow: 'Nossa direção', aboutVisionMissionTitle: 'Visão e missão', aboutServicesEyebrow: 'Nossa especialidade', aboutServicesTitle: 'Serviços criativos e digitais', aboutFounderTitle: 'Equipe / Fundador'
  },
  ja: {
    navHome: 'ホーム', navWork: '制作実績', navServices: 'サービス', navPortfolio: 'ポートフォリオ', navClients: 'クライアント', navAbout: '私たちについて', navContact: 'お問い合わせ', footerFAQ: 'よくある質問',
    welcomeGreeting: 'SV Creativeへようこそ', welcomeDescriptor: 'デジタル · クリエイティブ · ビジュアル', bookNow: '相談する', navToggleLabel: 'ナビゲーションメニューを開閉',
    heroEyebrow: 'デジタル • クリエイティブ • ビジュアル', heroTitle: '上質な印象を目指すブランドのために。', heroDesc: 'SV Creativeは、デジタルソリューション、クリエイティブサービス、ビジュアルストーリーテリングを組み合わせ、個人、組織、企業のプロフェッショナルなブランドづくりを支援します。', heroPrimary: '制作実績を見る', heroSecondary: '相談する',
    sectionServices: 'サービス内容', sectionServicesSub: '成長を支えるクリエイティブソリューション。', serviceWebsiteTitle: 'ウェブサイト・ランディングページ', serviceWebsiteDesc: '企業サイト、ポートフォリオ、コンバージョンを意識したページを制作します。', servicePortfolioTitle: '履歴書・ポートフォリオ', servicePhotographyTitle: '写真撮影', serviceVideographyTitle: '映像制作', serviceDesignTitle: 'クリエイティブデザイン',
    sectionPortfolio: 'ポートフォリオ', portfolioTitle: '主なプロジェクト', portfolioTitlePage: '厳選したプロジェクトとクリエイティブ作品。', portfolioIntro: 'ウェブデザイン、メディアストーリー、パーソナルブランディング、ビジュアルコミュニケーション。',
    whyUs: '選ばれる理由', whyUsTitle: '戦略、美しさ、わかりやすさを融合します。', testimonials: '対象となる方', testimonialsTitle: 'サポートするお客様',
    clientsPageEyebrow: 'コラボレーション', clientsPageTitle: 'クライアントと協業', clientsPageAction: '依頼する',
    contactHeaderTitle: '一緒に作りましょう', contactHeaderText: 'プロジェクトをお考えですか？一緒に価値あるものを作りましょう。', faqPageTitle: 'よくある質問', faqPageText: '業務範囲、納期、連絡方法、制作の進め方についてお答えします。',
    aboutEyebrow: 'デジタル · クリエイティブ · ビジュアル', aboutWhoTitle: '私たちについて', aboutStoryEyebrow: 'ストーリー', aboutStoryTitle: '好奇心から生まれたクリエイティブブランド。', aboutVisionMissionEyebrow: '目指す方向', aboutVisionMissionTitle: 'ビジョンと使命', aboutServicesEyebrow: '専門分野', aboutServicesTitle: 'クリエイティブ・デジタルサービス', aboutFounderTitle: 'チーム / 創設者'
  },
  ko: {
    navHome: '홈', navWork: '작업물', navServices: '서비스', navPortfolio: '포트폴리오', navClients: '고객', navAbout: '소개', navContact: '문의', footerFAQ: '자주 묻는 질문',
    welcomeGreeting: 'SV Creative에 오신 것을 환영합니다', welcomeDescriptor: '디지털 · 크리에이티브 · 비주얼', bookNow: '상담하기', navToggleLabel: '탐색 메뉴 열기 또는 닫기',
    heroEyebrow: '디지털 • 크리에이티브 • 비주얼', heroTitle: '프리미엄 이미지를 원하는 브랜드를 위해.', heroDesc: 'SV Creative는 디지털 솔루션, 크리에이티브 서비스, 비주얼 스토리텔링을 결합해 개인, 조직, 기업의 전문적인 브랜드와 디지털 이미지를 만듭니다.', heroPrimary: '작업물 보기', heroSecondary: '상담하기',
    sectionServices: '서비스 소개', sectionServicesSub: '성장을 위한 크리에이티브 솔루션.', serviceWebsiteTitle: '웹사이트 및 랜딩 페이지', serviceWebsiteDesc: '기업 소개, 포트폴리오, 비즈니스 웹사이트와 전환에 집중한 페이지를 제작합니다.', servicePortfolioTitle: '이력서 및 포트폴리오', servicePhotographyTitle: '사진', serviceVideographyTitle: '영상 제작', serviceDesignTitle: '크리에이티브 디자인',
    sectionPortfolio: '포트폴리오 미리보기', portfolioTitle: '주요 프로젝트', portfolioTitlePage: '엄선된 프로젝트와 크리에이티브 작업물.', portfolioIntro: '웹사이트 디자인, 미디어 스토리텔링, 퍼스널 브랜딩, 비주얼 커뮤니케이션 사례입니다.',
    whyUs: '선택하는 이유', whyUsTitle: '전략, 미감, 명확함을 함께 담습니다.', testimonials: '지원 대상', testimonialsTitle: '함께하는 고객',
    clientsPageEyebrow: '협업', clientsPageTitle: '고객 및 협업', clientsPageAction: '고객으로 문의하기',
    contactHeaderTitle: '함께 만들어가요', contactHeaderText: '프로젝트가 있으신가요? 의미 있는 결과물을 함께 만들어보세요.', faqPageTitle: '자주 묻는 질문', faqPageText: '범위, 일정, 소통 방식과 작업 과정에 관한 답변입니다.',
    aboutEyebrow: '디지털 · 크리에이티브 · 비주얼', aboutWhoTitle: '우리는 누구인가요', aboutStoryEyebrow: '우리의 이야기', aboutStoryTitle: '호기심에서 시작된 크리에이티브 서비스 브랜드.', aboutVisionMissionEyebrow: '우리의 방향', aboutVisionMissionTitle: '비전과 미션', aboutServicesEyebrow: '전문 분야', aboutServicesTitle: '크리에이티브 및 디지털 서비스', aboutFounderTitle: '팀 / 창립자'
  },
  ar: {
    navHome: 'الرئيسية', navWork: 'الأعمال', navServices: 'الخدمات', navPortfolio: 'معرض الأعمال', navClients: 'العملاء', navAbout: 'من نحن', navContact: 'اتصل بنا', footerFAQ: 'الأسئلة الشائعة',
    welcomeGreeting: 'مرحبًا بكم في SV Creative', welcomeDescriptor: 'رقمي · إبداعي · بصري', bookNow: 'لنتحدث', navToggleLabel: 'فتح قائمة التنقل أو إغلاقها',
    heroEyebrow: 'رقمي • إبداعي • بصري', heroTitle: 'مصمم للعلامات التجارية التي تطمح إلى صورة متميزة.', heroDesc: 'تجمع SV Creative بين الحلول الرقمية والخدمات الإبداعية والسرد البصري لمساعدة الأفراد والمؤسسات والشركات على بناء هوية وحضور رقمي احترافي.', heroPrimary: 'استكشف الأعمال', heroSecondary: 'لنتحدث',
    sectionServices: 'ما نقدمه', sectionServicesSub: 'حلول إبداعية للنمو.', serviceWebsiteTitle: 'المواقع وصفحات الهبوط', serviceWebsiteDesc: 'مواقع تعريفية للشركات ومعارض أعمال وصفحات تركز على التحويل.', servicePortfolioTitle: 'السيرة الذاتية ومعرض الأعمال', servicePhotographyTitle: 'التصوير الفوتوغرافي', serviceVideographyTitle: 'إنتاج الفيديو', serviceDesignTitle: 'التصميم الإبداعي',
    sectionPortfolio: 'لمحة عن الأعمال', portfolioTitle: 'مشاريع مختارة', portfolioTitlePage: 'مشاريع وأعمال إبداعية مختارة.', portfolioIntro: 'تصميم المواقع والسرد الإعلامي والعلامة الشخصية والتواصل البصري.',
    whyUs: 'لماذا تختارنا', whyUsTitle: 'نجمع بين الاستراتيجية والجمال والوضوح.', testimonials: 'لمن نقدم الدعم', testimonialsTitle: 'من نخدم',
    clientsPageEyebrow: 'التعاون', clientsPageTitle: 'العملاء والتعاون', clientsPageAction: 'كن عميلًا',
    contactHeaderTitle: 'لنبدع معًا', contactHeaderText: 'هل لديك مشروع؟ لنصنع معًا شيئًا ذا معنى.', faqPageTitle: 'الأسئلة الشائعة', faqPageText: 'إجابات عن نطاق العمل والجدول الزمني والتواصل وطريقة عملنا.',
    aboutEyebrow: 'رقمي · إبداعي · بصري', aboutWhoTitle: 'من نحن', aboutStoryEyebrow: 'قصتنا', aboutStoryTitle: 'من الفضول إلى علامة للخدمات الإبداعية.', aboutVisionMissionEyebrow: 'وجهتنا', aboutVisionMissionTitle: 'الرؤية والرسالة', aboutServicesEyebrow: 'خبراتنا', aboutServicesTitle: 'خدماتنا الإبداعية والرقمية', aboutFounderTitle: 'الفريق / المؤسس'
  }
};

function applyLanguage(lang) {
  const language = languages.some((item) => item.code === lang) ? lang : 'id';
  const dictionaryCode = language === 'zh' ? 'zh-CN' : language;
  const locale = {
    ...translations.id,
    ...aboutTranslations.id,
    ...(translations[dictionaryCode] || {}),
    ...(additionalTranslations[language] || {}),
    ...(aboutTranslations[dictionaryCode] || {})
  };
  document.documentElement.lang = dictionaryCode === 'zh-CN' ? 'zh-CN' : language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (locale[key]) {
      element.textContent = locale[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (locale[key]) {
      element.placeholder = locale[key];
    }
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
    const key = element.dataset.i18nAlt;
    if (locale[key]) {
      element.alt = locale[key];
    }
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (locale[key]) {
      element.setAttribute('aria-label', locale[key]);
    }
  });

}

function initLanguageSelector() {
  const selector = document.querySelector('.lang-switcher');
  const trigger = selector?.querySelector('.lang-trigger');
  const triggerLabel = selector?.querySelector('.lang-trigger-label');
  const options = selector?.querySelector('.lang-options');
  if (!selector || !trigger || !triggerLabel || !options) {
    return;
  }

  const savedLanguage = localStorage.getItem('language') || localStorage.getItem('svcreative-lang');
  const initialLanguage = languages.some((language) => language.code === savedLanguage) ? savedLanguage : 'id';
  const hasSavedLanguage = languages.some((language) => language.code === savedLanguage);
  applyLanguage(initialLanguage);

  const closeDropdown = (returnFocus = false) => {
    options.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    selector.classList.remove('is-open');
    if (returnFocus) {
      trigger.focus();
    }
  };
  const updateSelectedLanguage = (code, showSelectedName = true) => {
    const selectedLanguage = languages.find((language) => language.code === code) || languages[0];
    const label = showSelectedName ? selectedLanguage.name : 'Pilih Bahasa';
    triggerLabel.textContent = label;
    trigger.setAttribute('aria-label', label);
    options.querySelectorAll('.lang-option').forEach((option) => {
      option.setAttribute('aria-checked', String(option.dataset.lang === selectedLanguage.code));
    });
  };

  languages.forEach((language) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'lang-option';
    option.dataset.lang = language.code;
    option.setAttribute('role', 'menuitemradio');
    option.setAttribute('aria-checked', String(language.code === initialLanguage));
    option.textContent = language.name;
    option.addEventListener('click', () => {
      applyLanguage(language.code);
      localStorage.setItem('language', language.code);
      updateSelectedLanguage(language.code);
      closeDropdown(true);
    });
    options.append(option);
  });

  updateSelectedLanguage(initialLanguage, hasSavedLanguage && initialLanguage !== 'id');

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    options.hidden = isOpen;
    trigger.setAttribute('aria-expanded', String(!isOpen));
    selector.classList.toggle('is-open', !isOpen);
  });

  document.addEventListener('click', (event) => {
    if (!selector.contains(event.target)) {
      closeDropdown();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      closeDropdown(true);
    }
  });
}

function renderSocialLinks() {
  const socialLinks = document.querySelectorAll('[data-social-links]');
  const links = [
    {
      label: 'Instagram SV Creative',
      name: 'Simon Veres',
      href: SITE_CONTACT.instagram,
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".75" class="icon-fill"/></svg>',
      external: true
    },
    {
      label: 'TikTok SV Creative',
      name: 'Simon Veres',
      href: SITE_CONTACT.tiktok,
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a4.2 4.2 0 1 1-3.4-4.1v3.3a1.1 1.1 0 1 0 .2.8V3h3.2c.2 2.2 1.5 3.7 4 4.2v3.2A9 9 0 0 1 14 8.8"/></svg>',
      external: true
    },
    {
      label: 'Email SV Creative',
      name: SITE_CONTACT.email,
      href: `mailto:${SITE_CONTACT.email}`,
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
      external: false
    }
  ];

  socialLinks.forEach((container) => {
    container.innerHTML = links.map((link) => `
      <a class="footer-social-link" href="${link.href}" aria-label="${link.label}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
        <span class="social-icon">${link.icon}</span>
        <span>${link.name}</span>
      </a>
    `).join('');
  });
}

function applyContactLinks() {
  document.querySelectorAll('[data-contact-link]').forEach((link) => {
    const destination = link.dataset.contactLink;
    if (destination === 'email') {
      link.href = `mailto:${SITE_CONTACT.email}`;
    } else if (destination === 'instagram' || destination === 'tiktok') {
      link.href = SITE_CONTACT[destination];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });

  document.querySelectorAll('[data-contact-value]').forEach((element) => {
    const value = SITE_CONTACT[element.dataset.contactValue];
    if (value) {
      element.textContent = value;
    }
  });
}

function initWelcomeAnimation() {
  const welcomeBars = document.querySelectorAll('.welcome-bar');
  const pointerMotion = window.matchMedia('(pointer: fine) and (min-width: 641px)');

  welcomeBars.forEach((bar) => {
    const scene = document.createElement('span');
    scene.className = 'welcome-scene';
    scene.setAttribute('aria-hidden', 'true');

    [
      'welcome-orb',
      'welcome-ring',
      'welcome-ring welcome-ring-back',
      'welcome-particle',
      'welcome-particle welcome-particle-two',
      'welcome-particle welcome-particle-three'
    ].forEach((className) => {
      const element = document.createElement('span');
      element.className = className;
      scene.append(element);
    });

    bar.prepend(scene);

    if (!pointerMotion.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    bar.addEventListener('pointermove', (event) => {
      const bounds = bar.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
      bar.style.setProperty('--welcome-pointer-x', `${(offsetX * 5).toFixed(1)}px`);
      bar.style.setProperty('--welcome-pointer-y', `${(offsetY * 2).toFixed(1)}px`);
    }, { passive: true });

    bar.addEventListener('pointerleave', () => {
      bar.style.setProperty('--welcome-pointer-x', '0px');
      bar.style.setProperty('--welcome-pointer-y', '0px');
    }, { passive: true });
  });
}

function initMobileNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  if (!toggle) {
    return;
  }

  const nav = document.getElementById(toggle.getAttribute('aria-controls'));
  const navWrap = toggle.closest('.nav-wrap');
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
    navWrap?.classList.remove('is-menu-open');
  };

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    nav?.classList.toggle('is-open', !isExpanded);
    navWrap?.classList.toggle('is-menu-open', !isExpanded);
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 993px)').addEventListener('change', closeMenu);
}

function initResultsNavigation() {
  const navigation = document.querySelector('.main-nav');
  const mainScript = Array.from(document.scripts).find((script) => script.src.includes('assets/js/main.js'));
  if (!navigation || navigation.querySelector('.nav-results') || !mainScript) return;

  const categories = [
    ['Website', 'website'],
    ['CV & Portfolio', 'cv'],
    ['Fotografi', 'photography'],
    ['Videografi', 'videography'],
    ['Desain Kreatif', 'design']
  ];
  const dropdown = document.createElement('details');
  dropdown.className = 'nav-results';

  const summary = document.createElement('summary');
  summary.textContent = 'Hasil Desain';
  dropdown.append(summary);

  const menu = document.createElement('div');
  menu.className = 'nav-results-menu';
  menu.setAttribute('aria-label', 'Kategori Hasil Desain');
  const resultsUrl = new URL('../../pages/hasil-desain.html', mainScript.src);

  categories.forEach(([label, category]) => {
    const link = document.createElement('a');
    const destination = new URL(resultsUrl);
    destination.hash = category;
    link.href = destination.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    menu.append(link);
  });

  dropdown.append(menu);
  const workLink = navigation.querySelector('[data-i18n="navWork"]');
  navigation.insertBefore(dropdown, workLink?.nextSibling || null);
}

function initAIAssistant() {
  const mainScript = Array.from(document.scripts).find((script) => script.src.includes('assets/js/main.js'));
  if (!mainScript || document.querySelector('[data-ai-chat-module]')) {
    return;
  }

  const assistantScript = document.createElement('script');
  assistantScript.src = new URL('ai-chat.js', mainScript.src).href;
  assistantScript.dataset.aiChatModule = '';
  document.body.append(assistantScript);
}

function initScrollReveals() {
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (!revealItems.length) {
    return;
  }

  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll('[data-reveal]').forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index * 90, 360)}ms`);
    });
  });

  const showAll = () => revealItems.forEach((item) => item.classList.add('is-visible'));
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showAll();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  revealItems.forEach((item) => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', () => {
  const whatsappButtons = document.querySelectorAll('[data-whatsapp]');

  whatsappButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const message = encodeURIComponent(button.dataset.whatsapp || 'Halo SV Creative, saya ingin konsultasi project.');
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener');
    });
  });

  renderSocialLinks();
  applyContactLinks();
  initWelcomeAnimation();
  initResultsNavigation();
  initAIAssistant();
  initMobileNavigation();
  initScrollReveals();

  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const syncHeaderState = () => {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 0);
    };

    window.addEventListener('scroll', syncHeaderState, { passive: true });
    syncHeaderState();
  }

  initLanguageSelector();
});
