jSelDom
=======

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

```js
//using jquery
$('<div>').addClass('foo').appendTo('#result');
//or
$('<div class="foo">').appendTo('#result');
//using jSelDom
$('#result').jseldom('div.foo');
```

### dom creation with an object to inject with
#### you can see it on http://jseldom.shekhei.com

```js
// imagine if this links is returned from an ajax call? :)
var links = [
              {text:"Like it with jQuery?", child:"Get it here!", href:"plugins.jquery.com"},
              {text:"Demo!", child:"See them in action!", href:"demo.html"}, 
              {text:"Documentations...", child:"Read them...", href:"documentations.html"}
            ];
// using jquery
for ( var i = 0; i < links.length; i++ ) {
  // if you set them one by one on your own using prop is probably worse...
  $('<a href='+links[i].href+' class="orangelink">'+links[i].text+'<span class="child">'+links.child+'</span></a>').appendTo('#result');
}
// jseldom, using the special attribute called 'text'
$('#result').jseldom('a.orangelink[href="%href%",text="%text%"] span.child[text="%child%"]', links);
```

Please feel free to post any issue or feature request :) And please fork it all you want!
