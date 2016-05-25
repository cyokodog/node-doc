const fs = require('fs-extra');
const Docs = require('../lib/Docs');
const docs = new Docs();

docs.parse({
  srcDoc: fs.readFileSync('./doc.md', 'utf-8')
});

docs.render({
  template: fs.readFileSync('./theme/template.html', 'utf-8'),
  templatePath: './theme'
});

console.log('[result]', docs.getHtml());


