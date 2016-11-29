"use strict";

const frontMatter = require('front-matter');
const marked = require('marked');
const ejs = require('ejs');
const fs = require('fs-extra');

/**
 * ドキュメントソースの解析とテンプレートエンジンによるレンダリングを行う
 */
class Doc {

  /**
   * constructorではパラメータを受け取るのみ
   *
   * @param {object} params 詳細はsetParams参照
   */
  constructor (params){

    this.setParams(params);

  }

  /**
   * パラメータをセットする
   *
   * @param {object} params: {
   *  markdown: '', // ドキュメントのmarkdown
   *  template: '', // markdownを変換して得たhtmlの埋め込み先となるtemplate
   *  templateBasePath: '' // templateの置かれてるbasePath(他パーツのincludeする際参照する)
   *  data: {}, // template変換時に利用したいデータを設定する
   *  renderOption: {} // template変換時に利用したいメソッドを設定する
   * }
   */
  setParams (params){
    var config;

    const defaultParams = {
      markdown: '',
      template: '',
      templateBasePath: '',
      data: {},
      renderOption: {
        $include: (filePath, params) => {
          if( !config.templateBasePath ) throw new Error('no required parameter (markdown) !');
          const html = fs.readFileSync(config.templateBasePath + '/' + filePath, 'utf-8');
          return ejs.render(html, Object.assign(this, params));
        },
        $if: (bool, text) => bool ? text : '',
        $getConfig: () => config
      }
    };

    if(params && params.renderOption){
      Object.assign(params.renderOption, defaultParams.renderOption);
    }

    config = this.config = Object.assign( this.config || defaultParams, params);
  }

  /**
   * markdownを解析し各種データを得る
   *
   * @param {object} params 詳細はsetParams参照
   */
  parse (params){

    this.setParams(params);

    const config = this.config;

    if( !config.markdown ) throw new Error('no required parameter (markdown) !');

    const result = this.result = frontMatter( config.markdown );

    // プロパティ名を補正する
    result.attr = result.attributes;
    delete result.attributes;

    result.markdownBody = result.body;
    delete result.body;

    result.contents = marked(result.markdownBody);

    return result;
  }

  /**
   * parse()結果を元にテンプレートエンジンによるレンダリングを行う
   *
   * @param {object} params 詳細はsetParams参照
   */
  render (params){

    this.setParams(params);

    const config = this.config;

    // 未parse()状態ならparse()する
    if(!this.result){
      this.parse(params);
    }

    if( !config.template ) throw new Error('no required parameter (template) !');

    var option = Object.assign({}, this.result, {data: config.data}, config.renderOption);

    return ejs.render(this.config.template, option);

  }

  getConfig (){
    return this.config;
  }

}
module.exports = Doc;
