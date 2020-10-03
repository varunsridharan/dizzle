(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.dizzle = factory());
}(this, (function () { 'use strict';

	function DizzleCore(selector, context) {
	  return DizzleCore.find(selector, context);
	}

	DizzleCore.instanceID = 'dizzle' + 1 * new Date();

	DizzleCore.err = function (msg) {
	  throw new Error(msg);
	};

	var reName = /^[^\\]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/,
	    reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi,
	    // Modified version of https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L87
	reAttr = /^\s*((?:\\.|[\w\u00b0-\uFFFF-])+)\s*(?:(\S?)=\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00b0-\uFFFF-])*)|)|)\s*(i)?\]/,
	    // Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	    whitespace = '[\\x20\\t\\r\\n\\f]',
	    rwhitespace = new RegExp(whitespace + '+', 'g'),
	    // Below Regex is used to find any issues with string such as using / or \ - _ (Any Special Char Thats Needs To Be Escaped)
	rfindEscapeChar = /[-[\]{}()*+?.,\\^$|#\s]/g;

	var CombinatorTypes = ['>', '<', '~', '+'];

	/**
	 * Array Related Vars.
	 */
	var Arr = Array;
	var _Arrayprop = Arr.prototype;
	var _filter = _Arrayprop.filter;
	var _push = _Arrayprop.push;
	var _isArray = Arr.isArray;
	/**
	 * Object Related Vars
	 */

	var _obj = Object;
	/**
	 * General Vars
	 */

	var win = window;
	var doc = win.document;
	var celem = doc.createElement.bind(doc);

	function isObjectType(data, type) {
	  type = "[object " + type + "]" || "[object]";
	  return _obj.prototype.toString.call(data) === type;
	}
	function isType(data, type) {
	  return typeof data === type;
	}
	function isFunction(value) {
	  return isObjectType(value, 'Function') || isType(value, 'function');
	}
	function isString(value) {
	  return isObjectType(value, 'String');
	}
	function isUndefined(value) {
	  return value === void 0 || isType(value, 'undefined');
	}

	function createCache() {
	  var keys = [];

	  function cache(key, value) {
	    if (isUndefined(value)) {
	      return cache[key + ' '];
	    }

	    if (keys.push(key + ' ') > DizzleCore.cacheLength) {
	      delete cache[keys.shift()];
	    }

	    return cache[key + ' '] = value;
	  }

	  return cache;
	}
	/**
	 * Stores All Parsed Selector In Cache.
	 * @type {cache}
	 */


	var parseCache = createCache();
	/**
	 * Stores All Non Native Selector Data.
	 * @type {cache}
	 */

	var nonNativeSelector = createCache();
	/**
	 * Stores All Selector's Results in Cache
	 * @type {cache}
	 */

	var selectorResultsCache = createCache();

	var attribSelectors = {
	  '#': ['id', '='],
	  '.': ['class', 'element']
	},
	    unpackPseudos = new Set(['has', 'not', 'matches', 'is']),
	    stripQuotesFromPseudos = new Set(['contains', 'icontains']),
	    quotes = new Set(['"', '\'']);
	/**
	 * Below Regex Is Used To Escape CSS Selector such as
	 * #myID.entry[1] -->  #myID\\.entry\\[1\\]
	 * @type {RegExp}
	 */

	function funescape(escaped, escapedWhitespace) {
	  var high = parseInt(escaped, 16) - 0x10000;
	  return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xd800, high & 0x3ff | 0xdc00);
	}

	function unescapeCSS(str) {
	  return str.replace(reEscape, funescape);
	}

	function isWhitespace(c) {
	  return c === ' ' || c === '\n' || c === '\t' || c === '\f' || c === '\r';
	}

	function parseSelector(subselects, selector) {
	  var tokens = [],
	      sawWS = false;

	  function getName() {
	    var match = selector.match(reName);

	    if (!match) {
	      DizzleCore.err("Expected name, found " + selector);
	    }

	    var sub = match[0];
	    selector = selector.substr(sub.length);
	    return unescapeCSS(sub);
	  }

	  function stripWhitespace(start) {
	    while (isWhitespace(selector.charAt(start))) {
	      start++;
	    }

	    selector = selector.substr(start);
	  }

	  function isEscaped(pos) {
	    var slashCount = 0;

	    while (selector.charAt(--pos) === '\\') {
	      slashCount++;
	    }

	    return (slashCount & 1) === 1;
	  }

	  stripWhitespace(0);

	  while (selector !== '') {
	    var firstChar = selector.charAt(0);

	    if (isWhitespace(firstChar)) {
	      sawWS = true;
	      stripWhitespace(1);
	    } else if (CombinatorTypes.indexOf(firstChar) >= 0) {
	      tokens.push({
	        type: 'combinators',
	        action: firstChar
	      });
	      sawWS = false;
	      stripWhitespace(1);
	    } else if (firstChar === ',') {
	      if (tokens.length === 0) {
	        DizzleCore.err('Empty sub-selector');
	      }

	      subselects.push(tokens);
	      tokens = [];
	      sawWS = false;
	      stripWhitespace(1);
	    } else {
	      if (sawWS) {
	        if (tokens.length > 0) {
	          tokens.push({
	            type: 'descendant',
	            action: ' '
	          });
	        }

	        sawWS = false;
	      }

	      if (firstChar === '*') {
	        selector = selector.substr(1);
	        tokens.push({
	          type: '*'
	        });
	      } else if (firstChar in attribSelectors) {
	        var _attribSelectors$firs = attribSelectors[firstChar],
	            name = _attribSelectors$firs[0],
	            action = _attribSelectors$firs[1];
	        selector = selector.substr(1);
	        tokens.push({
	          type: 'attr',
	          id: name,
	          action: action,
	          val: getName(),
	          igCase: false
	        });
	      } else if (firstChar === '[') {
	        selector = selector.substr(1);
	        var attributeMatch = selector.match(reAttr);

	        if (!attributeMatch) {
	          DizzleCore.err("Malformed attribute selector: " + selector);
	        }

	        var completeSelector = attributeMatch[0],
	            baseName = attributeMatch[1],
	            actionType = attributeMatch[2],
	            _attributeMatch$ = attributeMatch[4],
	            quotedValue = _attributeMatch$ === void 0 ? "" : _attributeMatch$,
	            _attributeMatch$2 = attributeMatch[5],
	            value = _attributeMatch$2 === void 0 ? quotedValue : _attributeMatch$2,
	            igCase = attributeMatch[6];
	        selector = selector.substr(completeSelector.length);

	        var _name = unescapeCSS(baseName);

	        _name = _name.toLowerCase();
	        tokens.push({
	          type: 'attr',
	          id: _name,
	          action: actionType || '=',
	          val: unescapeCSS(value),
	          igCase: !!igCase
	        });
	      } else if (firstChar === ':') {
	        if (selector.charAt(1) === ':') {
	          selector = selector.substr(2);
	          tokens.push({
	            type: 'pseudo-element',
	            id: getName().toLowerCase()
	          });
	          continue;
	        }

	        selector = selector.substr(1);

	        var _name2 = getName().toLowerCase();

	        var data = null;

	        if (selector.startsWith('(')) {
	          if (unpackPseudos.has(_name2)) {
	            var quot = selector.charAt(1);
	            var quoted = quotes.has(quot);
	            selector = selector.substr(quoted ? 2 : 1);
	            data = [];
	            selector = parseSelector(data, selector);

	            if (quoted) {
	              if (!selector.startsWith(quot)) {
	                DizzleCore.err("Unmatched quotes in :" + _name2);
	              } else {
	                selector = selector.substr(1);
	              }
	            }

	            if (!selector.startsWith(')')) {
	              DizzleCore.err("Missing closing parenthesis in :" + _name2 + " (" + selector + ")");
	            }

	            selector = selector.substr(1);
	          } else {
	            var pos = 1,
	                counter = 1;

	            for (; counter > 0 && pos < selector.length; pos++) {
	              if (selector.charAt(pos) === '(' && !isEscaped(pos)) {
	                counter++;
	              } else if (selector.charAt(pos) === ')' && !isEscaped(pos)) {
	                counter--;
	              }
	            }

	            if (counter) {
	              DizzleCore.err('Parenthesis not matched');
	            }

	            data = selector.substr(1, pos - 2);
	            selector = selector.substr(pos);

	            if (stripQuotesFromPseudos.has(_name2)) {
	              var _quot = data.charAt(0);

	              if (_quot === data.slice(-1) && quotes.has(_quot)) {
	                data = data.slice(1, -1);
	              }

	              data = unescapeCSS(data);
	            }
	          }
	        }

	        tokens.push({
	          type: 'pseudo',
	          id: _name2,
	          data: data
	        });
	      } else if (reName.test(selector)) {
	        var _name3 = getName();

	        _name3 = _name3.toLowerCase();
	        tokens.push({
	          type: 'tag',
	          id: _name3
	        });
	      } else {
	        if (tokens.length && tokens[tokens.length - 1].type === 'descendant') {
	          tokens.pop();
	        }

	        addToken(subselects, tokens);
	        return selector;
	      }
	    }
	  }

	  addToken(subselects, tokens);
	  return selector;
	}

	function addToken(subselects, tokens) {
	  if (subselects.length > 0 && tokens.length === 0) {
	    DizzleCore.err('Empty sub-selector');
	  }

	  subselects.push(tokens);
	}

	function parse(selector) {
	  var cached = parseCache(selector);

	  if (cached) {
	    return cached;
	  }

	  cached = selector;
	  var subselects = [];
	  selector = parseSelector(subselects, "" + selector);

	  if (selector !== '') {
	    DizzleCore.err("Unmatched selector: " + selector);
	  }

	  return parseCache(cached, subselects);
	}

	/**
	 * @todo create a another function to check if attribute exists.
	 * @param currentValue
	 * @param compareValue
	 * @return {boolean}
	 */
	function equals (currentValue, compareValue) {
	  return currentValue === compareValue;
	}

	function notequals (currentValue, compareValue) {
	  return !equals(currentValue, compareValue);
	}

	function isTag(elem) {
	  return elem.nodeType === 1;
	}

	function getChildren(elem) {
	  return elem.childNodes ? Array.prototype.slice.call(elem.childNodes, 0) : [];
	}

	function getParent(elem) {
	  return elem.parentNode;
	}

	var adapter = {
	  isTag: isTag,
	  getChildren: getChildren,
	  getParent: getParent,
	  attr: function attr(el, key) {
	    return el.getAttribute(key);
	  },
	  getSiblings: function getSiblings(elem) {
	    var parent = getParent(elem);
	    return parent ? getChildren(parent) : [elem];
	  },
	  getTagName: function getTagName(elem) {
	    return (elem.tagName || '').toLowerCase();
	  }
	};

	function prefixedwith (currentValue, compareValue) {
	  return currentValue === compareValue || currentValue.slice(0, compareValue.length + 1) === compareValue + "-";
	}

	function contains (currentValue, compareValue) {
	  return compareValue && currentValue.indexOf(compareValue) > -1;
	}

	function containsword (currentValue, compareValue) {
	  return (' ' + currentValue.replace(rwhitespace, ' ') + ' ').indexOf(compareValue) > -1;
	}

	function endswith (currentValue, compareValue) {
	  return compareValue && currentValue.slice(-compareValue.length) === compareValue;
	}

	function startswith (currentValue, compareValue) {
	  return compareValue && currentValue.indexOf(compareValue) === 0;
	}

	function elementClass (currentValue, compareValue) {
	  compareValue = compareValue.replace(rfindEscapeChar, '\\$&');
	  var pattern = "(?:^|\\s)" + compareValue + "(?:$|\\s)";
	  var regex = new RegExp(pattern, '');
	  return currentValue != null && regex.test(currentValue);
	}

	var attrHandlers = {
	  '=': equals,
	  '!': notequals,
	  '|': prefixedwith,
	  '*': contains,
	  '~': containsword,
	  '$': endswith,
	  '^': startswith,

	  /**
	   * The below function is used only to check for element class
	   * when query is used like
	   * .myclass1.myclass2 / .myclass .anotherelement
	   */
	  'element': elementClass
	};
	function attrHandler (el, token) {
	  var status = true;
	  var action = token.action,
	      id = token.id,
	      val = token.val;
	  var currentValue = adapter.attr(el, id);

	  if (currentValue === null) {
	    return action === '!';
	  }

	  if (token.action in attrHandlers) {
	    status = attrHandlers[action](currentValue, val);
	  }

	  return status;
	}

	function empty (elem) {
	  // http://www.w3.org/TR/selectors/#empty-pseudo
	  // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
	  //   but not by others (comment: 8; processing instruction: 7; etc.)
	  // nodeType < 6 works because attributes (2) do not appear as children
	  for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
	    if (elem.nodeType < 6) {
	      return false;
	    }
	  }

	  return true;
	}

	function disabled (elem) {
	  // Only certain elements can match :enabled or :disabled
	  // https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
	  // https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
	  if ('form' in elem) {
	    // Check for inherited disabledness on relevant non-disabled elements:
	    // * listed form-associated elements in a disabled fieldset
	    //   https://html.spec.whatwg.org/multipage/forms.html#category-listed
	    //   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
	    // * option elements in a disabled optgroup
	    //   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
	    // All such elements have a "form" property.
	    if (elem.parentNode && elem.disabled === false) {
	      // Option elements defer to a parent optgroup if present
	      if ('label' in elem) {
	        return 'label' in elem.parentNode ? elem.parentNode.disabled === true : elem.disabled === true;
	      }
	    }

	    return elem.disabled === true; // Try to winnow out elements that can't be disabled before trusting the disabled property.
	    // Some victims get caught in our net (label, legend, menu, track), but it shouldn't
	    // even exist on them, let alone have a boolean value.
	  } else if ('label' in elem) {
	    return elem.disabled === true;
	  } // Remaining elements are neither :enabled nor :disabled


	  return false;
	}

	function enabled (elem) {
	  return !disabled(elem);
	}

	var preferedDocument = win.document;
	var currentDocument = preferedDocument,
	    docElem = currentDocument.documentElement;
	function markFunction(fn) {
	  fn[DizzleCore.instanceID] = true;
	  return fn;
	}
	function isMarkedFunction(fn) {
	  return isFunction(fn) && fn[DizzleCore.instanceID] && fn[DizzleCore.instanceID] === true;
	}
	/**
	 * Fetches Text Value From Nodes
	 *
	 * NodeTypes
	 * 	1 --> ELEMENT_NODE ( p / div)
	 * 	9 --> DOCUMENT_NODE (window.document)
	 * 	11 --> DOCUMENT_FRAGMENT_NODE (such as iframe)
	 * 	3 --> TEXT_NODE  ( The actual Text inside an Element or Attr. )
	 *  4 --> CDATA_SECTION_NODE (A CDATASection, such as <!CDATA[[ … ]]>.)
	 * @param elem
	 * @return {string|any}
	 */

	function getText(elem) {
	  var node,
	      ret = '',
	      i = 0,
	      nodeType = elem.nodeType;

	  if (!nodeType) {
	    while (node = elem[i++]) {
	      ret += getText(node);
	    }
	  } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
	    if (isString(elem.textContent)) {
	      return elem.textContent;
	    } else {
	      for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
	        ret += getText(elem);
	      }
	    }
	  } else if (nodeType === 3 || nodeType === 4) {
	    return elem.nodeValue;
	  }

	  return ret;
	}

	function createPositionalPseudo(fn) {
	  return markFunction(function (elements, token) {
	    token.data = +token.data;
	    var j,
	        matches = [],
	        matchIndexes = fn([], elements.length, token),
	        i = matchIndexes.length;

	    while (i--) {
	      if (elements[j = matchIndexes[i]]) {
	        elements[j] = !(matches[j] = elements[j]);
	      }
	    }

	    return matches;
	  });
	}
	function oddOrEven(isodd, result, totalFound) {
	  var i = isodd ? 1 : 0;

	  for (; i < totalFound; i += 2) {
	    result.push(i);
	  }

	  return result;
	}
	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */

	function createInputPseudo(type) {
	  return function (elem) {
	    return elem.nodeName.toLowerCase() === 'input' && elem.type === type;
	  };
	}
	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */

	function createButtonPseudo(type) {
	  return function (elem) {
	    var name = elem.nodeName.toLowerCase();
	    return (name === 'input' || name === 'button') && elem.type === type;
	  };
	}

	function even (result, totalFound) {
	  return oddOrEven(false, result, totalFound);
	}

	function lang (el, token) {
	  var elemLang,
	      data = token.data;
	  data = data.toLowerCase();

	  do {
	    if (elemLang = el.lang || adapter.attr(el, 'lang')) {
	      elemLang = elemLang.toLowerCase();
	      return elemLang === data || elemLang.indexOf(data + '-') === 0;
	    }
	  } while ((el = el.parentNode) && el.nodeType === 1);

	  return false;
	}

	function visible (elem) {
	  return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
	}

	function hidden (elem) {
	  return !visible(elem);
	}

	function contains$1 (elem, token) {
	  return (elem.textContent || getText(elem)).indexOf(token.data) > -1;
	}

	function eq (result, totalFound, token) {
	  return [token.data < 0 ? token.data + totalFound : token.data];
	}

	function firstChild (elem) {
	  return !elem.previousElementSibling;
	}

	function lastChild (elem) {
	  return !elem.nextElementSibling;
	}

	function firstOfType (elem) {
	  var siblings = adapter.getSiblings(elem);

	  for (var i = 0; i < siblings.length; i++) {
	    if (adapter.isTag(siblings[i])) {
	      if (siblings[i] === elem) {
	        return true;
	      }

	      if (adapter.getTagName(siblings[i]) === adapter.getTagName(elem)) {
	        break;
	      }
	    }
	  }

	  return false;
	}

	function lastOfType (elem) {
	  var siblings = adapter.getSiblings(elem);

	  for (var i = siblings.length - 1; i >= 0; i--) {
	    if (adapter.isTag(siblings[i])) {
	      if (siblings[i] === elem) {
	        return true;
	      }

	      if (adapter.getTagName(siblings[i]) === adapter.getTagName(elem)) {
	        break;
	      }
	    }
	  }

	  return false;
	}

	/**
	 * @see https://github.com/fb55/nth-check
	 */

	/*
		returns a function that checks if an elements index matches the given rule
		highly optimized to return the fastest solution
	*/
	function compile(parsed) {
	  var a = parsed[0],
	      b = parsed[1] - 1; //when b <= 0, a*n won't be possible for any matches when a < 0
	  //besides, the specification says that no element is matched when a and b are 0

	  if (b < 0 && a <= 0) {
	    return false;
	  } //when a is in the range -1..1, it matches any element (so only b is checked)


	  if (a === -1) {
	    return function (pos) {
	      return pos <= b;
	    };
	  }

	  if (a === 0) {
	    return function (pos) {
	      return pos === b;
	    };
	  } //when b <= 0 and a === 1, they match any element


	  if (a === 1) {
	    return b < 0 ? true : function (pos) {
	      return pos >= b;
	    };
	  } //when a > 0, modulo can be used to check if there is a match


	  var bMod = b % a;

	  if (bMod < 0) {
	    bMod += a;
	  }

	  if (a > 1) {
	    return function (pos) {
	      return pos >= b && pos % a === bMod;
	    };
	  }

	  a *= -1; //make `a` positive

	  return function (pos) {
	    return pos <= b && pos % a === bMod;
	  };
	}
	/*
		parses a nth-check formula, returns an array of two numbers
		//following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
		//[ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?
	*/


	function parse$1(formula) {
	  formula = formula.trim().toLowerCase();

	  if (formula === 'even') {
	    return [2, 0];
	  } else if (formula === 'odd') {
	    return [2, 1];
	  } else {
	    var parsed = formula.match(/^([+\-]?\d*n)?\s*(?:([+\-]?)\s*(\d+))?$/);

	    if (!parsed) {
	      throw new SyntaxError("n-th rule couldn't be parsed ('" + formula + "')");
	    }

	    var a;

	    if (parsed[1]) {
	      a = parseInt(parsed[1], 10);

	      if (isNaN(a)) {
	        if (parsed[1].charAt(0) === '-') {
	          a = -1;
	        } else {
	          a = 1;
	        }
	      }
	    } else {
	      a = 0;
	    }

	    return [a, parsed[3] ? parseInt((parsed[2] || '') + parsed[3], 10) : 0];
	  }
	}

	function nthCheck(formula) {
	  return compile(parse$1(formula));
	}

	function nthOfType (el, token) {
	  var func = nthCheck(token.data),
	      siblings = adapter.getSiblings(el);
	  var pos = 0;

	  for (var i = 0; i < siblings.length; i++) {
	    if (adapter.isTag(siblings[i])) {
	      if (siblings[i] === el) {
	        break;
	      }

	      if (adapter.getTagName(siblings[i]) === adapter.getTagName(el)) {
	        pos++;
	      }
	    }
	  }

	  return func(pos);
	}

	function first () {
	  return [0];
	}

	function last (result, totalFound) {
	  return [totalFound - 1];
	}

	function odd (result, totalFound) {
	  return oddOrEven(true, result, totalFound);
	}

	function gt (result, totalFound, token) {
	  var i = token.data < 0 ? token.data + totalFound : token.data;

	  for (; ++i < totalFound;) {
	    result.push(i);
	  }

	  return result;
	}

	function lt (result, totalFound, token) {
	  var i = token.data < 0 ? token.data + totalFound : token.data > totalFound ? totalFound : token.data;

	  for (; --i >= 0;) {
	    result.push(i);
	  }

	  return result;
	}

	function nthLastOfType (el, token) {
	  var func = nthCheck(token.data),
	      siblings = adapter.getSiblings(el);
	  var pos = 0;

	  for (var i = siblings.length - 1; i >= 0; i--) {
	    if (adapter.isTag(siblings[i])) {
	      if (siblings[i] === el) {
	        break;
	      }

	      if (adapter.getTagName(siblings[i]) === adapter.getTagName(el)) {
	        pos++;
	      }
	    }
	  }

	  return func(pos);
	}

	function nthLastChild (el, token) {
	  var func = nthCheck(token.data),
	      siblings = adapter.getSiblings(el);
	  var pos = 0;

	  for (var i = siblings.length - 1; i >= 0; i--) {
	    if (adapter.isTag(siblings[i])) {
	      if (siblings[i] === el) {
	        break;
	      } else {
	        pos++;
	      }
	    }
	  }

	  return func(pos);
	}

	function checked (elem) {
	  var nodeName = elem.nodeName.toLowerCase();
	  return nodeName === 'input' && !!elem.checked || nodeName === 'option' && !!elem.selected;
	}

	function button (elem) {
	  var name = elem.nodeName.toLowerCase();
	  return name === 'input' && elem.type === 'button' || name === 'button';
	}

	function input (elem) {
	  return /^(?:input|select|textarea|button)$/i.test(elem.nodeName);
	}

	function parent (elem) {
	  return !empty(elem);
	}

	function selected (elem) {
	  /**
	   * Accessing this property makes selected-by-default
	   * options in Safari work properly
	   */
	  if (elem.parentNode) {
	    elem.parentNode.selectedIndex;
	  }

	  return elem.selected === true;
	}

	function text (elem) {
	  var attr;
	  return elem.nodeName.toLowerCase() === 'input' && elem.type === 'text' && ((attr = elem.getAttribute('type')) == null || attr.toLowerCase() === 'text');
	}

	function onlyChild(elem) {
	  var siblings = adapter.getSiblings(elem);

	  for (var i = 0; i < siblings.length; i++) {
	    if (adapter.isTag(siblings[i]) && siblings[i] !== elem) {
	      return false;
	    }
	  }

	  return true;
	}

	function onlyOfType(elem) {
	  var siblings = adapter.getSiblings(elem);

	  for (var i = 0, j = siblings.length; i < j; i++) {
	    if (adapter.isTag(siblings[i])) {
	      if (siblings[i] === elem) {
	        continue;
	      }

	      if (adapter.getTagName(siblings[i]) === adapter.getTagName(elem)) {
	        return false;
	      }
	    }
	  }

	  return true;
	}

	function has (elem, token) {
	  return DizzleCore.find(token.data, elem).length > 0;
	}

	var pesudoHandlers = {
	  'empty': empty,
	  'disabled': disabled,
	  'enabled': enabled,
	  'lang': lang,
	  'visible': visible,
	  'hidden': hidden,
	  'contains': contains$1,
	  'first-child': firstChild,
	  'last-child': lastChild,
	  'first-of-type': firstOfType,
	  'last-of-type': lastOfType,
	  'even': createPositionalPseudo(even),
	  'odd': createPositionalPseudo(odd),
	  'gt': createPositionalPseudo(gt),
	  'lt': createPositionalPseudo(lt),
	  'eq': createPositionalPseudo(eq),
	  'first': createPositionalPseudo(first),
	  'last': createPositionalPseudo(last),
	  'nth-of-type': nthOfType,
	  'nth-last-of-type': nthLastOfType,
	  'nth-last-child': nthLastChild,
	  'checked': checked,
	  'input': input,
	  'button': button,
	  'parent': parent,
	  'selected': selected,
	  'text': text,
	  'only-child': onlyChild,
	  'only-of-type': onlyOfType,
	  'has': has
	};
	['radio', 'checkbox', 'file', 'password', 'image'].forEach(function (i) {
	  pesudoHandlers[i] = createInputPseudo(i);
	});
	['submit', 'reset'].forEach(function (i) {
	  pesudoHandlers[i] = createButtonPseudo(i);
	});
	function pesudoHandler(el, token) {
	  if (_isArray(el)) {
	    var id = token.id;

	    if (id in pesudoHandlers) {
	      if (isMarkedFunction(pesudoHandlers[id])) {
	        el = pesudoHandlers[id](el, token);
	      } else {
	        el = el.filter(function (e) {
	          return pesudoHandlers[id](e, token);
	        });
	      }
	    }

	    return el;
	  } else {
	    var status = true;
	    var _id = token.id;

	    if (_id in pesudoHandlers) {
	      status = pesudoHandlers[_id](el, token);
	    }

	    return status;
	  }
	}

	var matcherFn = false;
	function matches(el, selector) {
	  return el[matcherFn](selector);
	}
	function setupMatcherFn() {
	  matcherFn = ['matches', 'webkitMatchesSelector', 'msMatchesSelector'].reduce(function (fn, name) {
	    return fn ? fn : name in docElem ? name : fn;
	  }, null);
	}

	function isCheckCustom(selector, elem) {
	  var r = parse(selector).reduce(function (results, tokens) {
	    var i = 0,
	        len = tokens.length,
	        status = true;

	    while (i < len) {
	      var token = tokens[i++];

	      if (status && ('attr' === token.type || 'pseudo' === token.type)) {
	        status = filterElement(elem, token) ? elem : false;
	      }
	    }

	    return status;
	  }, true);
	  return !!r;
	}
	function is(selector, elem) {
	  try {
	    return matches(elem, selector);
	  } catch (e) {
	    return isCheckCustom(selector, elem);
	  }
	}

	function filterElement(element, token) {
	  if (!isUndefined(token)) {
	    switch (token.type) {
	      case 'attr':
	        return attrHandler(element, token);

	      case 'pseudo':
	        return pesudoHandler(element, token);
	    }
	  }

	  return true;
	}
	function filter(selector, elems) {
	  return elems.filter(function (elem) {
	    return isCheckCustom(selector, elem);
	  });
	}

	/**
	 * Tries To Run Native Query Selectors.
	 * @param selector
	 * @param context
	 * @return {boolean|[]}
	 */

	function nativeQuery(selector, context) {
	  var results = [],
	      isNativeQuery = true !== nonNativeSelector(selector),
	      isNativeQueryData,
	      selector_id,
	      selector_class,
	      nodeType = context ? context.nodeType : 9;
	  /**
	   * Return False if query is already cached as none native
	   */

	  if (!isNativeQuery) {
	    return false;
	  }
	  /**
	   * If the Selector is simple then just use native query system.
	   */


	  if (nodeType !== 11) {
	    if (isNativeQueryData = rquickExpr.exec(selector)) {
	      if ((selector_id = isNativeQueryData[1]) && nodeType === 9) {
	        results.push(context.getElementById(selector_id));
	        return results;
	      } else if (isNativeQueryData[2]) {
	        _push.apply(results, context.getElementsByTagName(selector));

	        return results;
	      } else if (selector_class = isNativeQueryData[3]) {
	        _push.apply(results, context.getElementsByClassName(selector_class));

	        return results;
	      }
	    }
	  }

	  results = queryAll(selector, context);

	  if (false === results) {
	    nonNativeSelector(selector, true);
	    return false;
	  }

	  return results;
	}
	function queryAll(selector, context) {
	  var results = [];
	  /**
	   * Try To Use Native QuerySelector All To Find Elements For The Provided Query
	   */

	  try {
	    var scope = context;

	    if (!isFunction(context.querySelectorAll)) {
	      if (!isUndefined(context.document) && isFunction(context.document.querySelectorAll)) {
	        scope = context.document;
	      } else if (!isUndefined(context.documentElement) && isFunction(context.documentElement.querySelectorAll)) {
	        scope = context.documentElement;
	      }
	    }

	    _push.apply(results, scope.querySelectorAll(selector));

	    return results;
	  } catch (e) {}

	  return false;
	}

	function child (selector, context, results, nextToken) {
	  return results.concat(_filter.call(queryAll(selector, context), function (el) {
	    return el.parentNode === context && filterElement(el, nextToken);
	  }));
	}

	function parent$1 (selector, context, results, nextToken) {}

	function adjacent (selector, context, results) {
	  var el = context.nextElementSibling;

	  if (el && matches(el, selector)) {
	    results.push(el);
	  }

	  return results;
	}

	function sibling (selector, context, results) {
	  var el = context.nextElementSibling;

	  while (el) {
	    if (matches(el, selector)) {
	      results.push(el);
	    }

	    el = el.nextElementSibling;
	  }

	  return results;
	}

	function descendant (selector, context, results, nextToken) {
	  return results.concat(_filter.call(queryAll(selector, context), function (el) {
	    return filterElement(el, nextToken);
	  }));
	}

	var combinators = {
	  '>': child,
	  '<': parent$1,
	  '+': adjacent,
	  '~': sibling,
	  ' ': descendant
	};

	function nextToken(currentPos, tokens) {
	  if (!isUndefined(tokens[currentPos])) {
	    if (tokens[currentPos].type === 'pseudo') {
	      if (!isMarkedFunction(pesudoHandlers[tokens[currentPos].id])) {
	        return {
	          token: tokens[currentPos++],
	          pos: currentPos
	        };
	      }
	    } else if (tokens[currentPos].type !== 'combinators' && tokens[currentPos].type !== 'descendant') {
	      return {
	        token: tokens[currentPos++],
	        pos: currentPos
	      };
	    }
	  }

	  return {
	    token: false,
	    pos: currentPos
	  };
	}

	function validateToken(tokens) {
	  return 'tag' === tokens[0].type || 'attr' === tokens[0].type && ('id' === tokens[0].id || 'class' === tokens[0].id) ? tokens : [{
	    type: 'descendant'
	  }].concat(tokens);
	}

	function findAdvanced(selectors, root) {
	  selectors = isString(selectors) ? parse(selectors) : selectors;
	  root = !_isArray(root) ? [root] : root;
	  return selectors.reduce(function (results, tokens) {
	    tokens = validateToken(tokens);
	    var i = 0,
	        len = tokens.length,
	        context = root;

	    var _loop = function _loop() {
	      var token = tokens[i++],
	          newToken = void 0,
	          combinator_callback = combinators[' '],

	      /**
	       * having selectors like `body :hidden` is not working since pseudo works only for elements array
	       * so had to modify the code know if we found any sort of combinators.
	       */
	      combinators_found = false;

	      if ((token.type === 'combinators' || token.type === 'descendant') && token.action in combinators) {
	        combinator_callback = combinators[token.action];
	        combinators_found = true;
	        token = tokens[i++];
	      }

	      var _token = token,
	          type = _token.type,
	          id = _token.id;

	      switch (type) {
	        case '*':
	          newToken = nextToken(i, tokens);
	          i = newToken.pos;
	          context = context.reduce(function (nodes, el) {
	            return combinator_callback('*', el, nodes, newToken.token);
	          }, []);
	          break;

	        case 'tag':
	          newToken = nextToken(i, tokens);
	          i = newToken.pos;
	          context = context.reduce(function (nodes, el) {
	            return combinator_callback(id, el, nodes, newToken.token);
	          }, []);
	          break;

	        case 'attr':
	          if ('id' === id || 'class' === id) {
	            newToken = nextToken(i, tokens);
	            i = newToken.pos;

	            var _selector = 'id' === id ? '#' : '.';

	            context = context.reduce(function (nodes, el) {
	              return combinator_callback("" + _selector + token.val, el, nodes, newToken.token);
	            }, []);
	          } else {
	            context = context.filter(function (el) {
	              return attrHandler(el, token);
	            });
	          }

	          break;

	        case 'pseudo':
	          if (context === root || combinators_found) {
	            context = context.reduce(function (nodes, el) {
	              return combinator_callback("*", el, nodes, false);
	            }, []);
	          }

	          context = pesudoHandler(context, token);
	          break;
	      }
	    };

	    while (i < len) {
	      _loop();
	    }

	    context.forEach(function (el) {
	      if (!results.includes(el)) {
	        results.push(el);
	      }
	    });
	    return results;
	  }, []);
	}
	function engine (selector, context) {
	  /**
	   * Node Types
	   * 1  -- Element Node
	   * 9  -- Document Node (document)
	   * 11 -- Document FRAGMENT
	   */
	  var results = false,
	      nodeType = context ? context.nodeType : 9;

	  if (isString(selector) && (results = selectorResultsCache(selector))) {
	    return results;
	  }
	  /**
	   * Checks if selector var is a !string or !empty and also check for given contxt node type (1,9,11)
	   */


	  if (!selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
	    return results;
	  }

	  context = context || currentDocument;

	  if (isString(selector)) {
	    results = nativeQuery(selector, context);
	  }

	  if (!results) {
	    results = findAdvanced(selector, context);
	  }

	  selectorResultsCache(selector, results);
	  return results;
	}

	DizzleCore.version = '1.0.0';
	DizzleCore.parse = parse;
	DizzleCore.find = engine;
	DizzleCore.cacheLength = 50;
	DizzleCore.combinators = combinators;
	DizzleCore.pesudo = pesudoHandlers;
	DizzleCore.attr = attrHandlers;
	DizzleCore.is = is;
	DizzleCore.filter = filter;
	setupMatcherFn();

	return DizzleCore;

})));
