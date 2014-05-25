/**
 * Anchors <https://github.com/jonschlinkert/anchors>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */


var file = require('fs-utils');
var cheerio = require('cheerio');
var _ = require('lodash');


function Scripts(html) {
  this.$ = cheerio.load(html);
  this.orig = html;

  this._attributes = [];
  this._block = [];
  this._src = [];
}


Scripts.prototype.attributes = function (html) {
  var $ = cheerio.load(html);
  var attributes = this._attributes;

  $('script').each(function (i, elem) {
    var attr = [];
    attributes.push({attribs: elem.attribs});
  });

  this._attributes = attributes.filter(Boolean);
  return attributes;
};

Scripts.prototype.src = function () {
  var $ = this.$;
  var src = this._src;

  $('script').filter(function (i, elem) {
    src.push($(this).attr('src'));
  });

  this._src = src.filter(Boolean);
  return this._src;
};

Scripts.prototype.block = function () {
  var $ = this.$;
  var block = this._block;

  $('script').filter(function (i, elem) {
    block.push($(this).html());
  });

  this._block = block.filter(Boolean);
  return this._block;
};


Scripts.prototype.removeScriptTags = function (html) {
  var $ = cheerio.load(html);

  $('script').filter(function (i, elem) {
    return $(this).attr('src') != null;
  }).remove();

  return $.html();
};


Scripts.prototype.removeScriptBlocks = function (html) {
  var $ = cheerio.load(html);

  $('script').filter(function (i, elem) {
    return $(this).text().length !== 0;
  }).remove();

  return $.html();
};

var createTag = Scripts.prototype.createTag = function (arr) {
  return arr.map(function(content) {
    return '<script src="' + content + '"></script>';
  }).join('\n');
};

var createBlock = Scripts.prototype.createBlock = function (arr) {
  return '<script>\n' + arr.map(function(content) {
    return content;
  }).join('\n') + '\n</script>\n';
};


Scripts.prototype.consolidateSrc = function (html) {
  var scripts = createTag(this.src());
  var sanitized = this.removeScriptTags(html);
  var $ = cheerio.load(sanitized);

  $('body').append(scripts).html();
  return $.html();
};


Scripts.prototype.consolidateBlocks = function (html) {
  var scripts = _.unescape(createBlock(this.block()));
  var sanitized = this.removeScriptBlocks(html);
  var $ = cheerio.load(sanitized);
  console.log(scripts)

  $('body').append(_.unescape(scripts));
  return $.html();
};



module.exports = Scripts;