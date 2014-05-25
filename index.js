/*!
 * consolidate-scripts <https://github.com/jonschlinkert/consolidate-scripts>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

var Handlebars = require('handlebars');
var cheerio = require('cheerio');
var _ = require('lodash');


function attributes(attr) {
  if (attr) {
    return Object.keys(attr).map(function (key) {
      return ' ' + key + '="' + attr[key] + '"';
    }).join(' ');
  }
}

var unescape = function(str) {
  str = str.replace(/&apos;/g, '\'');
  return _.unescape(str);
};


Handlebars.registerHelper('addTags', function (context) {
  var tags = context.map(function(obj) {
    var attrs = attributes(obj.attr);
    var html = obj.html || '';
    return '\n<script' + unescape(attrs) + '>' + unescape(html) + '</script>';
  }).join('');
  return new Handlebars.SafeString(tags);
});

module.exports = function (html) {
  var $ = cheerio.load(html);
  var context = {};
  var tags = [];

  $('script').filter(function (i, elem) {
    tags.push({
      src: $(this).attr('src'),
      attr: elem.attribs,
      html: $(this).html()
    });
  });

  $('body').append('\n{{addTags tags}}');

  // Compact the array
  context.tags = tags.filter(Boolean);

  // Strip script tags with `src`
  $('script').filter(function () {
    return $(this).attr('src') != null;
  }).remove();

  // Strip script tags with inner content
  $('script').filter(function () {
    return $(this).text().length !== 0;
  }).remove();

  var template = Handlebars.compile($.html());
  return template(context);
};