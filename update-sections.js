/**
 * Update section pages to link to all 100 generated articles
 */
const fs = require('fs');
const path = require('path');

const articles = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf8'));
const catMap = {
  'Research': 'ai', 'Models': 'ai', 'Open Source': 'ai', 'Tools': 'ai',
  'Industry': 'tech', 'Startups': 'tech',
  'Regulation': 'policy', 'Policy': 'policy',
};

const AD_CLIENT = 'ca-pub-8916809584235685';
const AD_SLOT = '5226798173';

// Generate story card HTML for an article
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

// Process each section page
const sections = ['ai', 'tech', 'policy'];
sections.forEach(section => {
  const filePath = path.join(__dirname, section + '.html');
  let content = fs.readFileSync(filePath, 'utf8');

  // Get articles for this section
  const sectionArticles = articles.filter(a => {
    const s = catMap[a.category] || 'tech';
    return s === section;
  });

  console.log(`${section}.html: ${sectionArticles.length} articles to add`);

  // Find where to insert (before the last story grid closing or before footer)
  // Strategy: find the last </div> before </footer> that closes a story-grid
  // Insert new cards right before the footer

  const footerIndex = content.indexOf('</footer>');
  if (footerIndex === -1) {
    console.log(`  WARNING: No footer found in ${section}.html`);
    return;
  }

  // Build new cards HTML
  const newCards = sectionArticles.map((a, i) => storyCard(a, i + 16)).join('\n');

  // Insert before footer
  const beforeFooter = content.substring(0, footerIndex);
  const afterFooter = content.substring(footerIndex);

  // Find the last story card's closing </a> before footer
  const lastCardEnd = beforeFooter.lastIndexOf('</a>');
  if (lastCardEnd === -1) {
    console.log(`  WARNING: No story cards found in ${section}.html`);
    return;
  }

  // Insert after the last card
  const insertPoint = lastCardEnd + 4; // after </a>
  const updated = beforeFooter.substring(0, insertPoint) + '\n' + newCards + '\n' + beforeFooter.substring(insertPoint) + afterFooter;

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`  Updated: ${section}.html (${sectionArticles.length} cards added)`);
});

// Also update index.html with a section linking to news/
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
const indexFooterIdx = indexContent.indexOf('</footer>');
if (indexFooterIdx !== -1) {
  // Add a "Latest from the Wire" section before footer
  const latestSection = `
  <section class="story-section" style="max-width:1200px;margin:80px auto;padding:0 32px;">
    <div class="story-section__head" data-reveal="fade-up">
      <span class="story-section__label">LATEST FROM THE WIRE</span>
      <span class="story-section__sep"></span>
      <span class="story-section__count">${articles.length} stories</span>
    </div>
    <div class="story-grid" style="margin-top:32px;">
${articles.slice(0, 12).map((a, i) => storyCard(a, i)).join('\n')}
    </div>
    <div style="text-align:center;margin-top:40px;" data-reveal="fade-up">
      <a href="ai.html" class="subscribe-cta" style="display:inline-flex;text-decoration:none;font-size:11px;">
        <span>View All ${articles.length} Stories →</span>
      </a>
    </div>
  </section>
`;
  indexContent = indexContent.substring(0, indexFooterIdx) + latestSection + '\n' + indexContent.substring(indexFooterIdx);
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log(`index.html: Added "Latest from the Wire" section with 12 cards`);
}

console.log('Done!');
