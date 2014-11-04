var chai = require('chai'),
	expect = chai.expect,
	jseldom = require('../../build/jseldom');
describe("selector to output", function(){
	
	it("selector to output: should return correct tree('.one .one.two (.three + #four)')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var tree = new jseldom.Tree('.one .one.two (.three + #four)');
		console.log(tree);
		console.log(tree.print());
	});
});