/**
Copyright (c) 2010, All Right Reserved, Wong Shek Hei @ shekhei@gmail.com
License: GNU Lesser General Public License (http://www.gnu.org/licenses/lgpl.html)
**/
(function() {
	var expr = /[.#\w].([\S]*)/g;
	var classexpr = /(?!(\[))(\.)[^.#[]*/g;
	var idexpr = /(#)[^.#[]*/;
	var tagexpr = /^[\w]+/;
	var varexpr = /(\w+?)=(['"])([^\2$]*?)\2/;
	var simpleselector = /^[\w]+$/;
	var parseSelector = function( selector ) {
		//var buffer = [];
		var buffer = {sel:[],val:[]};
		var arr = [];
		var isVar = false;
		var quote = '';
		var varbuff = [];
		for ( var i = 0, l = selector.length; i < l; i++ ) {
			var c = selector.charAt(i);
			if ( isVar ) {
				if ( c === '\\' && i+1 < selector.length ) {
					varbuff.push(selector.charAt(++i));
				}
				else if ( quote === c ) {
					quote = '';
					varbuff.push(c);
				}
				else if ((c === '\'' || c === '\"') && quote === '' ) {
					quote = c;
					varbuff.push(c);
				}
				else if ( c === ']' && quote === '' ) {
					buffer.val.push(varbuff.join(''));
					varbuff = [];
					isVar = false;
				}
				else if ( c !== ']' ) {
					if ( quote === '' && c === ',' ) {
						buffer.val.push(varbuff.join(''));
						varbuff = [];
					}
					else {
						varbuff.push(c);
					}
				}
			}
			else if ( c === '\\' && i+1 < selector.length ) {
				if ( isVar ) {
					varbuff.push(selector.charAt(++i));
				}
			}
			else if ( c === '[' && quote === '') {
				isVar = true;
			}
			else if ( c === ' ' || c === '+' ) {	// end of a tag, or as a sibling element
				buffer.sel = buffer.sel.join('');
				arr.push(buffer);
				if ( c === '+') {
					arr.push({sel:'+', val:''});
				}
				buffer = {sel:[],val:[]};
			}
			else if ( c !== ' ' && c !== ']' ) {
				buffer.sel.push(c);
			}
		}
		if ( buffer.sel.length != 0 || buffer.val.length != 0 ) {
			buffer.sel = buffer.sel.join('');
			arr.push(buffer);
		}
		for ( var i = 0; i < arr.length; i++ ) {
			var sel = arr[i].sel;
			if ( sel === '+' ) {
				temp.tag = sel;
			}
			else {
				var temp = [];
				temp.tag = tagexpr.exec(sel);
				temp.id = idexpr.exec(sel);
				if ( temp.id && $.isArray(temp.id) ) {
					temp.id = temp.id[0].substr(1);
				}
				if ( !temp.tag ) {
					temp.tag = 'div';
				}
				temp.vars = [];
				for ( var j = 0; j < arr[i].val.length; j++ ) {
					var index = arr[i].val[j].indexOf('=');
					var key = arr[i].val[j].substr(0, index);
					var val = arr[i].val[j].substr(index+1);
					val = val.replace(/^[\s]*[\"\']*|[\"\']*[\s]*$/g, '');
					if ( key === "text" ) {
						temp.text = val;
					}
					else {
						temp.vars.push([key,val]);
					}
				}
				var arr2 = sel.match(classexpr);
				var buff = [];
				if ( arr2 ) {
					for ( var j = 0; j < arr2.length; j++ ) {
						buff.push(arr2[j].substr(1));
					}
					temp.className = buff.join(' ');
				}
			}
			arr[i] = temp;
		}
		return arr;
	};
	var rmFromParent = function(el) {
		var p = el.parentNode;
		var s = el.nextSibling;
		p.removeChild(el);
		if ( s ) { return function() { p.insertBefore(el, s); }; }
		else { return function() { p.appendChild(el); }; }
	}
	var nonArrVer = function(selector, count) {
		var arr = [];
		if ( simpleselector.test(selector) ) {
			arr = [ { tag: selector } ];	//if it is just a simple tag selector, then there is no need to parse it, makes it much more efficient
		}
		else {
			arr = parseSelector(selector);
		}
		var newel = [];
		if ( typeof count === "undefined" ) {
			count = 1;
		}
		var eachfunc = function() {
			var addFunc = rmFromParent(this);
			var parent = [];
			var lastparent = [];
			for ( var x = 0; x < count; x++ ) {
				parent.push(this);
			}
			lastparent = parent.slice();
			//var buff = [];
			for ( var i = 0; i < arr.length; i++ ) {
				if ( arr[i].tag == '+' ) { parent = lastparent.slice();}
				else {
					for ( var x = 0; x < count; x++ ) {
						if ( arr[i].tag == 'input' ) { // special case, needs to create tag by html
							var html = [];
							html.push( "<"+arr[i].tag);
							if ( arr[i].id) {
								html.push( "id=\'"+arr[i].id+"\'");
							}
							if ( arr[i].className ) {
								html.push( "class=\'"+arr[i].className );
								if ( i+1 === arr.length ) {
									html.push( lastClass);
								}
								html.push( "\'");
							}
							if ( arr[i].vars ) {
								for ( var j = 0; j < arr[i].vars.length; j++ ) {
									html.push(arr[i].vars[j][0]+"=\'"+arr[i].vars[j][1]+"\'");
								}
							}
							if ( arr[i].text ) {
								html.push("text=\'"+arr[i].text+"\'");
							}
							html.push("/>");
							lastparent[x] = parent[x];
							parent[x].innerHTML = parent[x].innerHTML+html.join(" ");
							parent[x]=parent[x].lastChild;
						}
						else {
							var buff = document.createElement(arr[i].tag);
							if ( arr[i].vars ) {
								for ( var j = 0; j < arr[i].vars.length; j++ ) {
									buff.setAttribute(arr[i].vars[j][0], arr[i].vars[j][1]);
								}
							}
							if ( arr[i].id ) {
								buff.id = arr[i].id;
							}
							if ( arr[i].className ) {
								buff.className = arr[i].className;
							}
							if ( arr[i].text ) {
								buff.appendChild(document.createTextNode(arr[i].text));
							}
							lastparent[x] = parent[x];
							parent[x] = parent[x].appendChild(buff);
						}
					}
				}
				newel = $.merge(newel, parent);
			}
			addFunc(this);
		};
		this.each(eachfunc);
		return $(newel);
	};
	var arrVer = function(sel, arr, count ) {
		var regex = /%[^%]*%/g;
		var vars = sel.match(regex);
		var newel = [];
		for ( var i = 0; i < arr.length; i++ ) {
			var tsel = sel;
			for ( var j = 0; j < vars.length; j++ ) {
				var vname = vars[j].substr(1,vars[j].length-2);
				tsel = tsel.replace(vars[j], arr[i][vname]);
			}
			newel = $.merge(newel, nonArrVer.apply(this, [tsel, count]));
		}
		return $(newel);
	};
	$.fn.jseldom = function(selector) {
		if ( arguments.length == 1 || (arguments.length == 2 && !$.isArray(arguments[1]))) {
			return nonArrVer.apply( this, arguments );
		}
		else if ( arguments.length == 2 ) {
			return arrVer.apply(this,arguments);
		}
	}
})();
