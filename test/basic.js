var t = $("#qunit-fixture");
clearModuleTeardown = {teardown: function(){t.children().remove();}};
function testBasicSet(set) {
  for ( var i = 0; i < set.length; i++ ) {
    var el = set[i];
    QUnit.test("Testing "+el, function(assert) {
      $.jseldom(el).appendTo(t);
      assert.ok(t.children(el).length === 1, "there is only one "+el);
      assert.ok(t.children(el)[0].tagName.toLowerCase() === el, "the element is correct");
      assert.ok(t.children(el).children().first().children().length === 0, "there is no children");
      expect(3);
    });
  }
}
QUnit.module("basic selectors", clearModuleTeardown); 
var el = "div span a table h1 h2 h3 h4 input tr td".split(" ");
testBasicSet(el);
QUnit.module("html5 selectors", clearModuleTeardown);
el = "header article section".split(" ");
testBasicSet(el);

QUnit.module("sibling selectors", clearModuleTeardown);
el = "div span a section".split(" ");
var createSiblingAssertFunc = function(el1, el2, selector) {
  return function(assert) {
    $.jseldom(selector).appendTo(t);
    assert.ok(t.children(el1).length >= 1, "There is only 1 "+el1);
    assert.ok(t.children(el2).length >= 1, "There is only 1 "+el2);
    assert.ok(t.children().length === 2, "There should only be 2 children, but there are "+t.children().length+"children("+Array.prototype.join.call(t[0].childNodes, " ")+")");
    var first = t.children().first();
    var last = t.children().last();
    assert.ok(first[0].tagName.toLowerCase() === el1, "The first child is "+el1);
    assert.ok(last[0].tagName.toLowerCase() === el2, "The first child is "+el2);
    assert.ok(first.children().length === 0, "the first child has no children");
    assert.ok(last.children().length === 0, "The last child has no children");
    expect(7);
  }
}
var siblingTest = function(el1, el2) {
  var combiners = ["+", " +", "+ ", " + ", "   +  "];
  for ( var i = 0; i < combiners.length; i++ ) {
    var selector = [el1,el2].join(combiners[i]);
    QUnit.test(selector, createSiblingAssertFunc(el1, el2, selector)); 
  }
}
for ( var i = 0; i < el.length; i++ ) {
  for ( var j = 0; j < el.length; j++ ) {
    var el1 = el[i], el2 = el[j];
    siblingTest(el1,el2);
  }
}
