(() => {
  'use strict';

  const scriptUrl = document.currentScript?.src;
  if (!scriptUrl) return;

  const assetRoot = new URL('../', scriptUrl);
  const siteRoot = new URL('../', assetRoot);
  const avatarUrl = new URL('icons/icon%20ai.png', assetRoot).href;
  const resultsUrl = new URL('pages/hasil-desain.html', siteRoot).href;
  const contactUrl = new URL('pages/kontak.html', siteRoot).href;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('css/ai-chat.css', assetRoot).href;
  stylesheet.dataset.aiChatStyles = '';
  document.head.append(stylesheet);

  const SERVICES = Object.freeze([
    {
      id: 'website',
      name: 'Website & Landing Page',
      keywords: ['website', 'web', 'landing page', 'company profile'],
      description: 'Profil perusahaan, portofolio, website bisnis, dan halaman yang fokus pada konversi.',
      examples: 'Company Profile, Portfolio Website, Business Website, Landing Page, dan Personal Website.'
    },
    {
      id: 'cv',
      name: 'CV & Portfolio',
      keywords: ['cv', 'resume', 'ats', 'portfolio', 'portofolio'],
      description: 'Dokumen personal brand profesional agar terasa lebih rapi, kredibel, dan berkesan.',
      examples: 'CV Profesional, ATS CV, Creative CV, Portfolio, dan Personal Branding Document.'
    },
    {
      id: 'photography',
      name: 'Fotografi',
      keywords: ['foto', 'fotografi', 'photography', 'wisuda', 'portrait', 'potret'],
      description: 'Dokumentasi dan storytelling untuk acara, wisuda, personal branding, dan momen penting.',
      examples: 'Graduation Photography, Event Photography, Personal Branding, Product Photography, dan Dokumentasi Acara.'
    },
    {
      id: 'videography',
      name: 'Videografi',
      keywords: ['video', 'videografi', 'videography', 'reels', 'aftermovie', 'highlight'],
      description: 'Video highlight, reels, dan storytelling visual untuk kanal digital.',
      examples: 'Event Highlight, Reels, Promotional Video, Social Media Video, dan Storytelling Video.'
    },
    {
      id: 'design',
      name: 'Desain Kreatif',
      keywords: ['desain', 'design', 'poster', 'social media', 'instagram', 'pitch deck', 'presentasi'],
      description: 'Desain poster, kit media sosial, pitch deck, dan aset visual sesuai pesan Anda.',
      examples: 'Poster, Social Media Kit, Instagram Content, Pitch Deck, Presentation Design, dan Digital Assets.'
    },
  ]);

  const SUGGESTIONS = [
    { label: 'Website', prompt: 'Saya tertarik dengan Website & Landing Page.' },
    { label: 'CV & Portfolio', prompt: 'Saya membutuhkan CV profesional.' },
    { label: 'Fotografi', prompt: 'Saya ingin foto untuk wisuda.' },
    { label: 'Videografi', prompt: 'Saya membutuhkan video untuk media sosial.' },
    { label: 'Desain Kreatif', prompt: 'Saya ingin membuat desain poster.' },
    { label: 'Belum tahu', prompt: 'Saya belum tahu layanan apa yang cocok untuk kebutuhan saya.' }
  ];

  const state = {
    history: [],
    serviceId: null,
    audience: null,
    industry: null,
    awaiting: null,
    initialized: false,
    waiting: false
  };

  let launcher;
  let chatWindow;
  let messageLog;
  let composer;
  let input;
  let sendButton;
  let closeButton;
  let typingRow;

  function normalize(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function hasTerm(text, term) {
    if (term.includes(' ')) return text.includes(term);
    return new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text);
  }

  function matchesAny(text, terms) {
    return terms.some((term) => hasTerm(text, term));
  }

  function findService(id) {
    return SERVICES.find((service) => service.id === id) || null;
  }

  function detectService(text) {
    const order = ['website', 'cv', 'photography', 'videography', 'design'];
    return order.map(findService).find((service) => matchesAny(text, service.keywords)) || null;
  }

  function detectAudience(text) {
    if (matchesAny(text, ['bisnis', 'usaha', 'umkm', 'perusahaan', 'brand bisnis', 'jualan'])) return 'bisnis';
    if (matchesAny(text, ['organisasi', 'komunitas', 'institusi', 'event', 'acara'])) return 'organisasi atau acara';
    if (matchesAny(text, ['mahasiswa', 'fresh graduate', 'job seeker', 'pencari kerja', 'profesional', 'freelancer'])) return 'profil profesional';
    if (matchesAny(text, ['personal brand', 'personal branding', 'pribadi', 'portfolio pribadi', 'portofolio pribadi'])) return 'personal brand';
    return null;
  }

  function detectIndustry(text) {
    const industries = [
      { terms: ['makanan', 'kuliner', 'restoran', 'restaurant', 'catering', 'katering', 'kafe', 'cafe'], value: 'usaha makanan atau kuliner' },
      { terms: ['fashion', 'pakaian', 'baju', 'thrift'], value: 'usaha fashion' },
      { terms: ['kecantikan', 'salon', 'skincare', 'beauty'], value: 'usaha kecantikan' },
      { terms: ['properti', 'property', 'real estate'], value: 'usaha properti' },
      { terms: ['pendidikan', 'kursus', 'sekolah', 'edukasi'], value: 'bidang pendidikan' },
      { terms: ['fotografi', 'studio foto', 'photography'], value: 'usaha fotografi' },
      { terms: ['teknologi', 'software', 'aplikasi', 'tech'], value: 'bidang teknologi' }
    ];
    return industries.find((industry) => matchesAny(text, industry.terms))?.value || null;
  }

  function makeWhatsAppAction(label = 'Hubungi SV-Creative via WhatsApp') {
    const number = window.SVCreativeConfig?.whatsappNumber;
    if (!number) return { label: 'Lihat halaman kontak', href: contactUrl, kind: 'contact' };

    const userMessages = state.history.filter((item) => item.role === 'user').slice(-5).map((item) => `- ${item.text}`);
    const service = findService(state.serviceId);
    const details = [
      'Halo SV-Creative 👋',
      '',
      'Saya ingin berkonsultasi mengenai kebutuhan saya. Saya sebelumnya menggunakan AI SV-Creative.',
      '',
      'Kebutuhan saya:',
      ...(userMessages.length ? userMessages : ['- Saya ingin berdiskusi tentang sebuah project.']),
      ...(service ? ['', `Layanan yang sedang dibahas: ${service.name}.`] : []),
      '',
      'Mohon bantuannya ya. Terima kasih.'
    ].join('\n');

    return {
      label,
      href: `https://wa.me/${number}?text=${encodeURIComponent(details)}`,
      kind: 'whatsapp',
      external: true
    };
  }

  function resultAction() {
    const destination = new URL(resultsUrl);
    if (state.serviceId) destination.hash = state.serviceId;
    return { label: 'Lihat Hasil Desain', href: destination.href, kind: 'results', external: true };
  }

  function appendMessage(role, text, actions = []) {
    const row = document.createElement('div');
    row.className = `ai-message-row ai-message-row--${role}`;

    if (role === 'assistant') {
      const avatar = document.createElement('img');
      avatar.className = 'ai-message-avatar';
      avatar.src = avatarUrl;
      avatar.alt = '';
      avatar.width = 30;
      avatar.height = 30;
      row.append(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'ai-chat-bubble';
    const messageText = document.createElement('p');
    messageText.className = 'ai-chat-bubble-text';
    messageText.textContent = text;
    bubble.append(messageText);

    if (actions.length) {
      const actionGroup = document.createElement('div');
      actionGroup.className = 'ai-chat-actions';
      actions.forEach((action) => {
        const link = document.createElement('a');
        link.className = `ai-chat-action${action.kind === 'whatsapp' ? ' ai-chat-action--whatsapp' : ''}`;
        link.href = action.href;
        link.textContent = action.label;
        if (action.external) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        actionGroup.append(link);
      });
      bubble.append(actionGroup);
    }

    row.append(bubble);
    messageLog.append(row);
    state.history.push({ role, text });
    scrollToLatest();
  }

  function scrollToLatest() {
    requestAnimationFrame(() => {
      messageLog.scrollTop = messageLog.scrollHeight;
    });
  }

  function appendSuggestions() {
    const group = document.createElement('div');
    group.className = 'ai-chat-suggestions';
    group.setAttribute('aria-label', 'Mulai percakapan');

    SUGGESTIONS.forEach((suggestion) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ai-chat-suggestion';
      button.textContent = suggestion.label;
      button.addEventListener('click', () => sendMessage(suggestion.prompt));
      group.append(button);
    });

    messageLog.append(group);
    scrollToLatest();
  }

  function addWelcome() {
    if (state.initialized) return;
    state.initialized = true;
    appendMessage('assistant', 'Halo! 👋 Saya AI SV-Creative.\n\nSaya siap membantu Anda menemukan layanan yang paling sesuai dengan kebutuhan Anda. Ceritakan saja apa yang sedang Anda butuhkan. Tidak perlu menggunakan format tertentu.');
    appendMessage('assistant', 'Sebagai awal, Anda bisa bercerita tentang website untuk bisnis, CV profesional, foto wisuda, video media sosial, desain poster, atau kebutuhan yang belum Anda tahu cocoknya ke mana.');
    appendSuggestions();
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'ai-message-row ai-message-row--assistant';
    row.setAttribute('role', 'status');
    row.setAttribute('aria-label', 'AI SV-Creative sedang mengetik');

    const avatar = document.createElement('img');
    avatar.className = 'ai-message-avatar';
    avatar.src = avatarUrl;
    avatar.alt = '';
    avatar.width = 30;
    avatar.height = 30;

    const indicator = document.createElement('div');
    indicator.className = 'ai-chat-typing';
    const label = document.createElement('span');
    label.textContent = 'AI SV-Creative sedang mengetik';
    const dots = document.createElement('span');
    dots.className = 'ai-chat-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement('span');
      dot.className = 'ai-chat-dot';
      dots.append(dot);
    }
    indicator.append(label, dots);
    row.append(avatar, indicator);
    messageLog.append(row);
    scrollToLatest();
    return row;
  }

  function hasHumanRequest(text) {
    return matchesAny(text, [
      'admin', 'bicara dengan orang', 'bicara dengan manusia', 'orangnya', 'tim sv',
      'langsung ke tim', 'konsultasi langsung', 'mau konsultasi', 'ingin konsultasi',
      'langsung whatsapp', 'whatsapp langsung', 'lanjut whatsapp', 'chat whatsapp', 'hubungi whatsapp',
      'mau order', 'ingin order', 'mau pesan', 'ingin pesan', 'booking'
    ]);
  }

  function hasPriceRequest(text) {
    return matchesAny(text, ['harga', 'biaya', 'tarif', 'budget', 'quotation', 'penawaran harga']);
  }

  function hasUnsupportedRequest(text) {
    return matchesAny(text, ['erp', 'payment gateway', 'payroll', 'inventory', 'integrasi accounting', 'integrasi sistem', 'aplikasi custom', 'logo brand']);
  }

  function hasResultsRequest(text) {
    return matchesAny(text, ['hasil desain', 'hasil karya', 'referensi', 'contoh desain', 'contoh website', 'lihat contoh', 'lihat hasil', 'suka desain ini', 'nomor 2']);
  }

  function answerWebsiteNeed(text) {
    const audience = detectAudience(text);
    const industry = detectIndustry(text);
    if (audience) state.audience = audience;
    if (industry) {
      state.industry = industry;
      state.audience = 'bisnis';
    }

    if (!state.audience) {
      state.awaiting = 'website-audience';
      return {
        text: 'Tentu! Supaya saya bisa mengarahkan konsepnya dengan tepat, website ini untuk bisnis, portfolio pribadi, organisasi, atau kebutuhan lainnya?'
      };
    }

    if (state.audience === 'bisnis' && !state.industry) {
      state.awaiting = 'website-industry';
      return { text: 'Baik. Bisnisnya bergerak di bidang apa?' };
    }

    state.awaiting = 'website-order-flow';
    const context = state.industry ? `Untuk ${state.industry}, ` : 'Untuk kebutuhan tersebut, ';
    return {
      text: `${context}Website & Landing Page bisa menjadi pilihan yang cocok. Website dapat memperkenalkan bisnis atau profil Anda, menampilkan produk atau layanan, serta memuat kontak, lokasi, dan jalur pemesanan.\n\nPelanggan biasanya menghubungi Anda lewat WhatsApp, marketplace, atau formulir website?`,
      actions: [resultAction()]
    };
  }

  function respondToService(service, text) {
    state.serviceId = service.id;
    if (service.id === 'website') return answerWebsiteNeed(text);

    if (service.id === 'cv') {
      state.awaiting = 'cv-audience';
      return {
        text: 'CV & Portfolio membantu menyajikan pengalaman dan personal brand dengan lebih rapi dan kredibel. Pilihannya dapat berupa CV Profesional, ATS CV, Creative CV, atau portfolio. Anda sedang menyiapkannya untuk melamar kerja, kuliah, freelance, atau kebutuhan lain?',
        actions: [resultAction()]
      };
    }

    if (service.id === 'photography') {
      state.awaiting = 'photography-need';
      const graduation = matchesAny(text, ['wisuda', 'graduation']);
      return {
        text: graduation
          ? 'Fotografi cocok untuk dokumentasi wisuda dan momen penting. Anda bisa menentukan gaya potret serta momen yang ingin didokumentasikan. Apakah kebutuhannya untuk sesi pribadi, keluarga, atau dokumentasi acara wisuda?'
          : 'Fotografi mencakup dokumentasi acara, wisuda, personal branding, dan produk. Jenis foto apa yang sedang Anda butuhkan?',
        actions: [resultAction()]
      };
    }

    if (service.id === 'videography') {
      state.awaiting = 'videography-need';
      return {
        text: 'Videografi dapat berupa video highlight, reels, video promosi, atau storytelling untuk kanal digital. Konten ini akan digunakan untuk bisnis, event, atau personal brand?',
        actions: [resultAction()]
      };
    }

    if (service.id === 'design') {
      state.awaiting = 'design-need';
      return {
        text: 'Desain Kreatif mencakup poster, kit media sosial, konten Instagram, pitch deck, presentasi, dan aset digital. Desain apa yang ingin Anda buat dan untuk siapa?',
        actions: [resultAction()]
      };
    }

    return unknownAnswer();
  }

  function answerPending(text) {
    if (state.awaiting === 'website-audience' || state.awaiting === 'website-industry') {
      return answerWebsiteNeed(text);
    }

    if (state.awaiting === 'website-order-flow') {
      state.awaiting = null;
      const channel = matchesAny(text, ['whatsapp', 'wa'])
        ? 'WhatsApp'
        : matchesAny(text, ['marketplace'])
          ? 'marketplace'
          : matchesAny(text, ['formulir', 'form'])
            ? 'formulir website'
            : 'kanal tersebut';
      return {
        text: `Baik, berarti pelanggan Anda biasanya memesan lewat ${channel}. Website dapat menampilkan tombol atau informasi yang mengarahkan mereka ke kanal tersebut. Anda juga dapat melihat kategori Website & Landing Page di Hasil Desain sebagai referensi.`,
        actions: [resultAction()]
      };
    }

    if (state.awaiting === 'cv-audience') {
      state.awaiting = null;
      return {
        text: `Baik, kebutuhan CV & Portfolio untuk ${text} dapat disusun dengan menonjolkan pengalaman dan tujuan yang relevan. Jika Anda mau, ceritakan bidang atau posisi yang dituju.`,
        actions: [resultAction()]
      };
    }

    if (state.awaiting === 'photography-need') {
      state.awaiting = null;
      return { text: `Saya catat kebutuhannya: ${text}. Fotografi dapat diarahkan ke momen dan gaya dokumentasi yang Anda perlukan. Apakah ada waktu atau lokasi yang sudah direncanakan?` };
    }

    if (state.awaiting === 'videography-need') {
      state.awaiting = null;
      return { text: `Baik, video untuk ${text} bisa diarahkan ke format highlight, reels, atau storytelling sesuai kanalnya. Format mana yang paling Anda butuhkan?` };
    }

    if (state.awaiting === 'design-need') {
      state.awaiting = null;
      return { text: `Saya catat: ${text}. Desain Kreatif dapat mencakup aset visual yang konsisten dengan pesan dan audiensnya. Apakah Anda sudah memiliki identitas warna atau referensi visual?` };
    }

    if (state.awaiting === 'open-need') {
      state.awaiting = null;
      const service = detectService(text);
      if (service) return respondToService(service, text);
    }

    return null;
  }

  function listServices() {
    state.awaiting = 'open-need';
    return {
      text: 'Layanan yang tersedia meliputi Website & Landing Page, CV & Portfolio, Fotografi, Videografi, dan Desain Kreatif.\n\nAnda sedang ingin membuat apa atau mencapai hasil seperti apa?'
    };
  }

  function unknownAnswer() {
    state.awaiting = null;
    return {
      text: 'Saya belum memiliki informasi yang cukup untuk menjawabnya dengan tepat. Supaya Anda mendapat arahan yang sesuai, lebih baik kita lanjutkan melalui WhatsApp dengan tim SV-Creative.',
      actions: [makeWhatsAppAction()]
    };
  }

  function resolveResponse(rawText) {
    const text = normalize(rawText);

    if (hasHumanRequest(text)) {
      state.awaiting = null;
      return {
        text: 'Tentu! Anda bisa langsung melanjutkan percakapan dengan tim SV-Creative melalui WhatsApp.',
        actions: [makeWhatsAppAction('Chat dengan SV-Creative')]
      };
    }

    if (hasPriceRequest(text)) {
      state.awaiting = null;
      return {
        text: 'Harga bergantung pada kebutuhan dan ruang lingkup project, dan saya tidak memiliki daftar harga yang bisa saya pastikan di sini. Untuk mendapatkan penawaran yang sesuai, silakan konsultasikan langsung dengan tim SV-Creative.',
        actions: [makeWhatsAppAction('Minta Penawaran via WhatsApp')]
      };
    }

    if (hasUnsupportedRequest(text)) {
      state.awaiting = null;
      return {
        text: 'Untuk kebutuhan yang cukup spesifik seperti itu, saya belum bisa memastikan detail pengerjaannya melalui chat ini. Agar informasinya akurat, lebih baik diskusikan langsung dengan tim SV-Creative.',
        actions: [makeWhatsAppAction()]
      };
    }

    if (hasResultsRequest(text)) {
      const service = state.serviceId ? findService(state.serviceId) : detectService(text);
      return {
        text: service
          ? `Tentu. Buka Hasil Desain pada kategori ${service.name} untuk melihat gambaran jenis output dan menjadikannya referensi. Jika ada contoh tertentu yang Anda sukai, ceritakan bagian yang ingin dijadikan acuan.`
          : 'Tentu. Di Hasil Desain Anda bisa menelusuri kategori layanan dan gambaran output yang dapat dijadikan referensi. Jika ada contoh tertentu yang Anda sukai, ceritakan bagian yang ingin dijadikan acuan.',
        actions: [resultAction()]
      };
    }

    if (matchesAny(text, ['layanan apa', 'layanan sv', 'apa saja layanan', 'belum tahu', 'bingung memilih', 'tidak tahu layanan'])) {
      return listServices();
    }

    if (matchesAny(text, ['timeline', 'berapa lama', 'waktu pengerjaan', 'kapan selesai', 'durasi'])) {
      return {
        text: 'Waktu pengerjaan bergantung pada ruang lingkup, output, dan jumlah revisi. Timeline akan dibahas dan disepakati sejak awal setelah kebutuhannya lebih jelas. Project apa yang sedang Anda rencanakan?'
      };
    }

    const pending = answerPending(text);
    if (pending) return pending;

    const service = detectService(text);
    if (service) return respondToService(service, text);

    if (matchesAny(text, ['bisnis kecil', 'umkm', 'terlihat profesional di internet', 'hadir online', 'bisnis online'])) {
      state.serviceId = 'website';
      state.audience = 'bisnis';
      state.industry = detectIndustry(text);
      return answerWebsiteNeed(text);
    }

    if (matchesAny(text, ['halo', 'hai', 'selamat pagi', 'selamat siang', 'selamat sore'])) {
      return { text: 'Halo! Ceritakan apa yang sedang Anda butuhkan—saya bantu arahkan ke layanan yang paling relevan.' };
    }

    return unknownAnswer();
  }

  function setWaiting(isWaiting) {
    state.waiting = isWaiting;
    input.disabled = isWaiting;
    sendButton.disabled = isWaiting || !input.value.trim();
    composer.setAttribute('aria-busy', String(isWaiting));
  }

  function sendMessage(value = input.value) {
    const text = value.trim();
    if (!text || state.waiting) return;

    messageLog.querySelector('.ai-chat-suggestions')?.remove();
    appendMessage('user', text);
    input.value = '';
    input.style.height = '';
    setWaiting(true);
    typingRow = showTyping();

    const delay = 850 + Math.floor(Math.random() * 650);
    window.setTimeout(() => {
      typingRow?.remove();
      typingRow = null;
      try {
        const response = resolveResponse(text);
        appendMessage('assistant', response.text, response.actions || []);
      } catch (error) {
        console.error('AI SV-Creative response error:', error);
        appendMessage('assistant', 'Maaf, sepertinya saya sedang mengalami kendala. Anda tetap bisa menghubungi tim SV-Creative melalui WhatsApp.', [makeWhatsAppAction()]);
      } finally {
        setWaiting(false);
        sendButton.disabled = true;
        scrollToLatest();
      }
    }, delay);
  }

  function buildInterface() {
    if (document.querySelector('.ai-chat-window')) return;

    launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'ai-chat-launcher';
    launcher.setAttribute('aria-label', 'Chat dengan AI SV-Creative');
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.setAttribute('aria-controls', 'ai-chat-window');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.innerHTML = `<img class="ai-chat-avatar" src="${avatarUrl}" alt="" width="38" height="38"><span class="ai-launcher-status" aria-hidden="true"></span><span>Chat dengan AI</span>`;

    chatWindow = document.createElement('section');
    chatWindow.className = 'ai-chat-window';
    chatWindow.id = 'ai-chat-window';
    chatWindow.setAttribute('role', 'dialog');
    chatWindow.setAttribute('aria-label', 'AI SV-Creative, Creative Assistant');
    chatWindow.hidden = true;
    chatWindow.innerHTML = `
      <header class="ai-chat-header">
        <img class="ai-chat-avatar" src="${avatarUrl}" alt="Avatar AI SV-Creative" width="46" height="46">
        <div class="ai-chat-identity">
          <strong>AI SV-Creative</strong>
          <span class="ai-chat-subtitle">Creative Assistant</span>
          <span class="ai-chat-online">Online</span>
        </div>
        <button class="ai-chat-close" type="button" aria-label="Tutup chat AI">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </header>
      <div class="ai-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <form class="ai-chat-form">
        <label class="ai-chat-sr-only" for="ai-chat-input">Ketikan kebutuhan Anda</label>
        <textarea class="ai-chat-input" id="ai-chat-input" rows="1" placeholder="Ketikan kebutuhan Anda..." maxlength="1200"></textarea>
        <button class="ai-chat-send" type="submit" aria-label="Kirim pesan" disabled>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8Z"/><path d="M7 12h14"/></svg>
        </button>
      </form>`;

    document.body.append(launcher, chatWindow);
    messageLog = chatWindow.querySelector('.ai-chat-messages');
    composer = chatWindow.querySelector('.ai-chat-form');
    input = chatWindow.querySelector('.ai-chat-input');
    sendButton = chatWindow.querySelector('.ai-chat-send');
    closeButton = chatWindow.querySelector('.ai-chat-close');

    launcher.addEventListener('click', openChat);
    closeButton.addEventListener('click', closeChat);
    composer.addEventListener('submit', (event) => {
      event.preventDefault();
      sendMessage();
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
      sendButton.disabled = state.waiting || !input.value.trim();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (input.value.trim() && !state.waiting) composer.requestSubmit();
      }
    });

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-ai-chat-open]');
      if (!trigger) return;
      event.preventDefault();
      openChat();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !chatWindow.hidden) closeChat();
    });
  }

  function openChat() {
    if (!chatWindow) return;
    chatWindow.hidden = false;
    launcher.hidden = true;
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ai-chat-open');
    addWelcome();
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    (isMobile ? closeButton : input).focus({ preventScroll: true });
  }

  function closeChat() {
    if (!chatWindow || chatWindow.hidden) return;
    chatWindow.hidden = true;
    launcher.hidden = false;
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('ai-chat-open');
    launcher.focus({ preventScroll: true });
  }

  try {
    buildInterface();
  } catch (error) {
    console.error('AI SV-Creative could not start:', error);
  }
})();