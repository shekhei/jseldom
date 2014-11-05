var chai = require('chai'),
	expect = chai.expect,
	jseldom = require('../../build/jseldom');
describe("selector to output", function(){
	
	it("selector to output: should return correct tree('.one .one.two (.three + #four)')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var tree = new jseldom.Tree('.one .one.two (.three + #four)');
	});
	it("selector to output: should return correct tree('.one (.two ( .three + .four ) + (.five #six) .seven) > #eight')", function(){
		var tree = new jseldom.Tree('.one (.two ( .three + .four ) + (.five #six) .seven) > #eight');
		expect(tree.print()).to.eql(
["<div class='one'>"
," <div class='two'>"
,"  <div class='three'>"
,"  </div>"
,"  <div class='four'>"
,"  </div>"
,"  <div class='five'>"
,"   <div id='six'>"
,"   </div>"
,"   <div class='seven'>"
,"   </div>"
,"  </div>"
,"  <div id='eight'>"
,"  </div>"
," </div>"
,"</div>"].join("")
)
	});

});