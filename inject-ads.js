/**
 * Inject Adsterra ads into all HTML files:
 * 1. Native banner — after the top ad banner
 * 2. Popunder — before </body>
 */
const fs = require('fs');
const path = require('path');

const NATIVE_BANNER = `<script async="async" data-cfasync="false" src="https://pl30085535.effectivecpmnetwork.com/f1ba05d1a430c440ab2bd9ad3c40ae53/invoke.js"></script>
<div id="container-f1ba05d1a430c440ab2bd9ad3c40ae53"></div>`;

const POPUNDER = `<script src="https://pl30085536.effectivecpmnetwork.com/97/89/1c/97891c11c1acec8c45cf1c918915c1a3.js"></script>`;

const htmlFiles = [];
function findHtml(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
    const fp = path.join(dir, d.name);
    if (d.isDirectory() && !['node_modules', '.git'].includes(d.name)) findHtml(fp);
    else if (d.isFile() && d.name.endsWith('.html')) htmlFiles.push(fp);
  });
}
findHtml(__dirname);

let updated = 0;
htmlFiles.forEach(fp => {
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // 1. Popunder before </body> (if not already added)
  if (!content.includes('pl30085536.effectivecpmnetwork')) {
    content = content.replace('</body>', POPUNDER + '\n</body>');
    changed = true;
  }

  // 2. Native banner after top-banner div (if not already added)
  if (!content.includes('pl30085535.effectivecpmnetwork')) {
    const marker = 'data-full-width-responsive="true"></ins>';
    const idx = content.indexOf(marker);
    if (idx !== -1) {
      const insertAt = content.indexOf('</div>', idx + marker.length) + 6;
      const snippet = '\n  <div style="max-width:728px;margin:0 auto 24px;" data-reveal="fade-up">' + NATIVE_BANNER + '</div>';
      content = content.slice(0, insertAt) + snippet + content.slice(insertAt);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
    updated++;
  }
});

console.log(updated + ' files updated with Adsterra ads');
