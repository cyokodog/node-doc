const fs = require('fs-extra');
const Docs = require(__dirname + '/../lib/Docs');
const docs = new Docs();

docs.parse({
  srcDoc: fs.readFileSync(__dirname + '/doc.md', 'utf-8')
});

docs.render({
  template: fs.readFileSync(__dirname + '/theme/template.html', 'utf-8'),
  templatePath: __dirname + '/theme'
});

console.log('[result]', docs.getHtml());


