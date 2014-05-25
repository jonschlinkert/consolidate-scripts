/**
 * Anchors <https://github.com/jonschlinkert/anchors>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */


var file = require('fs-utils');
var cheerio = require('cheerio');
var _ = require('lodash');
var str = file.readFileSync('test/fixtures/index.html')


var getAttributes = function (str) {
  var attributes = [];
  $ = cheerio.load(str);

  $('script').each(function (i, elem) {
    var attr = [];
    attributes.push({attribs: elem.attribs});
  });
  return attributes;
};


console.log(getAttributes(str));

// extract()

var extractScriptSrc = function(str) {
  var $ = cheerio.load(str);
  var scripts = [];

  $('script').filter(function(i, el) {
    scripts.push($(this).attr('src'));
  });

  return _.compact(scripts);
};


var extractScriptBlock = function(str) {
  var $ = cheerio.load(str);
  var scripts = [];

  $('script').filter(function(i, el) {
    scripts.push($(this).html());
  });

  return _.compact(scripts);
};

var removeScripts = function(str, type) {
  var $ = cheerio.load(str);

  if (type === 'src') {
    $('script').filter(function(i, el) {
      return $(this).attr('src') !== undefined;
    }).remove();
  } else if (type === 'block') {
    $('script').filter(function(i, el) {
      return $(this).text().length !== 0;
    }).remove();
  }

  return $.html();
};

var createScripts = function(src, type) {
  src = !Array.isArray(src) ? [src] : src;

  if (type === 'src') {
    return src.map(function(content) {
      return '<script src="' + content + '"></script>';
    }).join('\n');
  } else if (type === 'block') {
    return '<script>\n' + src.map(function(content) {
      return content;
    }).join('\n') + '\n</script>';
  }
};


var consolidateSrcScripts = function(str) {
  var scriptsArray = extractScriptSrc(str);
  var scripts = createScripts(scriptsArray, 'src');
  var sanitized = removeScripts(str, 'src');

  var $ = cheerio.load(sanitized);
  var placeholder = $('script#insert').append(scripts);
  var html = $.html();

  return html.replace(placeholder, scripts);

};

var consolidateBlockScripts = function(str) {
  var scriptsArray = extractScriptBlock(str);
  var scripts = createScripts(scriptsArray, 'block');
  var sanitized = removeScripts(str, 'block');

  var $ = cheerio.load(sanitized);
  var placeholder = $.html($('script#insert'));
  var html = $.html();

  return html.replace(placeholder, scripts);

};

file.writeFileSync('test/actual/index.html', consolidateBlockScripts(str));