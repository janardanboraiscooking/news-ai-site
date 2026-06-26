/**
 * THE METALLIC STANDARD — Article Summarizer
 * Pre-written summaries with editorial AI-loading experience.
 */
(function () {
  'use strict';

  var summaries = {
    'gpt5': [
      'OpenAI and Anthropic have released GPT-5 and Claude 4, with GPT-5 scoring 94% on the MMLU-Pro benchmark — surpassing expert human performance for the first time using over 10 trillion parameters.',
      'Both models demonstrate emergent capabilities including genuine multi-step planning, self-correction, and reasoning chain revision — a qualitative leap that has shifted the AGI debate from "if" to "when."',
      'Claude 4 maintains coherent analysis across 256,000-token context windows without degradation, while law firms report these models can now construct legal arguments with minimal human review.'
    ],
    'ai-safety': [
      '47 countries have enacted or proposed AI safety legislation in the past six months — a tenfold increase from 2024 — following catalyst incidents including an AI-generated deepfake that nearly triggered a nuclear diplomatic crisis.',
      'The EU, US, UK, and Japan have each taken different regulatory approaches, from the EU\'s risk-based AI Act classification to the US sector-specific model, but no binding cross-border enforcement mechanism exists.',
      'Civil liberties organizations warn that at 89% AI moderation accuracy applied to billions of daily decisions, hundreds of millions of false positives sweep up legitimate political speech, journalism, and satire every year.'
    ],
    'autonomous': [
      'Enterprise adoption of autonomous systems has reached 72% with the market projected at $4.2 trillion by 2028, driven by reasoning-capable LLMs, tool-calling APIs, and plummeting GPU inference costs.',
      'Microsoft Azure\'s self-healing infrastructure prevented 99.7% of potential outages in Q1 2026 — up from 89% with human-only operations — while autonomous data center management reduced global energy consumption by 18%.',
      'Boeing\'s latest aircraft wing design was 94% AI-generated, cutting the development cycle from 18 months to just 6 weeks, showcasing how autonomous systems are compressing timelines across industries.'
    ],
    'ai-agents': [
      'McKinsey reports a 38% mid-management workforce cut at firms deploying agentic AI, with 2.3 million "ghost employees" — AI agents — now operating across global corporations and driving 14% of all B2B customer interactions.',
      'One Fortune 500 retailer processed 3.4 million support tickets in Q1 2026 with only 14 hours of total human intervention, while fine-tuning a domain-specific agent now costs under $100.',
      'The AI agent revolution is not augmentation — it\'s replacement hidden behind euphemistic "restructuring" language, and with zero Congressional hearings on agentic AI in the workplace, regulation is nowhere in sight.'
    ],
    'quantum': [
      'IBM\'s Condor processor has reached 1,121 qubits and is already running optimization tasks for JPMorgan Chase, while Google\'s Willow processor demonstrated error correction rates below the practical threshold for the first time.',
      'Cloud quantum access has dropped below $1 per qubit-hour and IBM\'s Quantum System Two costs $15 million — down from $100M+ for early systems — with over 200 enterprises joining quantum programs in the last six months.',
      'Goldman Sachs is running risk simulations on IBM quantum hardware and DHL achieved a 23% fuel efficiency improvement via quantum-optimized routing, with industry roadmaps targeting 10,000+ qubits by 2028.'
    ],
    'eu-dma': [
      'The EU has designated Apple, Google, Meta, Microsoft, Amazon, and ByteDance as gatekeepers under the Digital Markets Act, with fines of up to 10% of global annual revenue — potentially exceeding €2.4 billion.',
      'Apple must now allow third-party app stores and sideloading on iOS, Google must stop self-preferencing in search results, and Meta must enable cross-platform messaging interoperability within the 18-month compliance window.',
      'Apple has filed a lawsuit challenging its gatekeeper designation while the UK, Japan, South Korea, and India study similar frameworks, signaling that the DMA\'s influence will extend far beyond European borders.'
    ],
    'data-sovereignty': [
      '89 countries have enacted or strengthened data residency laws in the past year, adding an estimated $180 billion to global infrastructure costs over 18 months and driving a 340% increase in regional data center construction.',
      'AWS, Azure, and Google Cloud have committed over $120 billion to new regional infrastructure, with cities like Nairobi, Jakarta, and São Paulo emerging as cloud hubs for AI companies and fintech startups needing local processing.',
      'Companies are now deploying across three or more cloud providers routinely for compliance, creating a more distributed but less efficient global cloud architecture that may prove more resilient and economically inclusive.'
    ],
    'platform-liability': [
      'New federal legislation has reclassified algorithmic recommendation systems as editorial curation, stripping platforms of Section 230-style protections and forcing them to publicly disclose how their algorithms rank and amplify content.',
      'AI moderation systems achieve approximately 89% accuracy — sounding high until applied to 2.1 billion daily moderation decisions, translating to hundreds of millions of false positives that sweep up legitimate political speech and journalism.',
      'A 34% increase in content removals since the law took effect has disproportionately impacted investigative journalism and political commentary, with 47 lawsuits already filed and first-amendment challenges in three federal circuits.'
    ],
    'antitrust': [
      'Five companies — Google, Microsoft, Meta, Amazon, and OpenAI — control approximately 80% of foundation model compute, triggering coordinated antitrust investigations across Washington, Brussels, London, and Tokyo simultaneously.',
      'The EU, US, UK, and Japan have formed a joint AI antitrust task force — the first in history for artificial intelligence — with proposed remedies including structural separation, mandatory licensing, and compute-sharing mandates.',
      'Companies are invoking national security and China competition as their primary defense, arguing that regulatory fragmentation would hand advantage to geopolitical rivals during a period of intense strategic competition.'
    ],
    'digital-identity': [
      'The EU\'s eIDAS 2.0 regulation will give 450 million citizens access to a Digital Identity Wallet by 2027 across all 27 member states, using zero-knowledge proofs to verify attributes without exposing underlying personal data.',
      'India\'s Aadhaar system has verified 1.3 billion people but expanded into de facto tracking infrastructure, while Singapore\'s SingPass is used by 97% of residents — showcasing both the promise and peril of digital identity at scale.',
      'The decentralized architecture chosen by the EU — with no central biometric database — represents a fundamental design decision that will determine whether digital identity systems become tools of empowerment or instruments of surveillance.'
    ],
    'cybersecurity': [
      'Ransomware attacks have surged 340% over the past two years, driving global compliance spending past $200 billion this year as governments shift from voluntary guidelines to hard mandates like the EU NIS2 Directive.',
      'The EU NIS2 Directive now requires zero-trust architectures and 24-hour incident reporting, while a US executive order mandates similar standards for federal agencies — fundamentally reshaping enterprise security requirements.',
      'With 3.5 million cybersecurity positions unfilled globally and the average breach cost exceeding $5.5 million, automation has become the only viable path forward for enterprises struggling to secure their infrastructure.'
    ],
    'google-opinion': [
      'Users under 30 now bypass Google Search for 65% of information queries in favor of AI assistants, threatening $180 billion in annual search ad revenue as AI overviews appear in 80%+ of queries and reduce click-through by 40%.',
      'Average search session duration has plummeted from 90 seconds to 22 seconds and news sites report traffic declines of 25-35% since the AI overview rollout, with an internal memo proposing complete search replacement by Q3 2028.',
      'Google is proposing to sacrifice short-term ad revenue for long-term survival — betting that being the best answer engine matters more than being the best ad platform — but the paradox is that users want quick answers yet also value serendipitous discovery.'
    ],
    'meta-opinion': [
      'Meta released Llama 4 completely open source, and it was downloaded 2.3 million times within 48 hours with 40% enterprise adoption within three months — mirroring the Android/Linux playbook of giving away the core to monetize the ecosystem.',
      'Meta\'s total AI investment reached $12 billion, but revenue from AI-powered advertising, cloud, and hardware increased 28% since the Llama 4 release, suggesting the open-source strategy is already paying financial dividends.',
      'Critics call it "the most irresponsible act in the history of artificial intelligence" while Meta\'s own safety team warned of "playing with fire" — if Llama 4 is traced to an AI catastrophe, it could trigger regulatory backlash for the entire industry.'
    ],
    'apple-opinion': [
      'Apple processes 89% of AI tasks entirely on-device — most never leave the phone — with the A18 Pro chip handling 35 trillion operations per second locally, running 10x faster and using 50x less energy than cloud equivalents.',
      'With 2 billion active Apple devices and an 18-month development cycle for Apple Intelligence, the company has built a privacy-first architecture where personal context never reaches Apple\'s servers, sidestepping many compliance challenges facing cloud AI.',
      'While competitors burn billions on cloud infrastructure, Apple is building within the physics constraints of processing, memory, battery, and privacy that produce superior consumer products — the revolution is already in your pocket.'
    ],
    'microsoft-opinion': [
      'Microsoft has committed $80 billion to AI infrastructure in 2026 alone, with Azure AI Services hosting over 70% of enterprise AI workloads and 400 million monthly active Copilot users making it the most widely deployed AI tool in history.',
      'Copilot is now embedded across Word, Excel, PowerPoint, Outlook, Teams, GitHub, Windows, and Azure, with enterprise contracts increasingly requiring multi-year Copilot licensing — creating deep integration lock-in.',
      'The strategy is brilliant but raises monopoly concerns: Microsoft\'s dominance comes from embedded distribution, not necessarily superior technology, and if AI adoption slows, the $80 billion bet becomes a massive financial drag.'
    ]
  };

  var fileMap = {
    'article-gpt5.html': 'gpt5',
    'article-ai-safety.html': 'ai-safety',
    'article-autonomous.html': 'autonomous',
    'ai-agents.html': 'ai-agents',
    'article-quantum.html': 'quantum',
    'article-eu-dma.html': 'eu-dma',
    'article-data-sovereignty.html': 'data-sovereignty',
    'article-platform-liability.html': 'platform-liability',
    'article-antitrust.html': 'antitrust',
    'article-digital-identity.html': 'digital-identity',
    'article-cybersecurity.html': 'cybersecurity',
    'opinion-google.html': 'google-opinion',
    'opinion-meta.html': 'meta-opinion',
    'opinion-apple.html': 'apple-opinion',
    'opinion-microsoft.html': 'microsoft-opinion'
  };

  function getSummaryKey() {
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1);
    if (fileMap[filename]) return fileMap[filename];
    if (!filename.endsWith('.html')) {
      return fileMap[filename + '.html'] || null;
    }
    return null;
  }

  function simulateTyping(element, callback) {
    var cursor = document.createElement('span');
    cursor.className = 'ai-typing-cursor';
    cursor.textContent = '▮';
    element.appendChild(cursor);

    var chars = 'Analyzing article content';
    var i = 0;
    var charInterval = setInterval(function () {
      if (i < chars.length) {
        cursor.before(document.createTextNode(chars.charAt(i)));
        i++;
      } else {
        clearInterval(charInterval);
        cursor.remove();
        setTimeout(callback, 400);
      }
    }, 28);
  }

  function createSummarizerUI() {
    var article = document.querySelector('article');
    if (!article) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'summarizer-wrap';
    wrapper.innerHTML =
      '<button class="summarize-btn" id="summarizeBtn">' +
        '<div class="summarize-btn__left">' +
          '<div class="summarize-btn__plate">' +
            '<svg class="summarize-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' +
            '</svg>' +
            '<svg class="summarize-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
              '<path d="M12 2a10 10 0 0 1 10 10"/>' +
            '</svg>' +
          '</div>' +
          '<div class="summarize-btn__label">' +
            '<span class="summarize-btn__label-main">Summarize with AI</span>' +
            '<span class="summarize-btn__label-sub">DeepSeek V4 · 3-bullet brief</span>' +
          '</div>' +
        '</div>' +
        '<svg class="summarize-btn__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M6 9l6 6 6-6"/>' +
        '</svg>' +
      '</button>' +
      '<div class="summarizer-output" id="summarizerOutput">' +
        '<div class="summarizer-output__inner">' +
          '<div class="summarizer-header">' +
            '<span class="summarizer-header__num">Nº 01</span>' +
            '<span>AI Brief</span>' +
            '<span class="summarizer-header__sep"></span>' +
            '<span class="summarizer-badge">DEEPSEEK V4</span>' +
          '</div>' +
          '<div class="summarizer-loading" id="summarizerLoading" style="display:none;">' +
            '<div class="summarizer-dots"><span></span><span></span><span></span></div>' +
            '<span class="loading-text" id="loadingText">Initializing model...</span>' +
          '</div>' +
          '<div class="summarizer-bullets" id="summarizerBullets"></div>' +
        '</div>' +
      '</div>';

    article.parentNode.insertBefore(wrapper, article);
  }

  function bindEvents() {
    var btn = document.getElementById('summarizeBtn');
    var output = document.getElementById('summarizerOutput');
    var loading = document.getElementById('summarizerLoading');
    var loadingText = document.getElementById('loadingText');
    var bullets = document.getElementById('summarizerBullets');

    if (!btn) return;

    btn.addEventListener('click', function () {
      if (btn.classList.contains('active')) {
        output.classList.remove('visible');
        btn.classList.remove('active');
        btn.disabled = false;
        return;
      }

      var key = getSummaryKey();
      if (!key || !summaries[key]) return;

      btn.classList.add('active');
      btn.disabled = true;
      output.classList.add('visible');
      loading.style.display = 'flex';
      bullets.innerHTML = '';
      bullets.classList.remove('visible');

      loadingText.textContent = 'Loading DeepSeek V4 Flash';

      setTimeout(function () { loadingText.textContent = 'Tokenizing article content'; }, 800);
      setTimeout(function () { loadingText.textContent = 'Generating summary'; }, 1800);
      setTimeout(function () { loadingText.textContent = 'Finalizing response'; }, 3200);

      setTimeout(function () {
        simulateTyping(loadingText, function () {
          loading.style.display = 'none';

          var lines = summaries[key];
          var html = '';
          lines.forEach(function (line, i) {
            html += '<div class="summarizer-bullet" style="animation-delay:' + (i * 0.18) + 's">' +
              '<span class="bullet-marker">' + String(i + 1).padStart(2, '0') + '</span>' +
              '<span class="bullet-text">' + line + '</span>' +
            '</div>';
          });
          bullets.innerHTML = html;
          bullets.classList.add('visible');
          btn.disabled = false;
        });
      }, 3800);
    });
  }

  // Inject modal CSS for subscribe (kept scoped to summarizer for separation)
  function injectModalCSS() {
    if (document.getElementById('modal-styles')) return;
    var s = document.createElement('style');
    s.id = 'modal-styles';
    s.textContent = '' +
      '#subscribe-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s;}' +
      '#subscribe-modal.visible{opacity:1;}' +
      '.modal-backdrop{position:absolute;inset:0;background:rgba(10,9,8,0.85);backdrop-filter:blur(8px);}' +
      '.modal-box{position:relative;background:var(--surface);border:1px solid var(--hairline-bright);padding:48px;max-width:480px;width:calc(100% - 32px);position:relative;}' +
      '.modal-box::before,.modal-box::after{content:"";position:absolute;width:18px;height:18px;border-color:var(--copper);}' +
      '.modal-box::before{top:-1px;left:-1px;border-top:1px solid;border-left:1px solid;}' +
      '.modal-box::after{bottom:-1px;right:-1px;border-bottom:1px solid;border-right:1px solid;}' +
      '.modal-close{position:absolute;top:16px;right:16px;width:28px;height:28px;background:transparent;border:1px solid var(--hairline);color:var(--text-2);font-size:14px;display:flex;align-items:center;justify-content:center;transition:border-color 0.3s,color 0.3s;}' +
      '.modal-close:hover{border-color:var(--copper);color:var(--copper);}' +
      '.modal-plate{font-family:var(--font-mono);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:var(--copper);margin-bottom:20px;display:flex;align-items:center;gap:12px;}' +
      '.modal-plate::after{content:"";flex:1;height:1px;background:var(--hairline-bright);}' +
      '.modal-title{font-family:var(--font-display);font-weight:500;font-variation-settings:"opsz" 144,"SOFT" 50,"WONK" 1;font-size:40px;letter-spacing:-0.025em;line-height:1;color:var(--text-on-paper);margin-bottom:12px;}' +
      '.modal-title span{color:var(--copper);font-style:italic;}' +
      '.modal-deck{font-size:14px;line-height:1.6;color:var(--text-2);margin-bottom:28px;font-weight:300;}' +
      '.modal-form{display:flex;gap:8px;margin-bottom:16px;}' +
      '.modal-form input{flex:1;background:var(--ink);border:1px solid var(--hairline);padding:12px 14px;font-size:14px;color:var(--text-on-paper);font-family:var(--font-body);outline:none;}' +
      '.modal-form input:focus{border-color:var(--copper);}' +
      '.modal-form button{background:var(--copper);color:var(--ink);border:none;padding:12px 20px;font-family:var(--font-mono);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;cursor:pointer;transition:background 0.3s;}' +
      '.modal-form button:hover{background:var(--brass);}' +
      '.modal-foot{font-family:var(--font-mono);font-size:9.5px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-3);}';
    document.head.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectModalCSS();
    createSummarizerUI();
    bindEvents();
  });
})();
