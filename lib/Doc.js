"use strict";

/**
 * ドキュメントソースの解析結果を管理する
 */
class DocInfo {
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
class Doc {

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
    if( !config.srcDoc ) throw new Error('Doc.parse: srcDocが指定されてません');

    const info = this.info = new DocInfo();

    const result = matter( config.srcDoc );
    
    Object.assign(info.index, result.attributes);

    info.markdown = result.body;

    info.contents = marked(result.body);

    return this;
  }

  /**
   * 指定されたテンプレートで変換する
   */
  render (params){
    const config = Object.assign(this.config, params);
    if( !config.template ) throw new Error('Doc.render: templateが指定されてません');
    if( !this.info ) throw new Error('Doc.render: Doc.parseが実行されてません');

    const info = this.info;

    info.html = ejs.render(config.template, Object.assign({}, info, {

      _include: function(filePath, params){
        if( !config.templatePath ) throw new Error('Doc.render: templatePathが指定されてないため_includeを実行できません');
        var html = fs.readFileSync(config.templatePath + '/' + filePath, 'utf-8');
        return ejs.render(html, Object.assign(this, params));
      },

      _if: function (bool, text) {
        return bool ? text : '';    
      }

    })); 
    
    return this;
  }

  /**
   * DocInfo.indexを返す
   */
  getIndex (){
    return this.info.index;
  }
  
  /**
   * DocInfo.htmlを返す
   */
  getHtml (){
    return this.info.html;
  }

  /**
   * DocInfo.dataを返す
   */
  getData (){
    return this.info.data;
  }

}

module.exports = Doc;
