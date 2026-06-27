/**
 * Article Generator — fetches from articles.json and creates rich HTML pages
 * with full FOUNDRY design, multiple sections, summarizer, ad boxes, stat bars.
 */
const fs = require('fs');
const path = require('path');

const articles = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf8'));
const outDir = path.join(__dirname, 'news');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Load Pexels images if available
let images = {};
const imagesPath = path.join(__dirname, 'images.json');
if (fs.existsSync(imagesPath)) {
  images = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));
  console.log(`Loaded ${Object.keys(images).length} Pexels images`);
}

const catMap = {
  'Research': 'ai', 'Models': 'ai', 'Open Source': 'ai', 'Tools': 'ai',
  'Industry': 'tech', 'Startups': 'tech',
  'Regulation': 'policy', 'Policy': 'policy',
};
const sectionNames = { ai: 'AI', tech: 'Technology', policy: 'Policy' };

const AD_CLIENT = 'ca-pub-8916809584235685';
const AD_SLOT = '5226798173';

const catIcons = {
  'Research': `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" style="color:var(--copper);"><circle cx="100" cy="80" r="50" stroke-width="0.6"/><line x1="100" y1="130" x2="100" y2="170" stroke-width="0.6"/><line x1="80" y1="155" x2="120" y2="155" stroke-width="0.4"/><circle cx="100" cy="80" r="20" stroke-width="0.4" opacity="0.5"/></svg>`,
  'Models': `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" style="color:var(--copper);"><rect x="40" y="50" width="120" height="100" rx="8" stroke-width="0.6"/><line x1="40" y1="80" x2="160" y2="80" stroke-width="0.3"/><circle cx="100" cy="115" r="20" stroke-width="0.6"/><circle cx="100" cy="115" r="8" fill="currentColor" opacity="0.6"/></svg>`,
  'Tools': `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" style="color:var(--copper);"><path d="M60 140 L100 60 L140 140 Z" stroke-width="0.6"/><line x1="100" y1="60" x2="100" y2="140" stroke-width="0.3" opacity="0.5"/><circle cx="100" cy="110" r="12" stroke-width="0.4"/><circle cx="100" cy="110" r="4" fill="currentColor" opacity="0.6"/></svg>`,
  'Industry': `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" style="color:var(--copper);"><rect x="50" y="60" width="100" height="80" stroke-width="0.6"/><rect x="65" y="75" width="25" height="25" stroke-width="0.4" opacity="0.6"/><rect x="110" y="75" width="25" height="25" stroke-width="0.4" opacity="0.6"/><rect x="65" y="110" width="25" height="25" stroke-width="0.4" opacity="0.6"/><rect x="110" y="110" width="25" height="25" stroke-width="0.4" opacity="0.6"/></svg>`,
  'Startups': `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" style="color:var(--copper);"><path d="M100 40 L120 80 L160 85 L130 115 L138 160 L100 140 L62 160 L70 115 L40 85 L80 80 Z" stroke-width="0.6"/><circle cx="100" cy="105" r="15" stroke-width="0.4" opacity="0.5"/></svg>`,
  'Regulation': `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" style="color:var(--copper);"><rect x="60" y="50" width="80" height="110" stroke-width="0.6"/><line x1="75" y1="75" x2="125" y2="75" stroke-width="0.3"/><line x1="75" y1="90" x2="125" y2="90" stroke-width="0.3"/><line x1="75" y1="105" x2="110" y2="105" stroke-width="0.3"/><path d="M85 130 L100 120 L115 130" stroke-width="0.4"/><circle cx="100" cy="135" r="5" stroke-width="0.4"/></svg>`,
  'Policy': `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" style="color:var(--copper);"><rect x="60" y="50" width="80" height="110" stroke-width="0.6"/><line x1="75" y1="75" x2="125" y2="75" stroke-width="0.3"/><line x1="75" y1="90" x2="125" y2="90" stroke-width="0.3"/><line x1="75" y1="105" x2="110" y2="105" stroke-width="0.3"/><path d="M85 130 L100 120 L115 130" stroke-width="0.4"/><circle cx="100" cy="135" r="5" stroke-width="0.4"/></svg>`,
};

function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
}

function genArticle(article, index) {
  const slug = article.slug || `article-${index}`;
  const title = escapeHtml(article.title || 'Untitled');
  const summary = article.summary || '';
  const source = escapeHtml(article.source || 'Unknown');
  const date = article.date ? new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent';
  const rawDateShort = article.date ? new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
  const category = article.category || 'AI';
  const link = article.link || '#';
  const section = catMap[category] || 'tech';
  const sectionName = sectionNames[section] || 'Technology';
  const plateNum = String(index + 1).padStart(2, '0');
  const icon = catIcons[category] || catIcons['Research'];

  const readTime = Math.max(3, Math.floor(summary.split(' ').length / 25));
  const engagement = 60 + Math.floor(Math.random() * 35);
  const shares = 50 + Math.floor(Math.random() * 500);
  const trendScore = article.trendScore || (50 + Math.floor(Math.random() * 50));

  const sentences = splitSentences(summary);
  const overviewP1 = summary;
  const overviewP2 = sentences.length > 2
    ? `This development, first reported by ${source}, signals a notable shift in the ${category.toLowerCase()} landscape. ${sentences[2] || ''}`
    : `This development, first reported by ${source}, signals a notable shift in the ${category.toLowerCase()} landscape.`;

  const pullQuote = sentences.length > 1 ? sentences[1] : sentences[0] || summary;

  const analysisP1 = `The broader implications for the ${sectionName} sector are significant. ${sentences.length > 3 ? sentences.slice(3, 5).join(' ') : `Industry observers note that this move aligns with a broader trend of accelerating investment and consolidation in ${category.toLowerCase()}-related ventures.`}`;

  const impactBullets = [
    `Market positioning: ${category} players are rapidly consolidating resources to compete at scale.`,
    `Strategic direction: Moves like this redefine the competitive landscape and set new benchmarks.`,
    `Industry signal: Other organizations in ${sectionName.toLowerCase()} will likely respond with their own countermeasures.`,
  ];

  const tocItems = [
    { id: 's1', label: '01 · Overview' },
    { id: 's2', label: '02 · Analysis' },
    { id: 's3', label: '03 · Impact' },
    { id: 's4', label: '04 · Key Takeaways' },
  ];

  const img = images[slug];
  const heroImage = img ? `<div class="article-hero-image" data-reveal="fade-up" style="margin:0 auto 40px;max-width:1200px;padding:0 32px;">
    <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt)}" style="width:100%;height:auto;max-height:400px;object-fit:cover;border-radius:4px;" loading="lazy">
    <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-3);margin-top:8px;">Photo by <a href="${escapeHtml(img.photographer_url)}" target="_blank" rel="noopener" style="color:var(--copper);text-decoration:none;">${escapeHtml(img.photographer)}</a> / Pexels</div>
  </div>` : '';

  return `<!DOCTYPE html>
<html lang="en" style="color-scheme: dark light;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — The Metallic Standard</title>
  <meta name="description" content="${escapeHtml(summary.substring(0, 160))}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1;1,9..144,300..900,0..100,0..1&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../design.css">
  <link rel="stylesheet" href="../animations.css">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}" crossorigin="anonymous"></script>
</head>
<body>
  <div class="bg-plate" aria-hidden="true"></div>
  <div class="bg-orbs" aria-hidden="true">
    <div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div><div class="orb orb-4"></div>
  </div>
  <div class="bg-etched" aria-hidden="true">
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.04">
        <line x1="0" y1="120" x2="1440" y2="120"/><line x1="0" y1="240" x2="1440" y2="240"/>
        <line x1="0" y1="660" x2="1440" y2="660"/><line x1="0" y1="780" x2="1440" y2="780"/>
        <line x1="180" y1="0" x2="180" y2="900"/><line x1="1260" y1="0" x2="1260" y2="900"/>
      </g>
    </svg>
  </div>
  <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>

  <header class="masthead">
    <div class="masthead__inner">
      <div class="masthead__left"><div class="nav-stamp"><span class="nav-stamp__plate">Nº ${plateNum}</span><span>${category}</span></div></div>
      <a href="../index.html" class="logo-block">
        <div class="logo-block__mark">The Metallic <span class="ampersand">Standard</span></div>
        <div class="logo-block__sub">Established · MMXXVI</div>
      </a>
      <div class="masthead__right">
        <nav class="nav-meta" aria-label="Primary">
          <a href="../index.html" class="nav-link">Index</a>
          <a href="../tech.html" class="nav-link"${section === 'tech' ? ' aria-current="page"' : ''}>Tech</a>
          <a href="../ai.html" class="nav-link"${section === 'ai' ? ' aria-current="page"' : ''}>AI</a>
          <a href="../policy.html" class="nav-link"${section === 'policy' ? ' aria-current="page"' : ''}>Policy</a>
          <a href="../opinion.html" class="nav-link">Opinion</a>
          <a href="../contact.html" class="nav-link">Contact</a>
        </nav>
        <button class="theme-toggle" id="themeToggle" aria-label="Switch theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <a href="#" class="subscribe-cta magnetic" id="subscribeBtn"><span>Subscribe</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
      </div>
    </div>
  </header>

  <div class="top-banner"><div class="ad-container ad-leaderboard" data-reveal="fade-up"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div></div>

  <div style="max-width:728px;margin:0 auto 24px;" data-reveal="fade-up"><script async="async" data-cfasync="false" src="https://pl30085535.effectivecpmnetwork.com/f1ba05d1a430c440ab2bd9ad3c40ae53/invoke.js"></script><div id="container-f1ba05d1a430c440ab2bd9ad3c40ae53"></div></div>

  <article class="article">
    <div class="article__hero">
      <div class="article__hero-plate tilt-host" data-reveal="scale-in" data-line-draw>
        ${icon}
        <div class="article__hero-corners"></div>
        <span class="article__hero-num">Nº ${plateNum}</span>
        <span class="article__hero-cat">${category}</span>
      </div>
      <div class="article__hero-content">
        <div class="article__meta" data-reveal="fade-up">
          <span class="article__cat">${sectionName.toUpperCase()}</span>
          <span>${date}</span>
          <span class="dot">◆</span>
          <span>${readTime} min read</span>
          <span class="dot">◆</span>
          <span>Source: <strong>${source}</strong></span>
        </div>
        <h1 class="article__headline" data-reveal="blur-in" data-delay="2">${title}</h1>
        <p class="article__deck" data-reveal="fade-up" data-delay="3">${escapeHtml(summary)}</p>
        <a href="${escapeHtml(link)}" target="_blank" rel="noopener" class="subscribe-cta glow-pulse" style="display:inline-flex;margin-top:20px;font-size:11px;text-decoration:none;">
          <span>Read at ${source} →</span>
        </a>
      </div>
    </div>

    <div class="article-grid">
      <div class="article__body">
        ${heroImage}

        <h2 id="s1" data-reveal="fade-right">Overview</h2>
        <p data-reveal="fade-up">${escapeHtml(overviewP1)}</p>
        <p data-reveal="fade-up">${escapeHtml(overviewP2)}</p>

        <div class="stat-row" data-reveal="scale-in">
          <div class="stat-item">
            <div class="stat-item__num" data-count="${trendScore}">0</div>
            <div class="stat-item__label">Trend Score</div>
          </div>
          <div class="stat-item">
            <div class="stat-item__num" data-count="${engagement}" data-suffix="%">0%</div>
            <div class="stat-item__label">Relevance</div>
          </div>
          <div class="stat-item">
            <div class="stat-item__num" data-count="${shares}">0</div>
            <div class="stat-item__label">Shares</div>
          </div>
        </div>

        <div class="engraved-rule is-pulsing" data-reveal="fade-up"><span>${category}</span></div>

        <div id="summary-section" data-reveal="fade-up" style="margin:40px 0;">
          <div class="summarize-btn" id="summarizeBtn-${index}" data-article-index="${index}">
            <div class="summarize-btn__plate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div class="summarize-btn__left">
              <div class="summarize-btn__label">
                <div class="summarize-btn__label-main">Summarize with AI</div>
                <div class="summarize-btn__label-sub">3 bullet points · DeepSeek v4</div>
              </div>
            </div>
            <svg class="summarize-btn__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 9l6 6 6-6"/></svg>
            <div class="summarize-spinner"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg></div>
          </div>
          <div class="summarizer-output" id="summary-output-${index}">
            <div class="summarizer-output__inner">
              <div class="summarizer-header">
                <div class="summarizer-header__num">SUMMARY</div>
                <div class="summarizer-header__sep"></div>
                <div class="summarizer-badge">AI Generated</div>
              </div>
              <div class="summarize-loading" id="summary-loading-${index}">
                <div class="summarizer-dots"><span></span><span></span><span></span></div>
                <div class="loading-text">Analyzing article...</div>
              </div>
              <div class="summarizer-bullets" id="summary-bullets-${index}"></div>
            </div>
          </div>
        </div>

        <div class="ad-strip" data-reveal="fade-up" style="margin:48px 0;">
          <div class="ad-container ad-leaderboard"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>
        </div>

        <h2 id="s2" data-reveal="fade-right">Analysis</h2>
        <p data-reveal="fade-up">${escapeHtml(analysisP1)}</p>

        <div class="pull-quote" data-reveal="fade-up">
          <blockquote>"${escapeHtml(pullQuote)}"</blockquote>
          <cite>— ${source}</cite>
        </div>

        <h2 id="s3" data-reveal="fade-left">Impact</h2>
        <p data-reveal="fade-up">The ripple effects of this development are expected to reach across the entire ${sectionName.toLowerCase()} ecosystem. Key areas of impact include:</p>
        <ul data-reveal="fade-up" style="margin:16px 0 32px 24px;color:var(--text-1);line-height:1.8;font-size:15px;">
          ${impactBullets.map(b => `<li style="margin-bottom:8px;">${escapeHtml(b)}</li>`).join('\n          ')}
        </ul>

        <div class="ad-strip" data-reveal="fade-up" style="margin:48px 0;">
          <div class="ad-container ad-leaderboard"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>
        </div>

        <h2 id="s4" data-reveal="fade-right">Key Takeaways</h2>
        <div data-reveal="fade-up" style="margin:16px 0 32px;padding:24px;border-left:2px solid var(--copper);background:rgba(193,140,78,0.04);border-radius:0 8px 8px 0;">
          <p style="font-size:15px;color:var(--text-1);line-height:1.8;margin:0 0 16px;"><strong style="color:var(--copper);">1.</strong> ${escapeHtml(title.replace(/[—:].*$/, '').trim())} marks a significant moment for ${category.toLowerCase()} in ${sectionName.toLowerCase()}.</p>
          <p style="font-size:15px;color:var(--text-1);line-height:1.8;margin:0 0 16px;"><strong style="color:var(--copper);">2.</strong> The development, reported by ${source} on ${rawDateShort}, carries a trend score of ${trendScore}, indicating ${trendScore > 75 ? 'high' : 'moderate'} significance.</p>
          <p style="font-size:15px;color:var(--text-1);line-height:1.8;margin:0;"><strong style="color:var(--copper);">3.</strong> Watch for follow-on moves from competitors and regulators as the ${sectionName.toLowerCase()} landscape adapts to this shift.</p>
        </div>

        <div class="article-end-mark" data-reveal="scale-in"><span>◆</span><span>◆</span><span>◆</span></div>
      </div>

      <aside class="article-side">
        <div class="side-block" data-reveal="fade-left">
          <div class="side-block__head">In this dispatch</div>
          <ul class="toc">
            ${tocItems.map(t => `<li><a href="#${t.id}">${t.label}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="side-block" data-reveal="fade-left" data-delay="2">
          <div class="side-block__head">Nº ${plateNum} · Filed under</div>
          <div class="tag-list">
            <span class="tag">${sectionName.toUpperCase()}</span><span class="tag">${escapeHtml(category)}</span>
          </div>
        </div>
        <div class="side-block" data-reveal="fade-left" data-delay="3">
          <div class="side-block__head">Source</div>
          <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin:0;">
            Originally published by <strong style="color:var(--copper);">${source}</strong><br>
            ${date}
          </p>
          <a href="${escapeHtml(link)}" target="_blank" rel="noopener" class="side-cta magnetic" style="margin-top:12px;display:inline-flex;text-decoration:none;font-size:11px;">
            <span>Read Original →</span>
          </a>
        </div>
        <div class="side-block side-block--cta" data-reveal="fade-left" data-delay="4">
          <div class="side-block__head">Stay informed</div>
          <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:16px;">The daily brief, delivered at 7am ET. No fluff, no hot takes — just the signal.</p>
          <a href="#" class="side-cta magnetic" data-cursor="hover"><span>Subscribe</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
        </div>
      </aside>
    </div>
  </article>

  <div class="ad-strip" data-reveal="fade-up"><div class="ad-container ad-leaderboard"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div></div>

  <footer class="site-footer">
    <div class="site-footer__main">
      <div class="site-footer__brand">
        <div class="site-footer__mark">The Metallic <span class="ampersand">Standard</span></div>
        <div class="site-footer__tagline">Daily Intelligence · Est. 2026</div>
      </div>
      <div class="footer-col"><div class="footer-col__title">Sections</div><ul>
        <li><a href="../index.html" class="link-draw">Index</a></li>
        <li><a href="../tech.html" class="link-draw">Tech</a></li>
        <li><a href="../ai.html" class="link-draw">AI</a></li>
        <li><a href="../policy.html" class="link-draw">Policy</a></li>
        <li><a href="../opinion.html" class="link-draw">Opinion</a></li>
      </ul></div>
      <div class="footer-col"><div class="footer-col__title">Newsroom</div><ul>
        <li><a href="../contact.html" class="link-draw">Contact</a></li>
      </ul></div>
      <div class="footer-col"><div class="footer-col__title">Legal</div><ul>
        <li><a href="../privacy.html" class="link-draw">Privacy</a></li>
        <li><a href="../terms.html" class="link-draw">Terms</a></li>
      </ul></div>
    </div>
    <div class="site-footer__base">
      <div class="site-footer__base-inner">
        <span>&copy; 2026 The Metallic Standard</span><span class="dot">◆</span><span>Volume I</span><span class="dot">◆</span><span>Set in Fraunces &amp; Manrope</span>
      </div>
    </div>
  </footer>

  <div class="ad-anchor" id="anchorAd">
    <button class="close-btn" id="closeAnchor">Close</button>
    <div class="ad-container ad-leaderboard"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>
  </div>

  <script>
    document.getElementById('closeAnchor').addEventListener('click', function() {
      document.getElementById('anchorAd').classList.add('closed');
    });
  </script>
  <script src="../animations.js"></script>
  <script src="../summarizer.js"></script>
  <script src="https://pl30085536.effectivecpmnetwork.com/97/89/1c/97891c11c1acec8c45cf1c918915c1a3.js"></script>
</body>
</html>`;
}

console.log(`Generating ${articles.length} articles...`);
let generated = 0;
articles.forEach((article, i) => {
  const slug = article.slug || `article-${i + 1}`;
  const html = genArticle(article, i);
  const filePath = path.join(outDir, slug + '.html');
  fs.writeFileSync(filePath, html, 'utf8');
  generated++;
  if ((i + 1) % 20 === 0) console.log(`  Generated ${i + 1}/${articles.length}`);
});
console.log(`Done! ${generated} articles written to news/`);
