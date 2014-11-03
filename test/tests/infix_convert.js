var chai = require('chai'),
	expect = chai.expect,
	jseldom = require('../../build/jseldom');
describe("infix convert", function(){
	
	it("infix convert: should return correct tree('div (div + div)')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('div (div + div)');
		expect(postfix.ops).to.eql("> ( + )".split(" "));
		expect(postfix.out).eql("div div div".split(" "));
	});
	it("infix convert: should return correct tree('(div (div + div))')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('(div (div + div))');
		expect(postfix.ops).to.eql("( > ( + ) )".split(" "));
		expect(postfix.out).eql("div div div".split(" "));
	});
	it("infix convert: should return correct tree('(div(div+div))')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('(div(div+div))');
		expect(postfix.ops).to.eql("( > ( + ) )".split(" "));
		expect(postfix.out).eql("div div div".split(" "));
	});
	it("infix convert: should return correct tree('(div(div>div)(div+div))')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('(div(div>div)(div+div))');
		expect(postfix.ops).to.eql("( > ( > ) > ( + ) )".split(" "));
		expect(postfix.out.join(",")).eql("div,div,div,div,div");
	});
	it("infix convert: should return correct tree('(    div    (  div div  )  (    div +     div    )  )')", function(){
		// var postfix = jseldom.infixPostfix('div > div ((span span > div) div)>div');
		var postfix = jseldom.infixToTree('(    div    (  div div  )  (    div +     div    )  )');
		expect(postfix.ops.join(",")).to.eql("(,>,(,>,),>,(,+,),)");
		expect(postfix.out.join(",")).eql("div,div,div,div,div");
	});
});