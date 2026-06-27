const fs = require('fs');
const path = require('path');

const tag = '<meta name="google-site-verification" content="09gYlZtmtmhkcQdKmCUz4ERuYbJiYhG_EcRQgYtuh6U">';
const htmlFiles = [];

function find(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
    const fp = path.join(dir, d.name);
    if (d.isDirectory() && !['node_modules', '.git'].includes(d.name)) find(fp);
    else if (d.isFile() && d.name.endsWith('.html')) htmlFiles.push(fp);
  });
}

find(__dirname);

let count = 0;
htmlFiles.forEach(fp => {
  let c = fs.readFileSync(fp, 'utf8');
  if (!c.includes('google-site-verification')) {
    c = c.replace('</head>', '  ' + tag + '\n</head>');
    fs.writeFileSync(fp, c, 'utf8');
    count++;
  }
});

console.log(count + ' files updated');
