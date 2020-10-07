![https://cdn.svarun.dev/gh/varunsridharan/dizzle/banner.jpg](https://cdn.svarun.dev/gh/varunsridharan/dizzle/banner.jpg)

<p align="center">
<a href="https://www.producthunt.com/posts/dizzle-2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dizzle-2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=269511&theme=dark" alt="Dizzle - ~ Simple Fast CSS Selector Engine ~ | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</p>

## What?
___Dizzle___ turns CSS selectors into functions that tests if elements match them. When searching for elements, testing is executed "from the top", similar to how browsers execute CSS selectors.

## Features:
* Full implementation of CSS3 & CSS4 selectors
* Partial implementation of jQuery extensions
* Pretty good performance

## Usage 
Get **Dizzle** From [jsDelivr](https://cdn.jsdelivr.net/npm/dizzle/dist/dizzle.umd.min.js) and use it like this:

```html
<script src="https://cdn.jsdelivr.net/npm/dizzle/dist/dizzle.umd.min.js"></script>
<script>
  var divs = dizzle('div');
  console.log(divs);
</script>
```

**Dizzle** is also available through [npm](https://npmjs.com) as the [`dizzle`](https://npmjs.com/package/dizzle) package:

    npm install --save dizzle

That you can then use like this:

```javascript
import dizzle from "dizzle";

dizzle.find('div.myelement');
```

## Documentation
### Finding Elements
```javascript
/**
 * Search For h2 elements inside div in whole document
 */
console.log(dizzle('div > h2'));

/**
 * Fetches All H2 Elements in document
 * and loops into results and find span element in each h2 element
 */
var $h2 = dizzle('h2');
$h2.forEach(function(element){
    console.log(dizzle('span',element));
});
```

### IS / Match Element `Pseudo`
```javascript
/**
 * Fetches All H2 Elements in document
 * and loops into results and find span element in each h2 element
 */
var $h2 = dizzle('h2');
$h2.forEach(function(element){
   
    if(dizzle.is(':visible',element)){
        // your code if h2 is visible 
    }
});
```
### Element Filter
```javascript
/**
 * Filter All Visible H2 tags
 */
var visibleH2 = dizzle.filter(':visible',dizzle('h2'));
```

## Custom Adapter Support
```javascript
const customAdapter = {
	attr: function( elem, attrName ) {
		if( 'custom-Name' === attrName ) {
			return elem.getAttribute('customName');
		}
		return elem.getAttribute( attrName );
	}
};

const attr = dizzle('[custom-Name="Yes"]',null,customAdapter)
```

### Custom Adapter Functions
A custom adapter must implement the following functions:

    isTag, getChildren, getParent, attr, getSiblings, getTagName
    
Please check [src/adapter.js](https://github.com/varunsridharan/dizzle/blob/main/src/adapter.js) for more information
Custom adapters can be passed for all the below functions

```javascript
/**
  * @param selector String
  * @param context Parent Element / Root
  * @param adapter Custom Adapter Function
  */
dizzle( selector, context, adapter );

/**
  * @param selector String
  * @param elem Single Element Object
  * @param adapter Custom Adapter Function
  */
dizzle.is( selector, elem, adapter )

/**
  * @param selector String
  * @param elems Array of elements
  * @param adapter Custom Adapter Function
  */
dizzle.filter( selector, elems, adapter )

```


## Supported Selectors
| Combinators | Attributes | Pseudo |
| :--- | :---: | ---: |
| [`>` Child](#child-) | `=` | `:empty` |
| [`+` Adjacent](#adjacent-) | `!=` | `:disabled` |
| [`~` General Sibling](#sibling-) | `\|=` | `:enabled` | 
| [` ` Descendant](#descendant--) | `*=` | `:lang` |
| | `~=` | `:visible` |
| | `$=` | `:hidden` |
| | `^=` | `:contains` |
| | | `:first-child` |
| | | `:last-child` |
| | | `:first-of-type` |
| | | `:last-of-type` |
| | | `:even` |
| | | `:odd` |
| | | `:gt` |
| | | `:lt` |
| | | `:eq` |
| | | `:first` |
| | | `:last` |
| | | `:nth-of-type` |
| | | `:nth-last-of-type` |
| | | `:nth-last-child` |
| | | `:checked` |
| | | `:input` |
| | | `:button` |
| | | `:parent` |
| | | `:selected` |
| | | `:text` |
| | | `:only-child` |
| | | `:only-of-type` |
| | | `:has` |
| | | `:not` |
| | | `:radio` |
| | | `:checkbox` |
| | | `:file` |
| | | `:password` |
| | | `:image` |
| | | `:submit` |
| | | `:reset` |

## Combinators

### Child `>`
The child selector selects all elements that are the children of a specified element.
```javascript
dizzle('div > p > span');
```

### Adjacent `+`
The adjacent sibling selector selects all elements that are the adjacent siblings of a specified element.
```javascript
dizzle('div.copyright > p.content + span.year');
```

### Sibling `~`
The general sibling selector selects all elements that are siblings of a specified element.
```javascript
dizzle('p ~ span');
```

### Descendant ` `
The descendant selector matches all elements that are descendants of a specified element.
```javascript
dizzle('div p span');
```

---

## 📝 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[Checkout CHANGELOG.md](/CHANGELOG.md)

## 🤝 Contributing
If you would like to help, please take a look at the list of [issues](issues/).

## 💰 Sponsor
[I][twitter] fell in love with open-source in 2013 and there has been no looking back since! You can read more about me [here][website].
If you, or your company, use any of my projects or like what I’m doing, kindly consider backing me. I'm in this for the long run.

- ☕ How about we get to know each other over coffee? Buy me a cup for just [**$9.99**][buymeacoffee]
- ☕️☕️ How about buying me just 2 cups of coffee each month? You can do that for as little as [**$9.99**][buymeacoffee]
- 🔰         We love bettering open-source projects. Support 1-hour of open-source maintenance for [**$24.99 one-time?**][paypal]
- 🚀         Love open-source tools? Me too! How about supporting one hour of open-source development for just [**$49.99 one-time ?**][paypal]

## 📜  License & Conduct
- [**General Public License v3.0 license**](LICENSE) © [Varun Sridharan](website)
- [Code of Conduct](code-of-conduct.md)

## 📣 Feedback
- ⭐ This repository if this project helped you! :wink:
- Create An [🔧 Issue](issues/) if you need help / found a bug

## Connect & Say 👋
- **Follow** me on [👨‍💻 Github][github] and stay updated on free and open-source software
- **Follow** me on [🐦 Twitter][twitter] to get updates on my latest open source projects
- **Message** me on [📠 Telegram][telegram]
- **Follow** my pet on [Instagram][sofythelabrador] for some _dog-tastic_ updates!

---

<p align="center">
<i>Built With ♥ By <a href="https://sva.onl/twitter"  target="_blank" rel="noopener noreferrer">Varun Sridharan</a> 🇮🇳 </i>
</p>

---

<!-- Personl Links -->
[paypal]: https://sva.onl/paypal
[buymeacoffee]: https://sva.onl/buymeacoffee
[sofythelabrador]: https://www.instagram.com/sofythelabrador/
[github]: https://sva.onl/github/
[twitter]: https://sva.onl/twitter/
[telegram]: https://sva.onl/telegram/
[email]: https://sva.onl/email
[website]: https://sva.onl/website/

<!-- Private -->
[composer]: https://sva.onl/composer/
[downloadzip]:https://github.com/varunsridharan/vsp-framework/archive/master.zip
[wpcsl]: https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/
