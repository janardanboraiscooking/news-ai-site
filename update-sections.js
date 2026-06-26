/**
 * Update section pages — insert generated articles AFTER original story grid, BEFORE footer.
 */
const fs = require('fs');
const path = require('path');

const articles = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf8'));
const catMap = {
  'Research': 'ai', 'Models': 'ai', 'Open Source': 'ai', 'Tools': 'ai',
  'Industry': 'tech', 'Startups': 'tech',
  'Regulation': 'policy', 'Policy': 'policy',
};

function storyCard(article, index) {
  const date = article.date ? new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent';
  const readTime = Math.max(3, Math.floor((article.summary || '').split(' ').length / 25));
  return `          <a href="news/${article.slug}.html" class="story-card tilt-host" data-reveal="fade-up" data-delay="${(index % 6) + 1}" data-cursor="hover">
            <div class="story-card__plate">
              <span class="story-card__plate-cat">${article.category}</span>
              <span class="story-card__plate-num">Nº ${String(index + 1).padStart(2, '0')}</span>
            </div>
            <div class="story-card__body">
              <h3 class="story-card__title">${article.title}</h3>
              <div class="story-card__meta">
                <span>${article.source}</span>
                <span class="dot">◆</span>
                <span>${date}</span>
                <span class="dot">◆</span>
                <span>${readTime} min</span>
              </div>
            </div>
          </a>`;
}

const sections = ['ai', 'tech', 'policy'];
sections.forEach(section => {
  const filePath = path.join(__dirname, section + '.html');
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove any previously injected generated articles (between original grid and footer)
  const footerIdx = content.indexOf('<footer');
  if (footerIdx === -1) return;

  const beforeFooter = content.substring(0, footerIdx);
  const footerAndRest = content.substring(footerIdx);

  // Get articles for this section
  const sectionArticles = articles.filter(a => (catMap[a.category] || 'tech') === section);
  console.log(`${section}.html: ${sectionArticles.length} articles`);

  // Build the new section with generated articles
  const newCards = sectionArticles.map((a, i) => storyCard(a, i + 16)).join('\n');
  const newSection = `
  <header class="section-head" data-plate="Nº 05 · Wire" data-reveal="fade-up" style="margin-top:80px;">
    <h2 class="section-head__title">From the Wire</h2>
    <div class="section-head__sub">${sectionArticles.length} stories from the API</div>
  </header>

  <div class="story-grid story-grid--3col" data-stagger style="margin-bottom:80px;">
${newCards}
  </div>
`;

  // Insert before footer
  const updated = beforeFooter + '\n' + newSection + footerAndRest;
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`  Updated: ${section}.html`);
});

// Update index.html — add "Latest from the Wire" before footer
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
const indexFooterIdx = indexContent.indexOf('<footer');
if (indexFooterIdx !== -1) {
  const indexBefore = indexContent.substring(0, indexFooterIdx);
  const indexFooter = indexContent.substring(indexFooterIdx);

  // Remove old "Latest from the Wire" section if it exists
  const cleanBefore = indexBefore.replace(/\n  <section class="story-section"[\s\S]*?<\/section>\n/g, '\n');

  const latestSection = `
  <header class="section-head" data-plate="Nº 05 · Wire" data-reveal="fade-up" style="margin-top:80px;">
    <h2 class="section-head__title">Latest from the Wire</h2>
    <div class="section-head__sub">${articles.length} stories</div>
  </header>

  <div class="story-grid story-grid--3col" data-stagger style="max-width:1200px;margin:32px auto 80px;padding:0 32px;">
${articles.slice(0, 12).map((a, i) => storyCard(a, i)).join('\n')}
  </div>

  <div style="text-align:center;margin-bottom:80px;" data-reveal="fade-up">
    <a href="ai.html" class="subscribe-cta" style="display:inline-flex;text-decoration:none;font-size:11px;">
      <span>View All ${articles.length} Stories →</span>
    </a>
  </div>
`;
  fs.writeFileSync(indexPath, cleanBefore + '\n' + latestSection + indexFooter, 'utf8');
  console.log(`index.html: Updated "Latest from the Wire"`);
}

console.log('Done!');
