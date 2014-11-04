var chai = require('chai'),
	expect = chai.expect,
	jseldom = require('../../build/jseldom');
describe("infix convert", function(){
	
	it("infix convert: should return correct tree('div (div + div)')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('div (div + div)');
		expect(postfix.ops).to.eql("> ( + )".split(" "));
		expect(postfix.out.length).eql(3);
		for ( var i = 0; i < postfix.out.length; i++ ) {
			var out = postfix.out[i];
			expect(out.tagName).eql("div");
		}
		
	});
	it("infix convert: should return correct tree('(div (div + div))')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('(div (div + div))');
		expect(postfix.ops).to.eql("( > ( + ) )".split(" "));
		expect(postfix.out.length).eql(3);
		for ( var i = 0; i < postfix.out.length; i++ ) {
			var out = postfix.out[i];
			expect(out.tagName).eql("div");
		}
	});
	it("infix convert: should return correct tree('(div(div+div))')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('(div(div+div))');
		expect(postfix.ops).to.eql("( > ( + ) )".split(" "));
		expect(postfix.out.length).eql(3);
		for ( var i = 0; i < postfix.out.length; i++ ) {
			var out = postfix.out[i];
			expect(out.tagName).eql("div");
		}
	});
	it("infix convert: should return correct tree('(div(div>div)(div+div))')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('(div(div>div)(div+div))');
		expect(postfix.ops).to.eql("( > ( > ) > ( + ) )".split(" "));
		expect(postfix.out.length).eql(5);
		for ( var i = 0; i < postfix.out.length; i++ ) {
			var out = postfix.out[i];
			expect(out.tagName).eql("div");
		}
	});
	it("infix convert: should return correct tree('(    div    (  div div  )  (    div +     div    )  )')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('(    div    (  div div  )  (    div +     div    )  )');
		expect(postfix.ops.join(",")).to.eql("(,>,(,>,),>,(,+,),)");
		expect(postfix.out.length).eql(5);
		for ( var i = 0; i < postfix.out.length; i++ ) {
			var out = postfix.out[i];
			expect(out.tagName).eql("div");
		}
	});
});

describe("complex infix convert", function(){
	
	it("infix convert: should return correct tree('.one .one.two (.three + #four)')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('.one .one.two (.three + #four)');
		expect(postfix.ops).to.eql("> > ( + )".split(" "));
		expect(postfix.out.length).eql(4);
		expect(postfix.out[0].classname).to.eql(["one"]);
		expect(postfix.out[1].classname).to.eql(["one","two"]);
		expect(postfix.out[2].classname).to.eql(["three"]);
		expect(postfix.out[3].id).to.eql("four");
	});
	it("infix convert: should return correct tree('.one span.one#two.two (.three + #four)')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('.one span.one#two.two (.three + #four)');
		expect(postfix.ops).to.eql("> > ( + )".split(" "));
		expect(postfix.out.length).eql(4);
		expect(postfix.out[0].classname).to.eql(["one"]);
		expect(postfix.out[0].tagName).to.eql(undefined);
		expect(postfix.out[1].tagName).to.eql("span");
		expect(postfix.out[1].classname).to.eql(["one","two"]);
		expect(postfix.out[1].id, "expects 2nd element: #two").to.eql("two");
		expect(postfix.out[2].classname).to.eql(["three"]);
		expect(postfix.out[0].tagName).to.eql(undefined);
		expect(postfix.out[3].id).to.eql("four");
		expect(postfix.out[0].tagName).to.eql(undefined);
		
	});
	it("infix convert: should return correct tree('.one (.two ( .three + .four ) + (.five #six) .seven) > #eight ')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('.one (.two ( .three + .four ) + (.five #six) .seven) > #eight');
		expect(postfix.ops).to.eql("> ( > ( + ) + ( > ) > ) >".split(" "));
		expect(postfix.out.length).eql(8);
		expect(postfix.out[0].classname).to.eql(["one"]);
		expect(postfix.out[0].tagName).to.eql(undefined);
		expect(postfix.out[1].tagName).to.eql(undefined);
		expect(postfix.out[1].classname).to.eql(["two"]);
		expect(postfix.out[2].tagName).to.eql(undefined);
		expect(postfix.out[2].classname).to.eql(["three"]);
		expect(postfix.out[3].tagName).to.eql(undefined);
		expect(postfix.out[3].classname).to.eql(["four"]);
		expect(postfix.out[4].tagName).to.eql(undefined);
		expect(postfix.out[4].classname).to.eql(["five"]);
		expect(postfix.out[5].tagName).to.eql(undefined);
		expect(postfix.out[5].id).to.eql("six");
		expect(postfix.out[6].tagName).to.eql(undefined);
		expect(postfix.out[6].classname).to.eql(["seven"]);
		expect(postfix.out[7].tagName).to.eql(undefined);
		expect(postfix.out[7].id).to.eql("eight");
	});

});