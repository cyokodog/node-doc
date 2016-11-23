# Node Doc

## setup

```javascript
npm i
```
## example

### doc.md

```
---
title: "Node Doc Example"
date: "2016-01-01"
auther: "cyokodog"
---

## What is Lorem Ipsum?

Lorem Ipsum is simply dummy text of the printing and typesetting industry.

## Why do we use it?

It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
```

### theme/template.html

```
<%- $include('partials/header.html') %>

<h1><%= attr.title %></h1>
<ul>
  <li><%= attr.date %></li>
  <li><%= attr.auther %></li>
</ul>

<%- contents %>

<hr/>

<h2>Original Markdown</h2>

<pre>
<%- markdownBody %>
</pre>

<h2>Data</h2>
<% const keyLength = Object.keys(data).length; %>
<%- $if(keyLength, tag('p', `data count is ${keyLength}`)) %>
<ul>
<% for(var i in data){ %>
<%- tag('li', `${i} value is ${data[i]}`) %>
<% } %>
</ul>

<%- $include('partials/footer.html') %>
```

### theme/paartials/header.html

```
<!doctype>
<html>
<body>
  <div class="header">
    header area
  </div>
  <div class="body">
```

### theme/paartials/footer.html

```
  </div>
  <div class="footer">
    footer area
  </div>
</body>
</html>
```
### convert.js

```
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
```

### convert

```
node convert
```

### result

```
<!doctype>
<html>
<body>
  <div class="header">
    header area
  </div>
  <div class="body">


<h1>Node Doc Example</h1>
<ul>
  <li>2016-01-01</li>
  <li>cyokodog</li>
</ul>

<h2 id="what-is-lorem-ipsum-">What is Lorem Ipsum?</h2>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
<h2 id="why-do-we-use-it-">Why do we use it?</h2>
<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </p>


<hr/>

<h2>Original Markdown</h2>

<pre>

## What is Lorem Ipsum?

Lorem Ipsum is simply dummy text of the printing and typesetting industry.

## Why do we use it?

It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 

</pre>

<h2>Data</h2>

<p>data count is 2</p>
<ul>

<li>foo value is FOO</li>

<li>bar value is BAR</li>

</ul>

  </div>
  <div class="footer">
    footer area
  </div>
</body>
</html>
```
