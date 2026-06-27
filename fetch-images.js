/**
 * Fetch hero images from Pexels API for each article.
 * Usage: PEXELS_API_KEY=your_key node fetch-images.js
 * Saves image URLs to images.json for the article generator.
 */
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim();
    if (t && !t.startsWith('#') && t.includes('=')) {
      const [k, ...v] = t.split('=');
      process.env[k.trim()] = v.join('=').trim();
    }
  });
}

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error('ERROR: Set PEXELS_API_KEY in .env file');
  console.error('Get a free key at: https://www.pexels.com/api/');
  process.exit(1);
}

const articles = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf8'));
const imagesPath = path.join(__dirname, 'images.json');

// Load existing images to avoid re-fetching
let existing = {};
if (fs.existsSync(imagesPath)) {
  existing = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));
}

function extractKeywords(title) {
  // Remove common filler words and extract key terms
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'its', 'it', 'he', 'she', 'they', 'we', 'you', 'i', 'me', 'my', 'your', 'his', 'her', 'our', 'their', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom']);
  const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  // Take top 3-4 keywords
  return words.slice(0, 4).join(' ');
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchImage(keyword) {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape&size=medium`;
    const res = await fetch(url, {
      headers: { 'Authorization': API_KEY }
    });
    if (!res.ok) {
      console.warn(`  Pexels ${res.status} for "${keyword}"`);
      return null;
    }
    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      return {
        url: photo.src.large,
        photographer: photo.photographer,
        photographer_url: photo.photographer_url,
        alt: photo.alt || keyword
      };
    }
    return null;
  } catch (err) {
    console.warn(`  Fetch error for "${keyword}":`, err.message);
    return null;
  }
}

async function main() {
  console.log(`Fetching images for ${articles.length} articles...`);
  console.log(`Already have ${Object.keys(existing).length} cached images\n`);

  let fetched = 0;
  let cached = 0;
  let failed = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const slug = article.slug || `article-${i}`;

    if (existing[slug]) {
      cached++;
      continue;
    }

    const keywords = extractKeywords(article.title);
    process.stdout.write(`  [${i + 1}/${articles.length}] "${keywords}"... `);

    const image = await fetchImage(keywords);
    if (image) {
      existing[slug] = image;
      fetched++;
      console.log(`OK (${image.photographer})`);
    } else {
      failed++;
      console.log('no result');
    }

    // Rate limit: Pexels allows 200 req/hr ≈ 1 req every 18s, but we can go faster for short bursts
    await sleep(250);

    // Save every 10 articles
    if ((fetched + cached) % 10 === 0) {
      fs.writeFileSync(imagesPath, JSON.stringify(existing, null, 2), 'utf8');
    }
  }

  // Final save
  fs.writeFileSync(imagesPath, JSON.stringify(existing, null, 2), 'utf8');
  console.log(`\nDone! ${fetched} fetched, ${cached} cached, ${failed} failed`);
  console.log(`Saved to images.json`);
}

main().catch(console.error);
