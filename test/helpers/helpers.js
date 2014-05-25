const path = require('path');
const fs = require('fs-utils');
const Scripts = require('../..');


exports.readFixtures = function(src) {
  var files = fs.expand(src, {filter: 'isFile'});

  return files.map(function(filepath) {
    var basename = path.basename(filepath);
    var content = fs.readFileSync(filepath);
    var html = new Scripts(content);
    var result = html.consolidateBlocks(content);

    exports.writeExample('test/actual/' + basename, result);
    return result;
  }).join('\n');
};


/**
 * Write example file
 *
 * @param   {String}  `dest` The destination.
 * @param   {String}  `str` The string to write.
 * @return  {String}
 */

exports.writeExample = function(dest, str) {
  fs.writeFileSync(dest, str);
};