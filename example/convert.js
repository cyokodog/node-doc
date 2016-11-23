const fs = require('fs-extra');
const Doc = require(__dirname + '/../lib/Doc');

const parseParams = {
  markdown: fs.readFileSync(__dirname + '/doc.md', 'utf-8'),
  data: {
    foo: 'FOO',
    bar: 'BAR'
  },
  renderOption: {
    tag: (tag, text) => `<${tag}>${text}</${tag}>`
  }
};

const renderParams = {
  template: fs.readFileSync(__dirname + '/theme/template.html', 'utf-8'),
  templateBasePath: __dirname + '/theme'
};

const doc = new Doc();

const parseResult = doc.parse(parseParams);

const html = doc.render(renderParams);

console.log(html);

console.log(doc.getConfig());

//
// or
//
// const allParams = Object.assign({}, parseParams, renderParams);
// const doc = new Doc(allParams);
// const parseResult = doc.parse();
// const html = doc.render();
//
// or
//
// const doc = new Doc();
// const parseResult = doc.parse(allParams);
// const html = doc.render();
//
// or
//
// const doc = new Doc();
// doc.setParams(allParams);
// const parseResult = doc.parse();
// const html = doc.render();
//
// or
//
// const doc = new Doc();
// const html = doc.render(allParams);
