var chai = require('chai'),
	expect = chai.expect,
	jseldom = require('../../build/jseldom');
describe("Simple Selectors", function(){
	var selectors = "div span td tr table script iframe input".split(" ");
	for ( var i = 0; i < selectors.length; i++ ) {
		selector = selectors[i];
		it("should create simple single element selector('"+selector+"')", function(){
			var dom = $.jseldom(selector);
			expect(dom.length).equals(1);
			expect(dom[0].tagName).equals(selector.toUpperCase());
		});
	}

});