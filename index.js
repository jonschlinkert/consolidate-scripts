/**
 * Anchors <https://github.com/jonschlinkert/anchors>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */


var file = require('fs-utils');
var cheerio = require('cheerio');
var _ = require('lodash');


var createTag = function (arr) {
  return arr.map(function(content) {
    if (content.src) {
      return '\n<script src="' + content.src + '"></script>';
    }
  }).join('');
};

var filterBlocks = function(arr) {
  return arr.filter(function(content) {
    return content.html.length;
  })
};

var createBlock = function (arr) {
  arr = filterBlocks(arr);
  return '\n<script>\n' + arr.map(function(content) {
    return content.html;
  }).join('\n') + '\n</script>\n';
};


module.exports = function (html) {
  var orig = html;
  var $ = cheerio.load(html);

  var tags = [];

  $('script').filter(function (i, elem) {
    tags.push({
      src: $(this).attr('src'),
      attr: elem.attribs,
      html: $(this).html()
    });
  });

  $('body').append('{{scripts}}');

  // Compact the array
  tags = tags.filter(Boolean);

  // Strip script tags with `src`
  $('script').filter(function (i, elem) {
    return $(this).attr('src') != null;
  }).remove();

  // Strip script tags with inner content
  $('script').filter(function (i, elem) {
    return $(this).text().length !== 0;
  }).remove();

  var addBlocks = _.unescape(createBlock(tags));
  var addScripts = _.unescape(createTag(tags));
  $('body').append(_.unescape(addScripts));
  $('body').append(_.unescape(addBlocks));

  return $.html();
};