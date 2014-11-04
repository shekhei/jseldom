/**
Copyright (c) 2010, All Right Reserved, Wong Shek Hei @ shekhei@gmail.com
License: GNU Lesser General Public License (http://www.gnu.org/licenses/lgpl.html)
**/
var expr = /[.#\w].([\S]*)/g,
    classexpr = /(\.)([^.#[]+)/g,
    idexpr = /(#)[^.#[]+/,
    tagexpr = /^[\w]+/,
    varexpr = /(\w+?)=(['"])([^\2$]*?)\2/,
    simpleselector = /^[\w]+$/,
    rTrimmer = /^[\s]*[\"\']?|[\"\']?[\s]*$/g,
    rSpaceTrim = /^[\s]+|[\s]+$/g;
if ( !String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(rSpaceTrim, '');
    }
}
function parseSelector( selector ) {
    //var buffer = [];
    var buffer = {sel:"",val:[]},
        arr = [],
        isVar = false,
        quote,
        varbuff = "",
        pc = '', c = '', i,
        selLen = selector.length;
    for ( i = 0; i < selLen; i++ ) {
        pc = c;
        c = selector.charAt(i);
        if ( isVar ) {
            if ( c === '\\' && i+1 < selLen ) {
                varbuff += selector.charAt(++i);
            }
            else if ( quote === c ) {
                quote = undefined;
                varbuff += c;
            }
            else if ((c === '\'' || c === '\"') && quote === undefined ) {
                quote = c;
                varbuff += c;
            }
            else if ( c === ']' && quote === undefined ) {
                buffer.val.push(varbuff);
                varbuff = "";
                isVar = false;
            }
            else if ( c !== ']' || quote !== undefined ) {
                if ( quote === undefined && c === ',' ) {
                    buffer.val.push(varbuff);
                    varbuff = "";
                }
                else {
                    varbuff += c;
                }
            }
        }
        else if ( c === '\\' && i+1 < selLen ) {
            if ( isVar ) {
                varbuff += selector.charAt(++i);
            }
        }
        else if ( c === '[' && quote === undefined) {
            isVar = true;
        }
        else if ( c === ' ' || c === '+' || c === "<" ) {   // end of a tag, or as a sibling element
            // now lets peek forward
            if ( c === " " ) {
              for ( ; c === " " && i < selLen; i++ ) {
                c = selector.charAt(i);
              }
              if ( i < selLen ) {
                --i;
                c = selector.charAt(i);
              }
            }
            arr.push(buffer);
            if ( c === '+' || c === '<') {
                arr.push({sel:c, val:''});
                while ( i < selLen && ( c = selector.charAt(++i) ) === " " ) {}
                if ( i < selLen ) {
                  c = selector.charAt(--i);
                }
            }
            buffer = {sel:"",val:[]};
        }
        else if ( c !== ' ' && c !== ']' ) {
            buffer.sel+= c;
        }
    }
    if ( buffer.sel.length != 0 || buffer.val.length != 0 ) {
        arr.push(buffer);
    }
        var len = arr.length
    for ( i = 0; i < len; i++ ) {
        var sel = arr[i].sel, temp ={};
        
        if ( sel === '+' || sel ==="<") {
            temp.tag = sel;
        }
        else {
            temp.tag = tagexpr.exec(sel);
            temp.id = idexpr.exec(sel);
            if ( temp.id && $.isArray(temp.id) ) {
                temp.id = temp.id[0].substr(1);
            }
            if ( !temp.tag ) {
                temp.tag = 'div';
            }
            temp.vars = [];
            var classes = [];
            for ( var j = 0; j < arr[i].val.length; j++ ) {
                var index = arr[i].val[j].indexOf('=');
                var key = arr[i].val[j].substr(0, index).trim();
                var val = arr[i].val[j].substr(index+1);
                val = val.replace(rTrimmer, '');
                if ( key === "text" ) {
                    temp.text = val;
                } else if ( key === "class" && val.trim().length ) {
                    classes.push(val);
                }else {
                    temp.vars.push([key,val]);
                }
            }
            var arr2 = sel.match(classexpr);
            if ( arr2 ) {
                for ( var j = 0; j < arr2.length; j++ ) {
                    classes.push(arr2[j].substr(1));
                }
                temp.className = classes.join(" ");
            }
        }

        arr[i] = temp;
    }
    return arr;
};
function nonArrVer(selector, count) {
    var arr = [], newel = [];
    if ( simpleselector.test(selector) ) {
        arr = [ { tag: selector } ];    //if it is just a simple tag selector, then there is no need to parse it, makes it much more efficient
    }
    else {
        arr = parseSelector(selector);
    }
    
    if ( typeof count === "undefined" ) {
        count = 1;
    }
    var returns = $();
    var parent = [];
    var lastparent = [];
    var tempholder = document.createElement('div');
    //var buff = [];
    var depth = 0, i = 0, x = 0, len = arr.length;
    for ( i = 0; i < len; i++ ) {
        if ( arr[i].tag == '+' || arr[i].tag === '<' ) { parent = lastparent.slice(); --depth;}
        else {
            for ( x = 0; x < count; x++ ) {

                if ( arr[i].tag == 'input' ) { // special case, needs to create tag by html
                    var html = [];
                    html.push( "<"+arr[i].tag);
                    if ( arr[i].id) {
                        html.push( "id=\'"+arr[i].id+"\'");
                    }
                    if ( arr[i].className || (arr[i].vars && "class" in arr[i].vars)) {
                        var val = [];
                        if ( arr[i].className ) { val.push(arr[i].className); }
                        if ( arr[i].vals["class"] ) { val.push(arr[i].vars["class"]); }
                        html.push( "class=\'"+val.join(" ") );
                        html.push( "\'");
                    }
                    if ( arr[i].vars ) {
                        for ( var j = 0; j < arr[i].vars.length; j++ ) {
                            html.push(arr[i].vars[j][0]+"=\'"+arr[i].vars[j][1]+"\'");
                        }
                    }
                    if ( arr[i].text ) {
                        html.push("value=\'"+arr[i].text+"\'");
                    }
                    html.push("/>");
                    lastparent[x] = parent[x];
                    if ( !parent[x] ) {
                        tempholder.innerHTML = html.join(" ");
                        parent[x] = tempholder.removeChild(tempholder.firstChild);
                    } else {
                        parent[x].innerHTML = parent[x].innerHTML+html.join(" ");
                        parent[x]=parent[x].lastChild;
                    }
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
                    if ( parent[x] ) {
                        parent[x] = parent[x].appendChild(buff);
                    } else {
                        parent[x] = buff;
                    }
                }
            }
            if ( !depth++ ) {
                Array.prototype.push.apply(returns, parent);
            }
        }
        Array.prototype.push.apply( newel, parent );
    }
    return returns;
};
function arrVer(sel, arr, count ) {
    var regex = /{[^}]*}/g;
    var vars = sel.match(regex) || [];
    var newel = $();
    for ( var i = 0; i < arr.length; i++ ) {
        var tsel = sel;
        for ( var j = 0; j < vars.length; j++ ) {
            var vname = vars[j].substr(1,vars[j].length-2).split('.'),
                val = arr[i][vname[0]], oldval;
            if ( vname[0].trim() === "" ) {
                val = arr[i].toString();
            } else {
                for ( var x = 1; x < vname.length; x++ ) {
                    oldval = val;
                    val = val[vname[x]];
                    if (!val) {
                        val = "";
                        break;
                    }
                    if ( typeof val === "function" ) {
                        val = val.call(oldval)
                    }
                }
            }
            if ( $.isArray(val) ) { val = val.join(","); }
            if ( typeof val === "string" ) {
                val = val.replace(/\\['"\\]|['"]/g, function (s) {
                    return "\\"+s;
                });
            } else if ( typeof val === "function" ) {
                val = val.call(oldval)
            }
            val = val || "";
            tsel = tsel.replace(vars[j], val);
        }
        Array.prototype.push.apply(newel, nonArrVer(tsel, count));
        // newel = newel.pushStack(nonArrVer(tsel, count));
    }

    return newel;
};
var isArray = Array.isArray || function(arr){return toString.call(arr) === "[object Array]";}
jseldom = function jseldom(selector) {
    if ( arguments.length == 2 && $.isPlainObject(arguments[1])) {
        return arrVer.apply(this, [arguments[0], [arguments[1]]]);
    }
    else if ( arguments.length == 1 || (arguments.length == 2 && !isArray(arguments[1]))) {
        return nonArrVer.apply( this, arguments );
    }
    else if ( arguments.length == 2 ) {
        return arrVer.apply( this, arguments);
    }
}
$.jseldomf = function(selector) {
    var args = [selector, [Array.prototype.slice.call(arguments,1)]];
    return arrVer.apply(this, args);
}

function SSYM(val){
    SSYM.symbols = SSYM.symbols || {};
    SSYM.symbol_keys = SSYM.symbol_keys || [];
    var i;
    if ((i = SSYM.symbols[val]) !== undefined ){ return i;}
    var i = SSYM.symbol_keys.length;
    SSYM.symbols[val] = i;
    SSYM.symbol_keys[i] = val;
    return i;
}
function SSYM_KEY(symbol) {
    return SSYM.symbol_keys[symbol];
}
function Node(n) {
    this.n = n;
    this.children = [];
}
Node.prototype.addChild = function(node){
    this.children = this.children || [];
    this.children.push(node);
    node.parent = this;
}
Node.prototype.addSibling = function(node){
    if (this.parent) {this.parent.addChild(node)};
}
Node.prototype.print = function(output, settings, depth){
    depth = depth || 0;
    if (this.n) {
        for (var i = 0; i <depth; i++){
            output.push(" ");
        }
        output.push("<");
        output.push((this.n.tagName || "div"));
        if (this.n.id) {
            output.push(" id='"+this.n.id+"'");
        }
        if (this.n.classname){
            output.push(" class='"+this.n.classname.join(" ")+"'")
        }
        output.push(">");
    }
    for (var i = 0; i <this.children.length; i++){
        this.children[i].print(output, settings, depth+1);
    }
    if (this.n) { 
        for (var i = 0; i <depth; i++){
            output.push(" ");
        }
        output.push("</"+(this.n.tagName || "div")+">");
    }
}
var opsMap = {
    "+": "addSibling",
    ">": "addChild"
}
function Tree(selector) {
    console.log(selector);
    var result = infixToTree(selector), ops=result.ops, node=result.out, t, n, op;
    console.log(ops, node);
    this.tree = new Node();
    var opsStack = [], nodeStack=[this.tree], i = 0, j = 1;
    var firstNode = new Node(node[0]);
    this.tree.addChild(firstNode)
    nodeStack.push(firstNode);
    while ((n = node[j]) && (op = ops[i++])){
        if ( ")" === op ){
            while (opsStack[opsStack.length-1] !== "(" && opsStack.length > 0) {
                opsStack.pop();
                nodeStack.pop();
            }
            opsStack.pop();
        } else {
            opsStack.push(op);
            if ( "(" !== op ){
                var newNode = new Node(n);
                nodeStack[nodeStack.length-1][opsMap[op]](newNode);
                nodeStack.push(newNode);
                j++;
            }
        }
        console.log(opsStack);
    }

}
Tree.prototype.print = function(){
    var buffer = [];
    this.tree.print(buffer, undefined, -1);
    return buffer.join("");
}
// function Node(){
// }
// Node.prototype.left(node){
//     node.parent = this;
//     this.left = node;
// }
// Node.prototype.right(node) {
//     node.parent = this;
//     this.right = node;
// }
// function createElNode() {
//     return new Node();
// }
var rOnlyOneAttr=/id|tagName/;
function infixToTree( selector ) {
    var l = selector.length,
        i = 0,
        c,
        p,
        n,
        states = [SSYM("NONE")],
        state,
        opStack = [],
        outStack = [],
        buffer = [],
        node = {},
        elStates = [SSYM("tagName")],
        elState,
        space = false;
    while (selector[i] === " " && i < l) { i++; }
    for (; i < l; i++){
        c = selector[i];
        n = selector[i+1];
        elState = elStates[elStates.length-1];
        state = states[states.length-1];
        if (" " === c ) {
            space = true;
            if (buffer.length) {
                if ( rOnlyOneAttr.test(SSYM_KEY(elState))) {
                    node[SSYM_KEY(elState)] = buffer.join("");
                } else {
                    node[SSYM_KEY(elState)] = node[SSYM_KEY(elState)] || [];
                    node[SSYM_KEY(elState)].push(buffer.join(""));
                }
                outStack.push(node);
            }
            node = {};
            elStates.push(SSYM('tagName'));
            buffer.length = 0;
            continue;
        } else if (/[()+>]/.test(c) && SSYM("PROC") !== elState && SSYM("ATTR") !== elState ) {
            if ( SSYM("EL") === state ) {
                if ( buffer.length ) {
                    if ( rOnlyOneAttr.test(SSYM_KEY(elState))) {
                        node[SSYM_KEY(elState)] = buffer.join("");
                    } else {
                        node[SSYM_KEY(elState)] = node[SSYM_KEY(elState)] || [];
                        node[SSYM_KEY(elState)].push(buffer.join(""));
                    }
                    outStack.push(node);
                    node = {};
                    elStates.push(SSYM('tagName'));
                    elStates.pop();
                    buffer.length = 0;
                }
            }
            if ( c === "(" && ( p === ")" || SSYM("EL") === state)) {
                opStack.push(">");
            } else if (state === SSYM("OP") && c !== ")") {
                // this probably means no element was provided, defaults to div
                outStack.concat(node);
                node = {};
                buffer.length =0;
                elStates.push(SSYM('tagName'));
            }
            states.pop();
            states.push(SSYM("OP"));
            opStack.push(c);
        } else {
            if (space|| SSYM("EL") !== state) {
                states.pop();
                states.push(SSYM("EL"));
                if ( ")" === p && c ) {
                    opStack.push(">");
                }
            }
            if ( state === SSYM("EL") && space ) {
                opStack.push(">");
            }
            var changedState = false;
            if ( /[.#:[]/.test(c)) {
                changedState = true;
                if ( c === "." ) { elStates.pop(); elStates.push(SSYM("classname")); }
                else if ( c === "#" ) { elStates.pop(); elStates.push(SSYM("id")); }
                else if ( c === ":" ) { elStates.pop(); elStates.push(SSYM("proc")); }
                else if ( c === "[" ) { elStates.pop(); elStates.push(SSYM("attr")); }
            }
            if ( changedState ) {
                // change in state
                if (buffer.length) {
                    if ( rOnlyOneAttr.test(SSYM_KEY(elState))) {
                        node[SSYM_KEY(elState)] = buffer.join("");
                    } else {
                        node[SSYM_KEY(elState)] = node[SSYM_KEY(elState)] || [];
                        node[SSYM_KEY(elState)].push(buffer.join(""));
                    }
                }
                buffer.length = 0;
            } else {
                buffer.push(c);
            }
        }
        space = false;
        p = c;
    }
    if (buffer.length) {
        if ( rOnlyOneAttr.test(SSYM_KEY(elState))) {
            node[SSYM_KEY(elState)] = buffer.join("");
        } else {
            node[SSYM_KEY(elState)] = node[SSYM_KEY(elState)] || [];
            node[SSYM_KEY(elState)].push(buffer.join(""));
        }
        outStack.push(node);
    }
    return {
        ops: opStack,
        out: outStack
    }
};

var jSelDom = {
    jseldom: jseldom,
    infixToTree: infixToTree,
    Tree: Tree
}

$.jseldom = jseldom;
