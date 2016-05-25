"use strict";

/**
 * ドキュメントソースの解析結果を管理する
 */
class DocsInfo {
  constructor (){
    Object.assign(this, {
      index: {},    // front-matterのヘッダ部の解析結果
      markdown: '', // front-matterのボディ部の解析結果      
      contents: '', // markedによる変換結果
      html: '',     // テンプレートエンジンによる変換結果
      data: {}      // 拡張データ
    });
  }
}

const matter = require('front-matter');
const marked = require('marked');
const ejs = require('ejs');
const fs = require('fs-extra');

/**
 * ドキュメントソースの解析とテンプレートエンジンによるレンダリングを行う
 */
class Docs {

  constructor (params){
    this.config = Object.assign({
      srcDoc: '',
      template: '',
      templatePath: ''
    }, params);
  }

  /**
   * 指定されたドキュメントソースから情報を抜き出す
   */
  parse (params){
    const config = Object.assign(this.config, params);
    if( !config.srcDoc ) throw new Error('Docs.parse: srcDocが指定されてません');

    const info = this.info = new DocsInfo();

    const result = matter( config.srcDoc );
    
    Object.assign(info.index, result.attribute);

    info.markdown = result.body;

    info.contents = marked(result.body);

    return this;
  }

  /**
   * 指定されたテンプレートで変換する
   */
  render (params){
    const config = Object.assign(this.config, params);
    if( !config.template ) throw new Error('Docs.render: templateが指定されてません');
    if( !this.info ) throw new Error('Docs.render: Docs.parseが実行されてません');

    const info = this.info;

    info.html = ejs.render(config.template, Object.assign({}, info, {
      _include: function( filePath ){
        if( !config.templatePath ) throw new Error('Docs.render: templatePathが指定されてないため_includeを実行できません');
        var html = fs.readFileSync(config.templatePath + '/' + filePath, 'utf-8');
        return ejs.render(html, this);
      }
    })); 
  }

  /**
   * DocsInfo.indexを返す
   */
  getIndex (){
    return this.info.index;
  }
  
  /**
   * DocsInfo.htmlを返す
   */
  getHtml (){
    return this.info.html;
  }

  /**
   * DocsInfo.dataを返す
   */
  getData (){
    return this.info.data;
  }

}

module.exports = Docs;
