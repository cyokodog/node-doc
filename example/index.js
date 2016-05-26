const fs = require('fs-extra');
const Doc = require(__dirname + '/../lib/Doc');
const doc = new Doc();

doc.parse({
  srcDoc: fs.readFileSync(__dirname + '/doc.md', 'utf-8')
});

doc.render({
  template: fs.readFileSync(__dirname + '/theme/template.html', 'utf-8'),
  templatePath: __dirname + '/theme'
});

console.log('[result]', doc.getHtml());