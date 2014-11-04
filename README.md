jSelDom
=======

Changes version 0.0.3-edge
---------------------
Added parenthesis support, for example

```
.one (.two ( .three + .four ) + (.five #six) .seven) > #eight
```

will generate

```html
<div class="one">
	<div class="two">
		<div class="three"></div>
		<div class="five">
			<div id="six"></div>
			<div class="seven"></div>
		</div>
		<div class="four"></div>
	<div id="eight"></div>
</div>
```

Not using % for variables, now using {}, so for example, instead of "div[data-var=%variable%]" now it would be "div[data-var={variable}]"

What is this?
-------------
More often than not, in a rich interface site, there's a lot of dom creation required, and it hasn't been that simple, they require quite a bit of typing, although many libraries made it easier, it was still a little painful, so I came up with this

Inspiration
-----------
I was inspired by the usage of selectors for dom querying, and why cant it be used for dom creation?

Advantages
----------
You type less, and hence, make less mistakes :)

Examples(jquery example might not be the most optimised)
--------

### Simple dom creation(making a div with class foo)

#### Using jQuery
```js
//using jquery
$('<div>').addClass('foo').appendTo('#result');
```
```js
//or
$('<div class="foo">').appendTo('#result');
```
#### Using jSelDom w/ jSelDom
```js
$.jseldom('div.foo').appendTo('#result);
```

### dom creation with an object to inject with
You can see it on http://jseldom.shekhei.com

#### Object with data
```js
// imagine if this links is returned from an ajax call? :)
var links = [
              {text:"Like it with jQuery?", child:"Get it here!", href:"plugins.jquery.com"},
              {text:"Demo!", child:"See them in action!", href:"demo.html"}, 
              {text:"Documentations...", child:"Read them...", href:"documentations.html"}
            ];
```
#### Using jQuery
```js
// using jquery
for ( var i = 0; i < links.length; i++ ) {
  // if you set them one by one on your own using prop is probably worse...
  $('<a href='+links[i].href+' class="orangelink">'+links[i].text+'<span class="child">'+links.child+'</span></a>').appendTo('#result');
}
```
#### Using jSelDom w/ jQuery
```js
// jseldom, using the special attribute called 'text'
$.jseldom('a.orangelink[href="{href}",text="{text}"] span.child[text="{child}"]', links).appendto('#result');
```

### Using a printf like version
```js
$.jseldomf('div[data-var1="{0}"] .second[class="{1}"]', "name", "another"');
// this will result in <div data-var1="name"><div class="second another"></div></div>
```

Please feel free to post any issue or feature request :) And please fork it all you want!
