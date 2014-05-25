const expect = require('chai').expect;
const helpers = require('./helpers/helpers');
const scripts = require('..');

// TODO

describe('script-tags:', function () {
  var html = [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <title>Document</title>',
    '  <script src="bootstrap.js"></script>',
    '</head>',
    '<body>',
    '  Content',
    '</body>',
    '</html>'
  ].join('\n');

  var actual = scripts(html);

  it('should extract inner html from the script tag.', function () {
    var actual = scripts('<body><script src="bootstrap.js"></script></body>');
    console.log(actual)
    // expect(actual[0]).to.have.property('html');
    // expect(actual[0].attrs).to.have.property('src');
    // expect(actual[0].attrs.src).to.eql('bootstrap.js');
  });

  // it('should extract inner html from the script tag.', function () {
  //   var actual = scripts('<script>var foo = "bar";</script>');
  //   var re = /foo/.test(actual[0].html);
  //   expect(actual[0]).to.have.property('html');
  //   expect(re).to.eql(true);
  // });

  // it('should extract the attributes and inner html of each script tag.', function () {
  //   expect(actual.length).to.be.above(1);
  //   expect(actual[0]).to.have.property('attrs');
  //   expect(actual[0]).to.have.property('html');
  // });
});
