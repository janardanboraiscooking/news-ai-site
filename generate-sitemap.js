const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://newslumen.vercel.app';
const today = new Date().toISOString().split('T')[0];

const urls = [];

// Static pages
const staticPages = ['index.html', 'ai.html', 'tech.html', 'policy.html', 'opinion.html', 'contact.html', 'privacy.html', 'terms.html'];
staticPages.forEach(p => {
  urls.push({ loc: `${BASE_URL}/${p}`, priority: p === 'index.html' ? '1.0' : '0.8', changefreq: 'daily' });
});

// Original articles
const articleDirs = ['ai-articles', 'tech-articles', 'policy-articles', 'opinion-articles'];
articleDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) return;
  fs.readdirSync(dirPath).filter(f => f.endsWith('.html')).forEach(f => {
    urls.push({ loc: `${BASE_URL}/${dir}/${f}`, priority: '0.7', changefreq: 'weekly' });
  });
});

// 100 generated news articles
const newsDir = path.join(__dirname, 'news');
if (fs.existsSync(newsDir)) {
  fs.readdirSync(newsDir).filter(f => f.endsWith('.html')).forEach(f => {
    urls.push({ loc: `${BASE_URL}/news/${f}`, priority: '0.6', changefreq: 'weekly' });
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml created with ${urls.length} URLs`);
