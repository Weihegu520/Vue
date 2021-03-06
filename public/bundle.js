/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(63)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(20),
  /* template */
  __webpack_require__(47),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\article\\article.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] article.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-24d409cd", Component.options)
  } else {
    hotAPI.reload("data-v-24d409cd", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(25),
  /* template */
  __webpack_require__(49),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\list\\list.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] list.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-486f755f", Component.options)
  } else {
    hotAPI.reload("data-v-486f755f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * =====================================================
 * Mui v3.6.0 (http://dev.dcloud.net.cn/mui)
 * =====================================================
 */
/**
 * MUI核心JS
 * @type _L4.$|Function
 */
var mui = (function(document, undefined) {
	var readyRE = /complete|loaded|interactive/;
	var idSelectorRE = /^#([\w-]+)$/;
	var classSelectorRE = /^\.([\w-]+)$/;
	var tagSelectorRE = /^[\w-]+$/;
	var translateRE = /translate(?:3d)?\((.+?)\)/;
	var translateMatrixRE = /matrix(3d)?\((.+?)\)/;

	var $ = function(selector, context) {
		context = context || document;
		if (!selector)
			return wrap();
		if (typeof selector === 'object')
			if ($.isArrayLike(selector)) {
				return wrap($.slice.call(selector), null);
			} else {
				return wrap([selector], null);
			}
		if (typeof selector === 'function')
			return $.ready(selector);
		if (typeof selector === 'string') {
			try {
				selector = selector.trim();
				if (idSelectorRE.test(selector)) {
					var found = document.getElementById(RegExp.$1);
					return wrap(found ? [found] : []);
				}
				return wrap($.qsa(selector, context), selector);
			} catch (e) {}
		}
		return wrap();
	};

	var wrap = function(dom, selector) {
		dom = dom || [];
		Object.setPrototypeOf(dom, $.fn);
		dom.selector = selector || '';
		return dom;
	};

	$.uuid = 0;

	$.data = {};
	/**
	 * extend(simple)
	 * @param {type} target
	 * @param {type} source
	 * @param {type} deep
	 * @returns {unresolved}
	 */
	$.extend = function() { //from jquery2
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (typeof target === "boolean") {
			deep = target;

			target = arguments[i] || {};
			i++;
		}

		if (typeof target !== "object" && !$.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}

					if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && $.isArray(src) ? src : [];

						} else {
							clone = src && $.isPlainObject(src) ? src : {};
						}

						target[name] = $.extend(deep, clone, copy);

					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};
	/**
	 * mui noop(function)
	 */
	$.noop = function() {};
	/**
	 * mui slice(array)
	 */
	$.slice = [].slice;
	/**
	 * mui filter(array)
	 */
	$.filter = [].filter;

	$.type = function(obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
	/**
	 * mui isArray
	 */
	$.isArray = Array.isArray ||
		function(object) {
			return object instanceof Array;
		};
	/**
	 * mui isArrayLike 
	 * @param {Object} obj
	 */
	$.isArrayLike = function(obj) {
		var length = !!obj && "length" in obj && obj.length;
		var type = $.type(obj);
		if (type === "function" || $.isWindow(obj)) {
			return false;
		}
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	};
	/**
	 * mui isWindow(需考虑obj为undefined的情况)
	 */
	$.isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};
	/**
	 * mui isObject
	 */
	$.isObject = function(obj) {
		return $.type(obj) === "object";
	};
	/**
	 * mui isPlainObject
	 */
	$.isPlainObject = function(obj) {
		return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	};
	/**
	 * mui isEmptyObject
	 * @param {Object} o
	 */
	$.isEmptyObject = function(o) {
		for (var p in o) {
			if (p !== undefined) {
				return false;
			}
		}
		return true;
	};
	/**
	 * mui isFunction
	 */
	$.isFunction = function(value) {
		return $.type(value) === "function";
	};
	/**
	 * mui querySelectorAll
	 * @param {type} selector
	 * @param {type} context
	 * @returns {Array}
	 */
	$.qsa = function(selector, context) {
		context = context || document;
		return $.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
	};
	/**
	 * ready(DOMContentLoaded)
	 * @param {type} callback
	 * @returns {_L6.$}
	 */
	$.ready = function(callback) {
		if (readyRE.test(document.readyState)) {
			callback($);
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				callback($);
			}, false);
		}
		return this;
	};
	/**
	 * 将 fn 缓存一段时间后, 再被调用执行
	 * 此方法为了避免在 ms 段时间内, 执行 fn 多次. 常用于 resize , scroll , mousemove 等连续性事件中;
	 * 当 ms 设置为 -1, 表示立即执行 fn, 即和直接调用 fn 一样;
	 * 调用返回函数的 stop 停止最后一次的 buffer 效果
	 * @param {Object} fn
	 * @param {Object} ms
	 * @param {Object} context
	 */
	$.buffer = function(fn, ms, context) {
		var timer;
		var lastStart = 0;
		var lastEnd = 0;
		var ms = ms || 150;

		function run() {
			if (timer) {
				timer.cancel();
				timer = 0;
			}
			lastStart = $.now();
			fn.apply(context || this, arguments);
			lastEnd = $.now();
		}

		return $.extend(function() {
			if (
				(!lastStart) || // 从未运行过
				(lastEnd >= lastStart && $.now() - lastEnd > ms) || // 上次运行成功后已经超过ms毫秒
				(lastEnd < lastStart && $.now() - lastStart > ms * 8) // 上次运行或未完成，后8*ms毫秒
			) {
				run();
			} else {
				if (timer) {
					timer.cancel();
				}
				timer = $.later(run, ms, null, arguments);
			}
		}, {
			stop: function() {
				if (timer) {
					timer.cancel();
					timer = 0;
				}
			}
		});
	};
	/**
	 * each
	 * @param {type} elements
	 * @param {type} callback
	 * @returns {_L8.$}
	 */
	$.each = function(elements, callback, hasOwnProperty) {
		if (!elements) {
			return this;
		}
		if (typeof elements.length === 'number') {
			[].every.call(elements, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
		} else {
			for (var key in elements) {
				if (hasOwnProperty) {
					if (elements.hasOwnProperty(key)) {
						if (callback.call(elements[key], key, elements[key]) === false) return elements;
					}
				} else {
					if (callback.call(elements[key], key, elements[key]) === false) return elements;
				}
			}
		}
		return this;
	};
	$.focus = function(element) {
		if ($.os.ios) {
			setTimeout(function() {
				element.focus();
			}, 10);
		} else {
			element.focus();
		}
	};
	/**
	 * trigger event
	 * @param {type} element
	 * @param {type} eventType
	 * @param {type} eventData
	 * @returns {_L8.$}
	 */
	$.trigger = function(element, eventType, eventData) {
		element.dispatchEvent(new CustomEvent(eventType, {
			detail: eventData,
			bubbles: true,
			cancelable: true
		}));
		return this;
	};
	/**
	 * getStyles
	 * @param {type} element
	 * @param {type} property
	 * @returns {styles}
	 */
	$.getStyles = function(element, property) {
		var styles = element.ownerDocument.defaultView.getComputedStyle(element, null);
		if (property) {
			return styles.getPropertyValue(property) || styles[property];
		}
		return styles;
	};
	/**
	 * parseTranslate
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	$.parseTranslate = function(translateString, position) {
		var result = translateString.match(translateRE || '');
		if (!result || !result[1]) {
			result = ['', '0,0,0'];
		}
		result = result[1].split(",");
		result = {
			x: parseFloat(result[0]),
			y: parseFloat(result[1]),
			z: parseFloat(result[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	/**
	 * parseTranslateMatrix
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	$.parseTranslateMatrix = function(translateString, position) {
		var matrix = translateString.match(translateMatrixRE);
		var is3D = matrix && matrix[1];
		if (matrix) {
			matrix = matrix[2].split(",");
			if (is3D === "3d")
				matrix = matrix.slice(12, 15);
			else {
				matrix.push(0);
				matrix = matrix.slice(4, 7);
			}
		} else {
			matrix = [0, 0, 0];
		}
		var result = {
			x: parseFloat(matrix[0]),
			y: parseFloat(matrix[1]),
			z: parseFloat(matrix[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	$.hooks = {};
	$.addAction = function(type, hook) {
		var hooks = $.hooks[type];
		if (!hooks) {
			hooks = [];
		}
		hook.index = hook.index || 1000;
		hooks.push(hook);
		hooks.sort(function(a, b) {
			return a.index - b.index;
		});
		$.hooks[type] = hooks;
		return $.hooks[type];
	};
	$.doAction = function(type, callback) {
		if ($.isFunction(callback)) { //指定了callback
			$.each($.hooks[type], callback);
		} else { //未指定callback，直接执行
			$.each($.hooks[type], function(index, hook) {
				return !hook.handle();
			});
		}
	};
	/**
	 * setTimeout封装
	 * @param {Object} fn
	 * @param {Object} when
	 * @param {Object} context
	 * @param {Object} data
	 */
	$.later = function(fn, when, context, data) {
		when = when || 0;
		var m = fn;
		var d = data;
		var f;
		var r;

		if (typeof fn === 'string') {
			m = context[fn];
		}

		f = function() {
			m.apply(context, $.isArray(d) ? d : [d]);
		};

		r = setTimeout(f, when);

		return {
			id: r,
			cancel: function() {
				clearTimeout(r);
			}
		};
	};
	$.now = Date.now || function() {
		return +new Date();
	};
	var class2type = {};
	$.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});
	if (window.JSON) {
		$.parseJSON = JSON.parse;
	}
	/**
	 * $.fn
	 */
	$.fn = {
		each: function(callback) {
			[].every.call(this, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
			return this;
		}
	};

	/**
	 * 兼容 AMD 模块
	 **/
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return $;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	return $;
})(document);
//window.mui = mui;
//'$' in window || (window.$ = mui);
/**
 * $.os
 * @param {type} $
 * @returns {undefined}
 */
(function($, window) {
	function detect(ua) {
		this.os = {};
		var funcs = [

			function() { //wechat
				var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
				if (wechat) { //wechat
					this.os.wechat = {
						version: wechat[2].replace(/_/g, '.')
					};
				}
				return false;
			},
			function() { //android
				var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
				if (android) {
					this.os.android = true;
					this.os.version = android[2];

					this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
				}
				return this.os.android === true;
			},
			function() { //ios
				var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
				if (iphone) { //iphone
					this.os.ios = this.os.iphone = true;
					this.os.version = iphone[2].replace(/_/g, '.');
				} else {
					var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
					if (ipad) { //ipad
						this.os.ios = this.os.ipad = true;
						this.os.version = ipad[2].replace(/_/g, '.');
					}
				}
				return this.os.ios === true;
			}
		];
		[].every.call(funcs, function(func) {
			return !func.call($);
		});
	}
	detect.call($, navigator.userAgent);
})(mui, window);
/**
 * $.os.plus
 * @param {type} $
 * @returns {undefined}
 */
(function($, document) {
	function detect(ua) {
		this.os = this.os || {};
		var plus = ua.match(/Html5Plus/i); //TODO 5\+Browser?
		if (plus) {
			this.os.plus = true;
			$(function() {
				document.body.classList.add('mui-plus');
			});
			if (ua.match(/StreamApp/i)) { //TODO 最好有流应用自己的标识
				this.os.stream = true;
				$(function() {
					document.body.classList.add('mui-plus-stream');
				});
			}
		}
	}
	detect.call($, navigator.userAgent);
})(mui, document);
/**
 * 仅提供简单的on，off(仅支持事件委托，不支持当前元素绑定，当前元素绑定请直接使用addEventListener,removeEventListener)
 * @param {Object} $
 */
(function($) {
	if ('ontouchstart' in window) {
		$.isTouchable = true;
		$.EVENT_START = 'touchstart';
		$.EVENT_MOVE = 'touchmove';
		$.EVENT_END = 'touchend';
	} else {
		$.isTouchable = false;
		$.EVENT_START = 'mousedown';
		$.EVENT_MOVE = 'mousemove';
		$.EVENT_END = 'mouseup';
	}
	$.EVENT_CANCEL = 'touchcancel';
	$.EVENT_CLICK = 'click';

	var _mid = 1;
	var delegates = {};
	//需要wrap的函数
	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};
	//默认true返回函数
	var returnTrue = function() {
		return true
	};
	//默认false返回函数
	var returnFalse = function() {
		return false
	};
	//wrap浏览器事件
	var compatible = function(event, target) {
		if (!event.detail) {
			event.detail = {
				currentTarget: target
			};
		} else {
			event.detail.currentTarget = target;
		}
		$.each(eventMethods, function(name, predicate) {
			var sourceMethod = event[name];
			event[name] = function() {
				this[predicate] = returnTrue;
				return sourceMethod && sourceMethod.apply(event, arguments)
			}
			event[predicate] = returnFalse;
		}, true);
		return event;
	};
	//简单的wrap对象_mid
	var mid = function(obj) {
		return obj && (obj._mid || (obj._mid = _mid++));
	};
	//事件委托对象绑定的事件回调列表
	var delegateFns = {};
	//返回事件委托的wrap事件回调
	var delegateFn = function(element, event, selector, callback) {
		return function(e) {
			//same event
			var callbackObjs = delegates[element._mid][event];
			var handlerQueue = [];
			var target = e.target;
			var selectorAlls = {};
			for (; target && target !== document; target = target.parentNode) {
				if (target === element) {
					break;
				}
				if (~['click', 'tap', 'doubletap', 'longtap', 'hold'].indexOf(event) && (target.disabled || target.classList.contains('mui-disabled'))) {
					break;
				}
				var matches = {};
				$.each(callbackObjs, function(selector, callbacks) { //same selector
					selectorAlls[selector] || (selectorAlls[selector] = $.qsa(selector, element));
					if (selectorAlls[selector] && ~(selectorAlls[selector]).indexOf(target)) {
						if (!matches[selector]) {
							matches[selector] = callbacks;
						}
					}
				}, true);
				if (!$.isEmptyObject(matches)) {
					handlerQueue.push({
						element: target,
						handlers: matches
					});
				}
			}
			selectorAlls = null;
			e = compatible(e); //compatible event
			$.each(handlerQueue, function(index, handler) {
				target = handler.element;
				var tagName = target.tagName;
				if (event === 'tap' && (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT')) {
					e.preventDefault();
					e.detail && e.detail.gesture && e.detail.gesture.preventDefault();
				}
				$.each(handler.handlers, function(index, handler) {
					$.each(handler, function(index, callback) {
						if (callback.call(target, e) === false) {
							e.preventDefault();
							e.stopPropagation();
						}
					}, true);
				}, true)
				if (e.isPropagationStopped()) {
					return false;
				}
			}, true);
		};
	};
	var findDelegateFn = function(element, event) {
		var delegateCallbacks = delegateFns[mid(element)];
		var result = [];
		if (delegateCallbacks) {
			result = [];
			if (event) {
				var filterFn = function(fn) {
					return fn.type === event;
				}
				return delegateCallbacks.filter(filterFn);
			} else {
				result = delegateCallbacks;
			}
		}
		return result;
	};
	var preventDefaultException = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;
	/**
	 * mui delegate events
	 * @param {type} event
	 * @param {type} selector
	 * @param {type} callback
	 * @returns {undefined}
	 */
	$.fn.on = function(event, selector, callback) { //仅支持简单的事件委托,主要是tap事件使用，类似mouse,focus之类暂不封装支持
		return this.each(function() {
			var element = this;
			mid(element);
			mid(callback);
			var isAddEventListener = false;
			var delegateEvents = delegates[element._mid] || (delegates[element._mid] = {});
			var delegateCallbackObjs = delegateEvents[event] || ((delegateEvents[event] = {}));
			if ($.isEmptyObject(delegateCallbackObjs)) {
				isAddEventListener = true;
			}
			var delegateCallbacks = delegateCallbackObjs[selector] || (delegateCallbackObjs[selector] = []);
			delegateCallbacks.push(callback);
			if (isAddEventListener) {
				var delegateFnArray = delegateFns[mid(element)];
				if (!delegateFnArray) {
					delegateFnArray = [];
				}
				var delegateCallback = delegateFn(element, event, selector, callback);
				delegateFnArray.push(delegateCallback);
				delegateCallback.i = delegateFnArray.length - 1;
				delegateCallback.type = event;
				delegateFns[mid(element)] = delegateFnArray;
				element.addEventListener(event, delegateCallback);
				if (event === 'tap') { //TODO 需要找个更好的解决方案
					element.addEventListener('click', function(e) {
						if (e.target) {
							var tagName = e.target.tagName;
							if (!preventDefaultException.test(tagName)) {
								if (tagName === 'A') {
									var href = e.target.href;
									if (!(href && ~href.indexOf('tel:'))) {
										e.preventDefault();
									}
								} else {
									e.preventDefault();
								}
							}
						}
					});
				}
			}
		});
	};
	$.fn.off = function(event, selector, callback) {
		return this.each(function() {
			var _mid = mid(this);
			if (!event) { //mui(selector).off();
				delegates[_mid] && delete delegates[_mid];
			} else if (!selector) { //mui(selector).off(event);
				delegates[_mid] && delete delegates[_mid][event];
			} else if (!callback) { //mui(selector).off(event,selector);
				delegates[_mid] && delegates[_mid][event] && delete delegates[_mid][event][selector];
			} else { //mui(selector).off(event,selector,callback);
				var delegateCallbacks = delegates[_mid] && delegates[_mid][event] && delegates[_mid][event][selector];
				$.each(delegateCallbacks, function(index, delegateCallback) {
					if (mid(delegateCallback) === mid(callback)) {
						delegateCallbacks.splice(index, 1);
						return false;
					}
				}, true);
			}
			if (delegates[_mid]) {
				//如果off掉了所有当前element的指定的event事件，则remove掉当前element的delegate回调
				if ((!delegates[_mid][event] || $.isEmptyObject(delegates[_mid][event]))) {
					findDelegateFn(this, event).forEach(function(fn) {
						this.removeEventListener(fn.type, fn);
						delete delegateFns[_mid][fn.i];
					}.bind(this));
				}
			} else {
				//如果delegates[_mid]已不存在，删除所有
				findDelegateFn(this).forEach(function(fn) {
					this.removeEventListener(fn.type, fn);
					delete delegateFns[_mid][fn.i];
				}.bind(this));
			}
		});

	};
})(mui);
/**
 * mui target(action>popover>modal>tab>toggle)
 */
(function($, window, document) {
	/**
	 * targets
	 */
	$.targets = {};
	/**
	 * target handles
	 */
	$.targetHandles = [];
	/**
	 * register target
	 * @param {type} target
	 * @returns {$.targets}
	 */
	$.registerTarget = function(target) {

		target.index = target.index || 1000;

		$.targetHandles.push(target);

		$.targetHandles.sort(function(a, b) {
			return a.index - b.index;
		});

		return $.targetHandles;
	};
	window.addEventListener($.EVENT_START, function(event) {
		var target = event.target;
		var founds = {};
		for (; target && target !== document; target = target.parentNode) {
			var isFound = false;
			$.each($.targetHandles, function(index, targetHandle) {
				var name = targetHandle.name;
				if (!isFound && !founds[name] && targetHandle.hasOwnProperty('handle')) {
					$.targets[name] = targetHandle.handle(event, target);
					if ($.targets[name]) {
						founds[name] = true;
						if (targetHandle.isContinue !== true) {
							isFound = true;
						}
					}
				} else {
					if (!founds[name]) {
						if (targetHandle.isReset !== false)
							$.targets[name] = false;
					}
				}
			});
			if (isFound) {
				break;
			}
		}
	});
	window.addEventListener('click', function(event) { //解决touch与click的target不一致的问题(比如链接边缘点击时，touch的target为html，而click的target为A)
		var target = event.target;
		var isFound = false;
		for (; target && target !== document; target = target.parentNode) {
			if (target.tagName === 'A') {
				$.each($.targetHandles, function(index, targetHandle) {
					var name = targetHandle.name;
					if (targetHandle.hasOwnProperty('handle')) {
						if (targetHandle.handle(event, target)) {
							isFound = true;
							event.preventDefault();
							return false;
						}
					}
				});
				if (isFound) {
					break;
				}
			}
		}
	});
})(mui, window, document);
/**
 * fixed trim
 * @param {type} undefined
 * @returns {undefined}
 */
(function(undefined) {
	if (String.prototype.trim === undefined) { // fix for iOS 3.2
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
		obj['__proto__'] = proto;
		return obj;
	};

})();
/**
 * fixed CustomEvent
 */
(function() {
	if (typeof window.CustomEvent === 'undefined') {
		function CustomEvent(event, params) {
			params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};
			var evt = document.createEvent('Events');
			var bubbles = true;
			for (var name in params) {
				(name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
			}
			evt.initEvent(event, bubbles, true);
			return evt;
		};
		CustomEvent.prototype = window.Event.prototype;
		window.CustomEvent = CustomEvent;
	}
})();
/*
	A shim for non ES5 supporting browsers.
	Adds function bind to Function prototype, so that you can do partial application.
	Works even with the nasty thing, where the first word is the opposite of extranet, the second one is the profession of Columbus, and the version number is 9, flipped 180 degrees.
*/

Function.prototype.bind = Function.prototype.bind || function(to) {
	// Make an array of our arguments, starting from second argument
	var partial = Array.prototype.splice.call(arguments, 1),
		// We'll need the original function.
		fn = this;
	var bound = function() {
			// Join the already applied arguments to the now called ones (after converting to an array again).
			var args = partial.concat(Array.prototype.splice.call(arguments, 0));
			// If not being called as a constructor
			if (!(this instanceof bound)) {
				// return the result of the function called bound to target and partially applied.
				return fn.apply(to, args);
			}
			// If being called as a constructor, apply the function bound to self.
			fn.apply(this, args);
		}
		// Attach the prototype of the function to our newly created function.
	bound.prototype = fn.prototype;
	return bound;
};
/**
 * mui fixed classList
 * @param {type} document
 * @returns {undefined}
 */
(function(document) {
    if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {

        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/),
                                index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    };
                }

                var ret = {
                    add: update(function(classes, index, value) {
                        ~index || classes.push(value);
                    }),
                    remove: update(function(classes, index) {
                        ~index && classes.splice(index, 1);
                    }),
                    toggle: update(function(classes, index, value) {
                        ~index ? classes.splice(index, 1) : classes.push(value);
                    }),
                    contains: function(value) {
                        return !!~self.className.split(/\s+/).indexOf(value);
                    },
                    item: function(i) {
                        return self.className.split(/\s+/)[i] || null;
                    }
                };

                Object.defineProperty(ret, 'length', {
                    get: function() {
                        return self.className.split(/\s+/).length;
                    }
                });

                return ret;
            }
        });
    }
})(document);

/**
 * mui fixed requestAnimationFrame
 * @param {type} window
 * @returns {undefined}
 */
(function(window) {
	if (!window.requestAnimationFrame) {
		var lastTime = 0;
		window.requestAnimationFrame = window.webkitRequestAnimationFrame || function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
		window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || function(id) {
			clearTimeout(id);
		};
	};
}(window));
/**
 * fastclick(only for radio,checkbox)
 */
(function($, window, name) {
	if (!$.os.android && !$.os.ios) { //目前仅识别android和ios
		return;
	}
	if (window.FastClick) {
		return;
	}

	var handle = function(event, target) {
		if (target.tagName === 'LABEL') {
			if (target.parentNode) {
				target = target.parentNode.querySelector('input');
			}
		}
		if (target && (target.type === 'radio' || target.type === 'checkbox')) {
			if (!target.disabled) { //disabled
				return target;
			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 40,
		handle: handle,
		target: false
	});
	var dispatchEvent = function(event) {
		var targetElement = $.targets.click;
		if (targetElement) {
			var clickEvent, touch;
			// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect
			if (document.activeElement && document.activeElement !== targetElement) {
				document.activeElement.blur();
			}
			touch = event.detail.gesture.changedTouches[0];
			// Synthesise a click event, with an extra attribute so it can be tracked
			clickEvent = document.createEvent('MouseEvents');
			clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			clickEvent.forwardedTouchEvent = true;
			targetElement.dispatchEvent(clickEvent);
			event.detail && event.detail.gesture.preventDefault();
		}
	};
	window.addEventListener('tap', dispatchEvent);
	window.addEventListener('doubletap', dispatchEvent);
	//捕获
	window.addEventListener('click', function(event) {
		if ($.targets.click) {
			if (!event.forwardedTouchEvent) { //stop click
				if (event.stopImmediatePropagation) {
					event.stopImmediatePropagation();
				} else {
					// Part of the hack for browsers that don't support Event#stopImmediatePropagation
					event.propagationStopped = true;
				}
				event.stopPropagation();
				event.preventDefault();
				return false;
			}
		}
	}, true);

})(mui, window, 'click');
(function($, document) {
	$(function() {
		if (!$.os.ios) {
			return;
		}
		var CLASS_FOCUSIN = 'mui-focusin';
		var CLASS_BAR_TAB = 'mui-bar-tab';
		var CLASS_BAR_FOOTER = 'mui-bar-footer';
		var CLASS_BAR_FOOTER_SECONDARY = 'mui-bar-footer-secondary';
		var CLASS_BAR_FOOTER_SECONDARY_TAB = 'mui-bar-footer-secondary-tab';
		// var content = document.querySelector('.' + CLASS_CONTENT);
		// if (content) {
		// 	document.body.insertBefore(content, document.body.firstElementChild);
		// }
		document.addEventListener('focusin', function(e) {
			if ($.os.plus) { //在父webview里边不fix
				if (window.plus) {
					if (plus.webview.currentWebview().children().length > 0) {
						return;
					}
				}
			}
			var target = e.target;
			//TODO 需考虑所有键盘弹起的情况
			if (target.tagName && (target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && (target.type === 'text' || target.type === 'search' || target.type === 'number')))) {
				if (target.disabled || target.readOnly) {
					return;
				}
				document.body.classList.add(CLASS_FOCUSIN);
				var isFooter = false;
				for (; target && target !== document; target = target.parentNode) {
					var classList = target.classList;
					if (classList && classList.contains(CLASS_BAR_TAB) || classList.contains(CLASS_BAR_FOOTER) || classList.contains(CLASS_BAR_FOOTER_SECONDARY) || classList.contains(CLASS_BAR_FOOTER_SECONDARY_TAB)) {
						isFooter = true;
						break;
					}
				}
				if (isFooter) {
					var scrollTop = document.body.scrollHeight;
					var scrollLeft = document.body.scrollLeft;
					setTimeout(function() {
						window.scrollTo(scrollLeft, scrollTop);
					}, 20);
				}
			}
		});
		document.addEventListener('focusout', function(e) {
			var classList = document.body.classList;
			if (classList.contains(CLASS_FOCUSIN)) {
				classList.remove(CLASS_FOCUSIN);
				setTimeout(function() {
					window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
				}, 20);
			}
		});
	});
})(mui, document);
/**
 * mui namespace(optimization)
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	$.namespace = 'mui';
	$.classNamePrefix = $.namespace + '-';
	$.classSelectorPrefix = '.' + $.classNamePrefix;
	/**
	 * 返回正确的className
	 * @param {type} className
	 * @returns {String}
	 */
	$.className = function(className) {
		return $.classNamePrefix + className;
	};
	/**
	 * 返回正确的classSelector
	 * @param {type} classSelector
	 * @returns {String}
	 */
	$.classSelector = function(classSelector) {
		return classSelector.replace(/\./g, $.classSelectorPrefix);
	};
	/**
         * 返回正确的eventName
         * @param {type} event
         * @param {type} module
         * @returns {String}
         */
	$.eventName = function(event, module) {
		return event + ($.namespace ? ('.' + $.namespace) : '') + ( module ? ('.' + module) : '');
	};
})(mui);

/**
 * mui gestures
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
	$.gestures = {
		session: {}
	};
	/**
	 * Gesture preventDefault
	 * @param {type} e
	 * @returns {undefined}
	 */
	$.preventDefault = function(e) {
		e.preventDefault();
	};
	/**
	 * Gesture stopPropagation
	 * @param {type} e
	 * @returns {undefined}
	 */
	$.stopPropagation = function(e) {
		e.stopPropagation();
	};

	/**
	 * register gesture
	 * @param {type} gesture
	 * @returns {$.gestures}
	 */
	$.addGesture = function(gesture) {
		return $.addAction('gestures', gesture);

	};

	var round = Math.round;
	var abs = Math.abs;
	var sqrt = Math.sqrt;
	var atan = Math.atan;
	var atan2 = Math.atan2;
	/**
	 * distance
	 * @param {type} p1
	 * @param {type} p2
	 * @returns {Number}
	 */
	var getDistance = function(p1, p2, props) {
		if (!props) {
			props = ['x', 'y'];
		}
		var x = p2[props[0]] - p1[props[0]];
		var y = p2[props[1]] - p1[props[1]];
		return sqrt((x * x) + (y * y));
	};
	/**
	 * scale
	 * @param {Object} starts
	 * @param {Object} moves
	 */
	var getScale = function(starts, moves) {
		if (starts.length >= 2 && moves.length >= 2) {
			var props = ['pageX', 'pageY'];
			return getDistance(moves[1], moves[0], props) / getDistance(starts[1], starts[0], props);
		}
		return 1;
	};
	/**
	 * angle
	 * @param {type} p1
	 * @param {type} p2
	 * @returns {Number}
	 */
	var getAngle = function(p1, p2, props) {
		if (!props) {
			props = ['x', 'y'];
		}
		var x = p2[props[0]] - p1[props[0]];
		var y = p2[props[1]] - p1[props[1]];
		return atan2(y, x) * 180 / Math.PI;
	};
	/**
	 * direction
	 * @param {Object} x
	 * @param {Object} y
	 */
	var getDirection = function(x, y) {
		if (x === y) {
			return '';
		}
		if (abs(x) >= abs(y)) {
			return x > 0 ? 'left' : 'right';
		}
		return y > 0 ? 'up' : 'down';
	};
	/**
	 * rotation
	 * @param {Object} start
	 * @param {Object} end
	 */
	var getRotation = function(start, end) {
		var props = ['pageX', 'pageY'];
		return getAngle(end[1], end[0], props) - getAngle(start[1], start[0], props);
	};
	/**
	 * px per ms
	 * @param {Object} deltaTime
	 * @param {Object} x
	 * @param {Object} y
	 */
	var getVelocity = function(deltaTime, x, y) {
		return {
			x: x / deltaTime || 0,
			y: y / deltaTime || 0
		};
	};
	/**
	 * detect gestures
	 * @param {type} event
	 * @param {type} touch
	 * @returns {undefined}
	 */
	var detect = function(event, touch) {
		if ($.gestures.stoped) {
			return;
		}
		$.doAction('gestures', function(index, gesture) {
			if (!$.gestures.stoped) {
				if ($.options.gestureConfig[gesture.name] !== false) {
					gesture.handle(event, touch);
				}
			}
		});
	};
	/**
	 * 暂时无用
	 * @param {Object} node
	 * @param {Object} parent
	 */
	var hasParent = function(node, parent) {
		while (node) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	};

	var uniqueArray = function(src, key, sort) {
		var results = [];
		var values = [];
		var i = 0;

		while (i < src.length) {
			var val = key ? src[i][key] : src[i];
			if (values.indexOf(val) < 0) {
				results.push(src[i]);
			}
			values[i] = val;
			i++;
		}

		if (sort) {
			if (!key) {
				results = results.sort();
			} else {
				results = results.sort(function sortUniqueArray(a, b) {
					return a[key] > b[key];
				});
			}
		}

		return results;
	};
	var getMultiCenter = function(touches) {
		var touchesLength = touches.length;
		if (touchesLength === 1) {
			return {
				x: round(touches[0].pageX),
				y: round(touches[0].pageY)
			};
		}

		var x = 0;
		var y = 0;
		var i = 0;
		while (i < touchesLength) {
			x += touches[i].pageX;
			y += touches[i].pageY;
			i++;
		}

		return {
			x: round(x / touchesLength),
			y: round(y / touchesLength)
		};
	};
	var multiTouch = function() {
		return $.options.gestureConfig.pinch;
	};
	var copySimpleTouchData = function(touch) {
		var touches = [];
		var i = 0;
		while (i < touch.touches.length) {
			touches[i] = {
				pageX: round(touch.touches[i].pageX),
				pageY: round(touch.touches[i].pageY)
			};
			i++;
		}
		return {
			timestamp: $.now(),
			gesture: touch.gesture,
			touches: touches,
			center: getMultiCenter(touch.touches),
			deltaX: touch.deltaX,
			deltaY: touch.deltaY
		};
	};

	var calDelta = function(touch) {
		var session = $.gestures.session;
		var center = touch.center;
		var offset = session.offsetDelta || {};
		var prevDelta = session.prevDelta || {};
		var prevTouch = session.prevTouch || {};

		if (touch.gesture.type === $.EVENT_START || touch.gesture.type === $.EVENT_END) {
			prevDelta = session.prevDelta = {
				x: prevTouch.deltaX || 0,
				y: prevTouch.deltaY || 0
			};

			offset = session.offsetDelta = {
				x: center.x,
				y: center.y
			};
		}
		touch.deltaX = prevDelta.x + (center.x - offset.x);
		touch.deltaY = prevDelta.y + (center.y - offset.y);
	};
	var calTouchData = function(touch) {
		var session = $.gestures.session;
		var touches = touch.touches;
		var touchesLength = touches.length;

		if (!session.firstTouch) {
			session.firstTouch = copySimpleTouchData(touch);
		}

		if (multiTouch() && touchesLength > 1 && !session.firstMultiTouch) {
			session.firstMultiTouch = copySimpleTouchData(touch);
		} else if (touchesLength === 1) {
			session.firstMultiTouch = false;
		}

		var firstTouch = session.firstTouch;
		var firstMultiTouch = session.firstMultiTouch;
		var offsetCenter = firstMultiTouch ? firstMultiTouch.center : firstTouch.center;

		var center = touch.center = getMultiCenter(touches);
		touch.timestamp = $.now();
		touch.deltaTime = touch.timestamp - firstTouch.timestamp;

		touch.angle = getAngle(offsetCenter, center);
		touch.distance = getDistance(offsetCenter, center);

		calDelta(touch);

		touch.offsetDirection = getDirection(touch.deltaX, touch.deltaY);

		touch.scale = firstMultiTouch ? getScale(firstMultiTouch.touches, touches) : 1;
		touch.rotation = firstMultiTouch ? getRotation(firstMultiTouch.touches, touches) : 0;

		calIntervalTouchData(touch);

	};
	var CAL_INTERVAL = 25;
	var calIntervalTouchData = function(touch) {
		var session = $.gestures.session;
		var last = session.lastInterval || touch;
		var deltaTime = touch.timestamp - last.timestamp;
		var velocity;
		var velocityX;
		var velocityY;
		var direction;

		if (touch.gesture.type != $.EVENT_CANCEL && (deltaTime > CAL_INTERVAL || last.velocity === undefined)) {
			var deltaX = last.deltaX - touch.deltaX;
			var deltaY = last.deltaY - touch.deltaY;

			var v = getVelocity(deltaTime, deltaX, deltaY);
			velocityX = v.x;
			velocityY = v.y;
			velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
			direction = getDirection(deltaX, deltaY) || last.direction;

			session.lastInterval = touch;
		} else {
			velocity = last.velocity;
			velocityX = last.velocityX;
			velocityY = last.velocityY;
			direction = last.direction;
		}

		touch.velocity = velocity;
		touch.velocityX = velocityX;
		touch.velocityY = velocityY;
		touch.direction = direction;
	};
	var targetIds = {};
	var convertTouches = function(touches) {
		for (var i = 0; i < touches.length; i++) {
			!touches['identifier'] && (touches['identifier'] = 0);
		}
		return touches;
	};
	var getTouches = function(event, touch) {
		var allTouches = convertTouches($.slice.call(event.touches || [event]));

		var type = event.type;

		var targetTouches = [];
		var changedTargetTouches = [];

		//当touchstart或touchmove且touches长度为1，直接获得all和changed
		if ((type === $.EVENT_START || type === $.EVENT_MOVE) && allTouches.length === 1) {
			targetIds[allTouches[0].identifier] = true;
			targetTouches = allTouches;
			changedTargetTouches = allTouches;
			touch.target = event.target;
		} else {
			var i = 0;
			var targetTouches = [];
			var changedTargetTouches = [];
			var changedTouches = convertTouches($.slice.call(event.changedTouches || [event]));

			touch.target = event.target;
			var sessionTarget = $.gestures.session.target || event.target;
			targetTouches = allTouches.filter(function(touch) {
				return hasParent(touch.target, sessionTarget);
			});

			if (type === $.EVENT_START) {
				i = 0;
				while (i < targetTouches.length) {
					targetIds[targetTouches[i].identifier] = true;
					i++;
				}
			}

			i = 0;
			while (i < changedTouches.length) {
				if (targetIds[changedTouches[i].identifier]) {
					changedTargetTouches.push(changedTouches[i]);
				}
				if (type === $.EVENT_END || type === $.EVENT_CANCEL) {
					delete targetIds[changedTouches[i].identifier];
				}
				i++;
			}

			if (!changedTargetTouches.length) {
				return false;
			}
		}
		targetTouches = uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true);
		var touchesLength = targetTouches.length;
		var changedTouchesLength = changedTargetTouches.length;
		if (type === $.EVENT_START && touchesLength - changedTouchesLength === 0) { //first
			touch.isFirst = true;
			$.gestures.touch = $.gestures.session = {
				target: event.target
			};
		}
		touch.isFinal = ((type === $.EVENT_END || type === $.EVENT_CANCEL) && (touchesLength - changedTouchesLength === 0));

		touch.touches = targetTouches;
		touch.changedTouches = changedTargetTouches;
		return true;

	};
	var handleTouchEvent = function(event) {
		var touch = {
			gesture: event
		};
		var touches = getTouches(event, touch);
		if (!touches) {
			return;
		}
		calTouchData(touch);
		detect(event, touch);
		$.gestures.session.prevTouch = touch;
		if (event.type === $.EVENT_END && !$.isTouchable) {
			$.gestures.touch = $.gestures.session = {};
		}
	};
	window.addEventListener($.EVENT_START, handleTouchEvent);
	window.addEventListener($.EVENT_MOVE, handleTouchEvent);
	window.addEventListener($.EVENT_END, handleTouchEvent);
	window.addEventListener($.EVENT_CANCEL, handleTouchEvent);
	//fixed hashchange(android)
	window.addEventListener($.EVENT_CLICK, function(e) {
		//TODO 应该判断当前target是不是在targets.popover内部，而不是非要相等
		if (($.os.android || $.os.ios) && (($.targets.popover && e.target === $.targets.popover) || ($.targets.tab) || $.targets.offcanvas || $.targets.modal)) {
			e.preventDefault();
		}
	}, true);


	//增加原生滚动识别
	$.isScrolling = false;
	var scrollingTimeout = null;
	window.addEventListener('scroll', function() {
		$.isScrolling = true;
		scrollingTimeout && clearTimeout(scrollingTimeout);
		scrollingTimeout = setTimeout(function() {
			$.isScrolling = false;
		}, 250);
	});
})(mui, window);
/**
 * mui gesture flick[left|right|up|down]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var flickStartTime = 0;
	var handle = function(event, touch) {
		var session = $.gestures.session;
		var options = this.options;
		var now = $.now();
		switch (event.type) {
			case $.EVENT_MOVE:
				if (now - flickStartTime > 300) {
					flickStartTime = now;
					session.flickStart = touch.center;
				}
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				touch.flick = false;
				if (session.flickStart && options.flickMaxTime > (now - flickStartTime) && touch.distance > options.flickMinDistince) {
					touch.flick = true;
					touch.flickTime = now - flickStartTime;
					touch.flickDistanceX = touch.center.x - session.flickStart.x;
					touch.flickDistanceY = touch.center.y - session.flickStart.y;
					$.trigger(session.target, name, touch);
					$.trigger(session.target, name + touch.direction, touch);
				}
				break;
		}

	};
	/**
	 * mui gesture flick
	 */
	$.addGesture({
		name: name,
		index: 5,
		handle: handle,
		options: {
			flickMaxTime: 200,
			flickMinDistince: 10
		}
	});
})(mui, 'flick');
/**
 * mui gesture swipe[left|right|up|down]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var handle = function(event, touch) {
		var session = $.gestures.session;
		if (event.type === $.EVENT_END || event.type === $.EVENT_CANCEL) {
			var options = this.options;
			touch.swipe = false;
			//TODO 后续根据velocity计算
			if (touch.direction && options.swipeMaxTime > touch.deltaTime && touch.distance > options.swipeMinDistince) {
				touch.swipe = true;
				$.trigger(session.target, name, touch);
				$.trigger(session.target, name + touch.direction, touch);
			}
		}
	};
	/**
	 * mui gesture swipe
	 */
	$.addGesture({
		name: name,
		index: 10,
		handle: handle,
		options: {
			swipeMaxTime: 300,
			swipeMinDistince: 18
		}
	});
})(mui, 'swipe');
/**
 * mui gesture drag[start|left|right|up|down|end]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var handle = function(event, touch) {
		var session = $.gestures.session;
		switch (event.type) {
			case $.EVENT_START:
				break;
			case $.EVENT_MOVE:
				if (!touch.direction || !session.target) {
					return;
				}
				//修正direction,可在session期间自行锁定拖拽方向，方便开发scroll类不同方向拖拽插件嵌套
				if (session.lockDirection && session.startDirection) {
					if (session.startDirection && session.startDirection !== touch.direction) {
						if (session.startDirection === 'up' || session.startDirection === 'down') {
							touch.direction = touch.deltaY < 0 ? 'up' : 'down';
						} else {
							touch.direction = touch.deltaX < 0 ? 'left' : 'right';
						}
					}
				}

				if (!session.drag) {
					session.drag = true;
					$.trigger(session.target, name + 'start', touch);
				}
				$.trigger(session.target, name, touch);
				$.trigger(session.target, name + touch.direction, touch);
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				if (session.drag && touch.isFinal) {
					$.trigger(session.target, name + 'end', touch);
				}
				break;
		}
	};
	/**
	 * mui gesture drag
	 */
	$.addGesture({
		name: name,
		index: 20,
		handle: handle,
		options: {
			fingers: 1
		}
	});
})(mui, 'drag');
/**
 * mui gesture tap and doubleTap
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var lastTarget;
	var lastTapTime;
	var handle = function(event, touch) {
		var session = $.gestures.session;
		var options = this.options;
		switch (event.type) {
			case $.EVENT_END:
				if (!touch.isFinal) {
					return;
				}
				var target = session.target;
				if (!target || (target.disabled || (target.classList && target.classList.contains('mui-disabled')))) {
					return;
				}
				if (touch.distance < options.tapMaxDistance && touch.deltaTime < options.tapMaxTime) {
					if ($.options.gestureConfig.doubletap && lastTarget && (lastTarget === target)) { //same target
						if (lastTapTime && (touch.timestamp - lastTapTime) < options.tapMaxInterval) {
							$.trigger(target, 'doubletap', touch);
							lastTapTime = $.now();
							lastTarget = target;
							return;
						}
					}
					$.trigger(target, name, touch);
					lastTapTime = $.now();
					lastTarget = target;
				}
				break;
		}
	};
	/**
	 * mui gesture tap
	 */
	$.addGesture({
		name: name,
		index: 30,
		handle: handle,
		options: {
			fingers: 1,
			tapMaxInterval: 300,
			tapMaxDistance: 5,
			tapMaxTime: 250
		}
	});
})(mui, 'tap');
/**
 * mui gesture longtap
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var timer;
	var handle = function(event, touch) {
		var session = $.gestures.session;
		var options = this.options;
		switch (event.type) {
			case $.EVENT_START:
				clearTimeout(timer);
				timer = setTimeout(function() {
					$.trigger(session.target, name, touch);
				}, options.holdTimeout);
				break;
			case $.EVENT_MOVE:
				if (touch.distance > options.holdThreshold) {
					clearTimeout(timer);
				}
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				clearTimeout(timer);
				break;
		}
	};
	/**
	 * mui gesture longtap
	 */
	$.addGesture({
		name: name,
		index: 10,
		handle: handle,
		options: {
			fingers: 1,
			holdTimeout: 500,
			holdThreshold: 2
		}
	});
})(mui, 'longtap');
/**
 * mui gesture hold
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var timer;
	var handle = function(event, touch) {
		var session = $.gestures.session;
		var options = this.options;
		switch (event.type) {
			case $.EVENT_START:
				if ($.options.gestureConfig.hold) {
					timer && clearTimeout(timer);
					timer = setTimeout(function() {
						touch.hold = true;
						$.trigger(session.target, name, touch);
					}, options.holdTimeout);
				}
				break;
			case $.EVENT_MOVE:
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				if (timer) {
					clearTimeout(timer) && (timer = null);
					$.trigger(session.target, 'release', touch);
				}
				break;
		}
	};
	/**
	 * mui gesture hold
	 */
	$.addGesture({
		name: name,
		index: 10,
		handle: handle,
		options: {
			fingers: 1,
			holdTimeout: 0
		}
	});
})(mui, 'hold');
/**
 * mui gesture pinch
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var handle = function(event, touch) {
		var options = this.options;
		var session = $.gestures.session;
		switch (event.type) {
			case $.EVENT_START:
				break;
			case $.EVENT_MOVE:
				if ($.options.gestureConfig.pinch) {
					if (touch.touches.length < 2) {
						return;
					}
					if (!session.pinch) { //start
						session.pinch = true;
						$.trigger(session.target, name + 'start', touch);
					}
					$.trigger(session.target, name, touch);
					var scale = touch.scale;
					var rotation = touch.rotation;
					var lastScale = typeof touch.lastScale === 'undefined' ? 1 : touch.lastScale;
					var scaleDiff = 0.000000000001; //防止scale与lastScale相等，不触发事件的情况。
					if (scale > lastScale) { //out
						lastScale = scale - scaleDiff;
						$.trigger(session.target, name + 'out', touch);
					} //in
					else if (scale < lastScale) {
						lastScale = scale + scaleDiff;
						$.trigger(session.target, name + 'in', touch);
					}
					if (Math.abs(rotation) > options.minRotationAngle) {
						$.trigger(session.target, 'rotate', touch);
					}
				}
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				if ($.options.gestureConfig.pinch && session.pinch && touch.touches.length === 2) {
					session.pinch = false;
					$.trigger(session.target, name + 'end', touch);
				}
				break;
		}
	};
	/**
	 * mui gesture pinch
	 */
	$.addGesture({
		name: name,
		index: 10,
		handle: handle,
		options: {
			minRotationAngle: 0
		}
	});
})(mui, 'pinch');
/**
 * mui.init
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	$.global = $.options = {
		gestureConfig: {
			tap: true,
			doubletap: false,
			longtap: false,
			hold: false,
			flick: true,
			swipe: true,
			drag: true,
			pinch: false
		}
	};
	/**
	 *
	 * @param {type} options
	 * @returns {undefined}
	 */
	$.initGlobal = function(options) {
		$.options = $.extend(true, $.global, options);
		return this;
	};
	var inits = {};

	/**
	 * 单页配置 初始化
	 * @param {object} options
	 */
	$.init = function(options) {
		$.options = $.extend(true, $.global, options || {});
		$.ready(function() {
			$.doAction('inits', function(index, init) {
				var isInit = !!(!inits[init.name] || init.repeat);
				if (isInit) {
					init.handle.call($);
					inits[init.name] = true;
				}
			});
		});
		return this;
	};

	/**
	 * 增加初始化执行流程
	 * @param {function} init
	 */
	$.addInit = function(init) {
		return $.addAction('inits', init);
	};
	/**
	 * 处理html5版本subpages 
	 */
	$.addInit({
		name: 'iframe',
		index: 100,
		handle: function() {
			var options = $.options;
			var subpages = options.subpages || [];
			if (!$.os.plus && subpages.length) {
				//暂时只处理单个subpage。后续可以考虑支持多个subpage
				createIframe(subpages[0]);
			}
		}
	});
	var createIframe = function(options) {
		var wrapper = document.createElement('div');
		wrapper.className = 'mui-iframe-wrapper';
		var styles = options.styles || {};
		if (typeof styles.top !== 'string') {
			styles.top = '0px';
		}
		if (typeof styles.bottom !== 'string') {
			styles.bottom = '0px';
		}
		wrapper.style.top = styles.top;
		wrapper.style.bottom = styles.bottom;
		var iframe = document.createElement('iframe');
		iframe.src = options.url;
		iframe.id = options.id || options.url;
		iframe.name = iframe.id;
		wrapper.appendChild(iframe);
		document.body.appendChild(wrapper);
		//目前仅处理微信
		$.os.wechat && handleScroll(wrapper, iframe);
	};

	function handleScroll(wrapper, iframe) {
		var key = 'MUI_SCROLL_POSITION_' + document.location.href + '_' + iframe.src;
		var scrollTop = (parseFloat(localStorage.getItem(key)) || 0);
		if (scrollTop) {
			(function(y) {
				iframe.onload = function() {
					window.scrollTo(0, y);
				};
			})(scrollTop);
		}
		setInterval(function() {
			var _scrollTop = window.scrollY;
			if (scrollTop !== _scrollTop) {
				localStorage.setItem(key, _scrollTop + '');
				scrollTop = _scrollTop;
			}
		}, 100);
	};
	$(function() {
		var classList = document.body.classList;
		var os = [];
		if ($.os.ios) {
			os.push({
				os: 'ios',
				version: $.os.version
			});
			classList.add('mui-ios');
		} else if ($.os.android) {
			os.push({
				os: 'android',
				version: $.os.version
			});
			classList.add('mui-android');
		}
		if ($.os.wechat) {
			os.push({
				os: 'wechat',
				version: $.os.wechat.version
			});
			classList.add('mui-wechat');
		}
		if (os.length) {
			$.each(os, function(index, osObj) {
				var version = '';
				var classArray = [];
				if (osObj.version) {
					$.each(osObj.version.split('.'), function(i, v) {
						version = version + (version ? '-' : '') + v;
						classList.add($.className(osObj.os + '-' + version));
					});
				}
			});
		}
	});
})(mui);
/**
 * mui.init 5+
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	var defaultOptions = {
		swipeBack: false,
		preloadPages: [], //5+ lazyLoad webview
		preloadLimit: 10, //预加载窗口的数量限制(一旦超出，先进先出)
		keyEventBind: {
			backbutton: true,
			menubutton: true
		},
		titleConfig: {
			height: "44px",
			backgroundColor: "#f7f7f7", //导航栏背景色
			bottomBorderColor: "#cccccc", //底部边线颜色
			title: { //标题配置
				text: "", //标题文字
				position: {
					top: 0,
					left: 0,
					width: "100%",
					height: "100%"
				},
				styles: {
					color: "#000000",
					align: "center",
					family: "'Helvetica Neue',Helvetica,sans-serif",
					size: "17px",
					style: "normal",
					weight: "normal",
					fontSrc: ""
				}
			},
			back: {
				image: {
					base64Data: '',
					imgSrc: '',
					sprite: {
						top: '0px',
						left: '0px',
						width: '100%',
						height: '100%'
					},
					position: {
						top: "10px",
						left: "10px",
						width: "24px",
						height: "24px"
					}
				}
			}
		}
	};

	//默认页面动画
	var defaultShow = {
		event:"titleUpdate",
		autoShow: true,
		duration: 300,
		aniShow: 'slide-in-right',
		extras:{}
	};
	//若执行了显示动画初始化操作，则要覆盖默认配置
	if($.options.show) {
		defaultShow = $.extend(true, defaultShow, $.options.show);
	}

	$.currentWebview = null;

	$.extend(true, $.global, defaultOptions);
	$.extend(true, $.options, defaultOptions);
	/**
	 * 等待动画配置
	 * @param {type} options
	 * @returns {Object}
	 */
	$.waitingOptions = function(options) {
		return $.extend(true, {}, {
			autoShow: true,
			title: '',
			modal: false
		}, options);
	};
	/**
	 * 窗口显示配置
	 * @param {type} options
	 * @returns {Object}
	 */
	$.showOptions = function(options) {
		return $.extend(true, {}, defaultShow, options);
	};
	/**
	 * 窗口默认配置
	 * @param {type} options
	 * @returns {Object}
	 */
	$.windowOptions = function(options) {
		return $.extend({
			scalable: false,
			bounce: "" //vertical
		}, options);
	};
	/**
	 * plusReady
	 * @param {type} callback
	 * @returns {_L6.$}
	 */
	$.plusReady = function(callback) {
		if(window.plus) {
			setTimeout(function() { //解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
				callback();
			}, 0);
		} else {
			document.addEventListener("plusready", function() {
				callback();
			}, false);
		}
		return this;
	};
	/**
	 * 5+ event(5+没提供之前我自己实现)
	 * @param {type} webview
	 * @param {type} eventType
	 * @param {type} data
	 * @returns {undefined}
	 */
	$.fire = function(webview, eventType, data) {
		if(webview) {
			if(typeof data === 'undefined') {
				data = '';
			} else if(typeof data === 'boolean' || typeof data === 'number') {
				webview.evalJS("typeof mui!=='undefined'&&mui.receive('" + eventType + "'," + data + ")");
				return;
			} else if($.isPlainObject(data)) {
				data = JSON.stringify(data || {}).replace(/\'/g, "\\u0027").replace(/\\/g, "\\u005c");
			}
			webview.evalJS("typeof mui!=='undefined'&&mui.receive('" + eventType + "','" + data + "')");
		}
	};
	/**
	 * 5+ event(5+没提供之前我自己实现)
	 * @param {type} eventType
	 * @param {type} data
	 * @returns {undefined}
	 */
	$.receive = function(eventType, data) {
		if(eventType) {
			try {
				if(data && typeof data === 'string') {
					data = JSON.parse(data);
				}
			} catch(e) {}
			$.trigger(document, eventType, data);
		}
	};
	var triggerPreload = function(webview) {
		if(!webview.preloaded) { //保证仅触发一次
			$.fire(webview, 'preload');
			var list = webview.children();
			for(var i = 0; i < list.length; i++) {
				$.fire(list[i], 'preload');
			}
			webview.preloaded = true;
		}
	};
	var trigger = function(webview, eventType, timeChecked) {
		if(timeChecked) {
			if(!webview[eventType + 'ed']) {
				$.fire(webview, eventType);
				var list = webview.children();
				for(var i = 0; i < list.length; i++) {
					$.fire(list[i], eventType);
				}
				webview[eventType + 'ed'] = true;
			}
		} else {
			$.fire(webview, eventType);
			var list = webview.children();
			for(var i = 0; i < list.length; i++) {
				$.fire(list[i], eventType);
			}
		}

	};
	/**
	 * 打开新窗口
	 * @param {string} url 要打开的页面地址
	 * @param {string} id 指定页面ID
	 * @param {object} options 可选:参数,等待,窗口,显示配置{params:{},waiting:{},styles:{},show:{}}
	 */
	$.openWindow = function(url, id, options) {
		if(typeof url === 'object') {
			options = url;
			url = options.url;
			id = options.id || url;
		} else {
			if(typeof id === 'object') {
				options = id;
				id = options.id || url;
			} else {
				id = id || url;
			}
		}
		if(!$.os.plus) {
			//TODO 先临时这么处理：手机上顶层跳，PC上parent跳
			if($.os.ios || $.os.android) {
				window.top.location.href = url;
			} else {
				window.parent.location.href = url;
			}
			return;
		}
		if(!window.plus) {
			return;
		}

		options = options || {};
		var params = options.params || {};
		var webview = null,
			webviewCache = null,
			nShow, nWaiting;

		if($.webviews[id]) {
			webviewCache = $.webviews[id];
			//webview真实存在，才能获取
			if(plus.webview.getWebviewById(id)) {
				webview = webviewCache.webview;
			}
		} else if(options.createNew !== true) {
			webview = plus.webview.getWebviewById(id);
		}

		if(webview) { //已缓存
			//每次show都需要传递动画参数；
			//预加载的动画参数优先级：openWindow配置>preloadPages配置>mui默认配置；
			nShow = webviewCache ? webviewCache.show : defaultShow;
			nShow = options.show ? $.extend(nShow, options.show) : nShow;
			nShow.autoShow && webview.show(nShow.aniShow, nShow.duration, function() {
				triggerPreload(webview);
				trigger(webview, 'pagebeforeshow', false);
			});
			if(webviewCache) {
				webviewCache.afterShowMethodName && webview.evalJS(webviewCache.afterShowMethodName + '(\'' + JSON.stringify(params) + '\')');
			}
			return webview;
		} else { //新窗口
			if(!url) {
				throw new Error('webview[' + id + '] does not exist');
			}

			//显示waiting
			var waitingConfig = $.waitingOptions(options.waiting);
			if(waitingConfig.autoShow) {
				nWaiting = plus.nativeUI.showWaiting(waitingConfig.title, waitingConfig.options);
			}

			//创建页面
			options = $.extend(options, {
				id: id,
				url: url
			});

			webview = $.createWindow(options);

			//显示
			nShow = $.showOptions(options.show);
			if(nShow.autoShow) {
				var showWebview = function() {
					//关闭等待框
					if(nWaiting) {
						nWaiting.close();
					}
					//显示页面
					webview.show(nShow.aniShow, nShow.duration, function() {},nShow.extras);
					options.afterShowMethodName && webview.evalJS(options.afterShowMethodName + '(\'' + JSON.stringify(params) + '\')');
				};
				//titleUpdate触发时机早于loaded，更换为titleUpdate后，可以更早的显示webview
				webview.addEventListener(nShow.event, showWebview, false);
				//loaded事件发生后，触发预加载和pagebeforeshow事件
				webview.addEventListener("loaded", function() {
					triggerPreload(webview);
					trigger(webview, 'pagebeforeshow', false);
				}, false);
			}
		}
		return webview;
	};

	$.openWindowWithTitle = function(options, titleConfig) {
		options = options || {};
		var url = options.url;
		var id = options.id || url;

		if(!$.os.plus) {
			//TODO 先临时这么处理：手机上顶层跳，PC上parent跳
			if($.os.ios || $.os.android) {
				window.top.location.href = url;
			} else {
				window.parent.location.href = url;
			}
			return;
		}
		if(!window.plus) {
			return;
		}

		var params = options.params || {};
		var webview = null,
			webviewCache = null,
			nShow, nWaiting;

		if($.webviews[id]) {
			webviewCache = $.webviews[id];
			//webview真实存在，才能获取
			if(plus.webview.getWebviewById(id)) {
				webview = webviewCache.webview;
			}
		} else if(options.createNew !== true) {
			webview = plus.webview.getWebviewById(id);
		}

		if(webview) { //已缓存
			//每次show都需要传递动画参数；
			//预加载的动画参数优先级：openWindow配置>preloadPages配置>mui默认配置；
			nShow = webviewCache ? webviewCache.show : defaultShow;
			nShow = options.show ? $.extend(nShow, options.show) : nShow;
			nShow.autoShow && webview.show(nShow.aniShow, nShow.duration, function() {
				triggerPreload(webview);
				trigger(webview, 'pagebeforeshow', false);
			});
			if(webviewCache) {
				webviewCache.afterShowMethodName && webview.evalJS(webviewCache.afterShowMethodName + '(\'' + JSON.stringify(params) + '\')');
			}
			return webview;
		} else { //新窗口
			if(!url) {
				throw new Error('webview[' + id + '] does not exist');
			}

			//显示waiting
			var waitingConfig = $.waitingOptions(options.waiting);
			if(waitingConfig.autoShow) {
				nWaiting = plus.nativeUI.showWaiting(waitingConfig.title, waitingConfig.options);
			}

			//创建页面
			options = $.extend(options, {
				id: id,
				url: url
			});

			webview = $.createWindow(options);

			if(titleConfig) { //处理原生头
				$.extend(true, $.options.titleConfig, titleConfig);
				var tid = $.options.titleConfig.id ? $.options.titleConfig.id : id + "_title";
				var view = new plus.nativeObj.View(tid, {
					top: 0,
					height: $.options.titleConfig.height,
					width: "100%",
					dock: "top",
					position: "dock"
				});
				view.drawRect($.options.titleConfig.backgroundColor); //绘制背景色
				var _b = parseInt($.options.titleConfig.height) - 1;
				view.drawRect($.options.titleConfig.bottomBorderColor, {
					top: _b + "px",
					left: "0px"
				}); //绘制底部边线

				//绘制文字
				if($.options.titleConfig.title.text){
					var _title = $.options.titleConfig.title;
					view.drawText(_title.text,_title.position , _title.styles);
				}
				
				//返回图标绘制
				var _back = $.options.titleConfig.back;
				var backClick = null;
				//优先字体

				//其次是图片
				var _backImage = _back.image;
				if(_backImage.base64Data || _backImage.imgSrc) {
					//TODO 此处需要处理百分比的情况
					backClick = {
						left:parseInt(_backImage.position.left),
						right:parseInt(_backImage.position.left) + parseInt(_backImage.position.width)
					};
					var bitmap = new plus.nativeObj.Bitmap(id + "_back");
					if(_backImage.base64Data) { //优先base64编码字符串
						bitmap.loadBase64Data(_backImage.base64Data);
					} else { //其次加载图片文件
						bitmap.load(_backImage.imgSrc);
					}
					view.drawBitmap(bitmap,_backImage.sprite , _backImage.position);
				}

				//处理点击事件
				view.setTouchEventRect({
					top: "0px",
					left: "0px",
					width: "100%",
					height: "100%"
				});
				view.interceptTouchEvent(true);
				view.addEventListener("click", function(e) {
					var x = e.clientX;
					
					//返回按钮点击
					if(backClick&& x > backClick.left && x < backClick.right){
						if( _back.click && $.isFunction(_back.click)){
							_back.click();
						}else{
							webview.evalJS("window.mui&&mui.back();");
						}
					}
				}, false);
				webview.append(view);

			}

			//显示
			nShow = $.showOptions(options.show);
			if(nShow.autoShow) {
				//titleUpdate触发时机早于loaded，更换为titleUpdate后，可以更早的显示webview
				webview.addEventListener(nShow.event, function () {
					//关闭等待框
					if(nWaiting) {
						nWaiting.close();
					}
					//显示页面
					webview.show(nShow.aniShow, nShow.duration, function() {},nShow.extras);
				}, false);
			}
		}
		return webview;
	};

	/**
	 * 根据配置信息创建一个webview
	 * @param {type} options
	 * @param {type} isCreate
	 * @returns {webview}
	 */
	$.createWindow = function(options, isCreate) {
		if(!window.plus) {
			return;
		}
		var id = options.id || options.url;
		var webview;
		if(options.preload) {
			if($.webviews[id] && $.webviews[id].webview.getURL()) { //已经cache
				webview = $.webviews[id].webview;
			} else { //新增预加载窗口
				//判断是否携带createNew参数，默认为false
				if(options.createNew !== true) {
					webview = plus.webview.getWebviewById(id);
				}

				//之前没有，那就新创建	
				if(!webview) {
					webview = plus.webview.create(options.url, id, $.windowOptions(options.styles), $.extend({
						preload: true
					}, options.extras));
					if(options.subpages) {
						$.each(options.subpages, function(index, subpage) {
							var subpageId = subpage.id || subpage.url;
							if(subpageId) { //过滤空对象
								var subWebview = plus.webview.getWebviewById(subpageId);
								if(!subWebview) { //如果该webview不存在，则创建
									subWebview = plus.webview.create(subpage.url, subpageId, $.windowOptions(subpage.styles), $.extend({
										preload: true
									}, subpage.extras));
								}
								webview.append(subWebview);
							}
						});
					}
				}
			}

			//TODO 理论上，子webview也应该计算到预加载队列中，但这样就麻烦了，要退必须退整体，否则可能出现问题；
			$.webviews[id] = {
				webview: webview, //目前仅preload的缓存webview
				preload: true,
				show: $.showOptions(options.show),
				afterShowMethodName: options.afterShowMethodName //就不应该用evalJS。应该是通过事件消息通讯
			};
			//索引该预加载窗口
			var preloads = $.data.preloads;
			var index = preloads.indexOf(id);
			if(~index) { //删除已存在的(变相调整插入位置)
				preloads.splice(index, 1);
			}
			preloads.push(id);
			if(preloads.length > $.options.preloadLimit) {
				//先进先出
				var first = $.data.preloads.shift();
				var webviewCache = $.webviews[first];
				if(webviewCache && webviewCache.webview) {
					//需要将自己打开的所有页面，全部close；
					//关闭该预加载webview	
					$.closeAll(webviewCache.webview);
				}
				//删除缓存
				delete $.webviews[first];
			}
		} else {
			if(isCreate !== false) { //直接创建非预加载窗口
				webview = plus.webview.create(options.url, id, $.windowOptions(options.styles), options.extras);
				if(options.subpages) {
					$.each(options.subpages, function(index, subpage) {
						var subpageId = subpage.id || subpage.url;
						var subWebview = plus.webview.getWebviewById(subpageId);
						if(!subWebview) {
							subWebview = plus.webview.create(subpage.url, subpageId, $.windowOptions(subpage.styles), subpage.extras);
						}
						webview.append(subWebview);
					});
				}
			}
		}
		return webview;
	};

	/**
	 * 预加载
	 */
	$.preload = function(options) {
		//调用预加载函数，不管是否传递preload参数，强制变为true
		if(!options.preload) {
			options.preload = true;
		}
		return $.createWindow(options);
	};

	/**
	 *关闭当前webview打开的所有webview；
	 */
	$.closeOpened = function(webview) {
		var opened = webview.opened();
		if(opened) {
			for(var i = 0, len = opened.length; i < len; i++) {
				var openedWebview = opened[i];
				var open_open = openedWebview.opened();
				if(open_open && open_open.length > 0) {
					//关闭打开的webview
					$.closeOpened(openedWebview);
					//关闭自己
					openedWebview.close("none");
				} else {
					//如果直接孩子节点，就不用关闭了，因为父关闭的时候，会自动关闭子；
					if(openedWebview.parent() !== webview) {
						openedWebview.close('none');
					}
				}
			}
		}
	};
	$.closeAll = function(webview, aniShow) {
		$.closeOpened(webview);
		if(aniShow) {
			webview.close(aniShow);
		} else {
			webview.close();
		}
	};

	/**
	 * 批量创建webview
	 * @param {type} options
	 * @returns {undefined}
	 */
	$.createWindows = function(options) {
		$.each(options, function(index, option) {
			//初始化预加载窗口(创建)和非预加载窗口(仅配置，不创建)
			$.createWindow(option, false);
		});
	};
	/**
	 * 创建当前页面的子webview
	 * @param {type} options
	 * @returns {webview}
	 */
	$.appendWebview = function(options) {
		if(!window.plus) {
			return;
		}
		var id = options.id || options.url;
		var webview;
		if(!$.webviews[id]) { //保证执行一遍
			//TODO 这里也有隐患，比如某个webview不是作为subpage创建的，而是作为target webview的话；
			if(!plus.webview.getWebviewById(id)) {
				webview = plus.webview.create(options.url, id, options.styles, options.extras);
			}
			//之前的实现方案：子窗口loaded之后再append到父窗口中；
			//问题：部分子窗口loaded事件发生较晚，此时执行父窗口的children方法会返回空，导致父子通讯失败；
			//     比如父页面执行完preload事件后，需触发子页面的preload事件，此时未append的话，就无法触发；
			//修改方式：不再监控loaded事件，直接append
			//by chb@20150521
			// webview.addEventListener('loaded', function() {
			plus.webview.currentWebview().append(webview);
			// });
			$.webviews[id] = options;

		}
		return webview;
	};

	//全局webviews
	$.webviews = {};
	//预加载窗口索引
	$.data.preloads = [];
	//$.currentWebview
	$.plusReady(function() {
		$.currentWebview = plus.webview.currentWebview();
	});
	$.addInit({
		name: '5+',
		index: 100,
		handle: function() {
			var options = $.options;
			var subpages = options.subpages || [];
			if($.os.plus) {
				$.plusReady(function() {
					//TODO  这里需要判断一下，最好等子窗口加载完毕后，再调用主窗口的show方法；
					//或者：在openwindow方法中，监听实现；
					$.each(subpages, function(index, subpage) {
						$.appendWebview(subpage);
					});
					//判断是否首页
					if(plus.webview.currentWebview() === plus.webview.getWebviewById(plus.runtime.appid)) {
						//首页需要自己激活预加载；
						//timeout因为子页面loaded之后才append的，防止子页面尚未append、从而导致其preload未触发的问题；
						setTimeout(function() {
							triggerPreload(plus.webview.currentWebview());
						}, 300);
					}
					//设置ios顶部状态栏颜色；
					if($.os.ios && $.options.statusBarBackground) {
						plus.navigator.setStatusBarBackground($.options.statusBarBackground);
					}
					if($.os.android && parseFloat($.os.version) < 4.4) {
						//解决Android平台4.4版本以下，resume后，父窗体标题延迟渲染的问题；
						if(plus.webview.currentWebview().parent() == null) {
							document.addEventListener("resume", function() {
								var body = document.body;
								body.style.display = 'none';
								setTimeout(function() {
									body.style.display = '';
								}, 10);
							});
						}
					}
				});
			} else {
				//已支持iframe嵌入
				//				if (subpages.length > 0) {
				//					var err = document.createElement('div');
				//					err.className = 'mui-error';
				//					//文字描述
				//					var span = document.createElement('span');
				//					span.innerHTML = '在该浏览器下，不支持创建子页面，具体参考';
				//					err.appendChild(span);
				//					var a = document.createElement('a');
				//					a.innerHTML = '"mui框架适用场景"';
				//					a.href = 'http://ask.dcloud.net.cn/article/113';
				//					err.appendChild(a);
				//					document.body.appendChild(err);
				//					console.log('在该浏览器下，不支持创建子页面');
				//				}

			}

		}
	});
	window.addEventListener('preload', function() {
		//处理预加载部分
		var webviews = $.options.preloadPages || [];
		$.plusReady(function() {
			$.each(webviews, function(index, webview) {
				$.createWindow($.extend(webview, {
					preload: true
				}));
			});

		});
	});
	$.supportStatusbarOffset = function() {
		return $.os.plus && $.os.ios && parseFloat($.os.version) >= 7;
	};
	$.ready(function() {
		//标识当前环境支持statusbar
		if($.supportStatusbarOffset()) {
			document.body.classList.add('mui-statusbar');
		}
	});
})(mui);
/**
 * mui back
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
	/**
	 * register back
	 * @param {type} back
	 * @returns {$.gestures}
	 */
	$.addBack = function(back) {
		return $.addAction('backs', back);
	};
	/**
	 * default
	 */
	$.addBack({
		name: 'browser',
		index: 100,
		handle: function() {
			if (window.history.length > 1) {
				window.history.back();
				return true;
			}
			return false;
		}
	});
	/**
	 * 后退
	 */
	$.back = function() {
		if (typeof $.options.beforeback === 'function') {
			if ($.options.beforeback() === false) {
				return;
			}
		}
		$.doAction('backs');
	};
	window.addEventListener('tap', function(e) {
		var action = $.targets.action;
		if (action && action.classList.contains('mui-action-back')) {
			$.back();
			$.targets.action = false;
		}
	});
	window.addEventListener('swiperight', function(e) {
		var detail = e.detail;
		if ($.options.swipeBack === true && Math.abs(detail.angle) < 3) {
			$.back();
		}
	});

})(mui, window);
/**
 * mui back 5+
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
	if ($.os.plus && $.os.android) {
		$.addBack({
			name: 'mui',
			index: 5,
			handle: function() {
				//后续重新设计此处，将back放到各个空间内部实现
				//popover
				if ($.targets._popover && $.targets._popover.classList.contains('mui-active')) {
					$($.targets._popover).popover('hide');
					return true;
				}
				//offcanvas
				var offCanvas = document.querySelector('.mui-off-canvas-wrap.mui-active');
				if (offCanvas) {
					$(offCanvas).offCanvas('close');
					return true;
				}
				var previewImage = $.isFunction($.getPreviewImage) && $.getPreviewImage();
				if (previewImage && previewImage.isShown()) {
					previewImage.close();
					return true;
				}
				//popup
				return $.closePopup();
			}
		});
	}
	//首次按下back按键的时间
	$.__back__first = null;
	/**
	 * 5+ back
	 */
	$.addBack({
		name: '5+',
		index: 10,
		handle: function() {
			if (!window.plus) {
				return false;
			}
			var wobj = plus.webview.currentWebview();
			var parent = wobj.parent();
			if (parent) {
				parent.evalJS('mui&&mui.back();');
			} else {
				wobj.canBack(function(e) {
					//by chb 暂时注释，在碰到类似popover之类的锚点的时候，需多次点击才能返回；
					if (e.canBack) { //webview history back
						window.history.back();
					} else { //webview close or hide
						//fixed by fxy 此处不应该用opener判断，因为用户有可能自己close掉当前窗口的opener。这样的话。opener就为空了，导致不能执行close
						if (wobj.id === plus.runtime.appid) { //首页
							//首页不存在opener的情况下，后退实际上应该是退出应用；
							//首次按键，提示‘再按一次退出应用’
							if (!$.__back__first) {
								$.__back__first = new Date().getTime();
								mui.toast('再按一次退出应用');
								setTimeout(function() {
									$.__back__first = null;
								}, 2000);
							} else {
								if (new Date().getTime() - $.__back__first < 2000) {
									plus.runtime.quit();
								}
							}
						} else { //其他页面，
							if (wobj.preload) {
								wobj.hide("auto");
							} else {
								//关闭页面时，需要将其打开的所有子页面全部关闭；
								$.closeAll(wobj);
							}
						}
					}
				});
			}
			return true;
		}
	});


	$.menu = function() {
		var menu = document.querySelector('.mui-action-menu');
		if (menu) {
			$.trigger(menu, $.EVENT_START); //临时处理menu无touchstart的话，找不到当前targets的问题
			$.trigger(menu, 'tap');
		} else { //执行父窗口的menu
			if (window.plus) {
				var wobj = $.currentWebview;
				var parent = wobj.parent();
				if (parent) { //又得evalJS
					parent.evalJS('mui&&mui.menu();');
				}
			}
		}
	};
	var __back = function() {
		$.back();
	};
	var __menu = function() {
		$.menu();
	};
	//默认监听
	$.plusReady(function() {
		if ($.options.keyEventBind.backbutton) {
			plus.key.addEventListener('backbutton', __back, false);
		}
		if ($.options.keyEventBind.menubutton) {
			plus.key.addEventListener('menubutton', __menu, false);
		}
	});
	//处理按键监听事件
	$.addInit({
		name: 'keyEventBind',
		index: 1000,
		handle: function() {
			$.plusReady(function() {
				//如果不为true，则移除默认监听
				if (!$.options.keyEventBind.backbutton) {
					plus.key.removeEventListener('backbutton', __back);
				}
				if (!$.options.keyEventBind.menubutton) {
					plus.key.removeEventListener('menubutton', __menu);
				}
			});
		}
	});
})(mui, window);
/**
 * mui.init pulldownRefresh
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	$.addInit({
		name: 'pullrefresh',
		index: 1000,
		handle: function() {
			var options = $.options;
			var pullRefreshOptions = options.pullRefresh || {};
			var hasPulldown = pullRefreshOptions.down && pullRefreshOptions.down.hasOwnProperty('callback');
			var hasPullup = pullRefreshOptions.up && pullRefreshOptions.up.hasOwnProperty('callback');
			if (hasPulldown || hasPullup) {
				var container = pullRefreshOptions.container;
				if (container) {
					var $container = $(container);
					if ($container.length === 1) {
						if ($.os.plus && $.os.android) { //android 5+
							$.plusReady(function() {
								var webview = plus.webview.currentWebview();
								if (hasPullup) {
									//当前页面初始化pullup
									var upOptions = {};
									upOptions.up = pullRefreshOptions.up;
									upOptions.webviewId = webview.id || webview.getURL();
									$container.pullRefresh(upOptions);
								}
								if (hasPulldown) {
									var parent = webview.parent();
									var id = webview.id || webview.getURL();
									if (parent) {
										if (!hasPullup) { //如果没有上拉加载，需要手动初始化一个默认的pullRefresh，以便当前页面容器可以调用endPulldownToRefresh等方法
											$container.pullRefresh({
												webviewId: id
											});
										}
										var downOptions = {
											webviewId: id
										};
										downOptions.down = $.extend({}, pullRefreshOptions.down);
										downOptions.down.callback = '_CALLBACK';
										//父页面初始化pulldown
										parent.evalJS("mui&&mui(document.querySelector('.mui-content')).pullRefresh('" + JSON.stringify(downOptions) + "')");
									}
								}
							});
						} else {
							$container.pullRefresh(pullRefreshOptions);
						}
					}
				}
			}
		}
	});
})(mui);
/**
 * mui ajax
 * @param {type} $
 * @returns {undefined}
 */
(function($, window, undefined) {

	var jsonType = 'application/json';
	var htmlType = 'text/html';
	var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	var scriptTypeRE = /^(?:text|application)\/javascript/i;
	var xmlTypeRE = /^(?:text|application)\/xml/i;
	var blankRE = /^\s*$/;

	$.ajaxSettings = {
		type: 'GET',
		beforeSend: $.noop,
		success: $.noop,
		error: $.noop,
		complete: $.noop,
		context: null,
		xhr: function(protocol) {
			return new window.XMLHttpRequest();
		},
		accepts: {
			script: 'text/javascript, application/javascript, application/x-javascript',
			json: jsonType,
			xml: 'application/xml, text/xml',
			html: htmlType,
			text: 'text/plain'
		},
		timeout: 0,
		processData: true,
		cache: true
	};
	var ajaxBeforeSend = function(xhr, settings) {
		var context = settings.context
		if(settings.beforeSend.call(context, xhr, settings) === false) {
			return false;
		}
	};
	var ajaxSuccess = function(data, xhr, settings) {
		settings.success.call(settings.context, data, 'success', xhr);
		ajaxComplete('success', xhr, settings);
	};
	// type: "timeout", "error", "abort", "parsererror"
	var ajaxError = function(error, type, xhr, settings) {
		settings.error.call(settings.context, xhr, type, error);
		ajaxComplete(type, xhr, settings);
	};
	// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	var ajaxComplete = function(status, xhr, settings) {
		settings.complete.call(settings.context, xhr, status);
	};

	var serialize = function(params, obj, traditional, scope) {
		var type, array = $.isArray(obj),
			hash = $.isPlainObject(obj);
		$.each(obj, function(key, value) {
			type = $.type(value);
			if(scope) {
				key = traditional ? scope :
					scope + '[' + (hash || type === 'object' || type === 'array' ? key : '') + ']';
			}
			// handle data in serializeArray() format
			if(!scope && array) {
				params.add(value.name, value.value);
			}
			// recurse into nested objects
			else if(type === "array" || (!traditional && type === "object")) {
				serialize(params, value, traditional, key);
			} else {
				params.add(key, value);
			}
		});
	};
	var serializeData = function(options) {
		if(options.processData && options.data && typeof options.data !== "string") {
			var contentType = options.contentType;
			if(!contentType && options.headers) {
				contentType = options.headers['Content-Type'];
			}
			if(contentType && ~contentType.indexOf(jsonType)) { //application/json
				options.data = JSON.stringify(options.data);
			} else {
				options.data = $.param(options.data, options.traditional);
			}
		}
		if(options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	};
	var appendQuery = function(url, query) {
		if(query === '') {
			return url;
		}
		return(url + '&' + query).replace(/[&?]{1,2}/, '?');
	};
	var mimeToDataType = function(mime) {
		if(mime) {
			mime = mime.split(';', 2)[0];
		}
		return mime && (mime === htmlType ? 'html' :
			mime === jsonType ? 'json' :
			scriptTypeRE.test(mime) ? 'script' :
			xmlTypeRE.test(mime) && 'xml') || 'text';
	};
	var parseArguments = function(url, data, success, dataType) {
		if($.isFunction(data)) {
			dataType = success, success = data, data = undefined;
		}
		if(!$.isFunction(success)) {
			dataType = success, success = undefined;
		}
		return {
			url: url,
			data: data,
			success: success,
			dataType: dataType
		};
	};
	$.ajax = function(url, options) {
		if(typeof url === "object") {
			options = url;
			url = undefined;
		}
		var settings = options || {};
		settings.url = url || settings.url;
		for(var key in $.ajaxSettings) {
			if(settings[key] === undefined) {
				settings[key] = $.ajaxSettings[key];
			}
		}
		serializeData(settings);
		var dataType = settings.dataType;

		if(settings.cache === false || ((!options || options.cache !== true) && ('script' === dataType))) {
			settings.url = appendQuery(settings.url, '_=' + $.now());
		}
		var mime = settings.accepts[dataType && dataType.toLowerCase()];
		var headers = {};
		var setHeader = function(name, value) {
			headers[name.toLowerCase()] = [name, value];
		};
		var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
		var xhr = settings.xhr(settings);
		var nativeSetHeader = xhr.setRequestHeader;
		var abortTimeout;

		setHeader('X-Requested-With', 'XMLHttpRequest');
		setHeader('Accept', mime || '*/*');
		if(!!(mime = settings.mimeType || mime)) {
			if(mime.indexOf(',') > -1) {
				mime = mime.split(',', 2)[0];
			}
			xhr.overrideMimeType && xhr.overrideMimeType(mime);
		}
		if(settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() !== 'GET')) {
			setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
		}
		if(settings.headers) {
			for(var name in settings.headers)
				setHeader(name, settings.headers[name]);
		}
		xhr.setRequestHeader = setHeader;

		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				xhr.onreadystatechange = $.noop;
				clearTimeout(abortTimeout);
				var result, error = false;
				var isLocal = protocol === 'file:';
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && isLocal && xhr.responseText)) {
					dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
					result = xhr.responseText;
					try {
						// http://perfectionkills.com/global-eval-what-are-the-options/
						if(dataType === 'script') {
							(1, eval)(result);
						} else if(dataType === 'xml') {
							result = xhr.responseXML;
						} else if(dataType === 'json') {
							result = blankRE.test(result) ? null : $.parseJSON(result);
						}
					} catch(e) {
						error = e;
					}

					if(error) {
						ajaxError(error, 'parsererror', xhr, settings);
					} else {
						ajaxSuccess(result, xhr, settings);
					}
				} else {
					var status = xhr.status ? 'error' : 'abort';
					var statusText = xhr.statusText || null;
					if(isLocal) {
						status = 'error';
						statusText = '404';
					}
					ajaxError(statusText, status, xhr, settings);
				}
			}
		};
		if(ajaxBeforeSend(xhr, settings) === false) {
			xhr.abort();
			ajaxError(null, 'abort', xhr, settings);
			return xhr;
		}

		if(settings.xhrFields) {
			for(var name in settings.xhrFields) {
				xhr[name] = settings.xhrFields[name];
			}
		}

		var async = 'async' in settings ? settings.async : true;

		xhr.open(settings.type.toUpperCase(), settings.url, async, settings.username, settings.password);

		for(var name in headers) {
			if(headers.hasOwnProperty(name)) {
				nativeSetHeader.apply(xhr, headers[name]);
			}
		}
		if(settings.timeout > 0) {
			abortTimeout = setTimeout(function() {
				xhr.onreadystatechange = $.noop;
				xhr.abort();
				ajaxError(null, 'timeout', xhr, settings);
			}, settings.timeout);
		}
		xhr.send(settings.data ? settings.data : null);
		return xhr;
	};

	$.param = function(obj, traditional) {
		var params = [];
		params.add = function(k, v) {
			this.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
		};
		serialize(params, obj, traditional);
		return params.join('&').replace(/%20/g, '+');
	};
	$.get = function( /* url, data, success, dataType */ ) {
		return $.ajax(parseArguments.apply(null, arguments));
	};

	$.post = function( /* url, data, success, dataType */ ) {
		var options = parseArguments.apply(null, arguments);
		options.type = 'POST';
		return $.ajax(options);
	};

	$.getJSON = function( /* url, data, success */ ) {
		var options = parseArguments.apply(null, arguments);
		options.dataType = 'json';
		return $.ajax(options);
	};

	$.fn.load = function(url, data, success) {
		if(!this.length)
			return this;
		var self = this,
			parts = url.split(/\s/),
			selector,
			options = parseArguments(url, data, success),
			callback = options.success;
		if(parts.length > 1)
			options.url = parts[0], selector = parts[1];
		options.success = function(response) {
			if(selector) {
				var div = document.createElement('div');
				div.innerHTML = response.replace(rscript, "");
				var selectorDiv = document.createElement('div');
				var childs = div.querySelectorAll(selector);
				if(childs && childs.length > 0) {
					for(var i = 0, len = childs.length; i < len; i++) {
						selectorDiv.appendChild(childs[i]);
					}
				}
				self[0].innerHTML = selectorDiv.innerHTML;
			} else {
				self[0].innerHTML = response;
			}
			callback && callback.apply(self, arguments);
		};
		$.ajax(options);
		return this;
	};

})(mui, window);
/**
 * 5+ ajax
 */
(function($) {
	var originAnchor = document.createElement('a');
	originAnchor.href = window.location.href;
	$.plusReady(function() {
		$.ajaxSettings = $.extend($.ajaxSettings, {
			xhr: function(settings) {
				if (settings.crossDomain) { //强制使用plus跨域
					return new plus.net.XMLHttpRequest();
				}
				//仅在webview的url为远程文件，且ajax请求的资源不同源下使用plus.net.XMLHttpRequest
				if (originAnchor.protocol !== 'file:') {
					var urlAnchor = document.createElement('a');
					urlAnchor.href = settings.url;
					urlAnchor.href = urlAnchor.href;
					settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host);
					if (settings.crossDomain) {
						return new plus.net.XMLHttpRequest();
					}
				}
				if ($.os.ios && window.webkit && window.webkit.messageHandlers) { //wkwebview下同样使用5+ xhr
                    return new plus.net.XMLHttpRequest();
                }
				return new window.XMLHttpRequest();
			}
		});
	});
})(mui);
/**
 * mui layout(offset[,position,width,height...])
 * @param {type} $
 * @param {type} window
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, undefined) {
	$.offset = function(element) {
		var box = {
			top : 0,
			left : 0
		};
		if ( typeof element.getBoundingClientRect !== undefined) {
			box = element.getBoundingClientRect();
		}
		return {
			top : box.top + window.pageYOffset - element.clientTop,
			left : box.left + window.pageXOffset - element.clientLeft
		};
	};
})(mui, window); 
/**
 * mui animation
 */
(function($, window) {
	/**
	 * scrollTo
	 */
	$.scrollTo = function(scrollTop, duration, callback) {
		duration = duration || 1000;
		var scroll = function(duration) {
			if (duration <= 0) {
				window.scrollTo(0, scrollTop);
				callback && callback();
				return;
			}
			var distaince = scrollTop - window.scrollY;
			setTimeout(function() {
				window.scrollTo(0, window.scrollY + distaince / duration * 10);
				scroll(duration - 10);
			}, 16.7);
		};
		scroll(duration);
	};
	$.animationFrame = function(cb) {
		var args, isQueued, context;
		return function() {
			args = arguments;
			context = this;
			if (!isQueued) {
				isQueued = true;
				requestAnimationFrame(function() {
					cb.apply(context, args);
					isQueued = false;
				});
			}
		};
	};

})(mui, window);
(function($) {
	var initializing = false,
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/;

	var Class = function() {};
	Class.extend = function(prop) {
		var _super = this.prototype;
		initializing = true;
		var prototype = new this();
		initializing = false;
		for (var name in prop) {
			prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn) {
					return function() {
						var tmp = this._super;

						this._super = _super[name];

						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}
		function Class() {
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}
		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		Class.extend = arguments.callee;
		return Class;
	};
	$.Class = Class;
})(mui);
(function($, document, undefined) {
	var CLASS_PULL_TOP_POCKET = 'mui-pull-top-pocket';
	var CLASS_PULL_BOTTOM_POCKET = 'mui-pull-bottom-pocket';
	var CLASS_PULL = 'mui-pull';
	var CLASS_PULL_LOADING = 'mui-pull-loading';
	var CLASS_PULL_CAPTION = 'mui-pull-caption';
	var CLASS_PULL_CAPTION_DOWN = 'mui-pull-caption-down';
	var CLASS_PULL_CAPTION_REFRESH = 'mui-pull-caption-refresh';
	var CLASS_PULL_CAPTION_NOMORE = 'mui-pull-caption-nomore';

	var CLASS_ICON = 'mui-icon';
	var CLASS_SPINNER = 'mui-spinner';
	var CLASS_ICON_PULLDOWN = 'mui-icon-pulldown';

	var CLASS_BLOCK = 'mui-block';
	var CLASS_HIDDEN = 'mui-hidden';
	var CLASS_VISIBILITY = 'mui-visibility';

	var CLASS_LOADING_UP = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
	var CLASS_LOADING_DOWN = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
	var CLASS_LOADING = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_SPINNER;

	var pocketHtml = ['<div class="' + CLASS_PULL + '">', '<div class="{icon}"></div>', '<div class="' + CLASS_PULL_CAPTION + '">{contentrefresh}</div>', '</div>'].join('');

	var PullRefresh = {
		init: function(element, options) {
			this._super(element, $.extend(true, {
				scrollY: true,
				scrollX: false,
				indicators: true,
				deceleration: 0.003,
				down: {
					height: 50,
					contentinit: '下拉可以刷新',
					contentdown: '下拉可以刷新',
					contentover: '释放立即刷新',
					contentrefresh: '正在刷新...'
				},
				up: {
					height: 50,
					auto: false,
					contentinit: '上拉显示更多',
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了',
					duration: 300
				}
			}, options));
		},
		_init: function() {
			this._super();
			this._initPocket();
		},
		_initPulldownRefresh: function() {
			this.pulldown = true;
			this.pullPocket = this.topPocket;
			this.pullPocket.classList.add(CLASS_BLOCK);
			this.pullPocket.classList.add(CLASS_VISIBILITY);
			this.pullCaption = this.topCaption;
			this.pullLoading = this.topLoading;
		},
		_initPullupRefresh: function() {
			this.pulldown = false;
			this.pullPocket = this.bottomPocket;
			this.pullPocket.classList.add(CLASS_BLOCK);
			this.pullPocket.classList.add(CLASS_VISIBILITY);
			this.pullCaption = this.bottomCaption;
			this.pullLoading = this.bottomLoading;
		},
		_initPocket: function() {
			var options = this.options;
			if (options.down && options.down.hasOwnProperty('callback')) {
				this.topPocket = this.scroller.querySelector('.' + CLASS_PULL_TOP_POCKET);
				if (!this.topPocket) {
					this.topPocket = this._createPocket(CLASS_PULL_TOP_POCKET, options.down, CLASS_LOADING_DOWN);
					this.wrapper.insertBefore(this.topPocket, this.wrapper.firstChild);
				}
				this.topLoading = this.topPocket.querySelector('.' + CLASS_PULL_LOADING);
				this.topCaption = this.topPocket.querySelector('.' + CLASS_PULL_CAPTION);
			}
			if (options.up && options.up.hasOwnProperty('callback')) {
				this.bottomPocket = this.scroller.querySelector('.' + CLASS_PULL_BOTTOM_POCKET);
				if (!this.bottomPocket) {
					this.bottomPocket = this._createPocket(CLASS_PULL_BOTTOM_POCKET, options.up, CLASS_LOADING);
					this.scroller.appendChild(this.bottomPocket);
				}
				this.bottomLoading = this.bottomPocket.querySelector('.' + CLASS_PULL_LOADING);
				this.bottomCaption = this.bottomPocket.querySelector('.' + CLASS_PULL_CAPTION);
				//TODO only for h5
				this.wrapper.addEventListener('scrollbottom', this);
			}
		},
		_createPocket: function(clazz, options, iconClass) {
			var pocket = document.createElement('div');
			pocket.className = clazz;
			pocket.innerHTML = pocketHtml.replace('{contentrefresh}', options.contentinit).replace('{icon}', iconClass);
			return pocket;
		},
		_resetPullDownLoading: function() {
			var loading = this.pullLoading;
			if (loading) {
				this.pullCaption.innerHTML = this.options.down.contentdown;
				loading.style.webkitTransition = "";
				loading.style.webkitTransform = "";
				loading.style.webkitAnimation = "";
				loading.className = CLASS_LOADING_DOWN;
			}
		},
		_setCaptionClass: function(isPulldown, caption, title) {
			if (!isPulldown) {
				switch (title) {
					case this.options.up.contentdown:
						caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
						break;
					case this.options.up.contentrefresh:
						caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_REFRESH
						break;
					case this.options.up.contentnomore:
						caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_NOMORE;
						break;
				}
			}
		},
		_setCaption: function(title, reset) {
			if (this.loading) {
				return;
			}
			var options = this.options;
			var pocket = this.pullPocket;
			var caption = this.pullCaption;
			var loading = this.pullLoading;
			var isPulldown = this.pulldown;
			var self = this;
			if (pocket) {
				if (reset) {
					setTimeout(function() {
						caption.innerHTML = self.lastTitle = title;
						if (isPulldown) {
							loading.className = CLASS_LOADING_DOWN;
						} else {
							self._setCaptionClass(false, caption, title);
							loading.className = CLASS_LOADING;
						}
						loading.style.webkitAnimation = "";
						loading.style.webkitTransition = "";
						loading.style.webkitTransform = "";
					}, 100);
				} else {
					if (title !== this.lastTitle) {
						caption.innerHTML = title;
						if (isPulldown) {
							if (title === options.down.contentrefresh) {
								loading.className = CLASS_LOADING;
								loading.style.webkitAnimation = "spinner-spin 1s step-end infinite";
							} else if (title === options.down.contentover) {
								loading.className = CLASS_LOADING_UP;
								loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
								loading.style.webkitTransform = "rotate(180deg)";
							} else if (title === options.down.contentdown) {
								loading.className = CLASS_LOADING_DOWN;
								loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
								loading.style.webkitTransform = "rotate(0deg)";
							}
						} else {
							if (title === options.up.contentrefresh) {
								loading.className = CLASS_LOADING + ' ' + CLASS_VISIBILITY;
							} else {
								loading.className = CLASS_LOADING + ' ' + CLASS_HIDDEN;
							}
							self._setCaptionClass(false, caption, title);
						}
						this.lastTitle = title;
					}
				}

			}
		}
	};
	$.PullRefresh = PullRefresh;
})(mui, document);
(function($, window, document, undefined) {
	var CLASS_SCROLL = 'mui-scroll';
	var CLASS_SCROLLBAR = 'mui-scrollbar';
	var CLASS_INDICATOR = 'mui-scrollbar-indicator';
	var CLASS_SCROLLBAR_VERTICAL = CLASS_SCROLLBAR + '-vertical';
	var CLASS_SCROLLBAR_HORIZONTAL = CLASS_SCROLLBAR + '-horizontal';

	var CLASS_ACTIVE = 'mui-active';

	var ease = {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function(k) {
				return k * (2 - k);
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
			fn: function(k) {
				return Math.sqrt(1 - (--k * k));
			}
		},
		outCirc: {
			style: 'cubic-bezier(0.075, 0.82, 0.165, 1)'
		},
		outCubic: {
			style: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
		}
	}
	var Scroll = $.Class.extend({
		init: function(element, options) {
			this.wrapper = this.element = element;
			this.scroller = this.wrapper.children[0];
			this.scrollerStyle = this.scroller && this.scroller.style;
			this.stopped = false;

			this.options = $.extend(true, {
				scrollY: true, //是否竖向滚动
				scrollX: false, //是否横向滚动
				startX: 0, //初始化时滚动至x
				startY: 0, //初始化时滚动至y

				indicators: true, //是否显示滚动条
				stopPropagation: false,
				hardwareAccelerated: true,
				fixedBadAndorid: false,
				preventDefaultException: {
					tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|VIDEO)$/
				},
				momentum: true,

				snapX: 0.5, //横向切换距离(以当前容器宽度为基准)
				snap: false, //图片轮播，拖拽式选项卡

				bounce: true, //是否启用回弹
				bounceTime: 500, //回弹动画时间
				bounceEasing: ease.outCirc, //回弹动画曲线

				scrollTime: 500,
				scrollEasing: ease.outCubic, //轮播动画曲线

				directionLockThreshold: 5,

				parallaxElement: false, //视差元素
				parallaxRatio: 0.5
			}, options);

			this.x = 0;
			this.y = 0;
			this.translateZ = this.options.hardwareAccelerated ? ' translateZ(0)' : '';

			this._init();
			if (this.scroller) {
				this.refresh();
				//				if (this.options.startX !== 0 || this.options.startY !== 0) { //需要判断吗？后续根据实际情况再看看
				this.scrollTo(this.options.startX, this.options.startY);
				//				}
			}
		},
		_init: function() {
			this._initParallax();
			this._initIndicators();
			this._initEvent();
		},
		_initParallax: function() {
			if (this.options.parallaxElement) {
				this.parallaxElement = document.querySelector(this.options.parallaxElement);
				this.parallaxStyle = this.parallaxElement.style;
				this.parallaxHeight = this.parallaxElement.offsetHeight;
				this.parallaxImgStyle = this.parallaxElement.querySelector('img').style;
			}
		},
		_initIndicators: function() {
			var self = this;
			self.indicators = [];
			if (!this.options.indicators) {
				return;
			}
			var indicators = [],
				indicator;

			// Vertical scrollbar
			if (self.options.scrollY) {
				indicator = {
					el: this._createScrollBar(CLASS_SCROLLBAR_VERTICAL),
					listenX: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}

			// Horizontal scrollbar
			if (this.options.scrollX) {
				indicator = {
					el: this._createScrollBar(CLASS_SCROLLBAR_HORIZONTAL),
					listenY: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}

			for (var i = indicators.length; i--;) {
				this.indicators.push(new Indicator(this, indicators[i]));
			}

		},
		_initSnap: function() {
			this.currentPage = {};
			this.pages = [];
			var snaps = this.snaps;
			var length = snaps.length;
			var m = 0;
			var n = -1;
			var x = 0;
			var leftX = 0;
			var rightX = 0;
			var snapX = 0;
			for (var i = 0; i < length; i++) {
				var snap = snaps[i];
				var offsetLeft = snap.offsetLeft;
				var offsetWidth = snap.offsetWidth;
				if (i === 0 || offsetLeft <= snaps[i - 1].offsetLeft) {
					m = 0;
					n++;
				}
				if (!this.pages[m]) {
					this.pages[m] = [];
				}
				x = this._getSnapX(offsetLeft);
				snapX = Math.round((offsetWidth) * this.options.snapX);
				leftX = x - snapX;
				rightX = x - offsetWidth + snapX;
				this.pages[m][n] = {
					x: x,
					leftX: leftX,
					rightX: rightX,
					pageX: m,
					element: snap
				}
				if (snap.classList.contains(CLASS_ACTIVE)) {
					this.currentPage = this.pages[m][0];
				}
				if (x >= this.maxScrollX) {
					m++;
				}
			}
			this.options.startX = this.currentPage.x || 0;
		},
		_getSnapX: function(offsetLeft) {
			return Math.max(Math.min(0, -offsetLeft + (this.wrapperWidth / 2)), this.maxScrollX);
		},
		_gotoPage: function(index) {
			this.currentPage = this.pages[Math.min(index, this.pages.length - 1)][0];
			for (var i = 0, len = this.snaps.length; i < len; i++) {
				if (i === index) {
					this.snaps[i].classList.add(CLASS_ACTIVE);
				} else {
					this.snaps[i].classList.remove(CLASS_ACTIVE);
				}
			}
			this.scrollTo(this.currentPage.x, 0, this.options.scrollTime);
		},
		_nearestSnap: function(x) {
			if (!this.pages.length) {
				return {
					x: 0,
					pageX: 0
				};
			}
			var i = 0;
			var length = this.pages.length;
			if (x > 0) {
				x = 0;
			} else if (x < this.maxScrollX) {
				x = this.maxScrollX;
			}
			for (; i < length; i++) {
				var nearestX = this.direction === 'left' ? this.pages[i][0].leftX : this.pages[i][0].rightX;
				if (x >= nearestX) {
					return this.pages[i][0];
				}
			}
			return {
				x: 0,
				pageX: 0
			};
		},
		_initEvent: function(detach) {
			var action = detach ? 'removeEventListener' : 'addEventListener';
			window[action]('orientationchange', this);
			window[action]('resize', this);

			this.scroller[action]('webkitTransitionEnd', this);

			this.wrapper[action]($.EVENT_START, this);
			this.wrapper[action]($.EVENT_CANCEL, this);
			this.wrapper[action]($.EVENT_END, this);
			this.wrapper[action]('drag', this);
			this.wrapper[action]('dragend', this);
			this.wrapper[action]('flick', this);
			this.wrapper[action]('scrollend', this);
			if (this.options.scrollX) {
				this.wrapper[action]('swiperight', this);
			}
			var segmentedControl = this.wrapper.querySelector('.mui-segmented-control');
			if (segmentedControl) { //靠，这个bug排查了一下午，阻止hash跳转，一旦hash跳转会导致可拖拽选项卡的tab不见
				mui(segmentedControl)[detach ? 'off' : 'on']('click', 'a', $.preventDefault);
			}

			this.wrapper[action]('scrollstart', this);
			this.wrapper[action]('refresh', this);
		},
		_handleIndicatorScrollend: function() {
			this.indicators.map(function(indicator) {
				indicator.fade();
			});
		},
		_handleIndicatorScrollstart: function() {
			this.indicators.map(function(indicator) {
				indicator.fade(1);
			});
		},
		_handleIndicatorRefresh: function() {
			this.indicators.map(function(indicator) {
				indicator.refresh();
			});
		},
		handleEvent: function(e) {
			if (this.stopped) {
				this.resetPosition();
				return;
			}

			switch (e.type) {
				case $.EVENT_START:
					this._start(e);
					break;
				case 'drag':
					this.options.stopPropagation && e.stopPropagation();
					this._drag(e);
					break;
				case 'dragend':
				case 'flick':
					this.options.stopPropagation && e.stopPropagation();
					this._flick(e);
					break;
				case $.EVENT_CANCEL:
				case $.EVENT_END:
					this._end(e);
					break;
				case 'webkitTransitionEnd':
					this.transitionTimer && this.transitionTimer.cancel();
					this._transitionEnd(e);
					break;
				case 'scrollstart':
					this._handleIndicatorScrollstart(e);
					break;
				case 'scrollend':
					this._handleIndicatorScrollend(e);
					this._scrollend(e);
					e.stopPropagation();
					break;
				case 'orientationchange':
				case 'resize':
					this._resize();
					break;
				case 'swiperight':
					e.stopPropagation();
					break;
				case 'refresh':
					this._handleIndicatorRefresh(e);
					break;

			}
		},
		_start: function(e) {
			this.moved = this.needReset = false;
			this._transitionTime();
			if (this.isInTransition) {
				this.needReset = true;
				this.isInTransition = false;
				var pos = $.parseTranslateMatrix($.getStyles(this.scroller, 'webkitTransform'));
				this.setTranslate(Math.round(pos.x), Math.round(pos.y));
				//				this.resetPosition(); //reset
				$.trigger(this.scroller, 'scrollend', this);
				//				e.stopPropagation();
				e.preventDefault();
			}
			this.reLayout();
			$.trigger(this.scroller, 'beforescrollstart', this);
		},
		_getDirectionByAngle: function(angle) {
			if (angle < -80 && angle > -100) {
				return 'up';
			} else if (angle >= 80 && angle < 100) {
				return 'down';
			} else if (angle >= 170 || angle <= -170) {
				return 'left';
			} else if (angle >= -35 && angle <= 10) {
				return 'right';
			}
			return null;
		},
		_drag: function(e) {
			//			if (this.needReset) {
			//				e.stopPropagation(); //disable parent drag(nested scroller)
			//				return;
			//			}
			var detail = e.detail;
			if (this.options.scrollY || detail.direction === 'up' || detail.direction === 'down') { //如果是竖向滚动或手势方向是上或下
				//ios8 hack
				if ($.os.ios && parseFloat($.os.version) >= 8) { //多webview时，离开当前webview会导致后续touch事件不触发
					var clientY = detail.gesture.touches[0].clientY;
					//下拉刷新 or 上拉加载
					if ((clientY + 10) > window.innerHeight || clientY < 10) {
						this.resetPosition(this.options.bounceTime);
						return;
					}
				}
			}
			var isPreventDefault = isReturn = false;
			var direction = this._getDirectionByAngle(detail.angle);
			if (detail.direction === 'left' || detail.direction === 'right') {
				if (this.options.scrollX) {
					isPreventDefault = true;
					if (!this.moved) { //识别角度(该角度导致轮播不灵敏)
						//						if (direction !== 'left' && direction !== 'right') {
						//							isReturn = true;
						//						} else {
						$.gestures.session.lockDirection = true; //锁定方向
						$.gestures.session.startDirection = detail.direction;
						//						}
					}
				} else if (this.options.scrollY && !this.moved) {
					isReturn = true;
				}
			} else if (detail.direction === 'up' || detail.direction === 'down') {
				if (this.options.scrollY) {
					isPreventDefault = true;
					//					if (!this.moved) { //识别角度,竖向滚动似乎没必要进行小角度验证
					//						if (direction !== 'up' && direction !== 'down') {
					//							isReturn = true;
					//						}
					//					}
					if (!this.moved) {
						$.gestures.session.lockDirection = true; //锁定方向
						$.gestures.session.startDirection = detail.direction;
					}
				} else if (this.options.scrollX && !this.moved) {
					isReturn = true;
				}
			} else {
				isReturn = true;
			}
			if (this.moved || isPreventDefault) {
				e.stopPropagation(); //阻止冒泡(scroll类嵌套)
				detail.gesture && detail.gesture.preventDefault();
			}
			if (isReturn) { //禁止非法方向滚动
				return;
			}
			if (!this.moved) {
				$.trigger(this.scroller, 'scrollstart', this);
			} else {
				e.stopPropagation(); //move期间阻止冒泡(scroll嵌套)
			}
			var deltaX = 0;
			var deltaY = 0;
			if (!this.moved) { //start
				deltaX = detail.deltaX;
				deltaY = detail.deltaY;
			} else { //move
				deltaX = detail.deltaX - $.gestures.session.prevTouch.deltaX;
				deltaY = detail.deltaY - $.gestures.session.prevTouch.deltaY;
			}
			var absDeltaX = Math.abs(detail.deltaX);
			var absDeltaY = Math.abs(detail.deltaY);
			if (absDeltaX > absDeltaY + this.options.directionLockThreshold) {
				deltaY = 0;
			} else if (absDeltaY >= absDeltaX + this.options.directionLockThreshold) {
				deltaX = 0;
			}

			deltaX = this.hasHorizontalScroll ? deltaX : 0;
			deltaY = this.hasVerticalScroll ? deltaY : 0;
			var newX = this.x + deltaX;
			var newY = this.y + deltaY;
			// Slow down if outside of the boundaries
			if (newX > 0 || newX < this.maxScrollX) {
				newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
			}
			if (newY > 0 || newY < this.maxScrollY) {
				newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
			}

			if (!this.requestAnimationFrame) {
				this._updateTranslate();
			}
			this.direction = detail.deltaX > 0 ? 'right' : 'left';
			this.moved = true;
			this.x = newX;
			this.y = newY;
			$.trigger(this.scroller, 'scroll', this);
		},
		_flick: function(e) {
			//			if (!this.moved || this.needReset) {
			//				return;
			//			}
			if (!this.moved) {
				return;
			}
			e.stopPropagation();
			var detail = e.detail;
			this._clearRequestAnimationFrame();
			if (e.type === 'dragend' && detail.flick) { //dragend
				return;
			}

			var newX = Math.round(this.x);
			var newY = Math.round(this.y);

			this.isInTransition = false;
			// reset if we are outside of the boundaries
			if (this.resetPosition(this.options.bounceTime)) {
				return;
			}

			this.scrollTo(newX, newY); // ensures that the last position is rounded

			if (e.type === 'dragend') { //dragend
				$.trigger(this.scroller, 'scrollend', this);
				return;
			}
			var time = 0;
			var easing = '';
			// start momentum animation if needed
			if (this.options.momentum && detail.flickTime < 300) {
				momentumX = this.hasHorizontalScroll ? this._momentum(this.x, detail.flickDistanceX, detail.flickTime, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
					destination: newX,
					duration: 0
				};
				momentumY = this.hasVerticalScroll ? this._momentum(this.y, detail.flickDistanceY, detail.flickTime, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
					destination: newY,
					duration: 0
				};
				newX = momentumX.destination;
				newY = momentumY.destination;
				time = Math.max(momentumX.duration, momentumY.duration);
				this.isInTransition = true;
			}

			if (newX != this.x || newY != this.y) {
				if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
					easing = ease.quadratic;
				}
				this.scrollTo(newX, newY, time, easing);
				return;
			}

			$.trigger(this.scroller, 'scrollend', this);
			//			e.stopPropagation();
		},
		_end: function(e) {
			this.needReset = false;
			if ((!this.moved && this.needReset) || e.type === $.EVENT_CANCEL) {
				this.resetPosition();
			}
		},
		_transitionEnd: function(e) {
			if (e.target != this.scroller || !this.isInTransition) {
				return;
			}
			this._transitionTime();
			if (!this.resetPosition(this.options.bounceTime)) {
				this.isInTransition = false;
				$.trigger(this.scroller, 'scrollend', this);
			}
		},
		_scrollend: function(e) {
			if ((this.y === 0 && this.maxScrollY === 0) || (Math.abs(this.y) > 0 && this.y <= this.maxScrollY)) {
				$.trigger(this.scroller, 'scrollbottom', this);
			}
		},
		_resize: function() {
			var that = this;
			clearTimeout(that.resizeTimeout);
			that.resizeTimeout = setTimeout(function() {
				that.refresh();
			}, that.options.resizePolling);
		},
		_transitionTime: function(time) {
			time = time || 0;
			this.scrollerStyle['webkitTransitionDuration'] = time + 'ms';
			if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
				this.parallaxStyle['webkitTransitionDuration'] = time + 'ms';
			}
			if (this.options.fixedBadAndorid && !time && $.os.isBadAndroid) {
				this.scrollerStyle['webkitTransitionDuration'] = '0.001s';
				if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
					this.parallaxStyle['webkitTransitionDuration'] = '0.001s';
				}
			}
			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].transitionTime(time);
				}
			}
			if (time) { //自定义timer，保证webkitTransitionEnd始终触发
				this.transitionTimer && this.transitionTimer.cancel();
				this.transitionTimer = $.later(function() {
					$.trigger(this.scroller, 'webkitTransitionEnd');
				}, time + 100, this);
			}
		},
		_transitionTimingFunction: function(easing) {
			this.scrollerStyle['webkitTransitionTimingFunction'] = easing;
			if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
				this.parallaxStyle['webkitTransitionDuration'] = easing;
			}
			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].transitionTimingFunction(easing);
				}
			}
		},
		_translate: function(x, y) {
			this.x = x;
			this.y = y;
		},
		_clearRequestAnimationFrame: function() {
			if (this.requestAnimationFrame) {
				cancelAnimationFrame(this.requestAnimationFrame);
				this.requestAnimationFrame = null;
			}
		},
		_updateTranslate: function() {
			var self = this;
			if (self.x !== self.lastX || self.y !== self.lastY) {
				self.setTranslate(self.x, self.y);
			}
			self.requestAnimationFrame = requestAnimationFrame(function() {
				self._updateTranslate();
			});
		},
		_createScrollBar: function(clazz) {
			var scrollbar = document.createElement('div');
			var indicator = document.createElement('div');
			scrollbar.className = CLASS_SCROLLBAR + ' ' + clazz;
			indicator.className = CLASS_INDICATOR;
			scrollbar.appendChild(indicator);
			if (clazz === CLASS_SCROLLBAR_VERTICAL) {
				this.scrollbarY = scrollbar;
				this.scrollbarIndicatorY = indicator;
			} else if (clazz === CLASS_SCROLLBAR_HORIZONTAL) {
				this.scrollbarX = scrollbar;
				this.scrollbarIndicatorX = indicator;
			}
			this.wrapper.appendChild(scrollbar);
			return scrollbar;
		},
		_preventDefaultException: function(el, exceptions) {
			for (var i in exceptions) {
				if (exceptions[i].test(el[i])) {
					return true;
				}
			}
			return false;
		},
		_reLayout: function() {
			if (!this.hasHorizontalScroll) {
				this.maxScrollX = 0;
				this.scrollerWidth = this.wrapperWidth;
			}

			if (!this.hasVerticalScroll) {
				this.maxScrollY = 0;
				this.scrollerHeight = this.wrapperHeight;
			}

			this.indicators.map(function(indicator) {
				indicator.refresh();
			});

			//以防slider类嵌套使用
			if (this.options.snap && typeof this.options.snap === 'string') {
				var items = this.scroller.querySelectorAll(this.options.snap);
				this.itemLength = 0;
				this.snaps = [];
				for (var i = 0, len = items.length; i < len; i++) {
					var item = items[i];
					if (item.parentNode === this.scroller) {
						this.itemLength++;
						this.snaps.push(item);
					}
				}
				this._initSnap(); //需要每次都_initSnap么。其实init的时候执行一次，后续resize的时候执行一次就行了吧.先这么做吧，如果影响性能，再调整
			}
		},
		_momentum: function(current, distance, time, lowerMargin, wrapperSize, deceleration) {
			var speed = parseFloat(Math.abs(distance) / time),
				destination,
				duration;

			deceleration = deceleration === undefined ? 0.0006 : deceleration;
			destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
			duration = speed / deceleration;
			if (destination < lowerMargin) {
				destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
				distance = Math.abs(destination - current);
				duration = distance / speed;
			} else if (destination > 0) {
				destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
				distance = Math.abs(current) + destination;
				duration = distance / speed;
			}

			return {
				destination: Math.round(destination),
				duration: duration
			};
		},
		_getTranslateStr: function(x, y) {
			if (this.options.hardwareAccelerated) {
				return 'translate3d(' + x + 'px,' + y + 'px,0px) ' + this.translateZ;
			}
			return 'translate(' + x + 'px,' + y + 'px) ';
		},
		//API
		setStopped: function(stopped) {
			this.stopped = !!stopped;
		},
		setTranslate: function(x, y) {
			this.x = x;
			this.y = y;
			this.scrollerStyle['webkitTransform'] = this._getTranslateStr(x, y);
			if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
				var parallaxY = y * this.options.parallaxRatio;
				var scale = 1 + parallaxY / ((this.parallaxHeight - parallaxY) / 2);
				if (scale > 1) {
					this.parallaxImgStyle['opacity'] = 1 - parallaxY / 100 * this.options.parallaxRatio;
					this.parallaxStyle['webkitTransform'] = this._getTranslateStr(0, -parallaxY) + ' scale(' + scale + ',' + scale + ')';
				} else {
					this.parallaxImgStyle['opacity'] = 1;
					this.parallaxStyle['webkitTransform'] = this._getTranslateStr(0, -1) + ' scale(1,1)';
				}
			}
			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].updatePosition();
				}
			}
			this.lastX = this.x;
			this.lastY = this.y;
			$.trigger(this.scroller, 'scroll', this);
		},
		reLayout: function() {
			this.wrapper.offsetHeight;

			var paddingLeft = parseFloat($.getStyles(this.wrapper, 'padding-left')) || 0;
			var paddingRight = parseFloat($.getStyles(this.wrapper, 'padding-right')) || 0;
			var paddingTop = parseFloat($.getStyles(this.wrapper, 'padding-top')) || 0;
			var paddingBottom = parseFloat($.getStyles(this.wrapper, 'padding-bottom')) || 0;

			var clientWidth = this.wrapper.clientWidth;
			var clientHeight = this.wrapper.clientHeight;

			this.scrollerWidth = this.scroller.offsetWidth;
			this.scrollerHeight = this.scroller.offsetHeight;

			this.wrapperWidth = clientWidth - paddingLeft - paddingRight;
			this.wrapperHeight = clientHeight - paddingTop - paddingBottom;

			this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
			this.maxScrollY = Math.min(this.wrapperHeight - this.scrollerHeight, 0);
			this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
			this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
			this._reLayout();
		},
		resetPosition: function(time) {
			var x = this.x,
				y = this.y;

			time = time || 0;
			if (!this.hasHorizontalScroll || this.x > 0) {
				x = 0;
			} else if (this.x < this.maxScrollX) {
				x = this.maxScrollX;
			}

			if (!this.hasVerticalScroll || this.y > 0) {
				y = 0;
			} else if (this.y < this.maxScrollY) {
				y = this.maxScrollY;
			}

			if (x == this.x && y == this.y) {
				return false;
			}
			this.scrollTo(x, y, time, this.options.scrollEasing);

			return true;
		},
		_reInit: function() {
			var groups = this.wrapper.querySelectorAll('.' + CLASS_SCROLL);
			for (var i = 0, len = groups.length; i < len; i++) {
				if (groups[i].parentNode === this.wrapper) {
					this.scroller = groups[i];
					break;
				}
			}
			this.scrollerStyle = this.scroller && this.scroller.style;
		},
		refresh: function() {
			this._reInit();
			this.reLayout();
			$.trigger(this.scroller, 'refresh', this);
			this.resetPosition();
		},
		scrollTo: function(x, y, time, easing) {
			var easing = easing || ease.circular;
			//			this.isInTransition = time > 0 && (this.lastX != x || this.lastY != y);
			//暂不严格判断x,y，否则会导致部分版本上不正常触发轮播
			this.isInTransition = time > 0;
			if (this.isInTransition) {
				this._clearRequestAnimationFrame();
				this._transitionTimingFunction(easing.style);
				this._transitionTime(time);
				this.setTranslate(x, y);
			} else {
				this.setTranslate(x, y);
			}

		},
		scrollToBottom: function(time, easing) {
			time = time || this.options.scrollTime;
			this.scrollTo(0, this.maxScrollY, time, easing);
		},
		gotoPage: function(index) {
			this._gotoPage(index);
		},
		destroy: function() {
			this._initEvent(true); //detach
			delete $.data[this.wrapper.getAttribute('data-scroll')];
			this.wrapper.setAttribute('data-scroll', '');
		}
	});
	//Indicator
	var Indicator = function(scroller, options) {
		this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
		this.wrapperStyle = this.wrapper.style;
		this.indicator = this.wrapper.children[0];
		this.indicatorStyle = this.indicator.style;
		this.scroller = scroller;

		this.options = $.extend({
			listenX: true,
			listenY: true,
			fade: false,
			speedRatioX: 0,
			speedRatioY: 0
		}, options);

		this.sizeRatioX = 1;
		this.sizeRatioY = 1;
		this.maxPosX = 0;
		this.maxPosY = 0;

		if (this.options.fade) {
			this.wrapperStyle['webkitTransform'] = this.scroller.translateZ;
			this.wrapperStyle['webkitTransitionDuration'] = this.options.fixedBadAndorid && $.os.isBadAndroid ? '0.001s' : '0ms';
			this.wrapperStyle.opacity = '0';
		}
	}
	Indicator.prototype = {
		handleEvent: function(e) {

		},
		transitionTime: function(time) {
			time = time || 0;
			this.indicatorStyle['webkitTransitionDuration'] = time + 'ms';
			if (this.scroller.options.fixedBadAndorid && !time && $.os.isBadAndroid) {
				this.indicatorStyle['webkitTransitionDuration'] = '0.001s';
			}
		},
		transitionTimingFunction: function(easing) {
			this.indicatorStyle['webkitTransitionTimingFunction'] = easing;
		},
		refresh: function() {
			this.transitionTime();

			if (this.options.listenX && !this.options.listenY) {
				this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
			} else if (this.options.listenY && !this.options.listenX) {
				this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
			} else {
				this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
			}

			this.wrapper.offsetHeight; // force refresh

			if (this.options.listenX) {
				this.wrapperWidth = this.wrapper.clientWidth;
				this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
				this.indicatorStyle.width = this.indicatorWidth + 'px';

				this.maxPosX = this.wrapperWidth - this.indicatorWidth;

				this.minBoundaryX = 0;
				this.maxBoundaryX = this.maxPosX;

				this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
			}

			if (this.options.listenY) {
				this.wrapperHeight = this.wrapper.clientHeight;
				this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
				this.indicatorStyle.height = this.indicatorHeight + 'px';

				this.maxPosY = this.wrapperHeight - this.indicatorHeight;

				this.minBoundaryY = 0;
				this.maxBoundaryY = this.maxPosY;

				this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
			}

			this.updatePosition();
		},

		updatePosition: function() {
			var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
				y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

			if (x < this.minBoundaryX) {
				this.width = Math.max(this.indicatorWidth + x, 8);
				this.indicatorStyle.width = this.width + 'px';
				x = this.minBoundaryX;
			} else if (x > this.maxBoundaryX) {
				this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
				this.indicatorStyle.width = this.width + 'px';
				x = this.maxPosX + this.indicatorWidth - this.width;
			} else if (this.width != this.indicatorWidth) {
				this.width = this.indicatorWidth;
				this.indicatorStyle.width = this.width + 'px';
			}

			if (y < this.minBoundaryY) {
				this.height = Math.max(this.indicatorHeight + y * 3, 8);
				this.indicatorStyle.height = this.height + 'px';
				y = this.minBoundaryY;
			} else if (y > this.maxBoundaryY) {
				this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
				this.indicatorStyle.height = this.height + 'px';
				y = this.maxPosY + this.indicatorHeight - this.height;
			} else if (this.height != this.indicatorHeight) {
				this.height = this.indicatorHeight;
				this.indicatorStyle.height = this.height + 'px';
			}

			this.x = x;
			this.y = y;

			this.indicatorStyle['webkitTransform'] = this.scroller._getTranslateStr(x, y);

		},
		fade: function(val, hold) {
			if (hold && !this.visible) {
				return;
			}

			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;

			var time = val ? 250 : 500,
				delay = val ? 0 : 300;

			val = val ? '1' : '0';

			this.wrapperStyle['webkitTransitionDuration'] = time + 'ms';

			this.fadeTimeout = setTimeout((function(val) {
				this.wrapperStyle.opacity = val;
				this.visible = +val;
			}).bind(this, val), delay);
		}
	};

	$.Scroll = Scroll;

	$.fn.scroll = function(options) {
		var scrollApis = [];
		this.each(function() {
			var scrollApi = null;
			var self = this;
			var id = self.getAttribute('data-scroll');
			if (!id) {
				id = ++$.uuid;
				var _options = $.extend({}, options);
				if (self.classList.contains('mui-segmented-control')) {
					_options = $.extend(_options, {
						scrollY: false,
						scrollX: true,
						indicators: false,
						snap: '.mui-control-item'
					});
				}
				$.data[id] = scrollApi = new Scroll(self, _options);
				self.setAttribute('data-scroll', id);
			} else {
				scrollApi = $.data[id];
			}
			scrollApis.push(scrollApi);
		});
		return scrollApis.length === 1 ? scrollApis[0] : scrollApis;
	};
})(mui, window, document);
(function($, window, document, undefined) {

	var CLASS_VISIBILITY = 'mui-visibility';
	var CLASS_HIDDEN = 'mui-hidden';

	var PullRefresh = $.Scroll.extend($.extend({
		handleEvent: function(e) {
			this._super(e);
			if (e.type === 'scrollbottom') {
				if (e.target === this.scroller) {
					this._scrollbottom();
				}
			}
		},
		_scrollbottom: function() {
			if (!this.pulldown && !this.loading) {
				this.pulldown = false;
				this._initPullupRefresh();
				this.pullupLoading();
			}
		},
		_start: function(e) {
			//仅下拉刷新在start阻止默认事件
			if (e.touches && e.touches.length && e.touches[0].clientX > 30) {
				e.target && !this._preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
			}
			if (!this.loading) {
				this.pulldown = this.pullPocket = this.pullCaption = this.pullLoading = false
			}
			this._super(e);
		},
		_drag: function(e) {
			this._super(e);
			if (!this.pulldown && !this.loading && this.topPocket && e.detail.direction === 'down' && this.y >= 0) {
				this._initPulldownRefresh();
			}
			if (this.pulldown) {
				this._setCaption(this.y > this.options.down.height ? this.options.down.contentover : this.options.down.contentdown);
			}
		},

		_reLayout: function() {
			this.hasVerticalScroll = true;
			this._super();
		},
		//API
		resetPosition: function(time) {
			if (this.pulldown) {
				if (this.y >= this.options.down.height) {
					this.pulldownLoading(undefined, time || 0);
					return true;
				} else {
					!this.loading && this.topPocket.classList.remove(CLASS_VISIBILITY);
				}
			}
			return this._super(time);
		},
		pulldownLoading: function(y, time) {
			typeof y === 'undefined' && (y = this.options.down.height); //默认高度
			this.scrollTo(0, y, time, this.options.bounceEasing);
			if (this.loading) {
				return;
			}
			//			if (!this.pulldown) {
			this._initPulldownRefresh();
			//			}
			this._setCaption(this.options.down.contentrefresh);
			this.loading = true;
			this.indicators.map(function(indicator) {
				indicator.fade(0);
			});
			var callback = this.options.down.callback;
			callback && callback.call(this);
		},
		endPulldownToRefresh: function() {
			var self = this;
			if (self.topPocket && self.loading && this.pulldown) {
				self.scrollTo(0, 0, self.options.bounceTime, self.options.bounceEasing);
				self.loading = false;
				self._setCaption(self.options.down.contentdown, true);
				setTimeout(function() {
					self.loading || self.topPocket.classList.remove(CLASS_VISIBILITY);
				}, 350);
			}
		},
		pullupLoading: function(callback, x, time) {
			x = x || 0;
			this.scrollTo(x, this.maxScrollY, time, this.options.bounceEasing);
			if (this.loading) {
				return;
			}
			this._initPullupRefresh();
			this._setCaption(this.options.up.contentrefresh);
			this.indicators.map(function(indicator) {
				indicator.fade(0);
			});
			this.loading = true;
			callback = callback || this.options.up.callback;
			callback && callback.call(this);
		},
		endPullupToRefresh: function(finished) {
			var self = this;
			if (self.bottomPocket) { // && self.loading && !this.pulldown
				self.loading = false;
				if (finished) {
					this.finished = true;
					self._setCaption(self.options.up.contentnomore);
					//					self.bottomPocket.classList.remove(CLASS_VISIBILITY);
					//					self.bottomPocket.classList.add(CLASS_HIDDEN);
					self.wrapper.removeEventListener('scrollbottom', self);
				} else {
					self._setCaption(self.options.up.contentdown);
					//					setTimeout(function() {
					self.loading || self.bottomPocket.classList.remove(CLASS_VISIBILITY);
					//					}, 300);
				}
			}
		},
		disablePullupToRefresh: function() {
			this._initPullupRefresh();
			this.bottomPocket.className = 'mui-pull-bottom-pocket' + ' ' + CLASS_HIDDEN;
			this.wrapper.removeEventListener('scrollbottom', this);
		},
		enablePullupToRefresh: function() {
			this._initPullupRefresh();
			this.bottomPocket.classList.remove(CLASS_HIDDEN);
			this._setCaption(this.options.up.contentdown);
			this.wrapper.addEventListener('scrollbottom', this);
		},
		refresh: function(isReset) {
			if (isReset && this.finished) {
				this.enablePullupToRefresh();
				this.finished = false;
			}
			this._super();
		},
	}, $.PullRefresh));
	$.fn.pullRefresh = function(options) {
		if (this.length === 1) {
			var self = this[0];
			var pullRefreshApi = null;
			options = options || {};
			var id = self.getAttribute('data-pullrefresh');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = pullRefreshApi = new PullRefresh(self, options);
				self.setAttribute('data-pullrefresh', id);
			} else {
				pullRefreshApi = $.data[id];
			}
			if (options.down && options.down.auto) { //如果设置了auto，则自动下拉一次
				pullRefreshApi.pulldownLoading(options.down.autoY);
			} else if (options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
				pullRefreshApi.pullupLoading();
			}
			//暂不提供这种调用方式吧			
			//			if (typeof options === 'string') {
			//				var methodValue = pullRefreshApi[options].apply(pullRefreshApi, $.slice.call(arguments, 1));
			//				if (methodValue !== undefined) {
			//					return methodValue;
			//				}
			//			}
			return pullRefreshApi;
		}
	};
})(mui, window, document);
/**
 * snap 重构
 * @param {Object} $
 * @param {Object} window
 */
(function($, window) {
	var CLASS_SLIDER = 'mui-slider';
	var CLASS_SLIDER_GROUP = 'mui-slider-group';
	var CLASS_SLIDER_LOOP = 'mui-slider-loop';
	var CLASS_SLIDER_INDICATOR = 'mui-slider-indicator';
	var CLASS_ACTION_PREVIOUS = 'mui-action-previous';
	var CLASS_ACTION_NEXT = 'mui-action-next';
	var CLASS_SLIDER_ITEM = 'mui-slider-item';

	var CLASS_ACTIVE = 'mui-active';

	var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
	var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;
	var SELECTOR_SLIDER_PROGRESS_BAR = '.mui-slider-progress-bar';

	var Slider = $.Slider = $.Scroll.extend({
		init: function(element, options) {
			this._super(element, $.extend(true, {
				fingers: 1,
				interval: 0, //设置为0，则不定时轮播
				scrollY: false,
				scrollX: true,
				indicators: false,
				scrollTime: 1000,
				startX: false,
				slideTime: 0, //滑动动画时间
				snap: SELECTOR_SLIDER_ITEM
			}, options));
			if (this.options.startX) {
				//				$.trigger(this.wrapper, 'scrollend', this);
			}
		},
		_init: function() {
			this._reInit();
			if (this.scroller) {
				this.scrollerStyle = this.scroller.style;
				this.progressBar = this.wrapper.querySelector(SELECTOR_SLIDER_PROGRESS_BAR);
				if (this.progressBar) {
					this.progressBarWidth = this.progressBar.offsetWidth;
					this.progressBarStyle = this.progressBar.style;
				}
				//忘记这个代码是干什么的了？
				//				this.x = this._getScroll();
				//				if (this.options.startX === false) {
				//					this.options.startX = this.x;
				//				}
				//根据active修正startX

				this._super();
				this._initTimer();
			}
		},
		_triggerSlide: function() {
			var self = this;
			self.isInTransition = false;
			var page = self.currentPage;
			self.slideNumber = self._fixedSlideNumber();
			if (self.loop) {
				if (self.slideNumber === 0) {
					self.setTranslate(self.pages[1][0].x, 0);
				} else if (self.slideNumber === self.itemLength - 3) {
					self.setTranslate(self.pages[self.itemLength - 2][0].x, 0);
				}
			}
			if (self.lastSlideNumber != self.slideNumber) {
				self.lastSlideNumber = self.slideNumber;
				self.lastPage = self.currentPage;
				$.trigger(self.wrapper, 'slide', {
					slideNumber: self.slideNumber
				});
			}
			self._initTimer();
		},
		_handleSlide: function(e) {
			var self = this;
			if (e.target !== self.wrapper) {
				return;
			}
			var detail = e.detail;
			detail.slideNumber = detail.slideNumber || 0;
			var temps = self.scroller.querySelectorAll(SELECTOR_SLIDER_ITEM);
			var items = [];
			for (var i = 0, len = temps.length; i < len; i++) {
				var item = temps[i];
				if (item.parentNode === self.scroller) {
					items.push(item);
				}
			}
			var _slideNumber = detail.slideNumber;
			if (self.loop) {
				_slideNumber += 1;
			}
			if (!self.wrapper.classList.contains('mui-segmented-control')) {
				for (var i = 0, len = items.length; i < len; i++) {
					var item = items[i];
					if (item.parentNode === self.scroller) {
						if (i === _slideNumber) {
							item.classList.add(CLASS_ACTIVE);
						} else {
							item.classList.remove(CLASS_ACTIVE);
						}
					}
				}
			}
			var indicatorWrap = self.wrapper.querySelector('.mui-slider-indicator');
			if (indicatorWrap) {
				if (indicatorWrap.getAttribute('data-scroll')) { //scroll
					$(indicatorWrap).scroll().gotoPage(detail.slideNumber);
				}
				var indicators = indicatorWrap.querySelectorAll('.mui-indicator');
				if (indicators.length > 0) { //图片轮播
					for (var i = 0, len = indicators.length; i < len; i++) {
						indicators[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
					}
				} else {
					var number = indicatorWrap.querySelector('.mui-number span');
					if (number) { //图文表格
						number.innerText = (detail.slideNumber + 1);
					} else { //segmented controls
						var controlItems = indicatorWrap.querySelectorAll('.mui-control-item');
						for (var i = 0, len = controlItems.length; i < len; i++) {
							controlItems[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
						}
					}
				}
			}
			e.stopPropagation();
		},
		_handleTabShow: function(e) {
			var self = this;
			self.gotoItem((e.detail.tabNumber || 0), self.options.slideTime);
		},
		_handleIndicatorTap: function(event) {
			var self = this;
			var target = event.target;
			if (target.classList.contains(CLASS_ACTION_PREVIOUS) || target.classList.contains(CLASS_ACTION_NEXT)) {
				self[target.classList.contains(CLASS_ACTION_PREVIOUS) ? 'prevItem' : 'nextItem']();
				event.stopPropagation();
			}
		},
		_initEvent: function(detach) {
			var self = this;
			self._super(detach);
			var action = detach ? 'removeEventListener' : 'addEventListener';
			self.wrapper[action]('slide', this);
			self.wrapper[action]($.eventName('shown', 'tab'), this);
		},
		handleEvent: function(e) {
			this._super(e);
			switch (e.type) {
				case 'slide':
					this._handleSlide(e);
					break;
				case $.eventName('shown', 'tab'):
					if (~this.snaps.indexOf(e.target)) { //避免嵌套监听错误的tab show
						this._handleTabShow(e);
					}
					break;
			}
		},
		_scrollend: function(e) {
			this._super(e);
			this._triggerSlide(e);
		},
		_drag: function(e) {
			this._super(e);
			var direction = e.detail.direction;
			if (direction === 'left' || direction === 'right') {
				//拖拽期间取消定时
				var slidershowTimer = this.wrapper.getAttribute('data-slidershowTimer');
				slidershowTimer && window.clearTimeout(slidershowTimer);

				e.stopPropagation();
			}
		},
		_initTimer: function() {
			var self = this;
			var slider = self.wrapper;
			var interval = self.options.interval;
			var slidershowTimer = slider.getAttribute('data-slidershowTimer');
			slidershowTimer && window.clearTimeout(slidershowTimer);
			if (interval) {
				slidershowTimer = window.setTimeout(function() {
					if (!slider) {
						return;
					}
					//仅slider显示状态进行自动轮播
					if (!!(slider.offsetWidth || slider.offsetHeight)) {
						self.nextItem(true);
						//下一个
					}
					self._initTimer();
				}, interval);
				slider.setAttribute('data-slidershowTimer', slidershowTimer);
			}
		},

		_fixedSlideNumber: function(page) {
			page = page || this.currentPage;
			var slideNumber = page.pageX;
			if (this.loop) {
				if (page.pageX === 0) {
					slideNumber = this.itemLength - 3;
				} else if (page.pageX === (this.itemLength - 1)) {
					slideNumber = 0;
				} else {
					slideNumber = page.pageX - 1;
				}
			}
			return slideNumber;
		},
		_reLayout: function() {
			this.hasHorizontalScroll = true;
			this.loop = this.scroller.classList.contains(CLASS_SLIDER_LOOP);
			this._super();
		},
		_getScroll: function() {
			var result = $.parseTranslateMatrix($.getStyles(this.scroller, 'webkitTransform'));
			return result ? result.x : 0;
		},
		_transitionEnd: function(e) {
			if (e.target !== this.scroller || !this.isInTransition) {
				return;
			}
			this._transitionTime();
			this.isInTransition = false;
			$.trigger(this.wrapper, 'scrollend', this);
		},
		_flick: function(e) {
			if (!this.moved) { //无moved
				return;
			}
			var detail = e.detail;
			var direction = detail.direction;
			this._clearRequestAnimationFrame();
			this.isInTransition = true;
			//			if (direction === 'up' || direction === 'down') {
			//				this.resetPosition(this.options.bounceTime);
			//				return;
			//			}
			if (e.type === 'flick') {
				if (detail.deltaTime < 200) { //flick，太容易触发，额外校验一下deltaTime
					this.x = this._getPage((this.slideNumber + (direction === 'right' ? -1 : 1)), true).x;
				}
				this.resetPosition(this.options.bounceTime);
			} else if (e.type === 'dragend' && !detail.flick) {
				this.resetPosition(this.options.bounceTime);
			}
			e.stopPropagation();
		},
		_initSnap: function() {
			this.scrollerWidth = this.itemLength * this.scrollerWidth;
			this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
			this._super();
			if (!this.currentPage.x) {
				//当slider处于隐藏状态时，导致snap计算是错误的，临时先这么判断一下，后续要考虑解决所有scroll在隐藏状态下初始化属性不正确的问题
				var currentPage = this.pages[this.loop ? 1 : 0];
				currentPage = currentPage || this.pages[0];
				if (!currentPage) {
					return;
				}
				this.currentPage = currentPage[0];
				this.slideNumber = 0;
				this.lastSlideNumber = typeof this.lastSlideNumber === 'undefined' ? 0 : this.lastSlideNumber;
			} else {
				this.slideNumber = this._fixedSlideNumber();
				this.lastSlideNumber = typeof this.lastSlideNumber === 'undefined' ? this.slideNumber : this.lastSlideNumber;
			}
			this.options.startX = this.currentPage.x || 0;
		},
		_getSnapX: function(offsetLeft) {
			return Math.max(-offsetLeft, this.maxScrollX);
		},
		_getPage: function(slideNumber, isFlick) {
			if (this.loop) {
				if (slideNumber > (this.itemLength - (isFlick ? 2 : 3))) {
					slideNumber = 1;
					time = 0;
				} else if (slideNumber < (isFlick ? -1 : 0)) {
					slideNumber = this.itemLength - 2;
					time = 0;
				} else {
					slideNumber += 1;
				}
			} else {
				if (!isFlick) {
					if (slideNumber > (this.itemLength - 1)) {
						slideNumber = 0;
						time = 0;
					} else if (slideNumber < 0) {
						slideNumber = this.itemLength - 1;
						time = 0;
					}
				}
				slideNumber = Math.min(Math.max(0, slideNumber), this.itemLength - 1);
			}
			return this.pages[slideNumber][0];
		},
		_gotoItem: function(slideNumber, time) {
			this.currentPage = this._getPage(slideNumber, true); //此处传true。可保证程序切换时，动画与人手操作一致(第一张，最后一张的切换动画)
			this.scrollTo(this.currentPage.x, 0, time, this.options.scrollEasing);
			if (time === 0) {
				$.trigger(this.wrapper, 'scrollend', this);
			}
		},
		//API
		setTranslate: function(x, y) {
			this._super(x, y);
			var progressBar = this.progressBar;
			if (progressBar) {
				this.progressBarStyle.webkitTransform = this._getTranslateStr((-x * (this.progressBarWidth / this.wrapperWidth)), 0);
			}
		},
		resetPosition: function(time) {
			time = time || 0;
			if (this.x > 0) {
				this.x = 0;
			} else if (this.x < this.maxScrollX) {
				this.x = this.maxScrollX;
			}
			this.currentPage = this._nearestSnap(this.x);
			this.scrollTo(this.currentPage.x, 0, time, this.options.scrollEasing);
			return true;
		},
		gotoItem: function(slideNumber, time) {
			this._gotoItem(slideNumber, typeof time === 'undefined' ? this.options.scrollTime : time);
		},
		nextItem: function() {
			this._gotoItem(this.slideNumber + 1, this.options.scrollTime);
		},
		prevItem: function() {
			this._gotoItem(this.slideNumber - 1, this.options.scrollTime);
		},
		getSlideNumber: function() {
			return this.slideNumber || 0;
		},
		_reInit: function() {
			var groups = this.wrapper.querySelectorAll('.' + CLASS_SLIDER_GROUP);
			for (var i = 0, len = groups.length; i < len; i++) {
				if (groups[i].parentNode === this.wrapper) {
					this.scroller = groups[i];
					break;
				}
			}
			this.scrollerStyle = this.scroller && this.scroller.style;
			if (this.progressBar) {
				this.progressBarWidth = this.progressBar.offsetWidth;
				this.progressBarStyle = this.progressBar.style;
			}
		},
		refresh: function(options) {
			if (options) {
				$.extend(this.options, options);
				this._super();
				this._initTimer();
			} else {
				this._super();
			}
		},
		destroy: function() {
			this._initEvent(true); //detach
			delete $.data[this.wrapper.getAttribute('data-slider')];
			this.wrapper.setAttribute('data-slider', '');
		}
	});
	$.fn.slider = function(options) {
		var slider = null;
		this.each(function() {
			var sliderElement = this;
			if (!this.classList.contains(CLASS_SLIDER)) {
				sliderElement = this.querySelector('.' + CLASS_SLIDER);
			}
			if (sliderElement && sliderElement.querySelector(SELECTOR_SLIDER_ITEM)) {
				var id = sliderElement.getAttribute('data-slider');
				if (!id) {
					id = ++$.uuid;
					$.data[id] = slider = new Slider(sliderElement, options);
					sliderElement.setAttribute('data-slider', id);
				} else {
					slider = $.data[id];
					if (slider && options) {
						slider.refresh(options);
					}
				}
			}
		});
		return slider;
	};
	$.ready(function() {
		//		setTimeout(function() {
		$('.mui-slider').slider();
		$('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
			scrollY: false,
			scrollX: true,
			indicators: false,
			snap: '.mui-control-item'
		});
		//		}, 500); //临时处理slider宽度计算不正确的问题(初步确认是scrollbar导致的)

	});
})(mui, window);
/**
 * pullRefresh 5+
 * @param {type} $
 * @returns {undefined}
 */
(function($, document) {
    if (!($.os.plus && $.os.android)) { //仅在5+android支持多webview的使用
        return;
    }
    $.plusReady(function() {
        if (window.__NWin_Enable__ === false) { //不支持多webview，则不用5+下拉刷新
            return;
        }
        var CLASS_PLUS_PULLREFRESH = 'mui-plus-pullrefresh';
        var CLASS_VISIBILITY = 'mui-visibility';
        var CLASS_HIDDEN = 'mui-hidden';
        var CLASS_BLOCK = 'mui-block';

        var CLASS_PULL_CAPTION = 'mui-pull-caption';
        var CLASS_PULL_CAPTION_DOWN = 'mui-pull-caption-down';
        var CLASS_PULL_CAPTION_REFRESH = 'mui-pull-caption-refresh';
        var CLASS_PULL_CAPTION_NOMORE = 'mui-pull-caption-nomore';

        var PlusPullRefresh = $.Class.extend({
            init: function(element, options) {
                this.element = element;
                this.options = options;
                this.wrapper = this.scroller = element;
                this._init();
                this._initPulldownRefreshEvent();
            },
            _init: function() {
                var self = this;
                //document.addEventListener('plusscrollbottom', this);
                window.addEventListener('dragup', self);
                document.addEventListener("plusscrollbottom", self);
                self.scrollInterval = window.setInterval(function() {
                    if (self.isScroll && !self.loading) {
                        if (window.pageYOffset + window.innerHeight + 10 >= document.documentElement.scrollHeight) {
                            self.isScroll = false; //放在这里是因为快速滚动的话，有可能检测时，还没到底，所以只要有滚动，没到底之前一直检测高度变化
                            if (self.bottomPocket) {
                                self.pullupLoading();
                            }
                        }
                    }
                }, 100);
            },
            _initPulldownRefreshEvent: function() {
                var self = this;
                if (self.topPocket && self.options.webviewId) {
                    $.plusReady(function() {
                        var webview = plus.webview.getWebviewById(self.options.webviewId);
                        if (!webview) {
                            return;
                        }
                        self.options.webview = webview;
                        var downOptions = self.options.down;
                        var height = downOptions.height;
                        webview.addEventListener('close', function() {
                            var attrWebviewId = self.options.webviewId && self.options.webviewId.replace(/\//g, "_"); //替换所有"/" 
                            self.element.removeAttribute('data-pullrefresh-plus-' + attrWebviewId);
                        });
                        webview.addEventListener("dragBounce", function(e) {
                            if (!self.pulldown) {
                                self._initPulldownRefresh();
                            } else {
                                self.pullPocket.classList.add(CLASS_BLOCK);
                            }
                            switch (e.status) {
                                case "beforeChangeOffset": //下拉可刷新状态
                                    self._setCaption(downOptions.contentdown);
                                    break;
                                case "afterChangeOffset": //松开可刷新状态
                                    self._setCaption(downOptions.contentover);
                                    break;
                                case "dragEndAfterChangeOffset": //正在刷新状态
                                    //执行下拉刷新所在webview的回调函数
                                    webview.evalJS("mui&&mui.options.pullRefresh.down.callback()");
                                    self._setCaption(downOptions.contentrefresh);
                                    break;
                                default:
                                    break;
                            }
                        }, false);
                        webview.setBounce({
                            position: {
                                top: height * 2 + 'px'
                            },
                            changeoffset: {
                                top: height + 'px'
                            }
                        });
                    });
                }
            },
            handleEvent: function(e) {
                var self = this;
                if (self.stopped) {
                    return;
                }
                //5+的plusscrollbottom当页面内容较少时，不触发
                //          if (e.type === 'plusscrollbottom') {
                //              if (this.bottomPocket) {
                //                  this.pullupLoading();
                //              }
                //          }
                self.isScroll = false;
                if (e.type === 'dragup' || e.type === 'plusscrollbottom') {
                    self.isScroll = true;
                    setTimeout(function() {
                        self.isScroll = false;
                    }, 1000);
                }
            }
        }).extend($.extend({
            setStopped: function(stopped) { //该方法是子页面调用的
                this.stopped = !!stopped;
                //TODO 此处需要设置当前webview的bounce为none,目前5+有BUG
                var webview = plus.webview.currentWebview();
                if (this.stopped) {
                    webview.setStyle({
                        bounce: 'none'
                    });
                    webview.setBounce({
                        position: {
                            top: 'none'
                        }
                    });
                } else {
                    var height = this.options.down.height;
                    webview.setStyle({
                        bounce: 'vertical'
                    });
                    webview.setBounce({
                        position: {
                            top: height * 2 + 'px'
                        },
                        changeoffset: {
                            top: height + 'px'
                        }
                    });
                }
            },
            pulldownLoading: function() { //该方法是子页面调用的
                $.plusReady(function() {
                    plus.webview.currentWebview().setBounce({
                        offset: {
                            top: this.options.down.height + "px"
                        }
                    });
                }.bind(this));
            },
            _pulldownLoading: function() { //该方法是父页面调用的
                var self = this;
                $.plusReady(function() {
                    var childWebview = plus.webview.getWebviewById(self.options.webviewId);
                    childWebview.setBounce({
                        offset: {
                            top: self.options.down.height + "px"
                        }
                    });
                });
            },
            endPulldownToRefresh: function() { //该方法是子页面调用的
                var webview = plus.webview.currentWebview();
                webview.parent().evalJS("mui&&mui(document.querySelector('.mui-content')).pullRefresh('" + JSON.stringify({
                    webviewId: webview.id
                }) + "')._endPulldownToRefresh()");
            },
            _endPulldownToRefresh: function() { //该方法是父页面调用的
                var self = this;
                if (self.topPocket && self.options.webview) {
                    self.options.webview.endPullToRefresh(); //下拉刷新所在webview回弹
                    self.loading = false;
                    self._setCaption(self.options.down.contentdown, true);
                    setTimeout(function() {
                        self.loading || self.topPocket.classList.remove(CLASS_BLOCK);
                    }, 350);
                }
            },
            pullupLoading: function(callback) {
                var self = this;
                if (self.isLoading) return;
                self.isLoading = true;
                if (self.pulldown !== false) {
                    self._initPullupRefresh();
                } else {
                    this.pullPocket.classList.add(CLASS_BLOCK);
                }
                setTimeout(function() {
                    self.pullLoading.classList.add(CLASS_VISIBILITY);
                    self.pullLoading.classList.remove(CLASS_HIDDEN);
                    self.pullCaption.innerHTML = ''; //修正5+里边第一次加载时，文字显示的bug(还会显示出来个“多”,猜测应该是渲染问题导致的)
                    self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_REFRESH;
                    self.pullCaption.innerHTML = self.options.up.contentrefresh;
                    callback = callback || self.options.up.callback;
                    callback && callback.call(self);
                }, 300);
            },
            endPullupToRefresh: function(finished) {
                var self = this;
                if (self.pullLoading) {
                    self.pullLoading.classList.remove(CLASS_VISIBILITY);
                    self.pullLoading.classList.add(CLASS_HIDDEN);
                    self.isLoading = false;
                    if (finished) {
                        self.finished = true;
                        self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_NOMORE;
                        self.pullCaption.innerHTML = self.options.up.contentnomore;
                        //                  self.bottomPocket.classList.remove(CLASS_BLOCK);
                        //                  self.bottomPocket.classList.add(CLASS_HIDDEN);
                        //取消5+的plusscrollbottom事件
                        document.removeEventListener('plusscrollbottom', self);
                        window.removeEventListener('dragup', self);
                    } else { //初始化时隐藏，后续不再隐藏
                        self.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
                        self.pullCaption.innerHTML = self.options.up.contentdown;
                        //                  setTimeout(function() {
                        //                      self.loading || self.bottomPocket.classList.remove(CLASS_BLOCK);
                        //                  }, 350);
                    }
                }
            },
            disablePullupToRefresh: function() {
                this._initPullupRefresh();
                this.bottomPocket.className = 'mui-pull-bottom-pocket' + ' ' + CLASS_HIDDEN;
                window.removeEventListener('dragup', this);
            },
            enablePullupToRefresh: function() {
                this._initPullupRefresh();
                this.bottomPocket.classList.remove(CLASS_HIDDEN);
                this.pullCaption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
                this.pullCaption.innerHTML = this.options.up.contentdown;
                document.addEventListener("plusscrollbottom", this);
                window.addEventListener('dragup', this);
            },
            scrollTo: function(x, y, time) {
                $.scrollTo(y, time);
            },
            scrollToBottom: function(time) {
                $.scrollTo(document.documentElement.scrollHeight, time);
            },
            refresh: function(isReset) {
                if (isReset && this.finished) {
                    this.enablePullupToRefresh();
                    this.finished = false;
                }
            }
        }, $.PullRefresh));

        //override h5 pullRefresh
        $.fn.pullRefresh = function(options) {
            var self;
            if (this.length === 0) {
                self = document.createElement('div');
                self.className = 'mui-content';
                document.body.appendChild(self);
            } else {
                self = this[0];
            }
            var args = options;
            //一个父需要支持多个子下拉刷新
            options = options || {}
            if (typeof options === 'string') {
                options = $.parseJSON(options);
            };
            !options.webviewId && (options.webviewId = (plus.webview.currentWebview().id || plus.webview.currentWebview().getURL()));
            var pullRefreshApi = null;
            var attrWebviewId = options.webviewId && options.webviewId.replace(/\//g, "_"); //替换所有"/"
            var id = self.getAttribute('data-pullrefresh-plus-' + attrWebviewId);
            if (!id && typeof args === 'undefined') {
                return false;
            }
            if (!id) { //避免重复初始化5+ pullrefresh
                id = ++$.uuid;
                self.setAttribute('data-pullrefresh-plus-' + attrWebviewId, id);
                document.body.classList.add(CLASS_PLUS_PULLREFRESH);
                $.data[id] = pullRefreshApi = new PlusPullRefresh(self, options);
            } else {
                pullRefreshApi = $.data[id];
            }
            if (options.down && options.down.auto) { //如果设置了auto，则自动下拉一次
                pullRefreshApi._pulldownLoading(); //parent webview
            } else if (options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
                pullRefreshApi.pullupLoading();
            }
            return pullRefreshApi;
        };
    });

})(mui, document);
/**
 * off-canvas
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} action
 * @returns {undefined}
 */
(function($, window, document, name) {
	var CLASS_OFF_CANVAS_LEFT = 'mui-off-canvas-left';
	var CLASS_OFF_CANVAS_RIGHT = 'mui-off-canvas-right';
	var CLASS_ACTION_BACKDROP = 'mui-off-canvas-backdrop';
	var CLASS_OFF_CANVAS_WRAP = 'mui-off-canvas-wrap';

	var CLASS_SLIDE_IN = 'mui-slide-in';
	var CLASS_ACTIVE = 'mui-active';


	var CLASS_TRANSITIONING = 'mui-transitioning';

	var SELECTOR_INNER_WRAP = '.mui-inner-wrap';


	var OffCanvas = $.Class.extend({
		init: function(element, options) {
			this.wrapper = this.element = element;
			this.scroller = this.wrapper.querySelector(SELECTOR_INNER_WRAP);
			this.classList = this.wrapper.classList;
			if (this.scroller) {
				this.options = $.extend(true, {
					dragThresholdX: 10,
					scale: 0.8,
					opacity: 0.1,
					preventDefaultException: {
						tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|VIDEO)$/
					},
				}, options);
				document.body.classList.add('mui-fullscreen'); //fullscreen
				this.refresh();
				this.initEvent();
			}
		},
		_preventDefaultException: function(el, exceptions) {
			for (var i in exceptions) {
				if (exceptions[i].test(el[i])) {
					return true;
				}
			}
			return false;
		},
		refresh: function(offCanvas) {
			//			offCanvas && !offCanvas.classList.contains(CLASS_ACTIVE) && this.classList.remove(CLASS_ACTIVE);
			this.slideIn = this.classList.contains(CLASS_SLIDE_IN);
			this.scalable = this.classList.contains('mui-scalable') && !this.slideIn;
			this.scroller = this.wrapper.querySelector(SELECTOR_INNER_WRAP);
			//			!offCanvas && this.scroller.classList.remove(CLASS_TRANSITIONING);
			//			!offCanvas && this.scroller.setAttribute('style', '');
			this.offCanvasLefts = this.wrapper.querySelectorAll('.' + CLASS_OFF_CANVAS_LEFT);
			this.offCanvasRights = this.wrapper.querySelectorAll('.' + CLASS_OFF_CANVAS_RIGHT);
			if (offCanvas) {
				if (offCanvas.classList.contains(CLASS_OFF_CANVAS_LEFT)) {
					this.offCanvasLeft = offCanvas;
				} else if (offCanvas.classList.contains(CLASS_OFF_CANVAS_RIGHT)) {
					this.offCanvasRight = offCanvas;
				}
			} else {
				this.offCanvasRight = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT);
				this.offCanvasLeft = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT);
			}
			this.offCanvasRightWidth = this.offCanvasLeftWidth = 0;
			this.offCanvasLeftSlideIn = this.offCanvasRightSlideIn = false;
			if (this.offCanvasRight) {
				this.offCanvasRightWidth = this.offCanvasRight.offsetWidth;
				this.offCanvasRightSlideIn = this.slideIn && (this.offCanvasRight.parentNode === this.wrapper);
				//				this.offCanvasRight.classList.remove(CLASS_TRANSITIONING);
				//				this.offCanvasRight.classList.remove(CLASS_ACTIVE);
				//				this.offCanvasRight.setAttribute('style', '');
			}
			if (this.offCanvasLeft) {
				this.offCanvasLeftWidth = this.offCanvasLeft.offsetWidth;
				this.offCanvasLeftSlideIn = this.slideIn && (this.offCanvasLeft.parentNode === this.wrapper);
				//				this.offCanvasLeft.classList.remove(CLASS_TRANSITIONING);
				//				this.offCanvasLeft.classList.remove(CLASS_ACTIVE);
				//				this.offCanvasLeft.setAttribute('style', '');
			}
			this.backdrop = this.scroller.querySelector('.' + CLASS_ACTION_BACKDROP);

			this.options.dragThresholdX = this.options.dragThresholdX || 10;

			this.visible = false;
			this.startX = null;
			this.lastX = null;
			this.offsetX = null;
			this.lastTranslateX = null;
		},
		handleEvent: function(e) {
			switch (e.type) {
				case $.EVENT_START:
					e.target && !this._preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
					break;
				case 'webkitTransitionEnd': //有个bug需要处理，需要考虑假设没有触发webkitTransitionEnd的情况
					if (e.target === this.scroller) {
						this._dispatchEvent();
					}
					break;
				case 'drag':
					var detail = e.detail;
					if (!this.startX) {
						this.startX = detail.center.x;
						this.lastX = this.startX;
					} else {
						this.lastX = detail.center.x;
					}
					if (!this.isDragging && Math.abs(this.lastX - this.startX) > this.options.dragThresholdX && (detail.direction === 'left' || (detail.direction === 'right'))) {
						if (this.slideIn) {
							this.scroller = this.wrapper.querySelector(SELECTOR_INNER_WRAP);
							if (this.classList.contains(CLASS_ACTIVE)) {
								if (this.offCanvasRight && this.offCanvasRight.classList.contains(CLASS_ACTIVE)) {
									this.offCanvas = this.offCanvasRight;
									this.offCanvasWidth = this.offCanvasRightWidth;
								} else {
									this.offCanvas = this.offCanvasLeft;
									this.offCanvasWidth = this.offCanvasLeftWidth;
								}
							} else {
								if (detail.direction === 'left' && this.offCanvasRight) {
									this.offCanvas = this.offCanvasRight;
									this.offCanvasWidth = this.offCanvasRightWidth;
								} else if (detail.direction === 'right' && this.offCanvasLeft) {
									this.offCanvas = this.offCanvasLeft;
									this.offCanvasWidth = this.offCanvasLeftWidth;
								} else {
									this.scroller = null;
								}
							}
						} else {
							if (this.classList.contains(CLASS_ACTIVE)) {
								if (detail.direction === 'left') {
									this.offCanvas = this.offCanvasLeft;
									this.offCanvasWidth = this.offCanvasLeftWidth;
								} else {
									this.offCanvas = this.offCanvasRight;
									this.offCanvasWidth = this.offCanvasRightWidth;
								}
							} else {
								if (detail.direction === 'right') {
									this.offCanvas = this.offCanvasLeft;
									this.offCanvasWidth = this.offCanvasLeftWidth;
								} else {
									this.offCanvas = this.offCanvasRight;
									this.offCanvasWidth = this.offCanvasRightWidth;
								}
							}
						}
						if (this.offCanvas && this.scroller) {
							this.startX = this.lastX;
							this.isDragging = true;

							$.gestures.session.lockDirection = true; //锁定方向
							$.gestures.session.startDirection = detail.direction;

							this.offCanvas.classList.remove(CLASS_TRANSITIONING);
							this.scroller.classList.remove(CLASS_TRANSITIONING);
							this.offsetX = this.getTranslateX();
							this._initOffCanvasVisible();
						}
					}
					if (this.isDragging) {
						this.updateTranslate(this.offsetX + (this.lastX - this.startX));
						detail.gesture.preventDefault();
						e.stopPropagation();
					}
					break;
				case 'dragend':
					if (this.isDragging) {
						var detail = e.detail;
						var direction = detail.direction;
						this.isDragging = false;
						this.offCanvas.classList.add(CLASS_TRANSITIONING);
						this.scroller.classList.add(CLASS_TRANSITIONING);
						var ratio = 0;
						var x = this.getTranslateX();
						if (!this.slideIn) {
							if (x >= 0) {
								ratio = (this.offCanvasLeftWidth && (x / this.offCanvasLeftWidth)) || 0;
							} else {
								ratio = (this.offCanvasRightWidth && (x / this.offCanvasRightWidth)) || 0;
							}
							if (ratio === 0) {
								this.openPercentage(0);
								this._dispatchEvent(); //此处不触发webkitTransitionEnd,所以手动dispatch
								return;
							}
							if (direction === 'right' && ratio >= 0 && (ratio >= 0.5 || detail.swipe)) { //右滑打开
								this.openPercentage(100);
							} else if (direction === 'right' && ratio < 0 && (ratio > -0.5 || detail.swipe)) { //右滑关闭
								this.openPercentage(0);
							} else if (direction === 'right' && ratio > 0 && ratio < 0.5) { //右滑还原关闭
								this.openPercentage(0);
							} else if (direction === 'right' && ratio < 0.5) { //右滑还原打开
								this.openPercentage(-100);
							} else if (direction === 'left' && ratio <= 0 && (ratio <= -0.5 || detail.swipe)) { //左滑打开
								this.openPercentage(-100);
							} else if (direction === 'left' && ratio > 0 && (ratio <= 0.5 || detail.swipe)) { //左滑关闭
								this.openPercentage(0);
							} else if (direction === 'left' && ratio < 0 && ratio >= -0.5) { //左滑还原关闭
								this.openPercentage(0);
							} else if (direction === 'left' && ratio > 0.5) { //左滑还原打开
								this.openPercentage(100);
							} else { //默认关闭
								this.openPercentage(0);
							}
							if (ratio === 1 || ratio === -1) { //此处不触发webkitTransitionEnd,所以手动dispatch
								this._dispatchEvent();
							}
						} else {
							if (x >= 0) {
								ratio = (this.offCanvasRightWidth && (x / this.offCanvasRightWidth)) || 0;
							} else {
								ratio = (this.offCanvasLeftWidth && (x / this.offCanvasLeftWidth)) || 0;
							}
							if (direction === 'right' && ratio <= 0 && (ratio >= -0.5 || detail.swipe)) { //右滑打开
								this.openPercentage(100);
							} else if (direction === 'right' && ratio > 0 && (ratio >= 0.5 || detail.swipe)) { //右滑关闭
								this.openPercentage(0);
							} else if (direction === 'right' && ratio <= -0.5) { //右滑还原关闭
								this.openPercentage(0);
							} else if (direction === 'right' && ratio > 0 && ratio <= 0.5) { //右滑还原打开
								this.openPercentage(-100);
							} else if (direction === 'left' && ratio >= 0 && (ratio <= 0.5 || detail.swipe)) { //左滑打开
								this.openPercentage(-100);
							} else if (direction === 'left' && ratio < 0 && (ratio <= -0.5 || detail.swipe)) { //左滑关闭
								this.openPercentage(0);
							} else if (direction === 'left' && ratio >= 0.5) { //左滑还原关闭
								this.openPercentage(0);
							} else if (direction === 'left' && ratio >= -0.5 && ratio < 0) { //左滑还原打开
								this.openPercentage(100);
							} else {
								this.openPercentage(0);
							}
							if (ratio === 1 || ratio === -1 || ratio === 0) {
								this._dispatchEvent();
								return;
							}

						}
					}
					break;
			}
		},
		_dispatchEvent: function() {
			if (this.classList.contains(CLASS_ACTIVE)) {
				$.trigger(this.wrapper, 'shown', this);
			} else {
				$.trigger(this.wrapper, 'hidden', this);
			}
		},
		_initOffCanvasVisible: function() {
			if (!this.visible) {
				this.visible = true;
				if (this.offCanvasLeft) {
					this.offCanvasLeft.style.visibility = 'visible';
				}
				if (this.offCanvasRight) {
					this.offCanvasRight.style.visibility = 'visible';
				}
			}
		},
		initEvent: function() {
			var self = this;
			if (self.backdrop) {
				self.backdrop.addEventListener('tap', function(e) {
					self.close();
					e.detail.gesture.preventDefault();
				});
			}
			if (this.classList.contains('mui-draggable')) {
				this.wrapper.addEventListener($.EVENT_START, this); //临时处理
				this.wrapper.addEventListener('drag', this);
				this.wrapper.addEventListener('dragend', this);
			}
			this.wrapper.addEventListener('webkitTransitionEnd', this);
		},
		openPercentage: function(percentage) {
			var p = percentage / 100;
			if (!this.slideIn) {
				if (this.offCanvasLeft && percentage >= 0) {
					this.updateTranslate(this.offCanvasLeftWidth * p);
					this.offCanvasLeft.classList[p !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
				} else if (this.offCanvasRight && percentage <= 0) {
					this.updateTranslate(this.offCanvasRightWidth * p);
					this.offCanvasRight.classList[p !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
				}
				this.classList[p !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
			} else {
				if (this.offCanvasLeft && percentage >= 0) {
					p = p === 0 ? -1 : 0;
					this.updateTranslate(this.offCanvasLeftWidth * p);
					this.offCanvasLeft.classList[percentage !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
				} else if (this.offCanvasRight && percentage <= 0) {
					p = p === 0 ? 1 : 0;
					this.updateTranslate(this.offCanvasRightWidth * p);
					this.offCanvasRight.classList[percentage !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
				}
				this.classList[percentage !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
			}
		},
		updateTranslate: function(x) {
			if (x !== this.lastTranslateX) {
				if (!this.slideIn) {
					if ((!this.offCanvasLeft && x > 0) || (!this.offCanvasRight && x < 0)) {
						this.setTranslateX(0);
						return;
					}
					if (this.leftShowing && x > this.offCanvasLeftWidth) {
						this.setTranslateX(this.offCanvasLeftWidth);
						return;
					}
					if (this.rightShowing && x < -this.offCanvasRightWidth) {
						this.setTranslateX(-this.offCanvasRightWidth);
						return;
					}
					this.setTranslateX(x);
					if (x >= 0) {
						this.leftShowing = true;
						this.rightShowing = false;
						if (x > 0) {
							if (this.offCanvasLeft) {
								$.each(this.offCanvasLefts, function(index, offCanvas) {
									if (offCanvas === this.offCanvasLeft) {
										this.offCanvasLeft.style.zIndex = 0;
									} else {
										offCanvas.style.zIndex = -1;
									}
								}.bind(this));
							}
							if (this.offCanvasRight) {
								this.offCanvasRight.style.zIndex = -1;
							}
						}
					} else {
						this.rightShowing = true;
						this.leftShowing = false;
						if (this.offCanvasRight) {
							$.each(this.offCanvasRights, function(index, offCanvas) {
								if (offCanvas === this.offCanvasRight) {
									offCanvas.style.zIndex = 0;
								} else {
									offCanvas.style.zIndex = -1;
								}
							}.bind(this));
						}
						if (this.offCanvasLeft) {
							this.offCanvasLeft.style.zIndex = -1;
						}
					}
				} else {
					if (this.offCanvas.classList.contains(CLASS_OFF_CANVAS_RIGHT)) {
						if (x < 0) {
							this.setTranslateX(0);
							return;
						}
						if (x > this.offCanvasRightWidth) {
							this.setTranslateX(this.offCanvasRightWidth);
							return;
						}
					} else {
						if (x > 0) {
							this.setTranslateX(0);
							return;
						}
						if (x < -this.offCanvasLeftWidth) {
							this.setTranslateX(-this.offCanvasLeftWidth);
							return;
						}
					}
					this.setTranslateX(x);
				}
				this.lastTranslateX = x;
			}
		},
		setTranslateX: $.animationFrame(function(x) {
			if (this.scroller) {
				if (this.scalable && this.offCanvas.parentNode === this.wrapper) {
					var percent = Math.abs(x) / this.offCanvasWidth;
					var zoomOutScale = 1 - (1 - this.options.scale) * percent;
					var zoomInScale = this.options.scale + (1 - this.options.scale) * percent;
					var zoomOutOpacity = 1 - (1 - this.options.opacity) * percent;
					var zoomInOpacity = this.options.opacity + (1 - this.options.opacity) * percent;
					if (this.offCanvas.classList.contains(CLASS_OFF_CANVAS_LEFT)) {
						this.offCanvas.style.webkitTransformOrigin = '-100%';
						this.scroller.style.webkitTransformOrigin = 'left';
					} else {
						this.offCanvas.style.webkitTransformOrigin = '200%';
						this.scroller.style.webkitTransformOrigin = 'right';
					}
					this.offCanvas.style.opacity = zoomInOpacity;
					this.offCanvas.style.webkitTransform = 'translate3d(0,0,0) scale(' + zoomInScale + ')';
					this.scroller.style.webkitTransform = 'translate3d(' + x + 'px,0,0) scale(' + zoomOutScale + ')';
				} else {
					if (this.slideIn) {
						this.offCanvas.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
					} else {
						this.scroller.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
					}
				}
			}
		}),
		getTranslateX: function() {
			if (this.offCanvas) {
				var scroller = this.slideIn ? this.offCanvas : this.scroller;
				var result = $.parseTranslateMatrix($.getStyles(scroller, 'webkitTransform'));
				return (result && result.x) || 0;
			}
			return 0;
		},
		isShown: function(direction) {
			var shown = false;
			if (!this.slideIn) {
				var x = this.getTranslateX();
				if (direction === 'right') {
					shown = this.classList.contains(CLASS_ACTIVE) && x < 0;
				} else if (direction === 'left') {
					shown = this.classList.contains(CLASS_ACTIVE) && x > 0;
				} else {
					shown = this.classList.contains(CLASS_ACTIVE) && x !== 0;
				}
			} else {
				if (direction === 'left') {
					shown = this.classList.contains(CLASS_ACTIVE) && this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT + '.' + CLASS_ACTIVE);
				} else if (direction === 'right') {
					shown = this.classList.contains(CLASS_ACTIVE) && this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT + '.' + CLASS_ACTIVE);
				} else {
					shown = this.classList.contains(CLASS_ACTIVE) && (this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT + '.' + CLASS_ACTIVE) || this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT + '.' + CLASS_ACTIVE));
				}
			}
			return shown;
		},
		close: function() {
			this._initOffCanvasVisible();
			this.offCanvas = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT + '.' + CLASS_ACTIVE) || this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT + '.' + CLASS_ACTIVE);
			this.offCanvasWidth = this.offCanvas.offsetWidth;
			if (this.scroller) {
				this.offCanvas.offsetHeight;
				this.offCanvas.classList.add(CLASS_TRANSITIONING);
				this.scroller.classList.add(CLASS_TRANSITIONING);
				this.openPercentage(0);
			}
		},
		show: function(direction) {
			this._initOffCanvasVisible();
			if (this.isShown(direction)) {
				return false;
			}
			if (!direction) {
				direction = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT) ? 'right' : 'left';
			}
			if (direction === 'right') {
				this.offCanvas = this.offCanvasRight;
				this.offCanvasWidth = this.offCanvasRightWidth;
			} else {
				this.offCanvas = this.offCanvasLeft;
				this.offCanvasWidth = this.offCanvasLeftWidth;
			}
			if (this.scroller) {
				this.offCanvas.offsetHeight;
				this.offCanvas.classList.add(CLASS_TRANSITIONING);
				this.scroller.classList.add(CLASS_TRANSITIONING);
				this.openPercentage(direction === 'left' ? 100 : -100);
			}
			return true;
		},
		toggle: function(directionOrOffCanvas) {
			var direction = directionOrOffCanvas;
			if (directionOrOffCanvas && directionOrOffCanvas.classList) {
				direction = directionOrOffCanvas.classList.contains(CLASS_OFF_CANVAS_LEFT) ? 'left' : 'right';
				this.refresh(directionOrOffCanvas);
			}
			if (!this.show(direction)) {
				this.close();
			}
		}
	});

	//hash to offcanvas
	var findOffCanvasContainer = function(target) {
		parentNode = target.parentNode;
		if (parentNode) {
			if (parentNode.classList.contains(CLASS_OFF_CANVAS_WRAP)) {
				return parentNode;
			} else {
				parentNode = parentNode.parentNode;
				if (parentNode.classList.contains(CLASS_OFF_CANVAS_WRAP)) {
					return parentNode;
				}
			}
		}
	};
	var handle = function(event, target) {
		if (target.tagName === 'A' && target.hash) {
			var offcanvas = document.getElementById(target.hash.replace('#', ''));
			if (offcanvas) {
				var container = findOffCanvasContainer(offcanvas);
				if (container) {
					$.targets._container = container;
					return offcanvas;
				}
			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 60,
		handle: handle,
		target: false,
		isReset: false,
		isContinue: true
	});

	window.addEventListener('tap', function(e) {
		if (!$.targets.offcanvas) {
			return;
		}
		//TODO 此处类型的代码后续考虑统一优化(target机制)，现在的实现费力不讨好
		var target = e.target;
		for (; target && target !== document; target = target.parentNode) {
			if (target.tagName === 'A' && target.hash && target.hash === ('#' + $.targets.offcanvas.id)) {
				e.detail && e.detail.gesture && e.detail.gesture.preventDefault(); //fixed hashchange
				$($.targets._container).offCanvas().toggle($.targets.offcanvas);
				$.targets.offcanvas = $.targets._container = null;
				break;
			}
		}
	});

	$.fn.offCanvas = function(options) {
		var offCanvasApis = [];
		this.each(function() {
			var offCanvasApi = null;
			var self = this;
			//hack old version
			if (!self.classList.contains(CLASS_OFF_CANVAS_WRAP)) {
				self = findOffCanvasContainer(self);
			}
			var id = self.getAttribute('data-offCanvas');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = offCanvasApi = new OffCanvas(self, options);
				self.setAttribute('data-offCanvas', id);
			} else {
				offCanvasApi = $.data[id];
			}
			if (options === 'show' || options === 'close' || options === 'toggle') {
				offCanvasApi.toggle();
			}
			offCanvasApis.push(offCanvasApi);
		});
		return offCanvasApis.length === 1 ? offCanvasApis[0] : offCanvasApis;
	};
	$.ready(function() {
		$('.mui-off-canvas-wrap').offCanvas();
	});
})(mui, window, document, 'offcanvas');
/**
 * actions
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var CLASS_ACTION = 'mui-action';

	var handle = function(event, target) {
		var className = target.className || '';
		if (typeof className !== 'string') { //svg className(SVGAnimatedString)
			className = '';
		}
		if (className && ~className.indexOf(CLASS_ACTION)) {
			if (target.classList.contains('mui-action-back')) {
				event.preventDefault();
			}
			return target;
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 50,
		handle: handle,
		target: false,
		isContinue: true
	});

})(mui, 'action');
/**
 * Modals
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} name
 * @returns {undefined}
 */
(function($, window, document, name) {
	var CLASS_MODAL = 'mui-modal';

	var handle = function(event, target) {
		if (target.tagName === 'A' && target.hash) {
			var modal = document.getElementById(target.hash.replace('#', ''));
			if (modal && modal.classList.contains(CLASS_MODAL)) {
				return modal;
			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 50,
		handle: handle,
		target: false,
		isReset: false,
		isContinue: true
	});

	window.addEventListener('tap', function(event) {
		if ($.targets.modal) {
			event.detail.gesture.preventDefault(); //fixed hashchange
			$.targets.modal.classList.toggle('mui-active');
		}
	});
})(mui, window, document, 'modal');
/**
 * Popovers
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} name
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name) {

	var CLASS_POPOVER = 'mui-popover';
	var CLASS_POPOVER_ARROW = 'mui-popover-arrow';
	var CLASS_ACTION_POPOVER = 'mui-popover-action';
	var CLASS_BACKDROP = 'mui-backdrop';
	var CLASS_BAR_POPOVER = 'mui-bar-popover';
	var CLASS_BAR_BACKDROP = 'mui-bar-backdrop';
	var CLASS_ACTION_BACKDROP = 'mui-backdrop-action';
	var CLASS_ACTIVE = 'mui-active';
	var CLASS_BOTTOM = 'mui-bottom';



	var handle = function(event, target) {
		if (target.tagName === 'A' && target.hash) {
			$.targets._popover = document.getElementById(target.hash.replace('#', ''));
			if ($.targets._popover && $.targets._popover.classList.contains(CLASS_POPOVER)) {
				return target;
			} else {
				$.targets._popover = null;
			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 60,
		handle: handle,
		target: false,
		isReset: false,
		isContinue: true
	});

	var onPopoverShown = function(e) {
		this.removeEventListener('webkitTransitionEnd', onPopoverShown);
		this.addEventListener($.EVENT_MOVE, $.preventDefault);
		$.trigger(this, 'shown', this);
	}
	var onPopoverHidden = function(e) {
		setStyle(this, 'none');
		this.removeEventListener('webkitTransitionEnd', onPopoverHidden);
		this.removeEventListener($.EVENT_MOVE, $.preventDefault);
		$.trigger(this, 'hidden', this);
	};

	var backdrop = (function() {
		var element = document.createElement('div');
		element.classList.add(CLASS_BACKDROP);
		element.addEventListener($.EVENT_MOVE, $.preventDefault);
		element.addEventListener('tap', function(e) {
			var popover = $.targets._popover;
			if (popover) {
				popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
				popover.classList.remove(CLASS_ACTIVE);
				removeBackdrop(popover);
			}
		});

		return element;
	}());
	var removeBackdropTimer;
	var removeBackdrop = function(popover) {
		backdrop.setAttribute('style', 'opacity:0');
		$.targets.popover = $.targets._popover = null; //reset
		removeBackdropTimer = $.later(function() {
			if (!popover.classList.contains(CLASS_ACTIVE) && backdrop.parentNode && backdrop.parentNode === document.body) {
				document.body.removeChild(backdrop);
			}
		}, 350);
	};
	window.addEventListener('tap', function(e) {
		if (!$.targets.popover) {
			return;
		}
		var toggle = false;
		var target = e.target;
		for (; target && target !== document; target = target.parentNode) {
			if (target === $.targets.popover) {
				toggle = true;
			}
		}
		if (toggle) {
			e.detail.gesture.preventDefault(); //fixed hashchange
			togglePopover($.targets._popover, $.targets.popover);
		}

	});

	var togglePopover = function(popover, anchor, state) {
		if ((state === 'show' && popover.classList.contains(CLASS_ACTIVE)) || (state === 'hide' && !popover.classList.contains(CLASS_ACTIVE))) {
			return;
		}
		removeBackdropTimer && removeBackdropTimer.cancel(); //取消remove的timer
		//remove一遍，以免来回快速切换，导致webkitTransitionEnd不触发，无法remove
		popover.removeEventListener('webkitTransitionEnd', onPopoverShown);
		popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
		backdrop.classList.remove(CLASS_BAR_BACKDROP);
		backdrop.classList.remove(CLASS_ACTION_BACKDROP);
		var _popover = document.querySelector('.mui-popover.mui-active');
		if (_popover) {
			//			_popover.setAttribute('style', '');
			_popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
			_popover.classList.remove(CLASS_ACTIVE);
			//			_popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
			//同一个弹出则直接返回，解决同一个popover的toggle
			if (popover === _popover) {
				removeBackdrop(_popover);
				return;
			}
		}
		var isActionSheet = false;
		if (popover.classList.contains(CLASS_BAR_POPOVER) || popover.classList.contains(CLASS_ACTION_POPOVER)) { //navBar
			if (popover.classList.contains(CLASS_ACTION_POPOVER)) { //action sheet popover
				isActionSheet = true;
				backdrop.classList.add(CLASS_ACTION_BACKDROP);
			} else { //bar popover
				backdrop.classList.add(CLASS_BAR_BACKDROP);
				//				if (anchor) {
				//					if (anchor.parentNode) {
				//						var offsetWidth = anchor.offsetWidth;
				//						var offsetLeft = anchor.offsetLeft;
				//						var innerWidth = window.innerWidth;
				//						popover.style.left = (Math.min(Math.max(offsetLeft, defaultPadding), innerWidth - offsetWidth - defaultPadding)) + "px";
				//					} else {
				//						//TODO anchor is position:{left,top,bottom,right}
				//					}
				//				}
			}
		}
		setStyle(popover, 'block'); //actionsheet transform
		popover.offsetHeight;
		popover.classList.add(CLASS_ACTIVE);
		backdrop.setAttribute('style', '');
		document.body.appendChild(backdrop);
		calPosition(popover, anchor, isActionSheet); //position
		backdrop.classList.add(CLASS_ACTIVE);
		popover.addEventListener('webkitTransitionEnd', onPopoverShown);
	};
	var setStyle = function(popover, display, top, left) {
		var style = popover.style;
		if (typeof display !== 'undefined')
			style.display = display;
		if (typeof top !== 'undefined')
			style.top = top + 'px';
		if (typeof left !== 'undefined')
			style.left = left + 'px';
	};
	var calPosition = function(popover, anchor, isActionSheet) {
		if (!popover || !anchor) {
			return;
		}

		if (isActionSheet) { //actionsheet
			setStyle(popover, 'block')
			return;
		}

		var wWidth = window.innerWidth;
		var wHeight = window.innerHeight;

		var pWidth = popover.offsetWidth;
		var pHeight = popover.offsetHeight;

		var aWidth = anchor.offsetWidth;
		var aHeight = anchor.offsetHeight;
		var offset = $.offset(anchor);

		var arrow = popover.querySelector('.' + CLASS_POPOVER_ARROW);
		if (!arrow) {
			arrow = document.createElement('div');
			arrow.className = CLASS_POPOVER_ARROW;
			popover.appendChild(arrow);
		}
		var arrowSize = arrow && arrow.offsetWidth / 2 || 0;



		var pTop = 0;
		var pLeft = 0;
		var diff = 0;
		var arrowLeft = 0;
		var defaultPadding = popover.classList.contains(CLASS_ACTION_POPOVER) ? 0 : 5;

		var position = 'top';
		if ((pHeight + arrowSize) < (offset.top - window.pageYOffset)) { //top
			pTop = offset.top - pHeight - arrowSize;
		} else if ((pHeight + arrowSize) < (wHeight - (offset.top - window.pageYOffset) - aHeight)) { //bottom
			position = 'bottom';
			pTop = offset.top + aHeight + arrowSize;
		} else { //middle
			position = 'middle';
			pTop = Math.max((wHeight - pHeight) / 2 + window.pageYOffset, 0);
			pLeft = Math.max((wWidth - pWidth) / 2 + window.pageXOffset, 0);
		}
		if (position === 'top' || position === 'bottom') {
			pLeft = aWidth / 2 + offset.left - pWidth / 2;
			diff = pLeft;
			if (pLeft < defaultPadding) pLeft = defaultPadding;
			if (pLeft + pWidth > wWidth) pLeft = wWidth - pWidth - defaultPadding;

			if (arrow) {
				if (position === 'top') {
					arrow.classList.add(CLASS_BOTTOM);
				} else {
					arrow.classList.remove(CLASS_BOTTOM);
				}
				diff = diff - pLeft;
				arrowLeft = (pWidth / 2 - arrowSize / 2 + diff);
				arrowLeft = Math.max(Math.min(arrowLeft, pWidth - arrowSize * 2 - 6), 6);
				arrow.setAttribute('style', 'left:' + arrowLeft + 'px');
			}
		} else if (position === 'middle') {
			arrow.setAttribute('style', 'display:none');
		}
		setStyle(popover, 'block', pTop, pLeft);
	};

	$.createMask = function(callback) {
		var element = document.createElement('div');
		element.classList.add(CLASS_BACKDROP);
		element.addEventListener($.EVENT_MOVE, $.preventDefault);
		element.addEventListener('tap', function() {
			mask.close();
		});
		var mask = [element];
		mask._show = false;
		mask.show = function() {
			mask._show = true;
			element.setAttribute('style', 'opacity:1');
			document.body.appendChild(element);
			return mask;
		};
		mask._remove = function() {
			if (mask._show) {
				mask._show = false;
				element.setAttribute('style', 'opacity:0');
				$.later(function() {
					var body = document.body;
					element.parentNode === body && body.removeChild(element);
				}, 350);
			}
			return mask;
		};
		mask.close = function() {
			if (callback) {
				if (callback() !== false) {
					mask._remove();
				}
			} else {
				mask._remove();
			}
		};
		return mask;
	};
	$.fn.popover = function() {
		var args = arguments;
		this.each(function() {
			$.targets._popover = this;
			if (args[0] === 'show' || args[0] === 'hide' || args[0] === 'toggle') {
				togglePopover(this, args[1], args[0]);
			}
		});
	};

})(mui, window, document, 'popover');
/**
 * segmented-controllers
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name, undefined) {

	var CLASS_CONTROL_ITEM = 'mui-control-item';
	var CLASS_SEGMENTED_CONTROL = 'mui-segmented-control';
	var CLASS_SEGMENTED_CONTROL_VERTICAL = 'mui-segmented-control-vertical';
	var CLASS_CONTROL_CONTENT = 'mui-control-content';
	var CLASS_TAB_BAR = 'mui-bar-tab';
	var CLASS_TAB_ITEM = 'mui-tab-item';
	var CLASS_SLIDER_ITEM = 'mui-slider-item';

	var handle = function(event, target) {
		if (target.classList && (target.classList.contains(CLASS_CONTROL_ITEM) || target.classList.contains(CLASS_TAB_ITEM))) {
			if (target.parentNode && target.parentNode.classList && target.parentNode.classList.contains(CLASS_SEGMENTED_CONTROL_VERTICAL)) {
				//vertical 如果preventDefault会导致无法滚动
			} else {
				event.preventDefault(); //stop hash change				
			}
			//			if (target.hash) {
			return target;
			//			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 80,
		handle: handle,
		target: false
	});

	window.addEventListener('tap', function(e) {

		var targetTab = $.targets.tab;
		if (!targetTab) {
			return;
		}
		var activeTab;
		var activeBodies;
		var targetBody;
		var className = 'mui-active';
		var classSelector = '.' + className;
		var segmentedControl = targetTab.parentNode;

		for (; segmentedControl && segmentedControl !== document; segmentedControl = segmentedControl.parentNode) {
			if (segmentedControl.classList.contains(CLASS_SEGMENTED_CONTROL)) {
				activeTab = segmentedControl.querySelector(classSelector + '.' + CLASS_CONTROL_ITEM);
				break;
			} else if (segmentedControl.classList.contains(CLASS_TAB_BAR)) {
				activeTab = segmentedControl.querySelector(classSelector + '.' + CLASS_TAB_ITEM);
			}
		}

		if (activeTab) {
			activeTab.classList.remove(className);
		}

		var isLastActive = targetTab === activeTab;
		if (targetTab) {
			targetTab.classList.add(className);
		}

		if (!targetTab.hash) {
			return;
		}
		targetBody = document.getElementById(targetTab.hash.replace('#', ''));

		if (!targetBody) {
			return;
		}
		if (!targetBody.classList.contains(CLASS_CONTROL_CONTENT)) { //tab bar popover
			targetTab.classList[isLastActive ? 'remove' : 'add'](className);
			return;
		}
		if (isLastActive) { //same
			return;
		}
		var parentNode = targetBody.parentNode;
		activeBodies = parentNode.querySelectorAll('.' + CLASS_CONTROL_CONTENT + classSelector);
		for (var i = 0; i < activeBodies.length; i++) {
			var activeBody = activeBodies[i];
			activeBody.parentNode === parentNode && activeBody.classList.remove(className);
		}

		targetBody.classList.add(className);

		var contents = [];
		var _contents = parentNode.querySelectorAll('.' + CLASS_CONTROL_CONTENT);
		for (var i = 0; i < _contents.length; i++) { //查找直属子节点
			_contents[i].parentNode === parentNode && (contents.push(_contents[i]));
		}
		$.trigger(targetBody, $.eventName('shown', name), {
			tabNumber: Array.prototype.indexOf.call(contents, targetBody)
		});
		e.detail && e.detail.gesture.preventDefault(); //fixed hashchange
	});

})(mui, window, document, 'tab');
/**
 * Toggles switch
 * @param {type} $
 * @param {type} window
 * @param {type} name
 * @returns {undefined}
 */
(function($, window, name) {

	var CLASS_SWITCH = 'mui-switch';
	var CLASS_SWITCH_HANDLE = 'mui-switch-handle';
	var CLASS_ACTIVE = 'mui-active';
	var CLASS_DRAGGING = 'mui-dragging';

	var CLASS_DISABLED = 'mui-disabled';

	var SELECTOR_SWITCH_HANDLE = '.' + CLASS_SWITCH_HANDLE;

	var handle = function(event, target) {
		if (target.classList && target.classList.contains(CLASS_SWITCH)) {
			return target;
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 100,
		handle: handle,
		target: false
	});


	var Toggle = function(element) {
		this.element = element;
		this.classList = this.element.classList;
		this.handle = this.element.querySelector(SELECTOR_SWITCH_HANDLE);
		this.init();
		this.initEvent();
	};
	Toggle.prototype.init = function() {
		this.toggleWidth = this.element.offsetWidth;
		this.handleWidth = this.handle.offsetWidth;
		this.handleX = this.toggleWidth - this.handleWidth - 3;
	};
	Toggle.prototype.initEvent = function() {
		this.element.addEventListener($.EVENT_START, this);
		this.element.addEventListener('drag', this);
		this.element.addEventListener('swiperight', this);
		this.element.addEventListener($.EVENT_END, this);
		this.element.addEventListener($.EVENT_CANCEL, this);

	};
	Toggle.prototype.handleEvent = function(e) {
		if (this.classList.contains(CLASS_DISABLED)) {
			return;
		}
		switch (e.type) {
			case $.EVENT_START:
				this.start(e);
				break;
			case 'drag':
				this.drag(e);
				break;
			case 'swiperight':
				this.swiperight();
				break;
			case $.EVENT_END:
			case $.EVENT_CANCEL:
				this.end(e);
				break;
		}
	};
	Toggle.prototype.start = function(e) {
		this.handle.style.webkitTransitionDuration = this.element.style.webkitTransitionDuration = '.2s';
		this.classList.add(CLASS_DRAGGING);
		if (this.toggleWidth === 0 || this.handleWidth === 0) { //当switch处于隐藏状态时，width为0，需要重新初始化
			this.init();
		}
	};
	Toggle.prototype.drag = function(e) {
		var detail = e.detail;
		if (!this.isDragging) {
			if (detail.direction === 'left' || detail.direction === 'right') {
				this.isDragging = true;
				this.lastChanged = undefined;
				this.initialState = this.classList.contains(CLASS_ACTIVE);
			}
		}
		if (this.isDragging) {
			this.setTranslateX(detail.deltaX);
			e.stopPropagation();
			detail.gesture.preventDefault();
		}
	};
	Toggle.prototype.swiperight = function(e) {
		if (this.isDragging) {
			e.stopPropagation();
		}
	};
	Toggle.prototype.end = function(e) {
		this.classList.remove(CLASS_DRAGGING);
		if (this.isDragging) {
			this.isDragging = false;
			e.stopPropagation();
			$.trigger(this.element, 'toggle', {
				isActive: this.classList.contains(CLASS_ACTIVE)
			});
		} else {
			this.toggle();
		}
	};
	Toggle.prototype.toggle = function(animate) {
		var classList = this.classList;
		if (animate === false) {
			this.handle.style.webkitTransitionDuration = this.element.style.webkitTransitionDuration = '0s';
		} else {
			this.handle.style.webkitTransitionDuration = this.element.style.webkitTransitionDuration = '.2s';
		}
		if (classList.contains(CLASS_ACTIVE)) {
			classList.remove(CLASS_ACTIVE);
			this.handle.style.webkitTransform = 'translate(0,0)';
		} else {
			classList.add(CLASS_ACTIVE);
			this.handle.style.webkitTransform = 'translate(' + this.handleX + 'px,0)';
		}
		$.trigger(this.element, 'toggle', {
			isActive: this.classList.contains(CLASS_ACTIVE)
		});
	};
	Toggle.prototype.setTranslateX = $.animationFrame(function(x) {
		if (!this.isDragging) {
			return;
		}
		var isChanged = false;
		if ((this.initialState && -x > (this.handleX / 2)) || (!this.initialState && x > (this.handleX / 2))) {
			isChanged = true;
		}
		if (this.lastChanged !== isChanged) {
			if (isChanged) {
				this.handle.style.webkitTransform = 'translate(' + (this.initialState ? 0 : this.handleX) + 'px,0)';
				this.classList[this.initialState ? 'remove' : 'add'](CLASS_ACTIVE);
			} else {
				this.handle.style.webkitTransform = 'translate(' + (this.initialState ? this.handleX : 0) + 'px,0)';
				this.classList[this.initialState ? 'add' : 'remove'](CLASS_ACTIVE);
			}
			this.lastChanged = isChanged;
		}

	});

	$.fn['switch'] = function(options) {
		var switchApis = [];
		this.each(function() {
			var switchApi = null;
			var id = this.getAttribute('data-switch');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = new Toggle(this);
				this.setAttribute('data-switch', id);
			} else {
				switchApi = $.data[id];
			}
			switchApis.push(switchApi);
		});
		return switchApis.length > 1 ? switchApis : switchApis[0];
	};
	$.ready(function() {
		$('.' + CLASS_SWITCH)['switch']();
	});
})(mui, window, 'toggle');
/**
 * Tableviews
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 */
(function($, window, document) {

	var CLASS_ACTIVE = 'mui-active';
	var CLASS_SELECTED = 'mui-selected';
	var CLASS_GRID_VIEW = 'mui-grid-view';
	var CLASS_RADIO_VIEW = 'mui-table-view-radio';
	var CLASS_TABLE_VIEW_CELL = 'mui-table-view-cell';
	var CLASS_COLLAPSE_CONTENT = 'mui-collapse-content';
	var CLASS_DISABLED = 'mui-disabled';
	var CLASS_TOGGLE = 'mui-switch';
	var CLASS_BTN = 'mui-btn';

	var CLASS_SLIDER_HANDLE = 'mui-slider-handle';
	var CLASS_SLIDER_LEFT = 'mui-slider-left';
	var CLASS_SLIDER_RIGHT = 'mui-slider-right';
	var CLASS_TRANSITIONING = 'mui-transitioning';


	var SELECTOR_SLIDER_HANDLE = '.' + CLASS_SLIDER_HANDLE;
	var SELECTOR_SLIDER_LEFT = '.' + CLASS_SLIDER_LEFT;
	var SELECTOR_SLIDER_RIGHT = '.' + CLASS_SLIDER_RIGHT;
	var SELECTOR_SELECTED = '.' + CLASS_SELECTED;
	var SELECTOR_BUTTON = '.' + CLASS_BTN;
	var overFactor = 0.8;
	var cell, a;

	var isMoved = isOpened = openedActions = progress = false;
	var sliderHandle = sliderActionLeft = sliderActionRight = buttonsLeft = buttonsRight = sliderDirection = sliderRequestAnimationFrame = false;
	var timer = translateX = lastTranslateX = sliderActionLeftWidth = sliderActionRightWidth = 0;



	var toggleActive = function(isActive) {
		if (isActive) {
			if (a) {
				a.classList.add(CLASS_ACTIVE);
			} else if (cell) {
				cell.classList.add(CLASS_ACTIVE);
			}
		} else {
			timer && timer.cancel();
			if (a) {
				a.classList.remove(CLASS_ACTIVE);
			} else if (cell) {
				cell.classList.remove(CLASS_ACTIVE);
			}
		}
	};

	var updateTranslate = function() {
		if (translateX !== lastTranslateX) {
			if (buttonsRight && buttonsRight.length > 0) {
				progress = translateX / sliderActionRightWidth;
				if (translateX < -sliderActionRightWidth) {
					translateX = -sliderActionRightWidth - Math.pow(-translateX - sliderActionRightWidth, overFactor);
				}
				for (var i = 0, len = buttonsRight.length; i < len; i++) {
					var buttonRight = buttonsRight[i];
					if (typeof buttonRight._buttonOffset === 'undefined') {
						buttonRight._buttonOffset = buttonRight.offsetLeft;
					}
					buttonOffset = buttonRight._buttonOffset;
					setTranslate(buttonRight, (translateX - buttonOffset * (1 + Math.max(progress, -1))));
				}
			}
			if (buttonsLeft && buttonsLeft.length > 0) {
				progress = translateX / sliderActionLeftWidth;
				if (translateX > sliderActionLeftWidth) {
					translateX = sliderActionLeftWidth + Math.pow(translateX - sliderActionLeftWidth, overFactor);
				}
				for (var i = 0, len = buttonsLeft.length; i < len; i++) {
					var buttonLeft = buttonsLeft[i];
					if (typeof buttonLeft._buttonOffset === 'undefined') {
						buttonLeft._buttonOffset = sliderActionLeftWidth - buttonLeft.offsetLeft - buttonLeft.offsetWidth;
					}
					buttonOffset = buttonLeft._buttonOffset;
					if (buttonsLeft.length > 1) {
						buttonLeft.style.zIndex = buttonsLeft.length - i;
					}
					setTranslate(buttonLeft, (translateX + buttonOffset * (1 - Math.min(progress, 1))));
				}
			}
			setTranslate(sliderHandle, translateX);
			lastTranslateX = translateX;
		}
		sliderRequestAnimationFrame = requestAnimationFrame(function() {
			updateTranslate();
		});
	};
	var setTranslate = function(element, x) {
		if (element) {
			element.style.webkitTransform = 'translate(' + x + 'px,0)';
		}
	};

	window.addEventListener($.EVENT_START, function(event) {
		if (cell) {
			toggleActive(false);
		}
		cell = a = false;
		isMoved = isOpened = openedActions = false;
		var target = event.target;
		var isDisabled = false;
		for (; target && target !== document; target = target.parentNode) {
			if (target.classList) {
				var classList = target.classList;
				if ((target.tagName === 'INPUT' && target.type !== 'radio' && target.type !== 'checkbox') || target.tagName === 'BUTTON' || classList.contains(CLASS_TOGGLE) || classList.contains(CLASS_BTN) || classList.contains(CLASS_DISABLED)) {
					isDisabled = true;
				}
				if (classList.contains(CLASS_COLLAPSE_CONTENT)) { //collapse content
					break;
				}
				if (classList.contains(CLASS_TABLE_VIEW_CELL)) {
					cell = target;
					//TODO swipe to delete close
					var selected = cell.parentNode.querySelector(SELECTOR_SELECTED);
					if (!cell.parentNode.classList.contains(CLASS_RADIO_VIEW) && selected && selected !== cell) {
						$.swipeoutClose(selected);
						cell = isDisabled = false;
						return;
					}
					if (!cell.parentNode.classList.contains(CLASS_GRID_VIEW)) {
						var link = cell.querySelector('a');
						if (link && link.parentNode === cell) { //li>a
							a = link;
						}
					}
					var handle = cell.querySelector(SELECTOR_SLIDER_HANDLE);
					if (handle) {
						toggleEvents(cell);
						event.stopPropagation();
					}
					if (!isDisabled) {
						if (handle) {
							if (timer) {
								timer.cancel();
							}
							timer = $.later(function() {
								toggleActive(true);
							}, 100);
						} else {
							toggleActive(true);
						}
					}
					break;
				}
			}
		}
	});
	window.addEventListener($.EVENT_MOVE, function(event) {
		toggleActive(false);
	});

	var handleEvent = {
		handleEvent: function(event) {
			switch (event.type) {
				case 'drag':
					this.drag(event);
					break;
				case 'dragend':
					this.dragend(event);
					break;
				case 'flick':
					this.flick(event);
					break;
				case 'swiperight':
					this.swiperight(event);
					break;
				case 'swipeleft':
					this.swipeleft(event);
					break;
			}
		},
		drag: function(event) {
			if (!cell) {
				return;
			}
			if (!isMoved) { //init
				sliderHandle = sliderActionLeft = sliderActionRight = buttonsLeft = buttonsRight = sliderDirection = sliderRequestAnimationFrame = false;
				sliderHandle = cell.querySelector(SELECTOR_SLIDER_HANDLE);
				if (sliderHandle) {
					sliderActionLeft = cell.querySelector(SELECTOR_SLIDER_LEFT);
					sliderActionRight = cell.querySelector(SELECTOR_SLIDER_RIGHT);
					if (sliderActionLeft) {
						sliderActionLeftWidth = sliderActionLeft.offsetWidth;
						buttonsLeft = sliderActionLeft.querySelectorAll(SELECTOR_BUTTON);
					}
					if (sliderActionRight) {
						sliderActionRightWidth = sliderActionRight.offsetWidth;
						buttonsRight = sliderActionRight.querySelectorAll(SELECTOR_BUTTON);
					}
					cell.classList.remove(CLASS_TRANSITIONING);
					isOpened = cell.classList.contains(CLASS_SELECTED);
					if (isOpened) {
						openedActions = cell.querySelector(SELECTOR_SLIDER_LEFT + SELECTOR_SELECTED) ? 'left' : 'right';
					}
				}
			}
			var detail = event.detail;
			var direction = detail.direction;
			var angle = detail.angle;
			if (direction === 'left' && (angle > 150 || angle < -150)) {
				if (buttonsRight || (buttonsLeft && isOpened)) { //存在右侧按钮或存在左侧按钮且是已打开状态
					isMoved = true;
				}
			} else if (direction === 'right' && (angle > -30 && angle < 30)) {
				if (buttonsLeft || (buttonsRight && isOpened)) { //存在左侧按钮或存在右侧按钮且是已打开状态
					isMoved = true;
				}
			}
			if (isMoved) {
				event.stopPropagation();
				event.detail.gesture.preventDefault();
				var translate = event.detail.deltaX;
				if (isOpened) {
					if (openedActions === 'right') {
						translate = translate - sliderActionRightWidth;
					} else {
						translate = translate + sliderActionLeftWidth;
					}
				}
				if ((translate > 0 && !buttonsLeft) || (translate < 0 && !buttonsRight)) {
					if (!isOpened) {
						return;
					}
					translate = 0;
				}
				if (translate < 0) {
					sliderDirection = 'toLeft';
				} else if (translate > 0) {
					sliderDirection = 'toRight';
				} else {
					if (!sliderDirection) {
						sliderDirection = 'toLeft';
					}
				}
				if (!sliderRequestAnimationFrame) {
					updateTranslate();
				}
				translateX = translate;
			}
		},
		flick: function(event) {
			if (isMoved) {
				event.stopPropagation();
			}
		},
		swipeleft: function(event) {
			if (isMoved) {
				event.stopPropagation();
			}
		},
		swiperight: function(event) {
			if (isMoved) {
				event.stopPropagation();
			}
		},
		dragend: function(event) {
			if (!isMoved) {
				return;
			}
			event.stopPropagation();
			if (sliderRequestAnimationFrame) {
				cancelAnimationFrame(sliderRequestAnimationFrame);
				sliderRequestAnimationFrame = null;
			}
			var detail = event.detail;
			isMoved = false;
			var action = 'close';
			var actionsWidth = sliderDirection === 'toLeft' ? sliderActionRightWidth : sliderActionLeftWidth;
			var isToggle = detail.swipe || (Math.abs(translateX) > actionsWidth / 2);
			if (isToggle) {
				if (!isOpened) {
					action = 'open';
				} else if (detail.direction === 'left' && openedActions === 'right') {
					action = 'open';
				} else if (detail.direction === 'right' && openedActions === 'left') {
					action = 'open';
				}

			}
			cell.classList.add(CLASS_TRANSITIONING);
			var buttons;
			if (action === 'open') {
				var newTranslate = sliderDirection === 'toLeft' ? -actionsWidth : actionsWidth;
				setTranslate(sliderHandle, newTranslate);
				buttons = sliderDirection === 'toLeft' ? buttonsRight : buttonsLeft;
				if (typeof buttons !== 'undefined') {
					var button = null;
					for (var i = 0; i < buttons.length; i++) {
						button = buttons[i];
						setTranslate(button, newTranslate);
					}
					button.parentNode.classList.add(CLASS_SELECTED);
					cell.classList.add(CLASS_SELECTED);
					if (!isOpened) {
						$.trigger(cell, sliderDirection === 'toLeft' ? 'slideleft' : 'slideright');
					}
				}
			} else {
				setTranslate(sliderHandle, 0);
				sliderActionLeft && sliderActionLeft.classList.remove(CLASS_SELECTED);
				sliderActionRight && sliderActionRight.classList.remove(CLASS_SELECTED);
				cell.classList.remove(CLASS_SELECTED);
			}
			var buttonOffset;
			if (buttonsLeft && buttonsLeft.length > 0 && buttonsLeft !== buttons) {
				for (var i = 0, len = buttonsLeft.length; i < len; i++) {
					var buttonLeft = buttonsLeft[i];
					buttonOffset = buttonLeft._buttonOffset;
					if (typeof buttonOffset === 'undefined') {
						buttonLeft._buttonOffset = sliderActionLeftWidth - buttonLeft.offsetLeft - buttonLeft.offsetWidth;
					}
					setTranslate(buttonLeft, buttonOffset);
				}
			}
			if (buttonsRight && buttonsRight.length > 0 && buttonsRight !== buttons) {
				for (var i = 0, len = buttonsRight.length; i < len; i++) {
					var buttonRight = buttonsRight[i];
					buttonOffset = buttonRight._buttonOffset;
					if (typeof buttonOffset === 'undefined') {
						buttonRight._buttonOffset = buttonRight.offsetLeft;
					}
					setTranslate(buttonRight, -buttonOffset);
				}
			}
		}
	};

	function toggleEvents(element, isRemove) {
		var method = !!isRemove ? 'removeEventListener' : 'addEventListener';
		element[method]('drag', handleEvent);
		element[method]('dragend', handleEvent);
		element[method]('swiperight', handleEvent);
		element[method]('swipeleft', handleEvent);
		element[method]('flick', handleEvent);
	};
	/**
	 * 打开滑动菜单
	 * @param {Object} el
	 * @param {Object} direction
	 */
	$.swipeoutOpen = function(el, direction) {
		if (!el) return;
		var classList = el.classList;
		if (classList.contains(CLASS_SELECTED)) return;
		if (!direction) {
			if (el.querySelector(SELECTOR_SLIDER_RIGHT)) {
				direction = 'right';
			} else {
				direction = 'left';
			}
		}
		var swipeoutAction = el.querySelector($.classSelector(".slider-" + direction));
		if (!swipeoutAction) return;
		swipeoutAction.classList.add(CLASS_SELECTED);
		classList.add(CLASS_SELECTED);
		classList.remove(CLASS_TRANSITIONING);
		var buttons = swipeoutAction.querySelectorAll(SELECTOR_BUTTON);
		var swipeoutWidth = swipeoutAction.offsetWidth;
		var translate = (direction === 'right') ? -swipeoutWidth : swipeoutWidth;
		var length = buttons.length;
		var button;
		for (var i = 0; i < length; i++) {
			button = buttons[i];
			if (direction === 'right') {
				setTranslate(button, -button.offsetLeft);
			} else {
				setTranslate(button, (swipeoutWidth - button.offsetWidth - button.offsetLeft));
			}
		}
		classList.add(CLASS_TRANSITIONING);
		for (var i = 0; i < length; i++) {
			setTranslate(buttons[i], translate);
		}
		setTranslate(el.querySelector(SELECTOR_SLIDER_HANDLE), translate);
	};
	/**
	 * 关闭滑动菜单
	 * @param {Object} el
	 */
	$.swipeoutClose = function(el) {
		if (!el) return;
		var classList = el.classList;
		if (!classList.contains(CLASS_SELECTED)) return;
		var direction = el.querySelector(SELECTOR_SLIDER_RIGHT + SELECTOR_SELECTED) ? 'right' : 'left';
		var swipeoutAction = el.querySelector($.classSelector(".slider-" + direction));
		if (!swipeoutAction) return;
		swipeoutAction.classList.remove(CLASS_SELECTED);
		classList.remove(CLASS_SELECTED);
		classList.add(CLASS_TRANSITIONING);
		var buttons = swipeoutAction.querySelectorAll(SELECTOR_BUTTON);
		var swipeoutWidth = swipeoutAction.offsetWidth;
		var length = buttons.length;
		var button;
		setTranslate(el.querySelector(SELECTOR_SLIDER_HANDLE), 0);
		for (var i = 0; i < length; i++) {
			button = buttons[i];
			if (direction === 'right') {
				setTranslate(button, (-button.offsetLeft));
			} else {
				setTranslate(button, (swipeoutWidth - button.offsetWidth - button.offsetLeft));
			}
		}
	};

	window.addEventListener($.EVENT_END, function(event) { //使用touchend来取消高亮，避免一次点击既不触发tap，doubletap，longtap的事件
		if (!cell) {
			return;
		}
		toggleActive(false);
		sliderHandle && toggleEvents(cell, true);
	});
	window.addEventListener($.EVENT_CANCEL, function(event) { //使用touchcancel来取消高亮，避免一次点击既不触发tap，doubletap，longtap的事件
		if (!cell) {
			return;
		}
		toggleActive(false);
		sliderHandle && toggleEvents(cell, true);
	});
	var radioOrCheckboxClick = function(event) {
		var type = event.target && event.target.type || '';
		if (type === 'radio' || type === 'checkbox') {
			return;
		}
		var classList = cell.classList;
		if (classList.contains('mui-radio')) {
			var input = cell.querySelector('input[type=radio]');
			if (input) {
				//				input.click();
				if (!input.disabled && !input.readOnly) {
					input.checked = !input.checked;
					$.trigger(input, 'change');
				}
			}
		} else if (classList.contains('mui-checkbox')) {
			var input = cell.querySelector('input[type=checkbox]');
			if (input) {
				//				input.click();
				if (!input.disabled && !input.readOnly) {
					input.checked = !input.checked;
					$.trigger(input, 'change');
				}
			}
		}
	};
	//fixed hashchange(android)
	window.addEventListener($.EVENT_CLICK, function(e) {
		if (cell && cell.classList.contains('mui-collapse')) {
			e.preventDefault();
		}
	});
	window.addEventListener('doubletap', function(event) {
		if (cell) {
			radioOrCheckboxClick(event);
		}
	});
	var preventDefaultException = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;
	window.addEventListener('tap', function(event) {
		if (!cell) {
			return;
		}
		var isExpand = false;
		var classList = cell.classList;
		var ul = cell.parentNode;
		if (ul && ul.classList.contains(CLASS_RADIO_VIEW)) {
			if (classList.contains(CLASS_SELECTED)) {
				return;
			}
			var selected = ul.querySelector('li' + SELECTOR_SELECTED);
			if (selected) {
				selected.classList.remove(CLASS_SELECTED);
			}
			classList.add(CLASS_SELECTED);
			$.trigger(cell, 'selected', {
				el: cell
			});
			return;
		}
		if (classList.contains('mui-collapse') && !cell.parentNode.classList.contains('mui-unfold')) {
			if (!preventDefaultException.test(event.target.tagName)) {
				event.detail.gesture.preventDefault();
			}

			if (!classList.contains(CLASS_ACTIVE)) { //展开时,需要收缩其他同类
				var collapse = cell.parentNode.querySelector('.mui-collapse.mui-active');
				if (collapse) {
					collapse.classList.remove(CLASS_ACTIVE);
				}
				isExpand = true;
			}
			classList.toggle(CLASS_ACTIVE);
			if (isExpand) {
				//触发展开事件
				$.trigger(cell, 'expand');

				//scroll
				//暂不滚动
				// var offsetTop = $.offset(cell).top;
				// var scrollTop = document.body.scrollTop;
				// var height = window.innerHeight;
				// var offsetHeight = cell.offsetHeight;
				// var cellHeight = (offsetTop - scrollTop + offsetHeight);
				// if (offsetHeight > height) {
				// 	$.scrollTo(offsetTop, 300);
				// } else if (cellHeight > height) {
				// 	$.scrollTo(cellHeight - height + scrollTop, 300);
				// }
			}
		} else {
			radioOrCheckboxClick(event);
		}
	});
})(mui, window, document);
(function($, window) {
	/**
	 * 警告消息框
	 */
	$.alert = function(message, title, btnValue, callback) {
		if ($.os.plus) {
			if (typeof message === 'undefined') {
				return;
			} else {
				if (typeof title === 'function') {
					callback = title;
					title = null;
					btnValue = '确定';
				} else if (typeof btnValue === 'function') {
					callback = btnValue;
					btnValue = null;
				}
				$.plusReady(function() {
					plus.nativeUI.alert(message, callback, title, btnValue);
				});
			}

		} else {
			//TODO H5版本
			window.alert(message);
		}
	};

})(mui, window);
(function($, window) {
	/**
	 * 确认消息框
	 */
	$.confirm = function(message, title, btnArray, callback) {
		if ($.os.plus) {
			if (typeof message === 'undefined') {
				return;
			} else {
				if (typeof title === 'function') {
					callback = title;
					title = null;
					btnArray = null;
				} else if (typeof btnArray === 'function') {
					callback = btnArray;
					btnArray = null;
				}
				$.plusReady(function() {
					plus.nativeUI.confirm(message, callback, title, btnArray);
				});
			}

		} else {
			//H5版本，0为确认，1为取消
			if (window.confirm(message)) {
				callback({
					index: 0
				});
			} else {
				callback({
					index: 1
				});
			}
		}
	};

})(mui, window);
(function($, window) {
	/**
	 * 输入对话框
	 */
	$.prompt = function(text, defaultText, title, btnArray, callback) {
		if ($.os.plus) {
			if (typeof message === 'undefined') {
				return;
			} else {

				if (typeof defaultText === 'function') {
					callback = defaultText;
					defaultText = null;
					title = null;
					btnArray = null;
				} else if (typeof title === 'function') {
					callback = title;
					title = null;
					btnArray = null;
				} else if (typeof btnArray === 'function') {
					callback = btnArray;
					btnArray = null;
				}
				$.plusReady(function() {
					plus.nativeUI.prompt(text, callback, title, defaultText, btnArray);
				});
			}

		} else {
			//H5版本(确认index为0，取消index为1)
			var result = window.prompt(text);
			if (result) {
				callback({
					index: 0,
					value: result
				});
			} else {
				callback({
					index: 1,
					value: ''
				});
			}
		}
	};

})(mui, window);
(function($, window) {
	var CLASS_ACTIVE = 'mui-active';
	/**
	 * 自动消失提示框
	 */
	$.toast = function(message,options) {
		var durations = {
		    'long': 3500,
		    'short': 2000
		};

		//计算显示时间
		 options = $.extend({
	        duration: 'short'
	    }, options || {});


		if ($.os.plus && options.type !== 'div') {
			//默认显示在底部；
			$.plusReady(function() {
				plus.nativeUI.toast(message, {
					verticalAlign: 'bottom',
					duration:options.duration
				});
			});
		} else {
			if (typeof options.duration === 'number') {
		        duration = options.duration>0 ? options.duration:durations['short'];
		    } else {
		        duration = durations[options.duration];
		    }
		    if (!duration) {
		        duration = durations['short'];
		    }
			var toast = document.createElement('div');
			toast.classList.add('mui-toast-container');
			toast.innerHTML = '<div class="' + 'mui-toast-message' + '">' + message + '</div>';
			toast.addEventListener('webkitTransitionEnd', function() {
				if (!toast.classList.contains(CLASS_ACTIVE)) {
					toast.parentNode.removeChild(toast);
					toast = null;
				}
			});
			//点击则自动消失
			toast.addEventListener('click', function() {
		        toast.parentNode.removeChild(toast);
		        toast = null;
		    });
			document.body.appendChild(toast);
			toast.offsetHeight;
			toast.classList.add(CLASS_ACTIVE);
			setTimeout(function() {
				toast && toast.classList.remove(CLASS_ACTIVE);
			}, duration);
			
			return {
		        isVisible: function() {return !!toast;}
		    }
		}   
	};

})(mui, window);
/**
 * Popup(alert,confirm,prompt)  
 * @param {Object} $
 * @param {Object} window
 * @param {Object} document
 */
(function($, window, document) {
    var CLASS_POPUP = 'mui-popup';
    var CLASS_POPUP_BACKDROP = 'mui-popup-backdrop';
    var CLASS_POPUP_IN = 'mui-popup-in';
    var CLASS_POPUP_OUT = 'mui-popup-out';
    var CLASS_POPUP_INNER = 'mui-popup-inner';
    var CLASS_POPUP_TITLE = 'mui-popup-title';
    var CLASS_POPUP_TEXT = 'mui-popup-text';
    var CLASS_POPUP_INPUT = 'mui-popup-input';
    var CLASS_POPUP_BUTTONS = 'mui-popup-buttons';
    var CLASS_POPUP_BUTTON = 'mui-popup-button';
    var CLASS_POPUP_BUTTON_BOLD = 'mui-popup-button-bold';
    var CLASS_POPUP_BACKDROP = 'mui-popup-backdrop';
    var CLASS_ACTIVE = 'mui-active';

    var popupStack = [];
    var backdrop = (function() {
        var element = document.createElement('div');
        element.classList.add(CLASS_POPUP_BACKDROP);
        element.addEventListener($.EVENT_MOVE, $.preventDefault);
        element.addEventListener('webkitTransitionEnd', function() {
            if (!this.classList.contains(CLASS_ACTIVE)) {
                element.parentNode && element.parentNode.removeChild(element);
            }
        });
        return element;
    }());

    var createInput = function(placeholder) {
        return '<div class="' + CLASS_POPUP_INPUT + '"><input type="text" autofocus placeholder="' + (placeholder || '') + '"/></div>';
    };
    var createInner = function(message, title, extra) {
        return '<div class="' + CLASS_POPUP_INNER + '"><div class="' + CLASS_POPUP_TITLE + '">' + title + '</div><div class="' + CLASS_POPUP_TEXT + '">' + message.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") + '</div>' + (extra || '') + '</div>';
    };
    var createButtons = function(btnArray) {
        var length = btnArray.length;
        var btns = [];
        for (var i = 0; i < length; i++) {
            btns.push('<span class="' + CLASS_POPUP_BUTTON + (i === length - 1 ? (' ' + CLASS_POPUP_BUTTON_BOLD) : '') + '">' + btnArray[i] + '</span>');
        }
        return '<div class="' + CLASS_POPUP_BUTTONS + '">' + btns.join('') + '</div>';
    };

    var createPopup = function(html, callback) {
        var popupElement = document.createElement('div');
        popupElement.className = CLASS_POPUP;
        popupElement.innerHTML = html;
        var removePopupElement = function() {
            popupElement.parentNode && popupElement.parentNode.removeChild(popupElement);
            popupElement = null;
        };
        popupElement.addEventListener($.EVENT_MOVE, $.preventDefault);
        popupElement.addEventListener('webkitTransitionEnd', function(e) {
            if (popupElement && e.target === popupElement && popupElement.classList.contains(CLASS_POPUP_OUT)) {
                removePopupElement();
            }
        });
        popupElement.style.display = 'block';
        document.body.appendChild(popupElement);
        popupElement.offsetHeight;
        popupElement.classList.add(CLASS_POPUP_IN);

        if (!backdrop.classList.contains(CLASS_ACTIVE)) {
            backdrop.style.display = 'block';
            document.body.appendChild(backdrop);
            backdrop.offsetHeight;
            backdrop.classList.add(CLASS_ACTIVE);
        }
        var btns = $.qsa('.' + CLASS_POPUP_BUTTON, popupElement);
        var input = popupElement.querySelector('.' + CLASS_POPUP_INPUT + ' input');
        var popup = {
            element: popupElement,
            close: function(index, animate) {
                if (popupElement) {
                    var result = callback && callback({
                        index: index || 0,
                        value: input && input.value || ''
                    });
                    if (result === false) { //返回false则不关闭当前popup
                        return;
                    }
                    if (animate !== false) {
                        popupElement.classList.remove(CLASS_POPUP_IN);
                        popupElement.classList.add(CLASS_POPUP_OUT);
                    } else {
                        removePopupElement();
                    }
                    popupStack.pop();
                    //如果还有其他popup，则不remove backdrop
                    if (popupStack.length) {
                        popupStack[popupStack.length - 1]['show'](animate);
                    } else {
                        backdrop.classList.remove(CLASS_ACTIVE);
                    }
                }
            }
        };
        var handleEvent = function(e) {
            popup.close(btns.indexOf(e.target));
        };
        $(popupElement).on('tap', '.' + CLASS_POPUP_BUTTON, handleEvent);
        if (popupStack.length) {
            popupStack[popupStack.length - 1]['hide']();
        }
        popupStack.push({
            close: popup.close,
            show: function(animate) {
                popupElement.style.display = 'block';
                popupElement.offsetHeight;
                popupElement.classList.add(CLASS_POPUP_IN);
            },
            hide: function() {
                popupElement.style.display = 'none';
                popupElement.classList.remove(CLASS_POPUP_IN);
            }
        });
        return popup;
    };
    var createAlert = function(message, title, btnValue, callback, type) {
        if (typeof message === 'undefined') {
            return;
        } else {
            if (typeof title === 'function') {
                callback = title;
                type = btnValue;
                title = null;
                btnValue = null;
            } else if (typeof btnValue === 'function') {
                type = callback;
                callback = btnValue;
                btnValue = null;
            }
        }
        if (!$.os.plus || type === 'div') {
            return createPopup(createInner(message, title || '提示') + createButtons([btnValue || '确定']), callback);
        }
        return plus.nativeUI.alert(message, callback, title || '提示', btnValue || '确定');
    };
    var createConfirm = function(message, title, btnArray, callback, type) {
        if (typeof message === 'undefined') {
            return;
        } else {
            if (typeof title === 'function') {
                callback = title;
                type = btnArray;
                title = null;
                btnArray = null;
            } else if (typeof btnArray === 'function') {
                type = callback;
                callback = btnArray;
                btnArray = null;
            }
        }
        if (!$.os.plus || type === 'div') {
            return createPopup(createInner(message, title || '提示') + createButtons(btnArray || ['取消', '确认']), callback);
        }
        return plus.nativeUI.confirm(message, callback, title, btnArray || ['取消', '确认']);
    };
    var createPrompt = function(message, placeholder, title, btnArray, callback, type) {
        if (typeof message === 'undefined') {
            return;
        } else {
            if (typeof placeholder === 'function') {
                callback = placeholder;
                type = title;
                placeholder = null;
                title = null;
                btnArray = null;
            } else if (typeof title === 'function') {
                callback = title;
                type = btnArray;
                title = null;
                btnArray = null;
            } else if (typeof btnArray === 'function') {
                type = callback;
                callback = btnArray;
                btnArray = null;
            }
        }
        if (!$.os.plus || type === 'div') {
            return createPopup(createInner(message, title || '提示', createInput(placeholder)) + createButtons(btnArray || ['取消', '确认']), callback);
        }
        return plus.nativeUI.prompt(message, callback, title || '提示', placeholder, btnArray || ['取消', '确认']);
    };
    var closePopup = function() {
        if (popupStack.length) {
            popupStack[popupStack.length - 1]['close']();
            return true;
        } else {
            return false;
        }
    };
    var closePopups = function() {
        while (popupStack.length) {
            popupStack[popupStack.length - 1]['close']();
        }
    };

    $.closePopup = closePopup;
    $.closePopups = closePopups;
    $.alert = createAlert;
    $.confirm = createConfirm;
    $.prompt = createPrompt;
})(mui, window, document);
(function($, document) {
	var CLASS_PROGRESSBAR = 'mui-progressbar';
	var CLASS_PROGRESSBAR_IN = 'mui-progressbar-in';
	var CLASS_PROGRESSBAR_OUT = 'mui-progressbar-out';
	var CLASS_PROGRESSBAR_INFINITE = 'mui-progressbar-infinite';

	var SELECTOR_PROGRESSBAR = '.mui-progressbar';

	var _findProgressbar = function(container) {
		container = $(container || 'body');
		if (container.length === 0) return;
		container = container[0];
		if (container.classList.contains(CLASS_PROGRESSBAR)) {
			return container;
		}
		var progressbars = container.querySelectorAll(SELECTOR_PROGRESSBAR);
		if (progressbars) {
			for (var i = 0, len = progressbars.length; i < len; i++) {
				var progressbar = progressbars[i];
				if (progressbar.parentNode === container) {
					return progressbar;
				}
			}
		}
	};
	/**
	 * 创建并显示进度条 
	 * @param {Object} container  可选，默认body，支持selector,DOM Node,mui wrapper
	 * @param {Object} progress 可选，undefined表示循环，数字表示具体进度
	 * @param {Object} color 可选，指定颜色样式(目前暂未提供实际样式，可暂时不暴露此参数)
	 */
	var showProgressbar = function(container, progress, color) {
		if (typeof container === 'number') {
			color = progress;
			progress = container;
			container = 'body';
		}
		container = $(container || 'body');
		if (container.length === 0) return;
		container = container[0];
		var progressbar;
		if (container.classList.contains(CLASS_PROGRESSBAR)) {
			progressbar = container;
		} else {
			var progressbars = container.querySelectorAll(SELECTOR_PROGRESSBAR + ':not(.' + CLASS_PROGRESSBAR_OUT + ')');
			if (progressbars) {
				for (var i = 0, len = progressbars.length; i < len; i++) {
					var _progressbar = progressbars[i];
					if (_progressbar.parentNode === container) {
						progressbar = _progressbar;
						break;
					}
				}
			}
			if (!progressbar) {
				progressbar = document.createElement('span');
				progressbar.className = CLASS_PROGRESSBAR + ' ' + CLASS_PROGRESSBAR_IN + (typeof progress !== 'undefined' ? '' : (' ' + CLASS_PROGRESSBAR_INFINITE)) + (color ? (' ' + CLASS_PROGRESSBAR + '-' + color) : '');
				if (typeof progress !== 'undefined') {
					progressbar.innerHTML = '<span></span>';
				}
				container.appendChild(progressbar);
			} else {
				progressbar.classList.add(CLASS_PROGRESSBAR_IN);
			}
		}
		if (progress) setProgressbar(container, progress);
		return progressbar;
	};
	/**
	 * 关闭进度条 
	 * @param {Object} container 可选，默认body，支持selector,DOM Node,mui wrapper
	 */
	var hideProgressbar = function(container) {
		var progressbar = _findProgressbar(container);
		if (!progressbar) {
			return;
		}
		var classList = progressbar.classList;
		if (!classList.contains(CLASS_PROGRESSBAR_IN) || classList.contains(CLASS_PROGRESSBAR_OUT)) {
			return;
		}
		classList.remove(CLASS_PROGRESSBAR_IN);
		classList.add(CLASS_PROGRESSBAR_OUT);
		progressbar.addEventListener('webkitAnimationEnd', function() {
			progressbar.parentNode && progressbar.parentNode.removeChild(progressbar);
			progressbar = null;
		});
		return;
	};
	/**
	 * 设置指定进度条进度 
	 * @param {Object} container  可选，默认body，支持selector,DOM Node,mui wrapper
	 * @param {Object} progress 可选，默认0 取值范围[0-100]
	 * @param {Object} speed 进度条动画时间
	 */
	var setProgressbar = function(container, progress, speed) {
		if (typeof container === 'number') {
			speed = progress;
			progress = container;
			container = false;
		}
		var progressbar = _findProgressbar(container);
		if (!progressbar || progressbar.classList.contains(CLASS_PROGRESSBAR_INFINITE)) {
			return;
		}
		if (progress) progress = Math.min(Math.max(progress, 0), 100);
		progressbar.offsetHeight;
		var span = progressbar.querySelector('span');
		if (span) {
			var style = span.style;
			style.webkitTransform = 'translate3d(' + (-100 + progress) + '%,0,0)';
			if (typeof speed !== 'undefined') {
				style.webkitTransitionDuration = speed + 'ms';
			} else {
				style.webkitTransitionDuration = '';
			}
		}
		return progressbar;
	};
	$.fn.progressbar = function(options) {
		var progressbarApis = [];
		options = options || {};
		this.each(function() {
			var self = this;
			var progressbarApi = self.mui_plugin_progressbar;
			if (!progressbarApi) {
				self.mui_plugin_progressbar = progressbarApi = {
					options: options,
					setOptions: function(options) {
						this.options = options;
					},
					show: function() {
						return showProgressbar(self, this.options.progress, this.options.color);
					},
					setProgress: function(progress) {
						return setProgressbar(self, progress);
					},
					hide: function() {
						return hideProgressbar(self);
					}
				};
			} else if (options) {
				progressbarApi.setOptions(options);
			}
			progressbarApis.push(progressbarApi);
		});
		return progressbarApis.length === 1 ? progressbarApis[0] : progressbarApis;
	};
	//	$.setProgressbar = setProgressbar;
	//	$.showProgressbar = showProgressbar;
	//	$.hideProgressbar = hideProgressbar;
})(mui, document);
/**
 * Input(TODO resize)
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 */
(function($, window, document) {
	var CLASS_ICON = 'mui-icon';
	var CLASS_ICON_CLEAR = 'mui-icon-clear';
	var CLASS_ICON_SPEECH = 'mui-icon-speech';
	var CLASS_ICON_SEARCH = 'mui-icon-search';
	var CLASS_ICON_PASSWORD = 'mui-icon-eye';
	var CLASS_INPUT_ROW = 'mui-input-row';
	var CLASS_PLACEHOLDER = 'mui-placeholder';
	var CLASS_TOOLTIP = 'mui-tooltip';
	var CLASS_HIDDEN = 'mui-hidden';
	var CLASS_FOCUSIN = 'mui-focusin';
	var SELECTOR_ICON_CLOSE = '.' + CLASS_ICON_CLEAR;
	var SELECTOR_ICON_SPEECH = '.' + CLASS_ICON_SPEECH;
	var SELECTOR_ICON_PASSWORD = '.' + CLASS_ICON_PASSWORD;
	var SELECTOR_PLACEHOLDER = '.' + CLASS_PLACEHOLDER;
	var SELECTOR_TOOLTIP = '.' + CLASS_TOOLTIP;

	var findRow = function(target) {
		for (; target && target !== document; target = target.parentNode) {
			if (target.classList && target.classList.contains(CLASS_INPUT_ROW)) {
				return target;
			}
		}
		return null;
	};
	var Input = function(element, options) {
		this.element = element;
		this.options = options || {
			actions: 'clear'
		};
		if (~this.options.actions.indexOf('slider')) { //slider
			this.sliderActionClass = CLASS_TOOLTIP + ' ' + CLASS_HIDDEN;
			this.sliderActionSelector = SELECTOR_TOOLTIP;
		} else { //clear,speech,search
			if (~this.options.actions.indexOf('clear')) {
				this.clearActionClass = CLASS_ICON + ' ' + CLASS_ICON_CLEAR + ' ' + CLASS_HIDDEN;
				this.clearActionSelector = SELECTOR_ICON_CLOSE;
			}
			if (~this.options.actions.indexOf('speech')) { //only for 5+
				this.speechActionClass = CLASS_ICON + ' ' + CLASS_ICON_SPEECH;
				this.speechActionSelector = SELECTOR_ICON_SPEECH;
			}
			if (~this.options.actions.indexOf('search')) {
				this.searchActionClass = CLASS_PLACEHOLDER;
				this.searchActionSelector = SELECTOR_PLACEHOLDER;
			}
			if (~this.options.actions.indexOf('password')) {
				this.passwordActionClass = CLASS_ICON + ' ' + CLASS_ICON_PASSWORD;
				this.passwordActionSelector = SELECTOR_ICON_PASSWORD;
			}
		}
		this.init();
	};
	Input.prototype.init = function() {
		this.initAction();
		this.initElementEvent();
	};
	Input.prototype.initAction = function() {
		var self = this;

		var row = self.element.parentNode;
		if (row) {
			if (self.sliderActionClass) {
				self.sliderAction = self.createAction(row, self.sliderActionClass, self.sliderActionSelector);
			} else {
				if (self.searchActionClass) {
					self.searchAction = self.createAction(row, self.searchActionClass, self.searchActionSelector);
					self.searchAction.addEventListener('tap', function(e) {
						$.focus(self.element);
						e.stopPropagation();
					});
				}
				if (self.speechActionClass) {
					self.speechAction = self.createAction(row, self.speechActionClass, self.speechActionSelector);
					self.speechAction.addEventListener('click', $.stopPropagation);
					self.speechAction.addEventListener('tap', function(event) {
						self.speechActionClick(event);
					});
				}
				if (self.clearActionClass) {
					self.clearAction = self.createAction(row, self.clearActionClass, self.clearActionSelector);
					self.clearAction.addEventListener('tap', function(event) {
						self.clearActionClick(event);
					});
				}
				if (self.passwordActionClass) {
					self.passwordAction = self.createAction(row, self.passwordActionClass, self.passwordActionSelector);
					self.passwordAction.addEventListener('tap', function(event) {
						self.passwordActionClick(event);
					});
				}
			}
		}
	};
	Input.prototype.createAction = function(row, actionClass, actionSelector) {
		var action = row.querySelector(actionSelector);
		if (!action) {
			var action = document.createElement('span');
			action.className = actionClass;
			if (actionClass === this.searchActionClass) {
				action.innerHTML = '<span class="' + CLASS_ICON + ' ' + CLASS_ICON_SEARCH + '"></span><span>' + this.element.getAttribute('placeholder') + '</span>';
				this.element.setAttribute('placeholder', '');
				if (this.element.value.trim()) {
					row.classList.add('mui-active');
				}
			}
			row.insertBefore(action, this.element.nextSibling);
		}
		return action;
	};
	Input.prototype.initElementEvent = function() {
		var element = this.element;

		if (this.sliderActionClass) {
			var tooltip = this.sliderAction;
			var timer = null;
			var showTip = function() { //每次重新计算是因为控件可能被隐藏，初始化时计算是不正确的
				tooltip.classList.remove(CLASS_HIDDEN);
				var offsetLeft = element.offsetLeft;
				var width = element.offsetWidth - 28;
				var tooltipWidth = tooltip.offsetWidth;
				var distince = Math.abs(element.max - element.min);
				var scaleWidth = (width / distince) * Math.abs(element.value - element.min);
				tooltip.style.left = (14 + offsetLeft + scaleWidth - tooltipWidth / 2) + 'px';
				tooltip.innerText = element.value;
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(function() {
					tooltip.classList.add(CLASS_HIDDEN);
				}, 1000);
			};
			element.addEventListener('input', showTip);
			element.addEventListener('tap', showTip);
			element.addEventListener($.EVENT_MOVE, function(e) {
				e.stopPropagation();
			});
		} else {
			if (this.clearActionClass) {
				var action = this.clearAction;
				if (!action) {
					return;
				}
				$.each(['keyup', 'change', 'input', 'focus', 'cut', 'paste'], function(index, type) {
					(function(type) {
						element.addEventListener(type, function() {
							action.classList[element.value.trim() ? 'remove' : 'add'](CLASS_HIDDEN);
						});
					})(type);
				});
				element.addEventListener('blur', function() {
					action.classList.add(CLASS_HIDDEN);
				});
			}
			if (this.searchActionClass) {
				element.addEventListener('focus', function() {
					element.parentNode.classList.add('mui-active');
				});
				element.addEventListener('blur', function() {
					if (!element.value.trim()) {
						element.parentNode.classList.remove('mui-active');
					}
				});
			}
		}
	};
	Input.prototype.setPlaceholder = function(text) {
		if (this.searchActionClass) {
			var placeholder = this.element.parentNode.querySelector(SELECTOR_PLACEHOLDER);
			placeholder && (placeholder.getElementsByTagName('span')[1].innerText = text);
		} else {
			this.element.setAttribute('placeholder', text);
		}
	};
	Input.prototype.passwordActionClick = function(event) {
		if (this.element.type === 'text') {
			this.element.type = 'password';
		} else {
			this.element.type = 'text';
		}
		this.passwordAction.classList.toggle('mui-active');
		event.preventDefault();
	};
	Input.prototype.clearActionClick = function(event) {
		var self = this;
		self.element.value = '';
		$.focus(self.element);
		self.clearAction.classList.add(CLASS_HIDDEN);
		event.preventDefault();
	};
	Input.prototype.speechActionClick = function(event) {
		if (window.plus) {
			var self = this;
			var oldValue = self.element.value;
			self.element.value = '';
			document.body.classList.add(CLASS_FOCUSIN);
			plus.speech.startRecognize({
				engine: 'iFly'
			}, function(s) {
				self.element.value += s;
				$.focus(self.element);
				plus.speech.stopRecognize();
				$.trigger(self.element, 'recognized', {
					value: self.element.value
				});
				if (oldValue !== self.element.value) {
					$.trigger(self.element, 'change');
					$.trigger(self.element, 'input');
				}
				// document.body.classList.remove(CLASS_FOCUSIN);
			}, function(e) {
				document.body.classList.remove(CLASS_FOCUSIN);
			});
		} else {
			alert('only for 5+');
		}
		event.preventDefault();
	};
	$.fn.input = function(options) {
		var inputApis = [];
		this.each(function() {
			var inputApi = null;
			var actions = [];
			var row = findRow(this.parentNode);
			if (this.type === 'range' && row.classList.contains('mui-input-range')) {
				actions.push('slider');
			} else {
				var classList = this.classList;
				if (classList.contains('mui-input-clear')) {
					actions.push('clear');
				}
				if (!($.os.android && $.os.stream) && classList.contains('mui-input-speech')) {
					actions.push('speech');
				}
				if (classList.contains('mui-input-password')) {
					actions.push('password');
				}
				if (this.type === 'search' && row.classList.contains('mui-search')) {
					actions.push('search');
				}
			}
			var id = this.getAttribute('data-input-' + actions[0]);
			if (!id) {
				id = ++$.uuid;
				inputApi = $.data[id] = new Input(this, {
					actions: actions.join(',')
				});
				for (var i = 0, len = actions.length; i < len; i++) {
					this.setAttribute('data-input-' + actions[i], id);
				}
			} else {
				inputApi = $.data[id];
			}
			inputApis.push(inputApi);
		});
		return inputApis.length === 1 ? inputApis[0] : inputApis;
	};
	$.ready(function() {
		$('.mui-input-row input').input();
	});
})(mui, window, document);
(function($, window) {
    var CLASS_ACTIVE = 'mui-active';
    var rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;
    var getColor = function(colorStr) {
        var matches = colorStr.match(rgbaRegex);
        if (matches && matches.length === 5) {
            return [
                matches[1],
                matches[2],
                matches[3],
                matches[4]
            ];
        }
        return [];
    };
    var Transparent = function(element, options) {
        this.element = element;
        this.options = $.extend({
            top: 0, //距离顶部高度(到达该高度即触发)
            offset: 150, //滚动透明距离档设定top值后offset也会随着top向下延伸
            duration: 16, //过渡时间
            scrollby: window
        }, options || {});

        this.scrollByElem = this.options.scrollby || window;
        if (!this.scrollByElem) {
            throw new Error("监听滚动的元素不存在");
        }
        this.isNativeScroll = false;
        if (this.scrollByElem === window) {
            this.isNativeScroll = true;
        } else if (!~this.scrollByElem.className.indexOf('mui-scroll-wrapper')) {
            this.isNativeScroll = true;
        }

        this._style = this.element.style;
        this._bgColor = this._style.backgroundColor;
        var color = getColor(mui.getStyles(this.element, 'backgroundColor'));
        if (color.length) {
            this._R = color[0];
            this._G = color[1];
            this._B = color[2];
            this._A = parseFloat(color[3]);
            this.lastOpacity = this._A;
            this._bufferFn = $.buffer(this.handleScroll, this.options.duration, this);
            this.initEvent();
        } else {
            throw new Error("元素背景颜色必须为RGBA");
        }
    };

    Transparent.prototype.initEvent = function() {
        this.scrollByElem.addEventListener('scroll', this._bufferFn);
        if (this.isNativeScroll) { //原生scroll
            this.scrollByElem.addEventListener($.EVENT_MOVE, this._bufferFn);
        }
    }
    Transparent.prototype.handleScroll = function(e) {
        var y = window.scrollY;
        if (!this.isNativeScroll && e && e.detail) {
            y = -e.detail.y;
        }
        var opacity = (y - this.options.top) / this.options.offset + this._A;
        opacity = Math.min(Math.max(this._A, opacity), 1);
        this._style.backgroundColor = 'rgba(' + this._R + ',' + this._G + ',' + this._B + ',' + opacity + ')';
        if (opacity > this._A) {
            this.element.classList.add(CLASS_ACTIVE);
        } else {
            this.element.classList.remove(CLASS_ACTIVE);
        }
        if (this.lastOpacity !== opacity) {
            $.trigger(this.element, 'alpha', {
                alpha: opacity
            });
            this.lastOpacity = opacity;
        }
    };
    Transparent.prototype.destory = function() {
        this.scrollByElem.removeEventListener('scroll', this._bufferFn);
        this.scrollByElem.removeEventListener($.EVENT_MOVE, this._bufferFn);
        this.element.style.backgroundColor = this._bgColor;
        this.element.mui_plugin_transparent = null;
    };
    $.fn.transparent = function(options) {
        options = options || {};
        var transparentApis = [];
        this.each(function() {
            var transparentApi = this.mui_plugin_transparent;
            if (!transparentApi) {
                var top = this.getAttribute('data-top');
                var offset = this.getAttribute('data-offset');
                var duration = this.getAttribute('data-duration');
                var scrollby = this.getAttribute('data-scrollby');
                if (top !== null && typeof options.top === 'undefined') {
                    options.top = top;
                }
                if (offset !== null && typeof options.offset === 'undefined') {
                    options.offset = offset;
                }
                if (duration !== null && typeof options.duration === 'undefined') {
                    options.duration = duration;
                }
                if (scrollby !== null && typeof options.scrollby === 'undefined') {
                    options.scrollby = document.querySelector(scrollby) || window;
                }
                transparentApi = this.mui_plugin_transparent = new Transparent(this, options);
            }
            transparentApis.push(transparentApi);
        });
        return transparentApis.length === 1 ? transparentApis[0] : transparentApis;
    };
    $.ready(function() {
        $('.mui-bar-transparent').transparent();
    });
})(mui, window);
/**
 * 数字输入框
 * varstion 1.0.1
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($) {

    var touchSupport = ('ontouchstart' in document);
    var tapEventName = touchSupport ? 'tap' : 'click';
    var changeEventName = 'change';
    var holderClassName = 'mui-numbox';
    var plusClassSelector = '.mui-btn-numbox-plus,.mui-numbox-btn-plus';
    var minusClassSelector = '.mui-btn-numbox-minus,.mui-numbox-btn-minus';
    var inputClassSelector = '.mui-input-numbox,.mui-numbox-input';

    var Numbox = $.Numbox = $.Class.extend({
        /**
         * 构造函数
         **/
        init: function(holder, options) {
            var self = this;
            if (!holder) {
                throw "构造 numbox 时缺少容器元素";
            }
            self.holder = holder;
            options = options || {};
            options.step = parseInt(options.step || 1);
            self.options = options;
            self.input = $.qsa(inputClassSelector, self.holder)[0];
            self.plus = $.qsa(plusClassSelector, self.holder)[0];
            self.minus = $.qsa(minusClassSelector, self.holder)[0];
            self.checkValue();
            self.initEvent();
        },
        /**
         * 初始化事件绑定
         **/
        initEvent: function() {
            var self = this;
            self.plus.addEventListener(tapEventName, function(event) {
                var val = parseInt(self.input.value) + self.options.step;
                self.input.value = val.toString();
                $.trigger(self.input, changeEventName, null);
            });
            self.minus.addEventListener(tapEventName, function(event) {
                var val = parseInt(self.input.value) - self.options.step;
                self.input.value = val.toString();
                $.trigger(self.input, changeEventName, null);
            });
            self.input.addEventListener(changeEventName, function(event) {
                self.checkValue();
                var val = parseInt(self.input.value);
                //触发顶层容器
                $.trigger(self.holder, changeEventName, {
                    value: val
                });
            });
        },
        /**
         * 获取当前值
         **/
        getValue: function() {
            var self = this;
            return parseInt(self.input.value);
        },
        /**
         * 验证当前值是法合法
         **/
        checkValue: function() {
            var self = this;
            var val = self.input.value;
            if (val == null || val == '' || isNaN(val)) {
                self.input.value = self.options.min || 0;
                self.minus.disabled = self.options.min != null;
            } else {
                var val = parseInt(val);
                if (self.options.max != null && !isNaN(self.options.max) && val >= parseInt(self.options.max)) {
                    val = self.options.max;
                    self.plus.disabled = true;
                } else {
                    self.plus.disabled = false;
                }
                if (self.options.min != null && !isNaN(self.options.min) && val <= parseInt(self.options.min)) {
                    val = self.options.min;
                    self.minus.disabled = true;
                } else {
                    self.minus.disabled = false;
                }
                self.input.value = val;
            }
        },
        /**
         * 更新选项
         **/
        setOption: function(name, value) {
            var self = this;
            self.options[name] = value;
        },
        /**
         * 动态设置新值
         **/
        setValue: function(value) {
            this.input.value = value;
            this.checkValue();
        }
    });

    $.fn.numbox = function(options) {
        var instanceArray = [];
        //遍历选择的元素
        this.each(function(i, element) {
            if (element.numbox) {
                return;
            }
            if (options) {
                element.numbox = new Numbox(element, options);
            } else {
                var optionsText = element.getAttribute('data-numbox-options');
                var options = optionsText ? JSON.parse(optionsText) : {};
                options.step = element.getAttribute('data-numbox-step') || options.step;
                options.min = element.getAttribute('data-numbox-min') || options.min;
                options.max = element.getAttribute('data-numbox-max') || options.max;
                element.numbox = new Numbox(element, options);
            }
        });
        return this[0] ? this[0].numbox : null;
    }

    //自动处理 class='mui-locker' 的 dom
    $.ready(function() {
        $('.' + holderClassName).numbox();
    });

}(mui));
/**
 * Button
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 */
(function($, window, document) {
    var CLASS_ICON = 'mui-icon';
    var CLASS_DISABLED = 'mui-disabled';

    var STATE_RESET = 'reset';
    var STATE_LOADING = 'loading';

    var defaultOptions = {
        loadingText: 'Loading...', //文案
        loadingIcon: 'mui-spinner' + ' ' + 'mui-spinner-white', //图标，可为空
        loadingIconPosition: 'left' //图标所处位置，仅支持left|right
    };

    var Button = function(element, options) {
        this.element = element;
        this.options = $.extend({}, defaultOptions, options);
        if (!this.options.loadingText) {
            this.options.loadingText = defaultOptions.loadingText;
        }
        if (this.options.loadingIcon === null) {
            this.options.loadingIcon = 'mui-spinner';
            if ($.getStyles(this.element, 'color') === 'rgb(255, 255, 255)') {
                this.options.loadingIcon += ' ' + 'mui-spinner-white';
            }
        }
        this.isInput = this.element.tagName === 'INPUT';
        this.resetHTML = this.isInput ? this.element.value : this.element.innerHTML;
        this.state = '';
    };
    Button.prototype.loading = function() {
        this.setState(STATE_LOADING);
    };
    Button.prototype.reset = function() {
        this.setState(STATE_RESET);
    };
    Button.prototype.setState = function(state) {
        if (this.state === state) {
            return false;
        }
        this.state = state;
        if (state === STATE_RESET) {
            this.element.disabled = false;
            this.element.classList.remove(CLASS_DISABLED);
            this.setHtml(this.resetHTML);
        } else if (state === STATE_LOADING) {
            this.element.disabled = true;
            this.element.classList.add(CLASS_DISABLED);
            var html = this.isInput ? this.options.loadingText : ('<span>' + this.options.loadingText + '</span>');
            if (this.options.loadingIcon && !this.isInput) {
                if (this.options.loadingIconPosition === 'right') {
                    html += '&nbsp;<span class="' + this.options.loadingIcon + '"></span>';
                } else {
                    html = '<span class="' + this.options.loadingIcon + '"></span>&nbsp;' + html;
                }
            }
            this.setHtml(html);
        }
    };
    Button.prototype.setHtml = function(html) {
        if (this.isInput) {
            this.element.value = html;
        } else {
            this.element.innerHTML = html;
        }
    }
    $.fn.button = function(state) {
        var buttonApis = [];
        this.each(function() {
            var buttonApi = this.mui_plugin_button;
            if (!buttonApi) {
                var loadingText = this.getAttribute('data-loading-text');
                var loadingIcon = this.getAttribute('data-loading-icon');
                var loadingIconPosition = this.getAttribute('data-loading-icon-position');
                this.mui_plugin_button = buttonApi = new Button(this, {
                    loadingText: loadingText,
                    loadingIcon: loadingIcon,
                    loadingIconPosition: loadingIconPosition
                });
            }
            if (state === STATE_LOADING || state === STATE_RESET) {
                buttonApi.setState(state);
            }
            buttonApis.push(buttonApi);
        });
        return buttonApis.length === 1 ? buttonApis[0] : buttonApis;
    };
})(mui, window, document);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(31);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(41)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/_css-loader@0.28.1@css-loader/index.js!./mui.css", function() {
			var newContent = require("!!../../node_modules/_css-loader@0.28.1@css-loader/index.js!./mui.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(21),
  /* template */
  __webpack_require__(45),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\detail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] detail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1ff45a91", Component.options)
  } else {
    hotAPI.reload("data-v-1ff45a91", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(59)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(22),
  /* template */
  __webpack_require__(50),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-59982a1f",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\home.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] home.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-59982a1f", Component.options)
  } else {
    hotAPI.reload("data-v-59982a1f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(58)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(23),
  /* template */
  __webpack_require__(48),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-2daa5d42",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2daa5d42", Component.options)
  } else {
    hotAPI.reload("data-v-2daa5d42", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  null,
  /* template */
  __webpack_require__(53),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\index\\collect.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] collect.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ac83a846", Component.options)
  } else {
    hotAPI.reload("data-v-ac83a846", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(24),
  /* template */
  __webpack_require__(55),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\index\\topics.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] topics.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c0c3e57e", Component.options)
  } else {
    hotAPI.reload("data-v-c0c3e57e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(26),
  /* template */
  __webpack_require__(56),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\mui\\mui.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] mui.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c73feb3a", Component.options)
  } else {
    hotAPI.reload("data-v-c73feb3a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(57)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(27),
  /* template */
  __webpack_require__(46),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\mui\\mui2.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] mui2.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-208e2942", Component.options)
  } else {
    hotAPI.reload("data-v-208e2942", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(60)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(30),
  /* template */
  __webpack_require__(51),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-6caa9da2",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\weui.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] weui.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6caa9da2", Component.options)
  } else {
    hotAPI.reload("data-v-6caa9da2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v2.5.3
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also regiseter instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    data.props = resolveProps(route, matched.props && matched.props[name]);

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    var val = extraQuery[key];
    parsedQuery[key] = Array.isArray(val) ? val.slice() : val;
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.slice().forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;
  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) { return String(a[key]) === String(b[key]); })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed) { return }
  install.installed = true;

  _Vue = Vue;

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this.$root._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this.$root._route }
  });

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (index$1(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (index$1(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = index.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  var pathMap = oldPathMap || Object.create(null);
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var normalizedPath = normalizePath(path, parent);
  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    if (Array.isArray(route.alias)) {
      route.alias.forEach(function (alias) {
        var aliasRoute = {
          path: alias,
          children: route.children
        };
        addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path);
      });
    } else {
      var aliasRoute = {
        path: route.alias,
        children: route.children
      };
      addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path);
    }
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path) {
  var regex = index(path);
  if (process.env.NODE_ENV !== 'production') {
    var keys = {};
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent) {
  path = path.replace(/\/$/, '');
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);
    if (!shouldScroll) {
      return
    }
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      var el = document.querySelector(shouldScroll.selector);
      if (el) {
        position = getElementPosition(el);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    if (called) { return }
    called = true;
    return fn.apply(this, arguments)
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    window.addEventListener('popstate', function (e) {
      this$1.transitionTo(getLocation(this$1.base), function (route) {
        if (expectScroll) {
          handleScroll(router, route, this$1.current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    window.addEventListener('hashchange', function () {
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        replaceHash(route.fullPath);
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
  window.location.hash = path;
}

function replaceHash (path) {
  var i = window.location.href.indexOf('#');
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  );
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: {} };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.5.3';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(40)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.3.3
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}
/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch (e) {
      // possible circular reference
      return a === b
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = (null); // work around flow check

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    } )); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target ).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.splice(key, 1);
    return
  }
  var ob = (target ).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    valid = typeof value === expectedType.toLowerCase();
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function () {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      for (var i = 0; i < fns.length; i++) {
        fns[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        (last).text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                "timeout (" + (res.timeout) + "ms)"
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this$1.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      child.data && child.data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // remove reference to DOM nodes (prevents leak)
    vm.$options._parentElm = vm.$options._refElm = null;
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure((name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render
  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    {
      observerState.isSettingProps = true;
    }
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    {
      observerState.isSettingProps = false;
    }
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdateHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdateHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  if (this.user) {
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    }
  } else {
    value = this.getter.call(vm, vm);
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch) { initWatch(vm, opts.watch); }
}

var isReservedProp = {
  key: 1,
  ref: 1,
  slot: 1
};

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      if (isReservedProp[key] || config.isReservedAttr(key)) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !observerState.isSettingProps) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      "development" !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(keys[i])) {
      proxy(vm, "_data", keys[i]);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    {
      if (getter === undefined) {
        warn(
          ("No getter function has been defined for computed property \"" + key + "\"."),
          vm
        );
        getter = noop;
      }
    }
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    {
      if (methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
    }
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    // isArray here
    var isArray = Array.isArray(inject);
    var result = Object.create(null);
    var keys = isArray
      ? inject
      : hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = isArray ? key : inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
    }
    return result
  }
}

/*  */

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || {});
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    data: data,
    props: props,
    children: children,
    parent: context,
    listeners: data.on || {},
    injections: resolveInject(Ctor.options.inject, context),
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    vnode.functionalOptions = Ctor.options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  if (isUndef(Ctor.cid)) {
    Ctor = resolveAsyncComponent(Ctor, baseCtor, context);
    if (Ctor === undefined) {
      // return nothing if this is indeed an async component
      // wait for the callback to trigger parent update.
      return
    }
  }

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  data = data || {};

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && isUndef(child.ns)) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      extend(props, bindObject);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "development" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      for (var key in value) {
        if (key === 'class' || key === 'style') {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];
        }
      }
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] =
    this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        vnode = vm.$options.renderError
          ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          : vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-init:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return this
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (cache, current, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, this._vnode, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, this._vnode, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode.ssrContext
  }
});

Vue$3.version = '2.3.3';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (isUndef(value)) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  var res = '';
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(value[i])) {
        if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) { res += key + ' '; }
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (ref.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("development" !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.elm = oldVnode.elm;
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }
    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if ("development" !== 'production' &&
              typeof console !== 'undefined' &&
              !bailed
            ) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  } else {
    return "var $$exp = " + (modelRs.exp) + ", $$idx = " + (modelRs.idx) + ";" +
      "if (!Array.isArray($$exp)){" +
        value + "=" + assignment + "}" +
      "else{$$exp.splice($$idx, 1, " + assignment + ")}"
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;

function parseModel (val) {
  str = val;
  len = str.length;
  index$1 = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$1(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, CHECKBOX_RADIO_TOKEN,
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number || type === 'number') {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  var event;
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  if (once$$1) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is not equal to the updated value
  return document.activeElement !== elm && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if ((isDef(modifiers) && modifiers.number) || elm.type === 'number') {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likley wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (vnode.tag === 'textarea' || el.type === 'text' || el.type === 'password') {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition && !isIE9) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("development" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("development" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

// check whether current browser encodes a char inside attribute values
function shouldDecode (content, encoded) {
  var div = document.createElement('div');
  div.innerHTML = "<div a=\"" + content + "\">";
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/*  */

var decoder;

function decode (html) {
  decoder = decoder || document.createElement('div');
  decoder.innerHTML = html;
  return decoder.textContent
}

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      var text = (void 0), rest$1 = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest$1 = html.slice(textEnd);
        while (
          !endTag.test(rest$1) &&
          !startTagOpen.test(rest$1) &&
          !comment.test(rest$1) &&
          !conditionalComment.test(rest$1)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest$1.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest$1 = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var endTagLength = 0;
      var rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest.length;
      html = rest;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;
  platformGetTagNamespace = options.getTagNamespace || no;
  platformMustUseProp = options.mustUseProp || no;
  platformIsPreTag = options.isPreTag || no;
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      walkThroughConditionsBlocks(node.ifConditions, isInFor);
    }
  }
}

function walkThroughConditionsBlocks (conditionBlocks, isInFor) {
  for (var i = 1, len = conditionBlocks.length; i < len; i++) {
    markStaticRoots(conditionBlocks[i].block, isInFor);
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    var handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if ("development" !== 'production' &&
      name === 'click' &&
      handler && handler.modifiers && handler.modifiers.right
    ) {
      warn(
        "Use \"contextmenu\" instead of \"click.right\" since right clicks " +
        "do not actually fire \"click\" events."
      );
    }
    res += "\"" + name + "\":" + (genHandler(name, handler)) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var alias = keyCodes[key];
  return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  bind: bind$1,
  cloak: noop
};

/*  */

// configurable state
var warn$3;
var transforms$1;
var dataGenFns;
var platformDirectives$1;
var isPlatformReservedTag$1;
var staticRenderFns;
var onceCount;
var currentOptions;

function generate (
  ast,
  options
) {
  // save previous staticRenderFns so generate calls can be nested
  var prevStaticRenderFns = staticRenderFns;
  var currentStaticRenderFns = staticRenderFns = [];
  var prevOnceCount = onceCount;
  onceCount = 0;
  currentOptions = options;
  warn$3 = options.warn || baseWarn;
  transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
  dataGenFns = pluckModuleFunction(options.modules, 'genData');
  platformDirectives$1 = options.directives || {};
  isPlatformReservedTag$1 = options.isReservedTag || no;
  var code = ast ? genElement(ast) : '_c("div")';
  staticRenderFns = prevStaticRenderFns;
  onceCount = prevOnceCount;
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: currentStaticRenderFns
  }
}

function genElement (el) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el)
  } else if (el.for && !el.forProcessed) {
    return genFor(el)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el);
    } else {
      var data = el.plain ? undefined : genData(el);

      var children = el.inlineTemplate ? null : genChildren(el, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < transforms$1.length; i++) {
      code = transforms$1[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el) {
  el.staticProcessed = true;
  staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
  return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && warn$3(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el)
    }
    return ("_o(" + (genElement(el)) + "," + (onceCount++) + (key ? ("," + key) : "") + ")")
  } else {
    return genStatic(el)
  }
}

function genIf (el) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice())
}

function genIfConditions (conditions) {
  if (!conditions.length) {
    return '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return el.once ? genOnce(el) : genElement(el)
  }
}

function genFor (el) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (
    "development" !== 'production' &&
    maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key
  ) {
    warn$3(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genElement(el)) +
    '})'
}

function genData (el) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < dataGenFns.length; i++) {
    data += dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, warn$3)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, warn$3)) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  return data
}

function genDirectives (el) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, warn$3);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length > 1 || ast.type !== 1
  )) {
    warn$3('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, currentOptions);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (slots) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) { return genScopedSlot(key, slots[key]); }).join(',')) + "])")
}

function genScopedSlot (key, el) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el)
  }
  return "{key:" + key + ",fn:function(" + (String(el.attrsMap.scope)) + "){" +
    "return " + (el.tag === 'template'
      ? genChildren(el) || 'void 0'
      : genElement(el)) + "}}"
}

function genForScopedSlot (key, el) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el)) +
    '})'
}

function genChildren (el, checkSkip) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return genElement(el$1)
    }
    var normalizationType = checkSkip ? getNormalizationType(children) : 0;
    return ("[" + (children.map(genNode).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (children) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function maybeComponent (el) {
  return !isPlatformReservedTag$1(el.tag)
}

function genNode (node) {
  if (node.type === 1) {
    return genElement(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genSlot (el) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (componentName, el) {
  var children = el.inlineTemplate ? null : genChildren(el, true);
  return ("_c(" + componentName + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
      );
    } else {
      errors.push(("invalid expression: " + (text.trim())));
    }
  }
}

/*  */

function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}

function makeFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompiler (baseOptions) {
  var functionCompileCache = Object.create(null);

  function compile (
    template,
    options
  ) {
    var finalOptions = Object.create(baseOptions);
    var errors = [];
    var tips = [];
    finalOptions.warn = function (msg, tip$$1) {
      (tip$$1 ? tips : errors).push(msg);
    };

    if (options) {
      // merge custom modules
      if (options.modules) {
        finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
      }
      // merge custom directives
      if (options.directives) {
        finalOptions.directives = extend(
          Object.create(baseOptions.directives),
          options.directives
        );
      }
      // copy other options
      for (var key in options) {
        if (key !== 'modules' && key !== 'directives') {
          finalOptions[key] = options[key];
        }
      }
    }

    var compiled = baseCompile(template, finalOptions);
    {
      errors.push.apply(errors, detectErrors(compiled.ast));
    }
    compiled.errors = errors;
    compiled.tips = tips;
    return compiled
  }

  function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = options || {};

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (functionCompileCache[key]) {
      return functionCompileCache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = makeFunction(compiled.render, fnGenErrors);
    var l = compiled.staticRenderFns.length;
    res.staticRenderFns = new Array(l);
    for (var i = 0; i < l; i++) {
      res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i], fnGenErrors);
    }

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (functionCompileCache[key] = res)
  }

  return {
    compile: compile,
    compileToFunctions: compileToFunctions
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData$1
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$2 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$2
};

var modules$1 = [
  klass$1,
  style$1
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        delimiters: options.delimiters
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(((this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

return Vue$3;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(64)))

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Store */
/* unused harmony export mapState */
/* unused harmony export mapMutations */
/* unused harmony export mapGetters */
/* unused harmony export mapActions */
/**
 * vuex v2.3.0
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
    Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: {} };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  var this$1 = this;

  // register root module (Vuex.Store options)
  this.root = new Module(rawRootModule, false);

  // register all nested modules
  if (rawRootModule.modules) {
    forEachValue(rawRootModule.modules, function (rawModule, key) {
      this$1.register([key], rawModule, false);
    });
  }
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update(this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  var parent = this.get(path.slice(0, -1));
  var newModule = new Module(rawModule, runtime);
  parent.addChild(path[path.length - 1], newModule);

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (targetModule, newModule) {
  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        console.warn(
          "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
          'manual reload is needed'
        );
        return
      }
      update(targetModule.getChild(key), newModule.modules[key]);
    }
  }
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
  assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");

  var state = options.state; if ( state === void 0 ) state = {};
  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.concat(devtoolPlugin).forEach(function (plugin) { return plugin(this$1); });
};

var prototypeAccessors = { state: {} };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  assert(false, "Use store.replaceState() to explicit replace store state.");
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    console.error(("[vuex] unknown mutation type: " + type));
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (options && options.silent) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var entry = this._actions[type];
  if (!entry) {
    console.error(("[vuex] unknown action type: " + type));
    return
  }
  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  var subs = this._subscribers;
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  assert(typeof getter === 'function', "store.watch only accepts a function.");
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule) {
  if (typeof path === 'string') { path = [path]; }
  assert(Array.isArray(path), "module path must be a string or an Array.");
  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path));
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }
  assert(Array.isArray(path), "module path must be a string or an Array.");
  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var namespacedType = namespace + key;
    registerAction(store, namespacedType, action, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (!store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (!store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler(local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler({
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    console.error(("[vuex] duplicate getter key: " + type));
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue) {
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    );
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (namespace && !getModuleByNamespace(this.$store, 'mapMutations', namespace)) {
        return
      }
      return this.$store.commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (!(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (namespace && !getModuleByNamespace(this.$store, 'mapActions', namespace)) {
        return
      }
      return this.$store.dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (!module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '2.3.0',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions
};

/* harmony default export */ __webpack_exports__["a"] = (index_esm);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_index_topics_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_index_topics_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_index_topics_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_index_collect_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_index_collect_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_index_collect_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_detail_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_detail_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_detail_vue__);




__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* default */]);

__webpack_require__(7);
window.mui = __webpack_require__(6);

//组件 首页
var index = __webpack_require__(10);
//主题

//收藏

//详情页面


var home = __webpack_require__(9);
var weui = __webpack_require__(15);
var muiCp = __webpack_require__(13);
var muiCp2 = __webpack_require__(14);

//路由
var router = new __WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]({
   routes: [{
      path: "/index",
      component: index,
      children: [{
         path: "topics",
         component: __WEBPACK_IMPORTED_MODULE_3__components_index_topics_vue___default.a
      }, {
         path: "collect",
         component: __WEBPACK_IMPORTED_MODULE_4__components_index_collect_vue___default.a
      }]
   }, {
      path: "/detail",
      component: __WEBPACK_IMPORTED_MODULE_5__components_detail_vue___default.a
   }, {
      path: "/home",
      component: home
   }, {
      path: "/weui",
      component: weui
   }, {
      path: "/mui",
      component: muiCp
   }, {
      path: "/mui2",
      component: muiCp2
   }]
});

//状态管理
var store = new __WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* default */].Stroe({
   state: {
      exchange: "测试"
   },
   mutations: {
      setExchange(state, data) {
         state.exchange = data;
      }
   },
   getters: {
      getExchange(state) {
         return state.exchange;
      }
   }
});

new __WEBPACK_IMPORTED_MODULE_0_vue___default.a({
   el: "#demo",
   template: `
   	     <router-view></router-view>
   	  `,
   router,
   store,
   data: {
      name: "wscats"
   }
});

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data() {
		return {
			article: "",
			src: __webpack_require__(3),
			html: __webpack_require__(39)
		};
	},
	methods: {
		setTitle() {
			this.$store.commit("setExchange", this.article);
		}
	}
});

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data() {
		return {
			src: __webpack_require__(3),
			topic: ""
		};
	},
	mothods: {
		getDetail() {
			var self = this;
			$.ajax({
				type: "GET",
				url: "https://cnodejs.org/api/v1/topic/58e607b0ddee72813eb22323",
				async: true,
				success(data) {
					console.log(data);
					self.topic = data.data.content;
				}
			});
		}
	},
	mounted() {
		this.getDetail();
	}
});

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__article_article_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__article_article_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__article_article_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__list_list_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__list_list_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__list_list_vue__);
//
//
//
//
//
//
//

//export default = module.exports


/* harmony default export */ __webpack_exports__["default"] = ({
	mounted() {
		//$("p").css("color", "red");
	},
	components: {
		xarticle: __WEBPACK_IMPORTED_MODULE_0__article_article_vue___default.a,
		xlist: __WEBPACK_IMPORTED_MODULE_1__list_list_vue___default.a
	}
});

/***/ }),
/* 23 */
/***/ (function(module, exports) {

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

module.exports = {
	data() {
		return {
			name: "第一页de"
		};
	},
	methods: {
		linkTo(page) {
			console.log(page);
			//跳转路由
			switch (page) {
				case 0:
					window.location.href = "#/index/topics";
					break;
				case 1:
					window.location.href = "#/index/collect";
					break;
			}
			//关闭侧栏菜单
			this.offHide();
		},
		offHide() {
			var offCanvasWrapper = mui('#offCanvasWrapper');
			offCanvasWrapper.offCanvas('show');
		}
	},
	mounted() {
		mui.init();
		//侧滑容器父节点
		var offCanvasWrapper = mui('#offCanvasWrapper');
		//主界面容器
		var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
		//菜单容器
		var offCanvasSide = document.getElementById("offCanvasSide");
		/*if(!mui.os.android) {
  	document.getElementById("move-togger").classList.remove('mui-hidden');
  	var spans = document.querySelectorAll('.android-only');
  	for(var i = 0, len = spans.length; i < len; i++) {
  		spans[i].style.display = "none";
  	}
  }*/
		//移动效果是否为整体移动
		var moveTogether = false;
		//侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
		/*var classList = offCanvasWrapper[0].classList;
  //变换侧滑动画移动效果；
  mui('.mui-input-group').on('change', 'input', function() {
  	if(this.checked) {
  		offCanvasSide.classList.remove('mui-transitioning');
  		offCanvasSide.setAttribute('style', '');
  		classList.remove('mui-slide-in');
  		classList.remove('mui-scalable');
  		switch(this.value) {
  			case 'main-move':
  				if(moveTogether) {
  					//仅主内容滑动时，侧滑菜单在off-canvas-wrap内，和主界面并列
  					offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
  				}
  				break;
  			case 'main-move-scalable':
  				if(moveTogether) {
  					//仅主内容滑动时，侧滑菜单在off-canvas-wrap内，和主界面并列
  					offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
  				}
  				classList.add('mui-scalable');
  				break;
  			case 'menu-move':
  				classList.add('mui-slide-in');
  				break;
  			case 'all-move':
  				moveTogether = true;
  				//整体滑动时，侧滑菜单在inner-wrap内
  				offCanvasInner.insertBefore(offCanvasSide, offCanvasInner.firstElementChild);
  				break;
  		}
  		offCanvasWrapper.offCanvas().refresh();
  	}
  });*/
		//主界面‘显示侧滑菜单’按钮的点击事件
		/*document.getElementById('offCanvasShow').addEventListener('tap', function() {
  	offCanvasWrapper.offCanvas('show');
  });
  //菜单界面，‘关闭侧滑菜单’按钮的点击事件
  document.getElementById('offCanvasHide').addEventListener('tap', function() {
  	console.log("close")
  	offCanvasWrapper.offCanvas('close');
  });*/
		//主界面和侧滑菜单界面均支持区域滚动；
		/*mui('#offCanvasSideScroll').scroll();
  mui('#offCanvasContentScroll').scroll();*/
		//实现ios平台原生侧滑关闭页面；
		/*if(mui.os.plus && mui.os.ios) {
  	mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
  		plus.webview.currentWebview().setStyle({
  			'popGesture': 'none'
  		});
  	});
  }*/
	}
};

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__swiper_vue__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__swiper_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__swiper_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pullrefresh_vue__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pullrefresh_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__pullrefresh_vue__);
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
	components: {
		swiper: __WEBPACK_IMPORTED_MODULE_0__swiper_vue___default.a,
		pullrefresh: __WEBPACK_IMPORTED_MODULE_1__pullrefresh_vue___default.a
	}
});

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data() {
		return {};
	},
	computed: {
		title() {
			return this.$store.getters.getExchange;
		}
	}
});

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data() {
		return {
			src: __webpack_require__(3)
		};
	},
	mounted() {
		mui.init({
			swipeBack: true //启用右滑关闭功能
		});
	}
});

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	mounted() {
		mui.init({
			swipeBack: true //启用右滑关闭功能
		});
		mui('body').on('shown', '.mui-popover', function (e) {
			//console.log('shown', e.detail.id);//detail为当前popover元素
		});
		mui('body').on('hidden', '.mui-popover', function (e) {
			//console.log('hidden', e.detail.id);//detail为当前popover元素
		});
		var info = document.getElementById("info");
		mui('body').on('tap', '.mui-popover-action li>a', function () {
			var a = this,
			    parent;
			//根据点击按钮，反推当前是哪个actionsheet
			for (parent = a.parentNode; parent != document.body; parent = parent.parentNode) {
				if (parent.classList.contains('mui-popover-action')) {
					break;
				}
			}
			//关闭actionsheet
			mui('#' + parent.id).popover('toggle');
			info.innerHTML = "你刚点击了\"" + a.innerHTML + "\"按钮";
		});
	}
});

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data() {
		return {
			src: __webpack_require__(3),
			topics: ""
		};
	},
	methods: {
		linkTo(page) {
			console.log(page);
			window.location.href = "#/detail";
		},
		getData() {
			var self = this;
			$.ajax({
				url: "https://cnodejs.org/api/v1/topics",
				type: "GET",
				success(data) {
					console.log(data);
					self.topics = data.data;
				}
			});
		}
	},
	mounted() {
		this.getData();
		mui.init({
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					height: 50, //可选,默认50.触发下拉刷新拖动距离,
					auto: true, //可选,默认false.自动下拉刷新一次
					contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
					contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
					contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
					callback: function () {
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
						console.log("hello");
					} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				}
			}
		});
	}
});

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data() {
		return {
			src: __webpack_require__(3)
		};
	},
	mounted() {
		mui.init({
			swipeBack: true //启用右滑关闭功能
		});
		var slider = mui("#slider");

		slider.slider({
			interval: 5000
		});
	}
});

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__article_article_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__article_article_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__article_article_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__list_list_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__list_list_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__list_list_vue__);
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
	data: function () {
		return {};
	},
	components: {
		xarticle: __WEBPACK_IMPORTED_MODULE_0__article_article_vue___default.a,
		xlist: __WEBPACK_IMPORTED_MODULE_1__list_list_vue___default.a
	}
});

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "/*!\r\n * =====================================================\r\n * Mui v3.6.0 (http://dev.dcloud.net.cn/mui)\r\n * =====================================================\r\n */\r\n\r\n/*! normalize.css v3.0.1 | MIT License | git.io/normalize */\r\nhtml\r\n{\r\n    font-family: sans-serif;\r\n\r\n    -webkit-text-size-adjust: 100%;\r\n}\r\n\r\nbody\r\n{\r\n    margin: 0;\r\n}\r\n\r\narticle,\r\naside,\r\ndetails,\r\nfigcaption,\r\nfigure,\r\nfooter,\r\nheader,\r\nhgroup,\r\nmain,\r\nnav,\r\nsection,\r\nsummary\r\n{\r\n    display: block;\r\n}\r\n\r\naudio,\r\ncanvas,\r\nprogress,\r\nvideo\r\n{\r\n    display: inline-block;\r\n\r\n    vertical-align: baseline;\r\n}\r\n\r\naudio:not([controls])\r\n{\r\n    display: none;\r\n\r\n    height: 0;\r\n}\r\n\r\n[hidden],\r\ntemplate\r\n{\r\n    display: none;\r\n}\r\n\r\na\r\n{\r\n    background: transparent;\r\n}\r\n\r\na:active,\r\na:hover\r\n{\r\n    outline: 0;\r\n}\r\n\r\nabbr[title]\r\n{\r\n    border-bottom: 1px dotted;\r\n}\r\n\r\nb,\r\nstrong\r\n{\r\n    font-weight: bold;\r\n}\r\n\r\ndfn\r\n{\r\n    font-style: italic;\r\n}\r\n\r\nh1\r\n{\r\n    font-size: 2em;\r\n\r\n    margin: .67em 0;\r\n}\r\n\r\nmark\r\n{\r\n    color: #000;\r\n    background: #ff0;\r\n}\r\n\r\nsmall\r\n{\r\n    font-size: 80%;\r\n}\r\n\r\nsub,\r\nsup\r\n{\r\n    font-size: 75%;\r\n    line-height: 0;\r\n\r\n    position: relative;\r\n\r\n    vertical-align: baseline;\r\n}\r\n\r\nsup\r\n{\r\n    top: -.5em;\r\n}\r\n\r\nsub\r\n{\r\n    bottom: -.25em;\r\n}\r\n\r\nimg\r\n{\r\n    border: 0;\r\n}\r\n\r\nsvg:not(:root)\r\n{\r\n    overflow: hidden;\r\n}\r\n\r\nfigure\r\n{\r\n    margin: 1em 40px;\r\n}\r\n\r\nhr\r\n{\r\n    box-sizing: content-box;\r\n    height: 0;\r\n}\r\n\r\npre\r\n{\r\n    overflow: auto;\r\n}\r\n\r\ncode,\r\nkbd,\r\npre,\r\nsamp\r\n{\r\n    font-family: monospace, monospace;\r\n    font-size: 1em;\r\n}\r\n\r\nbutton,\r\ninput,\r\noptgroup,\r\nselect,\r\ntextarea\r\n{\r\n    font: inherit;\r\n\r\n    margin: 0;\r\n\r\n    color: inherit;\r\n}\r\n\r\nbutton\r\n{\r\n    overflow: visible;\r\n}\r\n\r\nbutton,\r\nselect\r\n{\r\n    text-transform: none;\r\n}\r\n\r\nbutton,\r\nhtml input[type='button'],\r\ninput[type='reset'],\r\ninput[type='submit']\r\n{\r\n    cursor: pointer;\r\n\r\n    -webkit-appearance: button;\r\n}\r\n\r\nbutton[disabled],\r\nhtml input[disabled]\r\n{\r\n    cursor: default;\r\n}\r\n\r\ninput\r\n{\r\n    line-height: normal;\r\n}\r\n\r\ninput[type='checkbox'],\r\ninput[type='radio']\r\n{\r\n    box-sizing: border-box;\r\n    padding: 0;\r\n}\r\n\r\ninput[type='number']::-webkit-inner-spin-button,\r\ninput[type='number']::-webkit-outer-spin-button\r\n{\r\n    height: auto;\r\n}\r\n\r\ninput[type='search']\r\n{\r\n    -webkit-box-sizing: content-box;\r\n            box-sizing: content-box;\r\n\r\n    -webkit-appearance: textfield;\r\n}\r\n\r\ninput[type='search']::-webkit-search-cancel-button,\r\ninput[type='search']::-webkit-search-decoration\r\n{\r\n    -webkit-appearance: none;\r\n}\r\n\r\nfieldset\r\n{\r\n    margin: 0 2px;\r\n    padding: .35em .625em .75em;\r\n\r\n    border: 1px solid #c0c0c0;\r\n}\r\n\r\nlegend\r\n{\r\n    padding: 0;\r\n\r\n    border: 0;\r\n}\r\n\r\ntextarea\r\n{\r\n    overflow: auto;\r\n}\r\n\r\noptgroup\r\n{\r\n    font-weight: bold;\r\n}\r\n\r\ntable\r\n{\r\n    border-spacing: 0;\r\n    border-collapse: collapse;\r\n}\r\n\r\ntd,\r\nth\r\n{\r\n    padding: 0;\r\n}\r\n\r\n*\r\n{\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n\r\n    -webkit-user-select: none;\r\n\r\n    outline: none;\r\n\r\n    -webkit-tap-highlight-color: transparent;\r\n    -webkit-tap-highlight-color: transparent;\r\n}\r\n\r\nbody\r\n{\r\n    font-family: 'Helvetica Neue', Helvetica, sans-serif;\r\n    font-size: 17px;\r\n    line-height: 21px;\r\n\r\n    color: #000;\r\n    background-color: #efeff4;\r\n\r\n    -webkit-overflow-scrolling: touch;\r\n}\r\n\r\na\r\n{\r\n    text-decoration: none;\r\n\r\n    color: #007aff;\r\n}\r\na:active\r\n{\r\n    color: #0062cc;\r\n}\r\n\r\n.mui-content\r\n{\r\n    background-color: #efeff4;\r\n\r\n    -webkit-overflow-scrolling: touch;\r\n}\r\n\r\n.mui-bar-nav ~ .mui-content\r\n{\r\n    padding-top: 44px;\r\n}\r\n.mui-bar-nav ~ .mui-content.mui-scroll-wrapper .mui-scrollbar-vertical\r\n{\r\n    top: 44px;\r\n}\r\n\r\n.mui-bar-header-secondary ~ .mui-content\r\n{\r\n    padding-top: 88px;\r\n}\r\n.mui-bar-header-secondary ~ .mui-content.mui-scroll-wrapper .mui-scrollbar-vertical\r\n{\r\n    top: 88px;\r\n}\r\n\r\n.mui-bar-footer ~ .mui-content\r\n{\r\n    padding-bottom: 44px;\r\n}\r\n.mui-bar-footer ~ .mui-content.mui-scroll-wrapper .mui-scrollbar-vertical\r\n{\r\n    bottom: 44px;\r\n}\r\n\r\n.mui-bar-footer-secondary ~ .mui-content\r\n{\r\n    padding-bottom: 88px;\r\n}\r\n.mui-bar-footer-secondary ~ .mui-content.mui-scroll-wrapper .mui-scrollbar-vertical\r\n{\r\n    bottom: 88px;\r\n}\r\n\r\n.mui-bar-tab ~ .mui-content\r\n{\r\n    padding-bottom: 50px;\r\n}\r\n.mui-bar-tab ~ .mui-content.mui-scroll-wrapper .mui-scrollbar-vertical\r\n{\r\n    bottom: 50px;\r\n}\r\n\r\n.mui-bar-footer-secondary-tab ~ .mui-content\r\n{\r\n    padding-bottom: 94px;\r\n}\r\n.mui-bar-footer-secondary-tab ~ .mui-content.mui-scroll-wrapper .mui-scrollbar-vertical\r\n{\r\n    bottom: 94px;\r\n}\r\n\r\n.mui-content-padded\r\n{\r\n    margin: 10px;\r\n}\r\n\r\n.mui-inline\r\n{\r\n    display: inline-block;\r\n\r\n    vertical-align: top;\r\n}\r\n\r\n.mui-block\r\n{\r\n    display: block !important;\r\n}\r\n\r\n.mui-visibility\r\n{\r\n    visibility: visible !important;\r\n}\r\n\r\n.mui-hidden\r\n{\r\n    display: none !important;\r\n}\r\n\r\n.mui-ellipsis\r\n{\r\n    overflow: hidden;\r\n\r\n    white-space: nowrap;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n.mui-ellipsis-2\r\n{\r\n    display: -webkit-box;\r\n    overflow: hidden;\r\n\r\n    white-space: normal !important;\r\n    text-overflow: ellipsis;\r\n    word-wrap: break-word;\r\n\r\n    -webkit-line-clamp: 2;\r\n    -webkit-box-orient: vertical;\r\n}\r\n\r\n.mui-table\r\n{\r\n    display: table;\r\n\r\n    width: 100%;\r\n\r\n    table-layout: fixed;\r\n}\r\n\r\n.mui-table-cell\r\n{\r\n    position: relative;\r\n\r\n    display: table-cell;\r\n}\r\n\r\n.mui-text-left\r\n{\r\n    text-align: left !important;\r\n}\r\n\r\n.mui-text-center\r\n{\r\n    text-align: center !important;\r\n}\r\n\r\n.mui-text-justify\r\n{\r\n    text-align: justify !important;\r\n}\r\n\r\n.mui-text-right\r\n{\r\n    text-align: right !important;\r\n}\r\n\r\n.mui-pull-left\r\n{\r\n    float: left;\r\n}\r\n\r\n.mui-pull-right\r\n{\r\n    float: right;\r\n}\r\n\r\n.mui-list-unstyled\r\n{\r\n    padding-left: 0;\r\n\r\n    list-style: none;\r\n}\r\n\r\n.mui-list-inline\r\n{\r\n    margin-left: -5px;\r\n    padding-left: 0;\r\n\r\n    list-style: none;\r\n}\r\n\r\n.mui-list-inline > li\r\n{\r\n    display: inline-block;\r\n\r\n    padding-right: 5px;\r\n    padding-left: 5px;\r\n}\r\n\r\n.mui-clearfix:before, .mui-clearfix:after\r\n{\r\n    display: table;\r\n\r\n    content: ' ';\r\n}\r\n.mui-clearfix:after\r\n{\r\n    clear: both;\r\n}\r\n\r\n.mui-bg-primary\r\n{\r\n    background-color: #007aff;\r\n}\r\n\r\n.mui-bg-positive\r\n{\r\n    background-color: #4cd964;\r\n}\r\n\r\n.mui-bg-negative\r\n{\r\n    background-color: #dd524d;\r\n}\r\n\r\n.mui-error\r\n{\r\n    margin: 88px 35px;\r\n    padding: 10px;\r\n\r\n    border-radius: 6px;\r\n    background-color: #bbb;\r\n}\r\n\r\n.mui-subtitle\r\n{\r\n    font-size: 15px;\r\n}\r\n\r\nh1, h2, h3, h4, h5, h6\r\n{\r\n    line-height: 1;\r\n\r\n    margin-top: 5px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\nh1, .mui-h1\r\n{\r\n    font-size: 36px;\r\n}\r\n\r\nh2, .mui-h2\r\n{\r\n    font-size: 30px;\r\n}\r\n\r\nh3, .mui-h3\r\n{\r\n    font-size: 24px;\r\n}\r\n\r\nh4, .mui-h4\r\n{\r\n    font-size: 18px;\r\n}\r\n\r\nh5, .mui-h5\r\n{\r\n    font-size: 14px;\r\n    font-weight: normal;\r\n\r\n    color: #8f8f94;\r\n}\r\n\r\nh6, .mui-h6\r\n{\r\n    font-size: 12px;\r\n    font-weight: normal;\r\n\r\n    color: #8f8f94;\r\n}\r\n\r\np\r\n{\r\n    font-size: 14px;\r\n\r\n    margin-top: 0;\r\n    margin-bottom: 10px;\r\n\r\n    color: #8f8f94;\r\n}\r\n\r\n.mui-row:before, .mui-row:after\r\n{\r\n    display: table;\r\n\r\n    content: ' ';\r\n}\r\n.mui-row:after\r\n{\r\n    clear: both;\r\n}\r\n\r\n.mui-col-xs-1, .mui-col-sm-1, .mui-col-xs-2, .mui-col-sm-2, .mui-col-xs-3, .mui-col-sm-3, .mui-col-xs-4, .mui-col-sm-4, .mui-col-xs-5, .mui-col-sm-5, .mui-col-xs-6, .mui-col-sm-6, .mui-col-xs-7, .mui-col-sm-7, .mui-col-xs-8, .mui-col-sm-8, .mui-col-xs-9, .mui-col-sm-9, .mui-col-xs-10, .mui-col-sm-10, .mui-col-xs-11, .mui-col-sm-11, .mui-col-xs-12, .mui-col-sm-12\r\n{\r\n    position: relative;\r\n\r\n    min-height: 1px;\r\n}\r\n\r\n.mui-row > [class*='mui-col-']\r\n{\r\n    float: left;\r\n}\r\n\r\n.mui-col-xs-12\r\n{\r\n    width: 100%;\r\n}\r\n\r\n.mui-col-xs-11\r\n{\r\n    width: 91.66666667%;\r\n}\r\n\r\n.mui-col-xs-10\r\n{\r\n    width: 83.33333333%;\r\n}\r\n\r\n.mui-col-xs-9\r\n{\r\n    width: 75%;\r\n}\r\n\r\n.mui-col-xs-8\r\n{\r\n    width: 66.66666667%;\r\n}\r\n\r\n.mui-col-xs-7\r\n{\r\n    width: 58.33333333%;\r\n}\r\n\r\n.mui-col-xs-6\r\n{\r\n    width: 50%;\r\n}\r\n\r\n.mui-col-xs-5\r\n{\r\n    width: 41.66666667%;\r\n}\r\n\r\n.mui-col-xs-4\r\n{\r\n    width: 33.33333333%;\r\n}\r\n\r\n.mui-col-xs-3\r\n{\r\n    width: 25%;\r\n}\r\n\r\n.mui-col-xs-2\r\n{\r\n    width: 16.66666667%;\r\n}\r\n\r\n.mui-col-xs-1\r\n{\r\n    width: 8.33333333%;\r\n}\r\n\r\n@media (min-width: 400px)\r\n{\r\n    .mui-col-sm-12\r\n    {\r\n        width: 100%;\r\n    }\r\n\r\n    .mui-col-sm-11\r\n    {\r\n        width: 91.66666667%;\r\n    }\r\n\r\n    .mui-col-sm-10\r\n    {\r\n        width: 83.33333333%;\r\n    }\r\n\r\n    .mui-col-sm-9\r\n    {\r\n        width: 75%;\r\n    }\r\n\r\n    .mui-col-sm-8\r\n    {\r\n        width: 66.66666667%;\r\n    }\r\n\r\n    .mui-col-sm-7\r\n    {\r\n        width: 58.33333333%;\r\n    }\r\n\r\n    .mui-col-sm-6\r\n    {\r\n        width: 50%;\r\n    }\r\n\r\n    .mui-col-sm-5\r\n    {\r\n        width: 41.66666667%;\r\n    }\r\n\r\n    .mui-col-sm-4\r\n    {\r\n        width: 33.33333333%;\r\n    }\r\n\r\n    .mui-col-sm-3\r\n    {\r\n        width: 25%;\r\n    }\r\n\r\n    .mui-col-sm-2\r\n    {\r\n        width: 16.66666667%;\r\n    }\r\n\r\n    .mui-col-sm-1\r\n    {\r\n        width: 8.33333333%;\r\n    }\r\n}\r\n.mui-scroll-wrapper\r\n{\r\n    position: absolute;\r\n    z-index: 2;\r\n    top: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    overflow: hidden;\r\n\r\n    width: 100%;\r\n}\r\n\r\n.mui-scroll\r\n{\r\n    position: absolute;\r\n    z-index: 1;\r\n\r\n    width: 100%;\r\n\r\n    -webkit-transform: translateZ(0);\r\n            transform: translateZ(0);\r\n}\r\n\r\n.mui-scrollbar\r\n{\r\n    position: absolute;\r\n    z-index: 9998;\r\n\r\n    overflow: hidden;\r\n\r\n    -webkit-transition: 500ms;\r\n            transition: 500ms;\r\n    transform: translateZ(0px);\r\n    pointer-events: none;\r\n\r\n    opacity: 0;\r\n}\r\n\r\n.mui-scrollbar-vertical\r\n{\r\n    top: 0;\r\n    right: 1px;\r\n    bottom: 2px;\r\n\r\n    width: 4px;\r\n}\r\n.mui-scrollbar-vertical .mui-scrollbar-indicator\r\n{\r\n    width: 100%;\r\n}\r\n\r\n.mui-scrollbar-horizontal\r\n{\r\n    right: 2px;\r\n    bottom: 0;\r\n    left: 2px;\r\n\r\n    height: 4px;\r\n}\r\n.mui-scrollbar-horizontal .mui-scrollbar-indicator\r\n{\r\n    height: 100%;\r\n}\r\n\r\n.mui-scrollbar-indicator\r\n{\r\n    position: absolute;\r\n\r\n    display: block;\r\n\r\n    box-sizing: border-box;\r\n\r\n    -webkit-transition: .01s cubic-bezier(.1, .57, .1, 1);\r\n            transition: .01s cubic-bezier(.1, .57, .1, 1);\r\n    transform: translate(0px, 0px) translateZ(0px);\r\n\r\n    border: 1px solid rgba(255, 255, 255, .80196);\r\n    border-radius: 2px;\r\n    background: rgba(0, 0, 0, .39804);\r\n}\r\n\r\n.mui-plus-pullrefresh .mui-fullscreen .mui-scroll-wrapper .mui-scroll-wrapper, .mui-plus-pullrefresh .mui-fullscreen .mui-slider-group .mui-scroll-wrapper\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    overflow: hidden;\r\n\r\n    width: 100%;\r\n}\r\n.mui-plus-pullrefresh .mui-fullscreen .mui-scroll-wrapper .mui-scroll, .mui-plus-pullrefresh .mui-fullscreen .mui-slider-group .mui-scroll\r\n{\r\n    position: absolute;\r\n\r\n    width: 100%;\r\n}\r\n.mui-plus-pullrefresh .mui-scroll-wrapper, .mui-plus-pullrefresh .mui-slider-group\r\n{\r\n    position: static;\r\n    top: auto;\r\n    bottom: auto;\r\n    left: auto;\r\n\r\n    overflow: auto;\r\n\r\n    width: auto;\r\n}\r\n.mui-plus-pullrefresh .mui-slider-group\r\n{\r\n    overflow: visible;\r\n}\r\n.mui-plus-pullrefresh .mui-scroll\r\n{\r\n    position: static;\r\n\r\n    width: auto;\r\n}\r\n\r\n.mui-off-canvas-wrap .mui-bar\r\n{\r\n    position: absolute !important;\r\n\r\n    -webkit-transform: translate3d(0, 0, 0);\r\n            transform: translate3d(0, 0, 0);\r\n\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n}\r\n\r\n.mui-off-canvas-wrap\r\n{\r\n    position: relative;\r\n    z-index: 1;\r\n\r\n    overflow: hidden;\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n.mui-off-canvas-wrap .mui-inner-wrap\r\n{\r\n    position: relative;\r\n    z-index: 1;\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n.mui-off-canvas-wrap .mui-inner-wrap.mui-transitioning\r\n{\r\n    -webkit-transition: -webkit-transform 350ms;\r\n            transition:         transform 350ms cubic-bezier(.165, .84, .44, 1);\r\n}\r\n.mui-off-canvas-wrap .mui-inner-wrap .mui-off-canvas-left\r\n{\r\n    -webkit-transform: translate3d(-100%, 0, 0);\r\n            transform: translate3d(-100%, 0, 0);\r\n}\r\n.mui-off-canvas-wrap .mui-inner-wrap .mui-off-canvas-right\r\n{\r\n    -webkit-transform: translate3d(100%, 0, 0);\r\n            transform: translate3d(100%, 0, 0);\r\n}\r\n.mui-off-canvas-wrap.mui-active\r\n{\r\n    overflow: hidden;\r\n\r\n    height: 100%;\r\n}\r\n.mui-off-canvas-wrap.mui-active .mui-off-canvas-backdrop\r\n{\r\n    position: absolute;\r\n    z-index: 998;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    display: block;\r\n\r\n    transition: background 350ms cubic-bezier(.165, .84, .44, 1);\r\n\r\n    background: rgba(0, 0, 0, .4);\r\n    box-shadow: -4px 0 4px rgba(0, 0, 0, .5), 4px 0 4px rgba(0, 0, 0, .5);\r\n\r\n    -webkit-tap-highlight-color: transparent;\r\n}\r\n.mui-off-canvas-wrap.mui-slide-in .mui-off-canvas-right\r\n{\r\n    z-index: 10000 !important;\r\n\r\n    -webkit-transform: translate3d(100%, 0px, 0px);\r\n}\r\n.mui-off-canvas-wrap.mui-slide-in .mui-off-canvas-left\r\n{\r\n    z-index: 10000 !important;\r\n\r\n    -webkit-transform: translate3d(-100%, 0px, 0px);\r\n}\r\n\r\n.mui-off-canvas-left, .mui-off-canvas-right\r\n{\r\n    position: absolute;\r\n    z-index: -1;\r\n    top: 0;\r\n    bottom: 0;\r\n\r\n    visibility: hidden;\r\n\r\n    box-sizing: content-box;\r\n    width: 70%;\r\n    min-height: 100%;\r\n\r\n    background: #333;\r\n\r\n    -webkit-overflow-scrolling: touch;\r\n}\r\n.mui-off-canvas-left.mui-transitioning, .mui-off-canvas-right.mui-transitioning\r\n{\r\n    -webkit-transition: -webkit-transform 350ms cubic-bezier(.165, .84, .44, 1);\r\n            transition:         transform 350ms cubic-bezier(.165, .84, .44, 1);\r\n}\r\n\r\n.mui-off-canvas-left\r\n{\r\n    left: 0;\r\n}\r\n\r\n.mui-off-canvas-right\r\n{\r\n    right: 0;\r\n}\r\n\r\n.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable\r\n{\r\n    background-color: #333;\r\n}\r\n.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable > .mui-off-canvas-left, .mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable > .mui-off-canvas-right\r\n{\r\n    width: 80%;\r\n\r\n    -webkit-transform: scale(.8);\r\n            transform: scale(.8);\r\n\r\n    opacity: .1;\r\n}\r\n.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable > .mui-off-canvas-left.mui-transitioning, .mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable > .mui-off-canvas-right.mui-transitioning\r\n{\r\n    -webkit-transition: -webkit-transform 350ms cubic-bezier(.165, .84, .44, 1), opacity 350ms cubic-bezier(.165, .84, .44, 1);\r\n            transition:         transform 350ms cubic-bezier(.165, .84, .44, 1), opacity 350ms cubic-bezier(.165, .84, .44, 1);\r\n}\r\n.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable > .mui-off-canvas-left\r\n{\r\n    -webkit-transform-origin: -100%;\r\n            transform-origin: -100%;\r\n}\r\n.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable > .mui-off-canvas-right\r\n{\r\n    -webkit-transform-origin: 200%;\r\n            transform-origin: 200%;\r\n}\r\n.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable.mui-active > .mui-inner-wrap\r\n{\r\n    -webkit-transform: scale(.8);\r\n            transform: scale(.8);\r\n}\r\n.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable.mui-active > .mui-off-canvas-left, .mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable.mui-active > .mui-off-canvas-right\r\n{\r\n    -webkit-transform: scale(1);\r\n            transform: scale(1);\r\n\r\n    opacity: 1;\r\n}\r\n\r\n.mui-loading .mui-spinner\r\n{\r\n    display: block;\r\n\r\n    margin: 0 auto;\r\n}\r\n\r\n.mui-spinner\r\n{\r\n    display: inline-block;\r\n\r\n    width: 24px;\r\n    height: 24px;\r\n\r\n    -webkit-transform-origin: 50%;\r\n            transform-origin: 50%;\r\n    -webkit-animation: spinner-spin 1s step-end infinite;\r\n            animation: spinner-spin 1s step-end infinite;\r\n}\r\n\r\n.mui-spinner:after\r\n{\r\n    display: block;\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n    content: '';\r\n\r\n    background-image: url('data:image/svg+xml;charset=utf-8,<svg viewBox=\\'0 0 120 120\\' xmlns=\\'http://www.w3.org/2000/svg\\' xmlns:xlink=\\'http://www.w3.org/1999/xlink\\'><defs><line id=\\'l\\' x1=\\'60\\' x2=\\'60\\' y1=\\'7\\' y2=\\'27\\' stroke=\\'%236c6c6c\\' stroke-width=\\'11\\' stroke-linecap=\\'round\\'/></defs><g><use xlink:href=\\'%23l\\' opacity=\\'.27\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(30 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(60 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(90 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(120 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(150 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.37\\' transform=\\'rotate(180 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.46\\' transform=\\'rotate(210 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.56\\' transform=\\'rotate(240 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.66\\' transform=\\'rotate(270 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.75\\' transform=\\'rotate(300 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.85\\' transform=\\'rotate(330 60,60)\\'/></g></svg>');\r\n    background-repeat: no-repeat;\r\n    background-position: 50%;\r\n    background-size: 100%;\r\n}\r\n\r\n.mui-spinner-white:after\r\n{\r\n    background-image: url('data:image/svg+xml;charset=utf-8,<svg viewBox=\\'0 0 120 120\\' xmlns=\\'http://www.w3.org/2000/svg\\' xmlns:xlink=\\'http://www.w3.org/1999/xlink\\'><defs><line id=\\'l\\' x1=\\'60\\' x2=\\'60\\' y1=\\'7\\' y2=\\'27\\' stroke=\\'%23fff\\' stroke-width=\\'11\\' stroke-linecap=\\'round\\'/></defs><g><use xlink:href=\\'%23l\\' opacity=\\'.27\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(30 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(60 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(90 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(120 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(150 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.37\\' transform=\\'rotate(180 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.46\\' transform=\\'rotate(210 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.56\\' transform=\\'rotate(240 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.66\\' transform=\\'rotate(270 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.75\\' transform=\\'rotate(300 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.85\\' transform=\\'rotate(330 60,60)\\'/></g></svg>');\r\n}\r\n\r\n@-webkit-keyframes spinner-spin\r\n{\r\n    0%\r\n    {\r\n        -webkit-transform: rotate(0deg);\r\n    }\r\n\r\n    8.33333333%\r\n    {\r\n        -webkit-transform: rotate(30deg);\r\n    }\r\n\r\n    16.66666667%\r\n    {\r\n        -webkit-transform: rotate(60deg);\r\n    }\r\n\r\n    25%\r\n    {\r\n        -webkit-transform: rotate(90deg);\r\n    }\r\n\r\n    33.33333333%\r\n    {\r\n        -webkit-transform: rotate(120deg);\r\n    }\r\n\r\n    41.66666667%\r\n    {\r\n        -webkit-transform: rotate(150deg);\r\n    }\r\n\r\n    50%\r\n    {\r\n        -webkit-transform: rotate(180deg);\r\n    }\r\n\r\n    58.33333333%\r\n    {\r\n        -webkit-transform: rotate(210deg);\r\n    }\r\n\r\n    66.66666667%\r\n    {\r\n        -webkit-transform: rotate(240deg);\r\n    }\r\n\r\n    75%\r\n    {\r\n        -webkit-transform: rotate(270deg);\r\n    }\r\n\r\n    83.33333333%\r\n    {\r\n        -webkit-transform: rotate(300deg);\r\n    }\r\n\r\n    91.66666667%\r\n    {\r\n        -webkit-transform: rotate(330deg);\r\n    }\r\n\r\n    100%\r\n    {\r\n        -webkit-transform: rotate(360deg);\r\n    }\r\n}\r\n@keyframes spinner-spin\r\n{\r\n    0%\r\n    {\r\n        transform: rotate(0deg);\r\n    }\r\n\r\n    8.33333333%\r\n    {\r\n        transform: rotate(30deg);\r\n    }\r\n\r\n    16.66666667%\r\n    {\r\n        transform: rotate(60deg);\r\n    }\r\n\r\n    25%\r\n    {\r\n        transform: rotate(90deg);\r\n    }\r\n\r\n    33.33333333%\r\n    {\r\n        transform: rotate(120deg);\r\n    }\r\n\r\n    41.66666667%\r\n    {\r\n        transform: rotate(150deg);\r\n    }\r\n\r\n    50%\r\n    {\r\n        transform: rotate(180deg);\r\n    }\r\n\r\n    58.33333333%\r\n    {\r\n        transform: rotate(210deg);\r\n    }\r\n\r\n    66.66666667%\r\n    {\r\n        transform: rotate(240deg);\r\n    }\r\n\r\n    75%\r\n    {\r\n        transform: rotate(270deg);\r\n    }\r\n\r\n    83.33333333%\r\n    {\r\n        transform: rotate(300deg);\r\n    }\r\n\r\n    91.66666667%\r\n    {\r\n        transform: rotate(330deg);\r\n    }\r\n\r\n    100%\r\n    {\r\n        transform: rotate(360deg);\r\n    }\r\n}\r\ninput[type='button'],\r\ninput[type='submit'],\r\ninput[type='reset'],\r\nbutton,\r\n.mui-btn\r\n{\r\n    font-size: 14px;\r\n    font-weight: 400;\r\n    line-height: 1.42;\r\n\r\n    position: relative;\r\n\r\n    display: inline-block;\r\n\r\n    margin-bottom: 0;\r\n    padding: 6px 12px;\r\n\r\n    cursor: pointer;\r\n    -webkit-transition: all;\r\n            transition: all;\r\n    -webkit-transition-timing-function: linear;\r\n            transition-timing-function: linear;\r\n    -webkit-transition-duration: .2s;\r\n            transition-duration: .2s;\r\n    text-align: center;\r\n    vertical-align: top;\r\n    white-space: nowrap;\r\n\r\n    color: #333;\r\n    border: 1px solid #ccc;\r\n    border-radius: 3px;\r\n    border-top-left-radius: 3px;\r\n    border-top-right-radius: 3px;\r\n    border-bottom-right-radius: 3px;\r\n    border-bottom-left-radius: 3px;\r\n    background-color: #fff;\r\n    background-clip: padding-box;\r\n}\r\ninput[type='button']:enabled:active, input[type='button'].mui-active:enabled,\r\ninput[type='submit']:enabled:active,\r\ninput[type='submit'].mui-active:enabled,\r\ninput[type='reset']:enabled:active,\r\ninput[type='reset'].mui-active:enabled,\r\nbutton:enabled:active,\r\nbutton.mui-active:enabled,\r\n.mui-btn:enabled:active,\r\n.mui-btn.mui-active:enabled\r\n{\r\n    color: #fff;\r\n    background-color: #929292;\r\n}\r\ninput[type='button']:disabled, input[type='button'].mui-disabled,\r\ninput[type='submit']:disabled,\r\ninput[type='submit'].mui-disabled,\r\ninput[type='reset']:disabled,\r\ninput[type='reset'].mui-disabled,\r\nbutton:disabled,\r\nbutton.mui-disabled,\r\n.mui-btn:disabled,\r\n.mui-btn.mui-disabled\r\n{\r\n    opacity: .6;\r\n}\r\n\r\ninput[type='submit'],\r\n.mui-btn-primary,\r\n.mui-btn-blue\r\n{\r\n    color: #fff;\r\n    border: 1px solid #007aff;\r\n    background-color: #007aff;\r\n}\r\ninput[type='submit']:enabled:active, input[type='submit'].mui-active:enabled,\r\n.mui-btn-primary:enabled:active,\r\n.mui-btn-primary.mui-active:enabled,\r\n.mui-btn-blue:enabled:active,\r\n.mui-btn-blue.mui-active:enabled\r\n{\r\n    color: #fff;\r\n    border: 1px solid #0062cc;\r\n    background-color: #0062cc;\r\n}\r\n\r\n.mui-btn-positive,\r\n.mui-btn-success,\r\n.mui-btn-green\r\n{\r\n    color: #fff;\r\n    border: 1px solid #4cd964;\r\n    background-color: #4cd964;\r\n}\r\n.mui-btn-positive:enabled:active, .mui-btn-positive.mui-active:enabled,\r\n.mui-btn-success:enabled:active,\r\n.mui-btn-success.mui-active:enabled,\r\n.mui-btn-green:enabled:active,\r\n.mui-btn-green.mui-active:enabled\r\n{\r\n    color: #fff;\r\n    border: 1px solid #2ac845;\r\n    background-color: #2ac845;\r\n}\r\n\r\n.mui-btn-warning,\r\n.mui-btn-yellow\r\n{\r\n    color: #fff;\r\n    border: 1px solid #f0ad4e;\r\n    background-color: #f0ad4e;\r\n}\r\n.mui-btn-warning:enabled:active, .mui-btn-warning.mui-active:enabled,\r\n.mui-btn-yellow:enabled:active,\r\n.mui-btn-yellow.mui-active:enabled\r\n{\r\n    color: #fff;\r\n    border: 1px solid #ec971f;\r\n    background-color: #ec971f;\r\n}\r\n\r\n.mui-btn-negative,\r\n.mui-btn-danger,\r\n.mui-btn-red\r\n{\r\n    color: #fff;\r\n    border: 1px solid #dd524d;\r\n    background-color: #dd524d;\r\n}\r\n.mui-btn-negative:enabled:active, .mui-btn-negative.mui-active:enabled,\r\n.mui-btn-danger:enabled:active,\r\n.mui-btn-danger.mui-active:enabled,\r\n.mui-btn-red:enabled:active,\r\n.mui-btn-red.mui-active:enabled\r\n{\r\n    color: #fff;\r\n    border: 1px solid #cf2d28;\r\n    background-color: #cf2d28;\r\n}\r\n\r\n.mui-btn-royal,\r\n.mui-btn-purple\r\n{\r\n    color: #fff;\r\n    border: 1px solid #8a6de9;\r\n    background-color: #8a6de9;\r\n}\r\n.mui-btn-royal:enabled:active, .mui-btn-royal.mui-active:enabled,\r\n.mui-btn-purple:enabled:active,\r\n.mui-btn-purple.mui-active:enabled\r\n{\r\n    color: #fff;\r\n    border: 1px solid #6641e2;\r\n    background-color: #6641e2;\r\n}\r\n\r\n.mui-btn-grey\r\n{\r\n    color: #fff;\r\n    border: 1px solid #c7c7cc;\r\n    background-color: #c7c7cc;\r\n}\r\n.mui-btn-grey:enabled:active, .mui-btn-grey.mui-active:enabled\r\n{\r\n    color: #fff;\r\n    border: 1px solid #acacb4;\r\n    background-color: #acacb4;\r\n}\r\n\r\n.mui-btn-outlined\r\n{\r\n    background-color: transparent;\r\n}\r\n.mui-btn-outlined.mui-btn-primary, .mui-btn-outlined.mui-btn-blue\r\n{\r\n    color: #007aff;\r\n}\r\n.mui-btn-outlined.mui-btn-positive, .mui-btn-outlined.mui-btn-success, .mui-btn-outlined.mui-btn-green\r\n{\r\n    color: #4cd964;\r\n}\r\n.mui-btn-outlined.mui-btn-warning, .mui-btn-outlined.mui-btn-yellow\r\n{\r\n    color: #f0ad4e;\r\n}\r\n.mui-btn-outlined.mui-btn-negative, .mui-btn-outlined.mui-btn-danger, .mui-btn-outlined.mui-btn-red\r\n{\r\n    color: #dd524d;\r\n}\r\n.mui-btn-outlined.mui-btn-royal, .mui-btn-outlined.mui-btn-purple\r\n{\r\n    color: #8a6de9;\r\n}\r\n.mui-btn-outlined.mui-btn-primary:enabled:active, .mui-btn-outlined.mui-btn-blue:enabled:active, .mui-btn-outlined.mui-btn-positive:enabled:active, .mui-btn-outlined.mui-btn-success:enabled:active, .mui-btn-outlined.mui-btn-green:enabled:active, .mui-btn-outlined.mui-btn-warning:enabled:active, .mui-btn-outlined.mui-btn-yellow:enabled:active, .mui-btn-outlined.mui-btn-negative:enabled:active, .mui-btn-outlined.mui-btn-danger:enabled:active, .mui-btn-outlined.mui-btn-red:enabled:active, .mui-btn-outlined.mui-btn-royal:enabled:active, .mui-btn-outlined.mui-btn-purple:enabled:active\r\n{\r\n    color: #fff;\r\n}\r\n\r\n.mui-btn-link\r\n{\r\n    padding-top: 6px;\r\n    padding-bottom: 6px;\r\n\r\n    color: #007aff;\r\n    border: 0;\r\n    background-color: transparent;\r\n}\r\n.mui-btn-link:enabled:active, .mui-btn-link.mui-active:enabled\r\n{\r\n    color: #0062cc;\r\n    background-color: transparent;\r\n}\r\n\r\n.mui-btn-block\r\n{\r\n    font-size: 18px;\r\n\r\n    display: block;\r\n\r\n    width: 100%;\r\n    margin-bottom: 10px;\r\n    padding: 15px 0;\r\n}\r\n\r\n.mui-btn .mui-badge\r\n{\r\n    font-size: 14px;\r\n\r\n    margin: -2px -4px -2px 4px;\r\n\r\n    background-color: rgba(0, 0, 0, .15);\r\n}\r\n\r\n.mui-btn .mui-badge-inverted,\r\n.mui-btn:enabled:active .mui-badge-inverted\r\n{\r\n    background-color: transparent;\r\n}\r\n\r\n.mui-btn-primary:enabled:active .mui-badge-inverted,\r\n.mui-btn-positive:enabled:active .mui-badge-inverted,\r\n.mui-btn-negative:enabled:active .mui-badge-inverted\r\n{\r\n    color: #fff;\r\n}\r\n\r\n.mui-btn-block .mui-badge\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n\r\n    margin-right: 10px;\r\n}\r\n\r\n.mui-btn .mui-icon\r\n{\r\n    font-size: inherit;\r\n}\r\n\r\n.mui-btn.mui-icon\r\n{\r\n    font-size: 14px;\r\n    line-height: 1.42;\r\n}\r\n\r\n.mui-btn.mui-fab\r\n{\r\n    width: 56px;\r\n    height: 56px;\r\n    padding: 16px;\r\n\r\n    border-radius: 50%;\r\n    outline: none;\r\n}\r\n.mui-btn.mui-fab.mui-btn-mini\r\n{\r\n    width: 40px;\r\n    height: 40px;\r\n    padding: 8px;\r\n}\r\n.mui-btn.mui-fab .mui-icon\r\n{\r\n    font-size: 24px;\r\n    line-height: 24px;\r\n\r\n    width: 24px;\r\n    height: 24px;\r\n}\r\n\r\n.mui-btn .mui-spinner\r\n{\r\n    width: 14px;\r\n    height: 14px;\r\n\r\n    vertical-align: text-bottom;\r\n}\r\n\r\n.mui-btn-block .mui-spinner\r\n{\r\n    width: 22px;\r\n    height: 22px;\r\n}\r\n\r\n.mui-bar\r\n{\r\n    position: fixed;\r\n    z-index: 10;\r\n    right: 0;\r\n    left: 0;\r\n\r\n    height: 44px;\r\n    padding-right: 10px;\r\n    padding-left: 10px;\r\n\r\n    border-bottom: 0;\r\n    background-color: #f7f7f7;\r\n    -webkit-box-shadow: 0 0 1px rgba(0, 0, 0, .85);\r\n            box-shadow: 0 0 1px rgba(0, 0, 0, .85);\r\n\r\n    -webkit-backface-visibility: hidden;\r\n            backface-visibility: hidden;\r\n}\r\n\r\n.mui-bar .mui-title\r\n{\r\n    right: 40px;\r\n    left: 40px;\r\n\r\n    display: inline-block;\r\n    overflow: hidden;\r\n\r\n    width: auto;\r\n    margin: 0;\r\n\r\n    text-overflow: ellipsis;\r\n}\r\n.mui-bar .mui-backdrop\r\n{\r\n    background: none;\r\n}\r\n\r\n.mui-bar-header-secondary\r\n{\r\n    top: 44px;\r\n}\r\n\r\n.mui-bar-footer\r\n{\r\n    bottom: 0;\r\n}\r\n\r\n.mui-bar-footer-secondary\r\n{\r\n    bottom: 44px;\r\n}\r\n\r\n.mui-bar-footer-secondary-tab\r\n{\r\n    bottom: 50px;\r\n}\r\n\r\n.mui-bar-footer,\r\n.mui-bar-footer-secondary,\r\n.mui-bar-footer-secondary-tab\r\n{\r\n    border-top: 0;\r\n}\r\n\r\n.mui-bar-transparent\r\n{\r\n    top: 0;\r\n\r\n    background-color: rgba(247, 247, 247, 0);\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n}\r\n\r\n.mui-bar-nav\r\n{\r\n    top: 0;\r\n\r\n    -webkit-box-shadow: 0 1px 6px #ccc;\r\n            box-shadow: 0 1px 6px #ccc;\r\n}\r\n.mui-bar-nav ~ .mui-content .mui-anchor\r\n{\r\n    display: block;\r\n    visibility: hidden;\r\n\r\n    height: 45px;\r\n    margin-top: -45px;\r\n}\r\n.mui-bar-nav.mui-bar .mui-icon\r\n{\r\n    margin-right: -10px;\r\n    margin-left: -10px;\r\n    padding-right: 10px;\r\n    padding-left: 10px;\r\n}\r\n\r\n.mui-title\r\n{\r\n    font-size: 17px;\r\n    font-weight: 500;\r\n    line-height: 44px;\r\n\r\n    position: absolute;\r\n\r\n    display: block;\r\n\r\n    width: 100%;\r\n    margin: 0 -10px;\r\n    padding: 0;\r\n\r\n    text-align: center;\r\n    white-space: nowrap;\r\n\r\n    color: #000;\r\n}\r\n\r\n.mui-title a\r\n{\r\n    color: inherit;\r\n}\r\n\r\n.mui-bar-tab\r\n{\r\n    bottom: 0;\r\n\r\n    display: table;\r\n\r\n    width: 100%;\r\n    height: 50px;\r\n    padding: 0;\r\n\r\n    table-layout: fixed;\r\n\r\n    border-top: 0;\r\n    border-bottom: 0;\r\n\r\n    -webkit-touch-callout: none;\r\n}\r\n.mui-bar-tab .mui-tab-item\r\n{\r\n    display: table-cell;\r\n    overflow: hidden;\r\n\r\n    width: 1%;\r\n    height: 50px;\r\n\r\n    text-align: center;\r\n    vertical-align: middle;\r\n    white-space: nowrap;\r\n    text-overflow: ellipsis;\r\n\r\n    color: #929292;\r\n}\r\n.mui-bar-tab .mui-tab-item.mui-active\r\n{\r\n    color: #007aff;\r\n}\r\n.mui-bar-tab .mui-tab-item .mui-icon\r\n{\r\n    top: 3px;\r\n\r\n    width: 24px;\r\n    height: 24px;\r\n    padding-top: 0;\r\n    padding-bottom: 0;\r\n}\r\n.mui-bar-tab .mui-tab-item .mui-icon ~ .mui-tab-label\r\n{\r\n    font-size: 11px;\r\n\r\n    display: block;\r\n    overflow: hidden;\r\n\r\n    text-overflow: ellipsis;\r\n}\r\n.mui-bar-tab .mui-tab-item .mui-icon:active\r\n{\r\n    background: none;\r\n}\r\n\r\n.mui-focusin > .mui-bar-nav,\r\n.mui-focusin > .mui-bar-header-secondary\r\n{\r\n    position: absolute;\r\n}\r\n\r\n.mui-focusin > .mui-bar ~ .mui-content\r\n{\r\n    padding-bottom: 0;\r\n}\r\n\r\n.mui-bar .mui-btn\r\n{\r\n    font-weight: 400;\r\n\r\n    position: relative;\r\n    z-index: 20;\r\n    top: 7px;\r\n\r\n    margin-top: 0;\r\n    padding: 6px 12px 7px;\r\n}\r\n.mui-bar .mui-btn.mui-pull-right\r\n{\r\n    margin-left: 10px;\r\n}\r\n.mui-bar .mui-btn.mui-pull-left\r\n{\r\n    margin-right: 10px;\r\n}\r\n\r\n.mui-bar .mui-btn-link\r\n{\r\n    font-size: 16px;\r\n    line-height: 44px;\r\n\r\n    top: 0;\r\n\r\n    padding: 0;\r\n\r\n    color: #007aff;\r\n    border: 0;\r\n}\r\n.mui-bar .mui-btn-link:active, .mui-bar .mui-btn-link.mui-active\r\n{\r\n    color: #0062cc;\r\n}\r\n\r\n.mui-bar .mui-btn-block\r\n{\r\n    font-size: 16px;\r\n\r\n    top: 6px;\r\n\r\n    margin-bottom: 0;\r\n    padding: 5px 0;\r\n}\r\n\r\n.mui-bar .mui-btn-nav.mui-pull-left\r\n{\r\n    margin-left: -5px;\r\n}\r\n.mui-bar .mui-btn-nav.mui-pull-left .mui-icon-left-nav\r\n{\r\n    margin-right: -3px;\r\n}\r\n.mui-bar .mui-btn-nav.mui-pull-right\r\n{\r\n    margin-right: -5px;\r\n}\r\n.mui-bar .mui-btn-nav.mui-pull-right .mui-icon-right-nav\r\n{\r\n    margin-left: -3px;\r\n}\r\n.mui-bar .mui-btn-nav:active\r\n{\r\n    opacity: .3;\r\n}\r\n\r\n.mui-bar .mui-icon\r\n{\r\n    font-size: 24px;\r\n\r\n    position: relative;\r\n    z-index: 20;\r\n\r\n    padding-top: 10px;\r\n    padding-bottom: 10px;\r\n}\r\n.mui-bar .mui-icon:active\r\n{\r\n    opacity: .3;\r\n}\r\n.mui-bar .mui-btn .mui-icon\r\n{\r\n    top: 1px;\r\n\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n.mui-bar .mui-title .mui-icon\r\n{\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n.mui-bar .mui-title .mui-icon.mui-icon-caret\r\n{\r\n    top: 4px;\r\n\r\n    margin-left: -5px;\r\n}\r\n\r\n.mui-bar input[type='search']\r\n{\r\n    height: 29px;\r\n    margin: 6px 0;\r\n}\r\n\r\n.mui-bar .mui-input-row .mui-btn\r\n{\r\n    padding: 12px 10px;\r\n}\r\n\r\n.mui-bar .mui-search:before\r\n{\r\n    margin-top: -10px;\r\n}\r\n\r\n.mui-bar .mui-input-row .mui-input-clear ~ .mui-icon-clear,\r\n.mui-bar .mui-input-row .mui-input-speech ~ .mui-icon-speech\r\n{\r\n    top: 0;\r\n    right: 12px;\r\n}\r\n\r\n.mui-bar.mui-bar-header-secondary .mui-input-row .mui-input-clear ~ .mui-icon-clear,\r\n.mui-bar.mui-bar-header-secondary .mui-input-row .mui-input-speech ~ .mui-icon-speech\r\n{\r\n    top: 0;\r\n    right: 0;\r\n}\r\n\r\n.mui-bar .mui-segmented-control\r\n{\r\n    top: 7px;\r\n\r\n    width: auto;\r\n    margin: 0 auto;\r\n}\r\n\r\n.mui-bar.mui-bar-header-secondary .mui-segmented-control\r\n{\r\n    top: 0;\r\n}\r\n\r\n.mui-badge\r\n{\r\n    font-size: 12px;\r\n    line-height: 1;\r\n\r\n    display: inline-block;\r\n\r\n    padding: 3px 6px;\r\n\r\n    color: #333;\r\n    border-radius: 100px;\r\n    background-color: rgba(0, 0, 0, .15);\r\n}\r\n.mui-badge.mui-badge-inverted\r\n{\r\n    padding: 0 5px 0 0;\r\n\r\n    color: #929292;\r\n    background-color: transparent;\r\n}\r\n\r\n.mui-badge-primary, .mui-badge-blue\r\n{\r\n    color: #fff;\r\n    background-color: #007aff;\r\n}\r\n.mui-badge-primary.mui-badge-inverted, .mui-badge-blue.mui-badge-inverted\r\n{\r\n    color: #007aff;\r\n    background-color: transparent;\r\n}\r\n\r\n.mui-badge-success, .mui-badge-green\r\n{\r\n    color: #fff;\r\n    background-color: #4cd964;\r\n}\r\n.mui-badge-success.mui-badge-inverted, .mui-badge-green.mui-badge-inverted\r\n{\r\n    color: #4cd964;\r\n    background-color: transparent;\r\n}\r\n\r\n.mui-badge-warning, .mui-badge-yellow\r\n{\r\n    color: #fff;\r\n    background-color: #f0ad4e;\r\n}\r\n.mui-badge-warning.mui-badge-inverted, .mui-badge-yellow.mui-badge-inverted\r\n{\r\n    color: #f0ad4e;\r\n    background-color: transparent;\r\n}\r\n\r\n.mui-badge-danger, .mui-badge-red\r\n{\r\n    color: #fff;\r\n    background-color: #dd524d;\r\n}\r\n.mui-badge-danger.mui-badge-inverted, .mui-badge-red.mui-badge-inverted\r\n{\r\n    color: #dd524d;\r\n    background-color: transparent;\r\n}\r\n\r\n.mui-badge-royal, .mui-badge-purple\r\n{\r\n    color: #fff;\r\n    background-color: #8a6de9;\r\n}\r\n.mui-badge-royal.mui-badge-inverted, .mui-badge-purple.mui-badge-inverted\r\n{\r\n    color: #8a6de9;\r\n    background-color: transparent;\r\n}\r\n\r\n.mui-icon .mui-badge\r\n{\r\n    font-size: 10px;\r\n    line-height: 1.4;\r\n\r\n    position: absolute;\r\n    top: -2px;\r\n    left: 100%;\r\n\r\n    margin-left: -10px;\r\n    padding: 1px 5px;\r\n\r\n    color: white;\r\n    background: red;\r\n}\r\n\r\n.mui-card\r\n{\r\n    font-size: 14px;\r\n\r\n    position: relative;\r\n\r\n    overflow: hidden;\r\n\r\n    margin: 10px;\r\n\r\n    border-radius: 2px;\r\n    background-color: white;\r\n    background-clip: padding-box;\r\n    box-shadow: 0 1px 2px rgba(0, 0, 0, .3);\r\n}\r\n\r\n.mui-content > .mui-card:first-child\r\n{\r\n    margin-top: 15px;\r\n}\r\n\r\n.mui-card .mui-input-group:before, .mui-card .mui-input-group:after\r\n{\r\n    height: 0;\r\n}\r\n.mui-card .mui-input-group .mui-input-row:last-child:before, .mui-card .mui-input-group .mui-input-row:last-child:after\r\n{\r\n    height: 0;\r\n}\r\n\r\n.mui-card .mui-table-view\r\n{\r\n    margin-bottom: 0;\r\n\r\n    border-top: 0;\r\n    border-bottom: 0;\r\n    border-radius: 6px;\r\n}\r\n.mui-card .mui-table-view .mui-table-view-divider:first-child, .mui-card .mui-table-view .mui-table-view-cell:first-child\r\n{\r\n    top: 0;\r\n\r\n    border-top-left-radius: 6px;\r\n    border-top-right-radius: 6px;\r\n}\r\n.mui-card .mui-table-view .mui-table-view-divider:last-child, .mui-card .mui-table-view .mui-table-view-cell:last-child\r\n{\r\n    border-bottom-right-radius: 6px;\r\n    border-bottom-left-radius: 6px;\r\n}\r\n.mui-card .mui-table-view:before, .mui-card .mui-table-view:after\r\n{\r\n    height: 0;\r\n}\r\n\r\n.mui-card > .mui-table-view > .mui-table-view-cell:last-child:before, .mui-card > .mui-table-view > .mui-table-view-cell:last-child:after\r\n{\r\n    height: 0;\r\n}\r\n\r\n.mui-card-header,\r\n.mui-card-footer\r\n{\r\n    position: relative;\r\n\r\n    display: -webkit-box;\r\n    display: -webkit-flex;\r\n    display:         flex;\r\n\r\n    min-height: 44px;\r\n    padding: 10px 15px;\r\n\r\n    -webkit-box-pack: justify;\r\n    -webkit-justify-content: space-between;\r\n            justify-content: space-between;\r\n    -webkit-box-align: center;\r\n    -webkit-align-items: center;\r\n            align-items: center;\r\n}\r\n.mui-card-header .mui-card-link,\r\n.mui-card-footer .mui-card-link\r\n{\r\n    line-height: 44px;\r\n\r\n    position: relative;\r\n\r\n    display: -webkit-box;\r\n    display: -webkit-flex;\r\n    display:         flex;\r\n\r\n    height: 44px;\r\n    margin-top: -10px;\r\n    margin-bottom: -10px;\r\n\r\n    -webkit-transition-duration: .3s;\r\n            transition-duration: .3s;\r\n    text-decoration: none;\r\n\r\n    -webkit-box-pack: start;\r\n    -webkit-justify-content: flex-start;\r\n            justify-content: flex-start;\r\n    -webkit-box-align: center;\r\n    -webkit-align-items: center;\r\n            align-items: center;\r\n}\r\n\r\n.mui-card-header:after,\r\n.mui-card-footer:before\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n\r\n.mui-card-header\r\n{\r\n    font-size: 17px;\r\n\r\n    border-radius: 2px 2px 0 0;\r\n}\r\n.mui-card-header:after\r\n{\r\n    top: auto;\r\n    bottom: 0;\r\n}\r\n.mui-card-header > img:first-child\r\n{\r\n    font-size: 0;\r\n    line-height: 0;\r\n\r\n    float: left;\r\n\r\n    width: 34px;\r\n    height: 34px;\r\n}\r\n\r\n.mui-card-footer\r\n{\r\n    color: #6d6d72;\r\n    border-radius: 0 0 2px 2px;\r\n}\r\n\r\n.mui-card-content\r\n{\r\n    font-size: 14px;\r\n\r\n    position: relative;\r\n}\r\n\r\n.mui-card-content-inner\r\n{\r\n    position: relative;\r\n\r\n    padding: 15px;\r\n}\r\n\r\n.mui-card-media\r\n{\r\n    vertical-align: bottom;\r\n\r\n    color: #fff;\r\n    background-position: center;\r\n    background-size: cover;\r\n}\r\n\r\n.mui-card-header.mui-card-media\r\n{\r\n    display: block;\r\n\r\n    padding: 10px;\r\n}\r\n.mui-card-header.mui-card-media .mui-media-body\r\n{\r\n    font-size: 14px;\r\n    font-weight: 500;\r\n    line-height: 17px;\r\n\r\n    margin-bottom: 0;\r\n    margin-left: 44px;\r\n\r\n    color: #333;\r\n}\r\n.mui-card-header.mui-card-media .mui-media-body p\r\n{\r\n    font-size: 13px;\r\n\r\n    margin-bottom: 0;\r\n}\r\n\r\n.mui-table-view\r\n{\r\n    position: relative;\r\n\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n    padding-left: 0;\r\n\r\n    list-style: none;\r\n\r\n    background-color: #fff;\r\n}\r\n.mui-table-view:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n.mui-table-view:before\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n.mui-table-view:before\r\n{\r\n    top: -1px;\r\n}\r\n\r\n.mui-table-view-icon .mui-table-view-cell .mui-navigate-right .mui-icon\r\n{\r\n    font-size: 20px;\r\n\r\n    margin-top: -1px;\r\n    margin-right: 5px;\r\n    margin-left: -5px;\r\n}\r\n.mui-table-view-icon .mui-table-view-cell:after\r\n{\r\n    left: 40px;\r\n}\r\n\r\n.mui-table-view-chevron .mui-table-view-cell\r\n{\r\n    padding-right: 65px;\r\n}\r\n.mui-table-view-chevron .mui-table-view-cell > a:not(.mui-btn)\r\n{\r\n    margin-right: -65px;\r\n}\r\n\r\n.mui-table-view-radio .mui-table-view-cell\r\n{\r\n    padding-right: 65px;\r\n}\r\n.mui-table-view-radio .mui-table-view-cell > a:not(.mui-btn)\r\n{\r\n    margin-right: -65px;\r\n}\r\n.mui-table-view-radio .mui-table-view-cell .mui-navigate-right:after\r\n{\r\n    font-size: 30px;\r\n    font-weight: 600;\r\n\r\n    right: 9px;\r\n\r\n    content: '';\r\n\r\n    color: #007aff;\r\n}\r\n.mui-table-view-radio .mui-table-view-cell.mui-selected .mui-navigate-right:after\r\n{\r\n    content: '\\E472';\r\n}\r\n\r\n.mui-table-view-inverted\r\n{\r\n    color: #fff;\r\n    background: #333;\r\n}\r\n.mui-table-view-inverted:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #222;\r\n}\r\n.mui-table-view-inverted:before\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #222;\r\n}\r\n.mui-table-view-inverted .mui-table-view-cell:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 15px;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #222;\r\n}\r\n.mui-table-view-inverted .mui-table-view-cell.mui-active\r\n{\r\n    background-color: #242424;\r\n}\r\n.mui-table-view-inverted .mui-table-view-cell > a:not(.mui-btn).mui-active\r\n{\r\n    background-color: #242424;\r\n}\r\n\r\n.mui-table-view-cell\r\n{\r\n    position: relative;\r\n\r\n    overflow: hidden;\r\n\r\n    padding: 11px 15px;\r\n\r\n    -webkit-touch-callout: none;\r\n}\r\n.mui-table-view-cell:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 15px;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n.mui-table-view-cell.mui-radio input[type=radio], .mui-table-view-cell.mui-checkbox input[type=checkbox]\r\n{\r\n    top: 8px;\r\n}\r\n.mui-table-view-cell.mui-radio.mui-left, .mui-table-view-cell.mui-checkbox.mui-left\r\n{\r\n    padding-left: 58px;\r\n}\r\n.mui-table-view-cell.mui-active\r\n{\r\n    background-color: #eee;\r\n}\r\n.mui-table-view-cell:last-child:before, .mui-table-view-cell:last-child:after\r\n{\r\n    height: 0;\r\n}\r\n.mui-table-view-cell > a:not(.mui-btn)\r\n{\r\n    position: relative;\r\n\r\n    display: block;\r\n    overflow: hidden;\r\n\r\n    margin: -11px -15px;\r\n    padding: inherit;\r\n\r\n    white-space: nowrap;\r\n    text-overflow: ellipsis;\r\n\r\n    color: inherit;\r\n  /*&:active {\r\n      background-color: #eee;\r\n  }*/\r\n}\r\n.mui-table-view-cell > a:not(.mui-btn).mui-active\r\n{\r\n    background-color: #eee;\r\n}\r\n.mui-table-view-cell p\r\n{\r\n    margin-bottom: 0;\r\n}\r\n\r\n.mui-table-view-cell.mui-transitioning > .mui-slider-handle, .mui-table-view-cell.mui-transitioning > .mui-slider-left .mui-btn, .mui-table-view-cell.mui-transitioning > .mui-slider-right .mui-btn\r\n{\r\n    -webkit-transition: -webkit-transform 300ms ease;\r\n            transition:         transform 300ms ease;\r\n}\r\n.mui-table-view-cell.mui-active > .mui-slider-handle\r\n{\r\n    background-color: #eee;\r\n}\r\n.mui-table-view-cell > .mui-slider-handle\r\n{\r\n    position: relative;\r\n\r\n    background-color: #fff;\r\n}\r\n.mui-table-view-cell > .mui-slider-handle.mui-navigate-right:after, .mui-table-view-cell > .mui-slider-handle .mui-navigate-right:after\r\n{\r\n    right: 0;\r\n}\r\n.mui-table-view-cell > .mui-slider-handle, .mui-table-view-cell > .mui-slider-left .mui-btn, .mui-table-view-cell > .mui-slider-right .mui-btn\r\n{\r\n    -webkit-transition: -webkit-transform 0ms ease;\r\n            transition:         transform 0ms ease;\r\n}\r\n.mui-table-view-cell > .mui-slider-left, .mui-table-view-cell > .mui-slider-right\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n\r\n    display: -webkit-box;\r\n    display: -webkit-flex;\r\n    display:         flex;\r\n\r\n    height: 100%;\r\n}\r\n.mui-table-view-cell > .mui-slider-left > .mui-btn, .mui-table-view-cell > .mui-slider-right > .mui-btn\r\n{\r\n    position: relative;\r\n    left: 0;\r\n\r\n    display: -webkit-box;\r\n    display: -webkit-flex;\r\n    display:         flex;\r\n\r\n    padding: 0 30px;\r\n\r\n    color: #fff;\r\n    border: 0;\r\n    border-radius: 0;\r\n\r\n    -webkit-box-align: center;\r\n    -webkit-align-items: center;\r\n            align-items: center;\r\n}\r\n.mui-table-view-cell > .mui-slider-left > .mui-btn:after, .mui-table-view-cell > .mui-slider-right > .mui-btn:after\r\n{\r\n    position: absolute;\r\n    z-index: -1;\r\n    top: 0;\r\n\r\n    width: 600%;\r\n    height: 100%;\r\n\r\n    content: '';\r\n\r\n    background: inherit;\r\n}\r\n.mui-table-view-cell > .mui-slider-left > .mui-btn.mui-icon, .mui-table-view-cell > .mui-slider-right > .mui-btn.mui-icon\r\n{\r\n    font-size: 30px;\r\n}\r\n.mui-table-view-cell > .mui-slider-right\r\n{\r\n    right: 0;\r\n\r\n    -webkit-transition: -webkit-transform 0ms ease;\r\n            transition:         transform 0ms ease;\r\n    -webkit-transform: translateX(100%);\r\n            transform: translateX(100%);\r\n}\r\n.mui-table-view-cell > .mui-slider-left\r\n{\r\n    left: 0;\r\n\r\n    -webkit-transition: -webkit-transform 0ms ease;\r\n            transition:         transform 0ms ease;\r\n    -webkit-transform: translateX(-100%);\r\n            transform: translateX(-100%);\r\n}\r\n.mui-table-view-cell > .mui-slider-left > .mui-btn:after\r\n{\r\n    right: 100%;\r\n\r\n    margin-right: -1px;\r\n}\r\n\r\n.mui-table-view-divider\r\n{\r\n    font-weight: 500;\r\n\r\n    position: relative;\r\n\r\n    margin-top: -1px;\r\n    margin-left: 0;\r\n    padding-top: 6px;\r\n    padding-bottom: 6px;\r\n    padding-left: 15px;\r\n\r\n    color: #999;\r\n    background-color: #fafafa;\r\n}\r\n.mui-table-view-divider:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n.mui-table-view-divider:before\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n\r\n.mui-table-view .mui-media,\r\n.mui-table-view .mui-media-body\r\n{\r\n    overflow: hidden;\r\n}\r\n\r\n.mui-table-view .mui-media-large .mui-media-object\r\n{\r\n    line-height: 80px;\r\n\r\n    max-width: 80px;\r\n    height: 80px;\r\n}\r\n.mui-table-view .mui-media .mui-subtitle\r\n{\r\n    color: #000;\r\n}\r\n.mui-table-view .mui-media-object\r\n{\r\n    line-height: 42px;\r\n\r\n    max-width: 42px;\r\n    height: 42px;\r\n}\r\n.mui-table-view .mui-media-object.mui-pull-left\r\n{\r\n    margin-right: 10px;\r\n}\r\n.mui-table-view .mui-media-object.mui-pull-right\r\n{\r\n    margin-left: 10px;\r\n}\r\n.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-object\r\n{\r\n    line-height: 29px;\r\n\r\n    max-width: 29px;\r\n    height: 29px;\r\n    margin: -4px 0;\r\n}\r\n.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-object img\r\n{\r\n    line-height: 29px;\r\n\r\n    max-width: 29px;\r\n    height: 29px;\r\n}\r\n.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-object.mui-pull-left\r\n{\r\n    margin-right: 10px;\r\n}\r\n.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-object .mui-icon\r\n{\r\n    font-size: 29px;\r\n}\r\n.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-body:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 55px;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n.mui-table-view .mui-table-view-cell.mui-media-icon:after\r\n{\r\n    height: 0 !important;\r\n}\r\n\r\n.mui-table-view.mui-unfold .mui-table-view-cell.mui-collapse .mui-table-view\r\n{\r\n    display: block;\r\n}\r\n.mui-table-view.mui-unfold .mui-table-view-cell.mui-collapse .mui-table-view:before, .mui-table-view.mui-unfold .mui-table-view-cell.mui-collapse .mui-table-view:after\r\n{\r\n    height: 0 !important;\r\n}\r\n.mui-table-view.mui-unfold .mui-table-view-cell.mui-media-icon.mui-collapse .mui-media-body:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 70px;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n\r\n.mui-table-view-cell > .mui-btn,\r\n.mui-table-view-cell > .mui-badge,\r\n.mui-table-view-cell > .mui-switch,\r\n.mui-table-view-cell > a > .mui-btn,\r\n.mui-table-view-cell > a > .mui-badge,\r\n.mui-table-view-cell > a > .mui-switch\r\n{\r\n    position: absolute;\r\n    top: 50%;\r\n    right: 15px;\r\n\r\n    -webkit-transform: translateY(-50%);\r\n            transform: translateY(-50%);\r\n}\r\n.mui-table-view-cell .mui-navigate-right > .mui-btn,\r\n.mui-table-view-cell .mui-navigate-right > .mui-badge,\r\n.mui-table-view-cell .mui-navigate-right > .mui-switch,\r\n.mui-table-view-cell .mui-push-left > .mui-btn,\r\n.mui-table-view-cell .mui-push-left > .mui-badge,\r\n.mui-table-view-cell .mui-push-left > .mui-switch,\r\n.mui-table-view-cell .mui-push-right > .mui-btn,\r\n.mui-table-view-cell .mui-push-right > .mui-badge,\r\n.mui-table-view-cell .mui-push-right > .mui-switch,\r\n.mui-table-view-cell > a .mui-navigate-right > .mui-btn,\r\n.mui-table-view-cell > a .mui-navigate-right > .mui-badge,\r\n.mui-table-view-cell > a .mui-navigate-right > .mui-switch,\r\n.mui-table-view-cell > a .mui-push-left > .mui-btn,\r\n.mui-table-view-cell > a .mui-push-left > .mui-badge,\r\n.mui-table-view-cell > a .mui-push-left > .mui-switch,\r\n.mui-table-view-cell > a .mui-push-right > .mui-btn,\r\n.mui-table-view-cell > a .mui-push-right > .mui-badge,\r\n.mui-table-view-cell > a .mui-push-right > .mui-switch\r\n{\r\n    right: 35px;\r\n}\r\n\r\n.mui-content > .mui-table-view:first-child\r\n{\r\n    margin-top: 15px;\r\n}\r\n\r\n.mui-table-view-cell.mui-collapse .mui-table-view:before, .mui-table-view-cell.mui-collapse .mui-table-view:after\r\n{\r\n    height: 0;\r\n}\r\n.mui-table-view-cell.mui-collapse .mui-table-view .mui-table-view-cell:last-child:after\r\n{\r\n    height: 0;\r\n}\r\n.mui-table-view-cell.mui-collapse > .mui-navigate-right:after, .mui-table-view-cell.mui-collapse > .mui-push-right:after\r\n{\r\n    content: '\\E581';\r\n}\r\n.mui-table-view-cell.mui-collapse.mui-active\r\n{\r\n    margin-top: -1px;\r\n}\r\n.mui-table-view-cell.mui-collapse.mui-active .mui-table-view, .mui-table-view-cell.mui-collapse.mui-active .mui-collapse-content\r\n{\r\n    display: block;\r\n}\r\n.mui-table-view-cell.mui-collapse.mui-active > .mui-navigate-right:after, .mui-table-view-cell.mui-collapse.mui-active > .mui-push-right:after\r\n{\r\n    content: '\\E580';\r\n}\r\n.mui-table-view-cell.mui-collapse.mui-active .mui-table-view-cell > a:not(.mui-btn).mui-active\r\n{\r\n    margin-left: -31px;\r\n    padding-left: 47px;\r\n}\r\n.mui-table-view-cell.mui-collapse .mui-collapse-content\r\n{\r\n    position: relative;\r\n\r\n    display: none;\r\n    overflow: hidden;\r\n\r\n    margin: 11px -15px -11px;\r\n    padding: 8px 15px;\r\n\r\n    -webkit-transition: height .35s ease;\r\n         -o-transition: height .35s ease;\r\n            transition: height .35s ease;\r\n\r\n    background: white;\r\n}\r\n.mui-table-view-cell.mui-collapse .mui-collapse-content > .mui-input-group, .mui-table-view-cell.mui-collapse .mui-collapse-content > .mui-slider\r\n{\r\n    width: auto;\r\n    height: auto;\r\n    margin: -8px -15px;\r\n}\r\n.mui-table-view-cell.mui-collapse .mui-collapse-content > .mui-slider\r\n{\r\n    margin: -8px -16px;\r\n}\r\n.mui-table-view-cell.mui-collapse .mui-table-view\r\n{\r\n    display: none;\r\n\r\n    margin-top: 11px;\r\n    margin-right: -15px;\r\n    margin-bottom: -11px;\r\n    margin-left: -15px;\r\n\r\n    border: 0;\r\n}\r\n.mui-table-view-cell.mui-collapse .mui-table-view.mui-table-view-chevron\r\n{\r\n    margin-right: -65px;\r\n}\r\n.mui-table-view-cell.mui-collapse .mui-table-view .mui-table-view-cell\r\n{\r\n    padding-left: 31px;\r\n\r\n    background-position: 31px 100%;\r\n}\r\n.mui-table-view-cell.mui-collapse .mui-table-view .mui-table-view-cell:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 30px;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n\r\n.mui-table-view.mui-grid-view\r\n{\r\n    font-size: 0;\r\n\r\n    display: block;\r\n\r\n    width: 100%;\r\n    padding: 0 10px 10px 0;\r\n\r\n    white-space: normal;\r\n}\r\n.mui-table-view.mui-grid-view .mui-table-view-cell\r\n{\r\n    font-size: 17px;\r\n\r\n    display: inline-block;\r\n\r\n    margin-right: -4px;\r\n    padding: 10px 0 0 14px;\r\n\r\n    text-align: center;\r\n    vertical-align: middle;\r\n\r\n    background: none;\r\n}\r\n.mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-object\r\n{\r\n    width: 100%;\r\n    max-width: 100%;\r\n    height: auto;\r\n}\r\n.mui-table-view.mui-grid-view .mui-table-view-cell > a:not(.mui-btn)\r\n{\r\n    margin: -10px 0 0 -14px;\r\n}\r\n.mui-table-view.mui-grid-view .mui-table-view-cell > a:not(.mui-btn):active, .mui-table-view.mui-grid-view .mui-table-view-cell > a:not(.mui-btn).mui-active\r\n{\r\n    background: none;\r\n}\r\n.mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-body\r\n{\r\n    font-size: 15px;\r\n    line-height: 15px;\r\n\r\n    display: block;\r\n\r\n    width: 100%;\r\n    height: 15px;\r\n    margin-top: 8px;\r\n\r\n    text-overflow: ellipsis;\r\n\r\n    color: #333;\r\n}\r\n.mui-table-view.mui-grid-view .mui-table-view-cell:before, .mui-table-view.mui-grid-view .mui-table-view-cell:after\r\n{\r\n    height: 0;\r\n}\r\n\r\n.mui-grid-view.mui-grid-9\r\n{\r\n    margin: 0;\r\n    padding: 0;\r\n\r\n    border-top: 1px solid #eee;\r\n    border-left: 1px solid #eee;\r\n    background-color: #f2f2f2;\r\n}\r\n.mui-grid-view.mui-grid-9:before, .mui-grid-view.mui-grid-9:after\r\n{\r\n    display: table;\r\n\r\n    content: ' ';\r\n}\r\n.mui-grid-view.mui-grid-9:after\r\n{\r\n    clear: both;\r\n}\r\n.mui-grid-view.mui-grid-9:after\r\n{\r\n    position: static;\r\n}\r\n.mui-grid-view.mui-grid-9 .mui-table-view-cell\r\n{\r\n    margin: 0;\r\n    padding: 11px 15px;\r\n\r\n    vertical-align: top;\r\n\r\n    border-right: 1px solid #eee;\r\n    border-bottom: 1px solid #eee;\r\n}\r\n.mui-grid-view.mui-grid-9 .mui-table-view-cell.mui-active\r\n{\r\n    background-color: #eee;\r\n}\r\n.mui-grid-view.mui-grid-9 .mui-table-view-cell > a:not(.mui-btn)\r\n{\r\n    margin: 0;\r\n    padding: 10px 0;\r\n}\r\n.mui-grid-view.mui-grid-9:before\r\n{\r\n    height: 0;\r\n}\r\n.mui-grid-view.mui-grid-9 .mui-media\r\n{\r\n    color: #797979;\r\n}\r\n.mui-grid-view.mui-grid-9 .mui-media .mui-icon\r\n{\r\n    font-size: 2.4em;\r\n\r\n    position: relative;\r\n}\r\n\r\n.mui-slider-cell\r\n{\r\n    position: relative;\r\n}\r\n.mui-slider-cell > .mui-slider-handle\r\n{\r\n    z-index: 1;\r\n}\r\n.mui-slider-cell > .mui-slider-left, .mui-slider-cell > .mui-slider-right\r\n{\r\n    position: absolute;\r\n    z-index: 0;\r\n    top: 0;\r\n    bottom: 0;\r\n}\r\n.mui-slider-cell > .mui-slider-left\r\n{\r\n    left: 0;\r\n}\r\n.mui-slider-cell > .mui-slider-right\r\n{\r\n    right: 0;\r\n}\r\n\r\ninput,\r\ntextarea,\r\nselect\r\n{\r\n    font-family: 'Helvetica Neue', Helvetica, sans-serif;\r\n    font-size: 17px;\r\n\r\n    -webkit-tap-highlight-color: transparent;\r\n    -webkit-tap-highlight-color: transparent;\r\n}\r\ninput:focus,\r\ntextarea:focus,\r\nselect:focus\r\n{\r\n    -webkit-tap-highlight-color: transparent;\r\n    -webkit-tap-highlight-color: transparent;\r\n    -webkit-user-modify: read-write-plaintext-only;\r\n}\r\n\r\nselect,\r\ntextarea,\r\ninput[type='text'],\r\ninput[type='search'],\r\ninput[type='password'],\r\ninput[type='datetime'],\r\ninput[type='datetime-local'],\r\ninput[type='date'],\r\ninput[type='month'],\r\ninput[type='time'],\r\ninput[type='week'],\r\ninput[type='number'],\r\ninput[type='email'],\r\ninput[type='url'],\r\ninput[type='tel'],\r\ninput[type='color']\r\n{\r\n    line-height: 21px;\r\n\r\n    width: 100%;\r\n    height: 40px;\r\n    margin-bottom: 15px;\r\n    padding: 10px 15px;\r\n\r\n    -webkit-user-select: text;\r\n\r\n    border: 1px solid rgba(0, 0, 0, .2);\r\n    border-radius: 3px;\r\n    outline: none;\r\n    background-color: #fff;\r\n\r\n    -webkit-appearance: none;\r\n}\r\n\r\ninput[type=number]::-webkit-inner-spin-button,\r\ninput[type=number]::-webkit-outer-spin-button\r\n{\r\n    margin: 0;\r\n\r\n    -webkit-appearance: none;\r\n}\r\n\r\ninput[type='search']\r\n{\r\n    font-size: 16px;\r\n\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n    height: 34px;\r\n\r\n    text-align: center;\r\n\r\n    border: 0;\r\n    border-radius: 6px;\r\n    background-color: rgba(0, 0, 0, .1);\r\n}\r\n\r\ninput[type='search']:focus\r\n{\r\n    text-align: left;\r\n}\r\n\r\ntextarea\r\n{\r\n    height: auto;\r\n\r\n    resize: none;\r\n}\r\n\r\nselect\r\n{\r\n    font-size: 14px;\r\n\r\n    height: auto;\r\n    margin-top: 1px;\r\n\r\n    border: 0 !important;\r\n    background-color: #fff;\r\n}\r\nselect:focus\r\n{\r\n    -webkit-user-modify: read-only;\r\n}\r\n\r\n.mui-input-group\r\n{\r\n    position: relative;\r\n\r\n    padding: 0;\r\n\r\n    border: 0;\r\n    background-color: #fff;\r\n}\r\n.mui-input-group:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n.mui-input-group:before\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n\r\n.mui-input-group input,\r\n.mui-input-group textarea\r\n{\r\n    margin-bottom: 0;\r\n\r\n    border: 0;\r\n    border-radius: 0;\r\n    background-color: transparent;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n}\r\n\r\n.mui-input-group input[type='search']\r\n{\r\n    background: none;\r\n}\r\n\r\n.mui-input-group input:last-child\r\n{\r\n    background-image: none;\r\n}\r\n\r\n.mui-input-row\r\n{\r\n    clear: left;\r\n    overflow: hidden;\r\n}\r\n.mui-input-row select\r\n{\r\n    font-size: 17px;\r\n\r\n    height: 37px;\r\n    padding: 0;\r\n}\r\n\r\n.mui-input-row:last-child,\r\n.mui-input-row label + input, .mui-input-row .mui-btn + input\r\n{\r\n    background: none;\r\n}\r\n\r\n.mui-input-group .mui-input-row\r\n{\r\n    height: 40px;\r\n}\r\n.mui-input-group .mui-input-row:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 15px;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n\r\n.mui-input-row label\r\n{\r\n    font-family: 'Helvetica Neue', Helvetica, sans-serif;\r\n    line-height: 1.1;\r\n\r\n    float: left;\r\n\r\n    width: 35%;\r\n    padding: 11px 15px;\r\n}\r\n\r\n.mui-input-row label ~ input, .mui-input-row label ~ select, .mui-input-row label ~ textarea\r\n{\r\n    float: right;\r\n\r\n    width: 65%;\r\n    margin-bottom: 0;\r\n    padding-left: 0;\r\n\r\n    border: 0;\r\n}\r\n\r\n.mui-input-row .mui-btn\r\n{\r\n    line-height: 1.1;\r\n\r\n    float: right;\r\n\r\n    width: 15%;\r\n    padding: 10px 15px;\r\n}\r\n\r\n.mui-input-row .mui-btn ~ input, .mui-input-row .mui-btn ~ select, .mui-input-row .mui-btn ~ textarea\r\n{\r\n    float: left;\r\n\r\n    width: 85%;\r\n    margin-bottom: 0;\r\n    padding-left: 0;\r\n\r\n    border: 0;\r\n}\r\n\r\n.mui-button-row\r\n{\r\n    position: relative;\r\n\r\n    padding-top: 5px;\r\n\r\n    text-align: center;\r\n}\r\n\r\n.mui-input-group .mui-button-row\r\n{\r\n    height: 45px;\r\n}\r\n\r\n.mui-input-row\r\n{\r\n    position: relative;\r\n}\r\n.mui-input-row.mui-input-range\r\n{\r\n    overflow: visible;\r\n\r\n    padding-right: 20px;\r\n}\r\n.mui-input-row .mui-inline\r\n{\r\n    padding: 8px 0;\r\n}\r\n.mui-input-row .mui-input-clear ~ .mui-icon-clear, .mui-input-row .mui-input-speech ~ .mui-icon-speech, .mui-input-row .mui-input-password ~ .mui-icon-eye\r\n{\r\n    font-size: 20px;\r\n\r\n    position: absolute;\r\n    z-index: 1;\r\n    top: 10px;\r\n    right: 0;\r\n\r\n    width: 38px;\r\n    height: 38px;\r\n\r\n    text-align: center;\r\n\r\n    color: #999;\r\n}\r\n.mui-input-row .mui-input-clear ~ .mui-icon-clear.mui-active, .mui-input-row .mui-input-speech ~ .mui-icon-speech.mui-active, .mui-input-row .mui-input-password ~ .mui-icon-eye.mui-active\r\n{\r\n    color: #007aff;\r\n}\r\n.mui-input-row .mui-input-speech ~ .mui-icon-speech\r\n{\r\n    font-size: 24px;\r\n\r\n    top: 8px;\r\n}\r\n.mui-input-row .mui-input-clear ~ .mui-icon-clear ~ .mui-icon-speech\r\n{\r\n    display: none;\r\n}\r\n.mui-input-row .mui-input-clear ~ .mui-icon-clear.mui-hidden ~ .mui-icon-speech\r\n{\r\n    display: inline-block;\r\n}\r\n.mui-input-row .mui-icon-speech ~ .mui-placeholder\r\n{\r\n    right: 38px;\r\n}\r\n.mui-input-row.mui-search .mui-icon-clear\r\n{\r\n    top: 7px;\r\n}\r\n.mui-input-row.mui-search .mui-icon-speech\r\n{\r\n    top: 5px;\r\n}\r\n\r\n.mui-radio, .mui-checkbox\r\n{\r\n    position: relative;\r\n}\r\n.mui-radio label, .mui-checkbox label\r\n{\r\n    display: inline-block;\r\n    float: none;\r\n\r\n    width: 100%;\r\n    padding-right: 58px;\r\n}\r\n\r\n.mui-radio.mui-left input[type='radio'], .mui-checkbox.mui-left input[type='checkbox']\r\n{\r\n    left: 20px;\r\n}\r\n\r\n.mui-radio.mui-left label, .mui-checkbox.mui-left label\r\n{\r\n    padding-right: 15px;\r\n    padding-left: 58px;\r\n}\r\n\r\n.mui-radio input[type='radio'], .mui-checkbox input[type='checkbox']\r\n{\r\n    position: absolute;\r\n    top: 4px;\r\n    right: 20px;\r\n\r\n    display: inline-block;\r\n\r\n    width: 28px;\r\n    height: 26px;\r\n\r\n    border: 0;\r\n    outline: 0 !important;\r\n    background-color: transparent;\r\n\r\n    -webkit-appearance: none;\r\n}\r\n.mui-radio input[type='radio'][disabled]:before, .mui-checkbox input[type='checkbox'][disabled]:before\r\n{\r\n    opacity: .3;\r\n}\r\n.mui-radio input[type='radio']:before, .mui-checkbox input[type='checkbox']:before\r\n{\r\n    font-family: Muiicons;\r\n    font-size: 28px;\r\n    font-weight: normal;\r\n    line-height: 1;\r\n\r\n    text-decoration: none;\r\n\r\n    color: #aaa;\r\n    border-radius: 0;\r\n    background: none;\r\n\r\n    -webkit-font-smoothing: antialiased;\r\n}\r\n.mui-radio input[type='radio']:checked:before, .mui-checkbox input[type='checkbox']:checked:before\r\n{\r\n    color: #007aff;\r\n}\r\n\r\n.mui-radio.mui-disabled label, .mui-radio label.mui-disabled, .mui-checkbox.mui-disabled label, .mui-checkbox label.mui-disabled\r\n{\r\n    opacity: .4;\r\n}\r\n\r\n.mui-radio input[type='radio']:before\r\n{\r\n    content: '\\E411';\r\n}\r\n\r\n.mui-radio input[type='radio']:checked:before\r\n{\r\n    content: '\\E441';\r\n}\r\n\r\n.mui-checkbox input[type='checkbox']:before\r\n{\r\n    content: '\\E411';\r\n}\r\n\r\n.mui-checkbox input[type='checkbox']:checked:before\r\n{\r\n    content: '\\E442';\r\n}\r\n\r\n.mui-select\r\n{\r\n    position: relative;\r\n}\r\n\r\n.mui-select:before\r\n{\r\n    font-family: Muiicons;\r\n\r\n    position: absolute;\r\n    top: 8px;\r\n    right: 21px;\r\n\r\n    content: '\\E581';\r\n\r\n    color: rgba(170, 170, 170, .6);\r\n}\r\n\r\n.mui-input-row .mui-switch\r\n{\r\n    float: right;\r\n\r\n    margin-top: 5px;\r\n    margin-right: 20px;\r\n}\r\n\r\n.mui-input-range\r\n{\r\n  /*input[type=\"range\"] {\r\n      -webkit-appearance: none;\r\n      background: #999;\r\n      height: 36px;\r\n      border-radius: 1px;\r\n      overflow: hidden;\r\n      margin-top: 2px;\r\n      margin-bottom: 2px;\r\n      outline:none;\r\n      position:relative;\r\n      width:100%;\r\n  }*/\r\n  /*input[type='range']::-webkit-slider-thumb {\r\n      -webkit-appearance: none!important;\r\n      opacity: 0.5;\r\n      height:28px;\r\n      width:28px;\r\n      border-radius: 50%;\r\n      background:#00b7fb;\r\n      position: relative;\r\n      pointer-events: none;\r\n      -webkit-box-sizing: border-box;\r\n      box-sizing: border-box;\r\n      &:before{\r\n          position: absolute;\r\n          top: 13px;\r\n          left: -2000px;\r\n          width: 2000px;\r\n          height: 2px;\r\n          background: #00b7fb;\r\n          content:' ';\r\n      }\r\n  }*/\r\n}\r\n.mui-input-range input[type='range']\r\n{\r\n    position: relative;\r\n\r\n    width: 100%;\r\n    height: 2px;\r\n    margin: 17px 0;\r\n    padding: 0;\r\n\r\n    cursor: pointer;\r\n\r\n    border: 0;\r\n    border-radius: 3px;\r\n    outline: none;\r\n    background-color: #999;\r\n\r\n    -webkit-appearance: none !important;\r\n}\r\n.mui-input-range input[type='range']::-webkit-slider-thumb\r\n{\r\n    width: 28px;\r\n    height: 28px;\r\n\r\n    border-color: #0062cc;\r\n    border-radius: 50%;\r\n    background-color: #007aff;\r\n    background-clip: padding-box;\r\n\r\n    -webkit-appearance: none !important;\r\n}\r\n.mui-input-range label ~ input[type='range']\r\n{\r\n    width: 65%;\r\n}\r\n.mui-input-range .mui-tooltip\r\n{\r\n    font-size: 36px;\r\n    line-height: 64px;\r\n\r\n    position: absolute;\r\n    z-index: 1;\r\n    top: -70px;\r\n\r\n    width: 64px;\r\n    height: 64px;\r\n\r\n    text-align: center;\r\n\r\n    opacity: .8;\r\n    color: #333;\r\n    border: 1px solid #ddd;\r\n    border-radius: 6px;\r\n    background-color: #fff;\r\n    text-shadow: 0 1px 0 #f3f3f3;\r\n}\r\n\r\n.mui-search\r\n{\r\n    position: relative;\r\n}\r\n.mui-search input[type='search']\r\n{\r\n    padding-left: 30px;\r\n}\r\n.mui-search .mui-placeholder\r\n{\r\n    font-size: 16px;\r\n    line-height: 34px;\r\n\r\n    position: absolute;\r\n    z-index: 1;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    display: inline-block;\r\n\r\n    height: 34px;\r\n\r\n    text-align: center;\r\n\r\n    color: #999;\r\n    border: 0;\r\n    border-radius: 6px;\r\n    background: none;\r\n}\r\n.mui-search .mui-placeholder .mui-icon\r\n{\r\n    font-size: 20px;\r\n\r\n    color: #333;\r\n}\r\n.mui-search:before\r\n{\r\n    font-family: Muiicons;\r\n    font-size: 20px;\r\n    font-weight: normal;\r\n\r\n    position: absolute;\r\n    top: 50%;\r\n    right: 50%;\r\n\r\n    display: none;\r\n\r\n    margin-top: -18px;\r\n    margin-right: 31px;\r\n\r\n    content: '\\E466';\r\n}\r\n.mui-search.mui-active:before\r\n{\r\n    font-size: 20px;\r\n\r\n    right: auto;\r\n    left: 5px;\r\n\r\n    display: block;\r\n\r\n    margin-right: 0;\r\n}\r\n.mui-search.mui-active input[type='search']\r\n{\r\n    text-align: left;\r\n}\r\n.mui-search.mui-active .mui-placeholder\r\n{\r\n    display: none;\r\n}\r\n\r\n.mui-segmented-control\r\n{\r\n    font-size: 15px;\r\n    font-weight: 400;\r\n\r\n    position: relative;\r\n\r\n    display: table;\r\n    overflow: hidden;\r\n\r\n    width: 100%;\r\n\r\n    table-layout: fixed;\r\n\r\n    border: 1px solid #007aff;\r\n    border-radius: 3px;\r\n    background-color: transparent;\r\n\r\n    -webkit-touch-callout: none;\r\n}\r\n.mui-segmented-control.mui-segmented-control-vertical\r\n{\r\n    border-collapse: collapse;\r\n\r\n    border-width: 0;\r\n    border-radius: 0;\r\n}\r\n.mui-segmented-control.mui-segmented-control-vertical .mui-control-item\r\n{\r\n    display: block;\r\n\r\n    border-bottom: 1px solid #c8c7cc;\r\n    border-left-width: 0;\r\n}\r\n.mui-segmented-control.mui-scroll-wrapper\r\n{\r\n    height: 38px;\r\n}\r\n.mui-segmented-control.mui-scroll-wrapper .mui-scroll\r\n{\r\n    width: auto;\r\n    height: 40px;\r\n\r\n    white-space: nowrap;\r\n}\r\n.mui-segmented-control.mui-scroll-wrapper .mui-control-item\r\n{\r\n    display: inline-block;\r\n\r\n    width: auto;\r\n    padding: 0 20px;\r\n\r\n    border: 0;\r\n}\r\n.mui-segmented-control .mui-control-item\r\n{\r\n    line-height: 38px;\r\n\r\n    display: table-cell;\r\n    overflow: hidden;\r\n\r\n    width: 1%;\r\n\r\n    -webkit-transition: background-color .1s linear;\r\n            transition: background-color .1s linear;\r\n    text-align: center;\r\n    white-space: nowrap;\r\n    text-overflow: ellipsis;\r\n\r\n    color: #007aff;\r\n    border-color: #007aff;\r\n    border-left: 1px solid #007aff;\r\n}\r\n.mui-segmented-control .mui-control-item:first-child\r\n{\r\n    border-left-width: 0;\r\n}\r\n.mui-segmented-control .mui-control-item.mui-active\r\n{\r\n    color: #fff;\r\n    background-color: #007aff;\r\n}\r\n.mui-segmented-control.mui-segmented-control-inverted\r\n{\r\n    width: 100%;\r\n\r\n    border: 0;\r\n    border-radius: 0;\r\n}\r\n.mui-segmented-control.mui-segmented-control-inverted.mui-segmented-control-vertical .mui-control-item\r\n{\r\n    border-bottom: 1px solid #c8c7cc;\r\n}\r\n.mui-segmented-control.mui-segmented-control-inverted.mui-segmented-control-vertical .mui-control-item.mui-active\r\n{\r\n    border-bottom: 1px solid #c8c7cc;\r\n}\r\n.mui-segmented-control.mui-segmented-control-inverted .mui-control-item\r\n{\r\n    color: inherit;\r\n    border: 0;\r\n}\r\n.mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active\r\n{\r\n    color: #007aff;\r\n    border-bottom: 2px solid #007aff;\r\n    background: none;\r\n}\r\n.mui-segmented-control.mui-segmented-control-inverted ~ .mui-slider-progress-bar\r\n{\r\n    background-color: #007aff;\r\n}\r\n\r\n.mui-segmented-control-positive\r\n{\r\n    border: 1px solid #4cd964;\r\n}\r\n.mui-segmented-control-positive .mui-control-item\r\n{\r\n    color: #4cd964;\r\n    border-color: inherit;\r\n}\r\n.mui-segmented-control-positive .mui-control-item.mui-active\r\n{\r\n    color: #fff;\r\n    background-color: #4cd964;\r\n}\r\n.mui-segmented-control-positive.mui-segmented-control-inverted .mui-control-item.mui-active\r\n{\r\n    color: #4cd964;\r\n    border-bottom: 2px solid #4cd964;\r\n    background: none;\r\n}\r\n.mui-segmented-control-positive.mui-segmented-control-inverted ~ .mui-slider-progress-bar\r\n{\r\n    background-color: #4cd964;\r\n}\r\n\r\n.mui-segmented-control-negative\r\n{\r\n    border: 1px solid #dd524d;\r\n}\r\n.mui-segmented-control-negative .mui-control-item\r\n{\r\n    color: #dd524d;\r\n    border-color: inherit;\r\n}\r\n.mui-segmented-control-negative .mui-control-item.mui-active\r\n{\r\n    color: #fff;\r\n    background-color: #dd524d;\r\n}\r\n.mui-segmented-control-negative.mui-segmented-control-inverted .mui-control-item.mui-active\r\n{\r\n    color: #dd524d;\r\n    border-bottom: 2px solid #dd524d;\r\n    background: none;\r\n}\r\n.mui-segmented-control-negative.mui-segmented-control-inverted ~ .mui-slider-progress-bar\r\n{\r\n    background-color: #dd524d;\r\n}\r\n\r\n.mui-control-content\r\n{\r\n    position: relative;\r\n\r\n    display: none;\r\n}\r\n.mui-control-content.mui-active\r\n{\r\n    display: block;\r\n}\r\n\r\n.mui-popover\r\n{\r\n    position: absolute;\r\n    z-index: 999;\r\n\r\n    display: none;\r\n\r\n    width: 280px;\r\n\r\n    -webkit-transition: opacity .3s;\r\n            transition: opacity .3s;\r\n    -webkit-transition-property: opacity;\r\n            transition-property: opacity;\r\n    -webkit-transform: none;\r\n            transform: none;\r\n\r\n    opacity: 0;\r\n    border-radius: 7px;\r\n    background-color: #f7f7f7;\r\n    -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, .1);\r\n            box-shadow: 0 0 15px rgba(0, 0, 0, .1);\r\n}\r\n.mui-popover .mui-popover-arrow\r\n{\r\n    position: absolute;\r\n    z-index: 1000;\r\n    top: -25px;\r\n    left: 0;\r\n\r\n    overflow: hidden;\r\n\r\n    width: 26px;\r\n    height: 26px;\r\n}\r\n.mui-popover .mui-popover-arrow:after\r\n{\r\n    position: absolute;\r\n    top: 19px;\r\n    left: 0;\r\n\r\n    width: 26px;\r\n    height: 26px;\r\n\r\n    content: ' ';\r\n    -webkit-transform: rotate(45deg);\r\n            transform: rotate(45deg);\r\n\r\n    border-radius: 3px;\r\n    background: #f7f7f7;\r\n}\r\n.mui-popover .mui-popover-arrow.mui-bottom\r\n{\r\n    top: 100%;\r\n    left: -26px;\r\n\r\n    margin-top: -1px;\r\n}\r\n.mui-popover .mui-popover-arrow.mui-bottom:after\r\n{\r\n    top: -19px;\r\n    left: 0;\r\n}\r\n.mui-popover.mui-popover-action\r\n{\r\n    bottom: 0;\r\n\r\n    width: 100%;\r\n\r\n    -webkit-transition: -webkit-transform .3s, opacity .3s;\r\n            transition:         transform .3s, opacity .3s;\r\n    -webkit-transform: translate3d(0, 100%, 0);\r\n            transform: translate3d(0, 100%, 0);\r\n\r\n    border-radius: 0;\r\n    background: none;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n}\r\n.mui-popover.mui-popover-action .mui-popover-arrow\r\n{\r\n    display: none;\r\n}\r\n.mui-popover.mui-popover-action.mui-popover-bottom\r\n{\r\n    position: fixed;\r\n}\r\n.mui-popover.mui-popover-action.mui-active\r\n{\r\n    -webkit-transform: translate3d(0, 0, 0);\r\n            transform: translate3d(0, 0, 0);\r\n}\r\n.mui-popover.mui-popover-action .mui-table-view\r\n{\r\n    margin: 8px;\r\n\r\n    text-align: center;\r\n\r\n    color: #007aff;\r\n    border-radius: 4px;\r\n}\r\n.mui-popover.mui-popover-action .mui-table-view .mui-table-view-cell:after\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n\r\n    background-color: #c8c7cc;\r\n}\r\n.mui-popover.mui-popover-action .mui-table-view small\r\n{\r\n    font-weight: 400;\r\n    line-height: 1.3;\r\n\r\n    display: block;\r\n}\r\n.mui-popover.mui-active\r\n{\r\n    display: block;\r\n\r\n    opacity: 1;\r\n}\r\n.mui-popover .mui-bar ~ .mui-table-view\r\n{\r\n    padding-top: 44px;\r\n}\r\n\r\n.mui-backdrop\r\n{\r\n    position: fixed;\r\n    z-index: 998;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    background-color: rgba(0, 0, 0, .3);\r\n}\r\n\r\n.mui-bar-backdrop.mui-backdrop\r\n{\r\n    bottom: 50px;\r\n\r\n    background: none;\r\n}\r\n\r\n.mui-backdrop-action.mui-backdrop\r\n{\r\n    background-color: rgba(0, 0, 0, .3);\r\n}\r\n\r\n.mui-bar-backdrop.mui-backdrop, .mui-backdrop-action.mui-backdrop\r\n{\r\n    opacity: 0;\r\n}\r\n.mui-bar-backdrop.mui-backdrop.mui-active, .mui-backdrop-action.mui-backdrop.mui-active\r\n{\r\n    -webkit-transition: all .4s ease;\r\n            transition: all .4s ease;\r\n\r\n    opacity: 1;\r\n}\r\n\r\n.mui-popover .mui-btn-block\r\n{\r\n    margin-bottom: 5px;\r\n}\r\n.mui-popover .mui-btn-block:last-child\r\n{\r\n    margin-bottom: 0;\r\n}\r\n\r\n.mui-popover .mui-bar\r\n{\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n}\r\n\r\n.mui-popover .mui-bar-nav\r\n{\r\n    border-bottom: 1px solid rgba(0, 0, 0, .15);\r\n    border-top-left-radius: 12px;\r\n    border-top-right-radius: 12px;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n}\r\n\r\n.mui-popover .mui-scroll-wrapper\r\n{\r\n    margin: 7px 0;\r\n\r\n    border-radius: 7px;\r\n    background-clip: padding-box;\r\n}\r\n\r\n.mui-popover .mui-scroll .mui-table-view\r\n{\r\n    max-height: none;\r\n}\r\n\r\n.mui-popover .mui-table-view\r\n{\r\n    overflow: auto;\r\n\r\n    max-height: 300px;\r\n    margin-bottom: 0;\r\n\r\n    border-radius: 7px;\r\n    background-color: #f7f7f7;\r\n    background-image: none;\r\n\r\n    -webkit-overflow-scrolling: touch;\r\n}\r\n.mui-popover .mui-table-view:before, .mui-popover .mui-table-view:after\r\n{\r\n    height: 0;\r\n}\r\n.mui-popover .mui-table-view .mui-table-view-cell:first-child,\r\n.mui-popover .mui-table-view .mui-table-view-cell:first-child > a:not(.mui-btn)\r\n{\r\n    border-top-left-radius: 12px;\r\n    border-top-right-radius: 12px;\r\n}\r\n.mui-popover .mui-table-view .mui-table-view-cell:last-child,\r\n.mui-popover .mui-table-view .mui-table-view-cell:last-child > a:not(.mui-btn)\r\n{\r\n    border-bottom-right-radius: 12px;\r\n    border-bottom-left-radius: 12px;\r\n}\r\n\r\n.mui-popover.mui-bar-popover .mui-table-view\r\n{\r\n    width: 106px;\r\n}\r\n.mui-popover.mui-bar-popover .mui-table-view .mui-table-view-cell\r\n{\r\n    padding: 11px 15px 11px 15px;\r\n\r\n    background-position: 0 100%;\r\n}\r\n.mui-popover.mui-bar-popover .mui-table-view .mui-table-view-cell > a:not(.mui-btn)\r\n{\r\n    margin: -11px -15px -11px -15px;\r\n}\r\n\r\n.mui-popup-backdrop\r\n{\r\n    position: fixed;\r\n    z-index: 998;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    -webkit-transition-duration: 400ms;\r\n            transition-duration: 400ms;\r\n\r\n    opacity: 0;\r\n    background: rgba(0, 0, 0, .4);\r\n}\r\n.mui-popup-backdrop.mui-active\r\n{\r\n    opacity: 1;\r\n}\r\n\r\n.mui-popup\r\n{\r\n    position: fixed;\r\n    z-index: 10000;\r\n    top: 50%;\r\n    left: 50%;\r\n\r\n    display: none;\r\n    overflow: hidden;\r\n\r\n    width: 270px;\r\n\r\n    -webkit-transition-property: -webkit-transform,opacity;\r\n            transition-property:         transform,opacity;\r\n    -webkit-transform: translate3d(-50%, -50%, 0) scale(1.185);\r\n            transform: translate3d(-50%, -50%, 0) scale(1.185);\r\n    text-align: center;\r\n\r\n    opacity: 0;\r\n    color: #000;\r\n    border-radius: 13px;\r\n}\r\n.mui-popup.mui-popup-in\r\n{\r\n    display: block;\r\n\r\n    -webkit-transition-duration: 400ms;\r\n            transition-duration: 400ms;\r\n    -webkit-transform: translate3d(-50%, -50%, 0) scale(1);\r\n            transform: translate3d(-50%, -50%, 0) scale(1);\r\n\r\n    opacity: 1;\r\n}\r\n.mui-popup.mui-popup-out\r\n{\r\n    -webkit-transition-duration: 400ms;\r\n            transition-duration: 400ms;\r\n    -webkit-transform: translate3d(-50%, -50%, 0) scale(1);\r\n            transform: translate3d(-50%, -50%, 0) scale(1);\r\n\r\n    opacity: 0;\r\n}\r\n\r\n.mui-popup-inner\r\n{\r\n    position: relative;\r\n\r\n    padding: 15px;\r\n\r\n    border-radius: 13px 13px 0 0;\r\n    background: rgba(255, 255, 255, .95);\r\n}\r\n.mui-popup-inner:after\r\n{\r\n    position: absolute;\r\n    z-index: 15;\r\n    top: auto;\r\n    right: auto;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    display: block;\r\n\r\n    width: 100%;\r\n    height: 1px;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleY(.5);\r\n            transform: scaleY(.5);\r\n    -webkit-transform-origin: 50% 100%;\r\n            transform-origin: 50% 100%;\r\n\r\n    background-color: rgba(0, 0, 0, .2);\r\n}\r\n\r\n.mui-popup-title\r\n{\r\n    font-size: 18px;\r\n    font-weight: 500;\r\n\r\n    text-align: center;\r\n}\r\n\r\n.mui-popup-title + .mui-popup-text\r\n{\r\n    font-family: inherit;\r\n    font-size: 14px;\r\n\r\n    margin: 5px 0 0;\r\n}\r\n\r\n.mui-popup-buttons\r\n{\r\n    position: relative;\r\n\r\n    display: -webkit-box;\r\n    display: -webkit-flex;\r\n    display:         flex;\r\n\r\n    height: 44px;\r\n\r\n    -webkit-box-pack: center;\r\n    -webkit-justify-content: center;\r\n            justify-content: center;\r\n}\r\n\r\n.mui-popup-button\r\n{\r\n    font-size: 17px;\r\n    line-height: 44px;\r\n\r\n    position: relative;\r\n\r\n    display: block;\r\n    overflow: hidden;\r\n\r\n    box-sizing: border-box;\r\n    width: 100%;\r\n    height: 44px;\r\n    padding: 0 5px;\r\n\r\n    cursor: pointer;\r\n    text-align: center;\r\n    white-space: nowrap;\r\n    text-overflow: ellipsis;\r\n\r\n    color: #007aff;\r\n    background: rgba(255, 255, 255, .95);\r\n\r\n    -webkit-box-flex: 1;\r\n}\r\n.mui-popup-button:after\r\n{\r\n    position: absolute;\r\n    z-index: 15;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: auto;\r\n    left: auto;\r\n\r\n    display: block;\r\n\r\n    width: 1px;\r\n    height: 100%;\r\n\r\n    content: '';\r\n    -webkit-transform: scaleX(.5);\r\n            transform: scaleX(.5);\r\n    -webkit-transform-origin: 100% 50%;\r\n            transform-origin: 100% 50%;\r\n\r\n    background-color: rgba(0, 0, 0, .2);\r\n}\r\n.mui-popup-button:first-child\r\n{\r\n    border-radius: 0 0 0 13px;\r\n}\r\n.mui-popup-button:first-child:last-child\r\n{\r\n    border-radius: 0 0 13px 13px;\r\n}\r\n.mui-popup-button:last-child\r\n{\r\n    border-radius: 0 0 13px 0;\r\n}\r\n.mui-popup-button:last-child:after\r\n{\r\n    display: none;\r\n}\r\n.mui-popup-button.mui-popup-button-bold\r\n{\r\n    font-weight: 600;\r\n}\r\n\r\n.mui-popup-input input\r\n{\r\n    font-size: 14px;\r\n\r\n    width: 100%;\r\n    height: 26px;\r\n    margin: 15px 0 0;\r\n    padding: 0 5px;\r\n\r\n    border: 1px solid rgba(0, 0, 0, .3);\r\n    border-radius: 0;\r\n    background: #fff;\r\n}\r\n\r\n.mui-plus.mui-android .mui-popup-backdrop\r\n{\r\n    -webkit-transition-duration: 1ms;\r\n            transition-duration: 1ms;\r\n}\r\n\r\n.mui-plus.mui-android .mui-popup\r\n{\r\n    -webkit-transition-duration: 1ms;\r\n            transition-duration: 1ms;\r\n    -webkit-transform: translate3d(-50%, -50%, 0) scale(1);\r\n            transform: translate3d(-50%, -50%, 0) scale(1);\r\n}\r\n\r\n/* === Progress Bar === */\r\n.mui-progressbar\r\n{\r\n    position: relative;\r\n\r\n    display: block;\r\n    overflow: hidden;\r\n\r\n    width: 100%;\r\n    height: 2px;\r\n\r\n    -webkit-transform-origin: center top;\r\n            transform-origin: center top;\r\n    vertical-align: middle;\r\n\r\n    border-radius: 2px;\r\n    background: #b6b6b6;\r\n\r\n    -webkit-transform-style: preserve-3d;\r\n            transform-style: preserve-3d;\r\n}\r\n.mui-progressbar span\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n    -webkit-transition: 150ms;\r\n            transition: 150ms;\r\n    -webkit-transform: translate3d(-100%, 0, 0);\r\n            transform: translate3d(-100%, 0, 0);\r\n\r\n    background: #007aff;\r\n}\r\n.mui-progressbar.mui-progressbar-infinite:before\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n    content: '';\r\n    -webkit-transform: translate3d(0, 0, 0);\r\n            transform: translate3d(0, 0, 0);\r\n    -webkit-transform-origin: left center;\r\n            transform-origin: left center;\r\n    -webkit-animation: mui-progressbar-infinite 1s linear infinite;\r\n            animation: mui-progressbar-infinite 1s linear infinite;\r\n\r\n    background: #007aff;\r\n}\r\n\r\nbody > .mui-progressbar\r\n{\r\n    position: absolute;\r\n    z-index: 10000;\r\n    top: 44px;\r\n    left: 0;\r\n\r\n    border-radius: 0;\r\n}\r\n\r\n.mui-progressbar-in\r\n{\r\n    -webkit-animation: mui-progressbar-in 300ms forwards;\r\n            animation: mui-progressbar-in 300ms forwards;\r\n}\r\n\r\n.mui-progressbar-out\r\n{\r\n    -webkit-animation: mui-progressbar-out 300ms forwards;\r\n            animation: mui-progressbar-out 300ms forwards;\r\n}\r\n\r\n@-webkit-keyframes mui-progressbar-in\r\n{\r\n    from\r\n    {\r\n        -webkit-transform: scaleY(0);\r\n\r\n        opacity: 0;\r\n    }\r\n\r\n    to\r\n    {\r\n        -webkit-transform: scaleY(1);\r\n\r\n        opacity: 1;\r\n    }\r\n}\r\n@keyframes mui-progressbar-in\r\n{\r\n    from\r\n    {\r\n        transform: scaleY(0);\r\n\r\n        opacity: 0;\r\n    }\r\n\r\n    to\r\n    {\r\n        transform: scaleY(1);\r\n\r\n        opacity: 1;\r\n    }\r\n}\r\n@-webkit-keyframes mui-progressbar-out\r\n{\r\n    from\r\n    {\r\n        -webkit-transform: scaleY(1);\r\n\r\n        opacity: 1;\r\n    }\r\n\r\n    to\r\n    {\r\n        -webkit-transform: scaleY(0);\r\n\r\n        opacity: 0;\r\n    }\r\n}\r\n@keyframes mui-progressbar-out\r\n{\r\n    from\r\n    {\r\n        transform: scaleY(1);\r\n\r\n        opacity: 1;\r\n    }\r\n\r\n    to\r\n    {\r\n        transform: scaleY(0);\r\n\r\n        opacity: 0;\r\n    }\r\n}\r\n@-webkit-keyframes mui-progressbar-infinite\r\n{\r\n    0%\r\n    {\r\n        -webkit-transform: translate3d(-50%, 0, 0) scaleX(.5);\r\n    }\r\n\r\n    100%\r\n    {\r\n        -webkit-transform: translate3d(100%, 0, 0) scaleX(.5);\r\n    }\r\n}\r\n@keyframes mui-progressbar-infinite\r\n{\r\n    0%\r\n    {\r\n        transform: translate3d(-50%, 0, 0) scaleX(.5);\r\n    }\r\n\r\n    100%\r\n    {\r\n        transform: translate3d(100%, 0, 0) scaleX(.5);\r\n    }\r\n}\r\n.mui-pagination\r\n{\r\n    display: inline-block;\r\n\r\n    margin: 0 auto;\r\n    padding-left: 0;\r\n\r\n    border-radius: 6px;\r\n}\r\n.mui-pagination > li\r\n{\r\n    display: inline;\r\n}\r\n.mui-pagination > li > a,\r\n.mui-pagination > li > span\r\n{\r\n    line-height: 1.428571429;\r\n\r\n    position: relative;\r\n\r\n    float: left;\r\n\r\n    margin-left: -1px;\r\n    padding: 6px 12px;\r\n\r\n    text-decoration: none;\r\n\r\n    color: #007aff;\r\n    border: 1px solid #ddd;\r\n    background-color: #fff;\r\n}\r\n.mui-pagination > li:first-child > a,\r\n.mui-pagination > li:first-child > span\r\n{\r\n    margin-left: 0;\r\n\r\n    border-top-left-radius: 6px;\r\n    border-bottom-left-radius: 6px;\r\n    background-clip: padding-box;\r\n}\r\n.mui-pagination > li:last-child > a,\r\n.mui-pagination > li:last-child > span\r\n{\r\n    border-top-right-radius: 6px;\r\n    border-bottom-right-radius: 6px;\r\n    background-clip: padding-box;\r\n}\r\n.mui-pagination > li:active > a, .mui-pagination > li:active > a:active,\r\n.mui-pagination > li:active > span,\r\n.mui-pagination > li:active > span:active,\r\n.mui-pagination > li.mui-active > a,\r\n.mui-pagination > li.mui-active > a:active,\r\n.mui-pagination > li.mui-active > span,\r\n.mui-pagination > li.mui-active > span:active\r\n{\r\n    z-index: 2;\r\n\r\n    cursor: default;\r\n\r\n    color: #fff;\r\n    border-color: #007aff;\r\n    background-color: #007aff;\r\n}\r\n.mui-pagination > li.mui-disabled > span,\r\n.mui-pagination > li.mui-disabled > span:active,\r\n.mui-pagination > li.mui-disabled > a,\r\n.mui-pagination > li.mui-disabled > a:active\r\n{\r\n    opacity: .6;\r\n    color: #777;\r\n    border: 1px solid #ddd;\r\n    background-color: #fff;\r\n}\r\n\r\n.mui-pagination-lg > li > a,\r\n.mui-pagination-lg > li > span\r\n{\r\n    font-size: 18px;\r\n\r\n    padding: 10px 16px;\r\n}\r\n\r\n.mui-pagination-sm > li > a,\r\n.mui-pagination-sm > li > span\r\n{\r\n    font-size: 12px;\r\n\r\n    padding: 5px 10px;\r\n}\r\n\r\n.mui-pager\r\n{\r\n    padding-left: 0;\r\n\r\n    list-style: none;\r\n\r\n    text-align: center;\r\n}\r\n.mui-pager:before, .mui-pager:after\r\n{\r\n    display: table;\r\n\r\n    content: ' ';\r\n}\r\n.mui-pager:after\r\n{\r\n    clear: both;\r\n}\r\n.mui-pager li\r\n{\r\n    display: inline;\r\n}\r\n.mui-pager li > a,\r\n.mui-pager li > span\r\n{\r\n    display: inline-block;\r\n\r\n    padding: 5px 14px;\r\n\r\n    border: 1px solid #ddd;\r\n    border-radius: 6px;\r\n    background-color: #fff;\r\n    background-clip: padding-box;\r\n}\r\n.mui-pager li:active > a, .mui-pager li:active > span, .mui-pager li.mui-active > a, .mui-pager li.mui-active > span\r\n{\r\n    cursor: default;\r\n    text-decoration: none;\r\n\r\n    color: #fff;\r\n    border-color: #007aff;\r\n    background-color: #007aff;\r\n}\r\n.mui-pager .mui-next > a,\r\n.mui-pager .mui-next > span\r\n{\r\n    float: right;\r\n}\r\n.mui-pager .mui-previous > a,\r\n.mui-pager .mui-previous > span\r\n{\r\n    float: left;\r\n}\r\n.mui-pager .mui-disabled > a,\r\n.mui-pager .mui-disabled > a:active,\r\n.mui-pager .mui-disabled > span,\r\n.mui-pager .mui-disabled > span:active\r\n{\r\n    opacity: .6;\r\n    color: #777;\r\n    border: 1px solid #ddd;\r\n    background-color: #fff;\r\n}\r\n\r\n.mui-modal\r\n{\r\n    position: fixed;\r\n    z-index: 999;\r\n    top: 0;\r\n\r\n    overflow: hidden;\r\n\r\n    width: 100%;\r\n    min-height: 100%;\r\n\r\n    -webkit-transition: -webkit-transform .25s, opacity 1ms .25s;\r\n            transition:         transform .25s, opacity 1ms .25s;\r\n    -webkit-transition-timing-function: cubic-bezier(.1, .5, .1, 1);\r\n            transition-timing-function: cubic-bezier(.1, .5, .1, 1);\r\n    -webkit-transform: translate3d(0, 100%, 0);\r\n            transform: translate3d(0, 100%, 0);\r\n\r\n    opacity: 0;\r\n    background-color: #fff;\r\n}\r\n.mui-modal.mui-active\r\n{\r\n    height: 100%;\r\n\r\n    -webkit-transition: -webkit-transform .25s;\r\n            transition:         transform .25s;\r\n    -webkit-transition-timing-function: cubic-bezier(.1, .5, .1, 1);\r\n            transition-timing-function: cubic-bezier(.1, .5, .1, 1);\r\n    -webkit-transform: translate3d(0, 0, 0);\r\n            transform: translate3d(0, 0, 0);\r\n\r\n    opacity: 1;\r\n}\r\n\r\n.mui-android .mui-modal .mui-bar\r\n{\r\n    position: static;\r\n}\r\n\r\n.mui-android .mui-modal .mui-bar-nav ~ .mui-content\r\n{\r\n    padding-top: 0;\r\n}\r\n\r\n.mui-slider\r\n{\r\n    position: relative;\r\n    z-index: 1;\r\n\r\n    overflow: hidden;\r\n\r\n    width: 100%;\r\n}\r\n.mui-slider .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active\r\n{\r\n    border-bottom: 0;\r\n}\r\n.mui-slider .mui-segmented-control.mui-segmented-control-inverted ~ .mui-slider-group .mui-slider-item\r\n{\r\n    border-top: 1px solid #c8c7cc;\r\n    border-bottom: 1px solid #c8c7cc;\r\n}\r\n.mui-slider .mui-slider-group\r\n{\r\n    font-size: 0;\r\n\r\n    position: relative;\r\n\r\n    -webkit-transition: all 0s linear;\r\n            transition: all 0s linear;\r\n    white-space: nowrap;\r\n}\r\n.mui-slider .mui-slider-group .mui-slider-item\r\n{\r\n    font-size: 14px;\r\n\r\n    position: relative;\r\n\r\n    display: inline-block;\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n    vertical-align: top;\r\n    white-space: normal;\r\n}\r\n.mui-slider .mui-slider-group .mui-slider-item > a:not(.mui-control-item)\r\n{\r\n    line-height: 0;\r\n\r\n    position: relative;\r\n\r\n    display: block;\r\n}\r\n.mui-slider .mui-slider-group .mui-slider-item img\r\n{\r\n    width: 100%;\r\n}\r\n.mui-slider .mui-slider-group .mui-slider-item .mui-table-view:before, .mui-slider .mui-slider-group .mui-slider-item .mui-table-view:after\r\n{\r\n    height: 0;\r\n}\r\n.mui-slider .mui-slider-group.mui-slider-loop\r\n{\r\n    -webkit-transform: translate(-100%, 0px);\r\n            transform: translate(-100%, 0px);\r\n}\r\n\r\n.mui-slider-title\r\n{\r\n    line-height: 30px;\r\n\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    width: 100%;\r\n    height: 30px;\r\n    margin: 0;\r\n\r\n    text-align: left;\r\n    text-indent: 12px;\r\n\r\n    opacity: .8;\r\n    background-color: #000;\r\n}\r\n\r\n.mui-slider-indicator\r\n{\r\n    position: absolute;\r\n    bottom: 8px;\r\n\r\n    width: 100%;\r\n\r\n    text-align: center;\r\n\r\n    background: none;\r\n}\r\n.mui-slider-indicator.mui-segmented-control\r\n{\r\n    position: relative;\r\n    bottom: auto;\r\n}\r\n.mui-slider-indicator .mui-indicator\r\n{\r\n    display: inline-block;\r\n\r\n    width: 6px;\r\n    height: 6px;\r\n    margin: 1px 6px;\r\n\r\n    cursor: pointer;\r\n\r\n    border-radius: 50%;\r\n    background: #aaa;\r\n    -webkit-box-shadow: 0 0 1px 1px rgba(130, 130, 130, .7);\r\n            box-shadow: 0 0 1px 1px rgba(130, 130, 130, .7);\r\n}\r\n.mui-slider-indicator .mui-active.mui-indicator\r\n{\r\n    background: #fff;\r\n}\r\n.mui-slider-indicator .mui-icon\r\n{\r\n    font-size: 20px;\r\n    line-height: 30px;\r\n\r\n    width: 40px;\r\n    height: 30px;\r\n    margin: 3px;\r\n\r\n    text-align: center;\r\n\r\n    border: 1px solid #ddd;\r\n}\r\n.mui-slider-indicator .mui-number\r\n{\r\n    line-height: 32px;\r\n\r\n    display: inline-block;\r\n\r\n    width: 58px;\r\n}\r\n.mui-slider-indicator .mui-number span\r\n{\r\n    color: #ff5053;\r\n}\r\n\r\n.mui-slider-progress-bar\r\n{\r\n    z-index: 1;\r\n\r\n    height: 2px;\r\n\r\n    -webkit-transform: translateZ(0);\r\n            transform: translateZ(0);\r\n}\r\n\r\n.mui-switch\r\n{\r\n    position: relative;\r\n\r\n    display: block;\r\n\r\n    width: 74px;\r\n    height: 30px;\r\n\r\n    -webkit-transition-timing-function: ease-in-out;\r\n            transition-timing-function: ease-in-out;\r\n    -webkit-transition-duration: .2s;\r\n            transition-duration: .2s;\r\n    -webkit-transition-property: background-color, border;\r\n            transition-property: background-color, border;\r\n\r\n    border: 2px solid #ddd;\r\n    border-radius: 20px;\r\n    background-color: #fff;\r\n    background-clip: padding-box;\r\n}\r\n.mui-switch.mui-disabled\r\n{\r\n    opacity: .3;\r\n}\r\n.mui-switch .mui-switch-handle\r\n{\r\n    position: absolute;\r\n    z-index: 1;\r\n    top: -1px;\r\n    left: -1px;\r\n\r\n    width: 28px;\r\n    height: 28px;\r\n\r\n    -webkit-transition: .2s ease-in-out;\r\n            transition: .2s ease-in-out;\r\n    -webkit-transition-property: -webkit-transform, width,left;\r\n            transition-property:         transform, width,left;\r\n\r\n    border-radius: 16px;\r\n    background-color: #fff;\r\n    background-clip: padding-box;\r\n    -webkit-box-shadow: 0 2px 5px rgba(0, 0, 0, .4);\r\n            box-shadow: 0 2px 5px rgba(0, 0, 0, .4);\r\n}\r\n.mui-switch:before\r\n{\r\n    font-size: 13px;\r\n\r\n    position: absolute;\r\n    top: 3px;\r\n    right: 11px;\r\n\r\n    content: 'Off';\r\n    text-transform: uppercase;\r\n\r\n    color: #999;\r\n}\r\n.mui-switch.mui-dragging\r\n{\r\n    border-color: #f7f7f7;\r\n    background-color: #f7f7f7;\r\n}\r\n.mui-switch.mui-dragging .mui-switch-handle\r\n{\r\n    width: 38px;\r\n}\r\n.mui-switch.mui-dragging.mui-active .mui-switch-handle\r\n{\r\n    left: -11px;\r\n\r\n    width: 38px;\r\n}\r\n.mui-switch.mui-active\r\n{\r\n    border-color: #4cd964;\r\n    background-color: #4cd964;\r\n}\r\n.mui-switch.mui-active .mui-switch-handle\r\n{\r\n    -webkit-transform: translate(43px, 0);\r\n            transform: translate(43px, 0);\r\n}\r\n.mui-switch.mui-active:before\r\n{\r\n    right: auto;\r\n    left: 15px;\r\n\r\n    content: 'On';\r\n\r\n    color: #fff;\r\n}\r\n.mui-switch input[type='checkbox']\r\n{\r\n    display: none;\r\n}\r\n\r\n.mui-switch-mini\r\n{\r\n    width: 47px;\r\n}\r\n.mui-switch-mini:before\r\n{\r\n    display: none;\r\n}\r\n.mui-switch-mini.mui-active .mui-switch-handle\r\n{\r\n    -webkit-transform: translate(16px, 0);\r\n            transform: translate(16px, 0);\r\n}\r\n\r\n.mui-switch-blue.mui-active\r\n{\r\n    border: 2px solid #007aff;\r\n    background-color: #007aff;\r\n}\r\n\r\n.mui-content.mui-fade\r\n{\r\n    left: 0;\r\n\r\n    opacity: 0;\r\n}\r\n.mui-content.mui-fade.mui-in\r\n{\r\n    opacity: 1;\r\n}\r\n.mui-content.mui-sliding\r\n{\r\n    z-index: 2;\r\n\r\n    -webkit-transition: -webkit-transform .4s;\r\n            transition:         transform .4s;\r\n    -webkit-transform: translate3d(0, 0, 0);\r\n            transform: translate3d(0, 0, 0);\r\n}\r\n.mui-content.mui-sliding.mui-left\r\n{\r\n    z-index: 1;\r\n\r\n    -webkit-transform: translate3d(-100%, 0, 0);\r\n            transform: translate3d(-100%, 0, 0);\r\n}\r\n.mui-content.mui-sliding.mui-right\r\n{\r\n    z-index: 3;\r\n\r\n    -webkit-transform: translate3d(100%, 0, 0);\r\n            transform: translate3d(100%, 0, 0);\r\n}\r\n\r\n.mui-navigate-right:after,\r\n.mui-push-left:after,\r\n.mui-push-right:after\r\n{\r\n    font-family: Muiicons;\r\n    font-size: inherit;\r\n    line-height: 1;\r\n\r\n    position: absolute;\r\n    top: 50%;\r\n\r\n    display: inline-block;\r\n\r\n    -webkit-transform: translateY(-50%);\r\n            transform: translateY(-50%);\r\n    text-decoration: none;\r\n\r\n    color: #bbb;\r\n\r\n    -webkit-font-smoothing: antialiased;\r\n}\r\n\r\n.mui-push-left:after\r\n{\r\n    left: 15px;\r\n\r\n    content: '\\E582';\r\n}\r\n\r\n.mui-navigate-right:after,\r\n.mui-push-right:after\r\n{\r\n    right: 15px;\r\n\r\n    content: '\\E583';\r\n}\r\n\r\n.mui-pull-top-pocket, .mui-pull-bottom-pocket\r\n{\r\n    position: absolute;\r\n    left: 0;\r\n\r\n    display: block;\r\n    visibility: hidden;\r\n    overflow: hidden;\r\n\r\n    width: 100%;\r\n    height: 50px;\r\n}\r\n\r\n.mui-plus-pullrefresh .mui-pull-top-pocket, .mui-plus-pullrefresh .mui-pull-bottom-pocket\r\n{\r\n    display: none;\r\n    visibility: visible;\r\n}\r\n\r\n.mui-pull-top-pocket\r\n{\r\n    top: 0;\r\n}\r\n\r\n.mui-bar-nav ~ .mui-content .mui-pull-top-pocket\r\n{\r\n    top: 44px;\r\n}\r\n\r\n.mui-bar-nav ~ .mui-bar-header-secondary ~ .mui-content .mui-pull-top-pocket\r\n{\r\n    top: 88px;\r\n}\r\n\r\n.mui-pull-bottom-pocket\r\n{\r\n    position: relative;\r\n    bottom: 0;\r\n\r\n    height: 40px;\r\n}\r\n.mui-pull-bottom-pocket .mui-pull-loading\r\n{\r\n    visibility: hidden;\r\n}\r\n.mui-pull-bottom-pocket .mui-pull-loading.mui-in\r\n{\r\n    display: inline-block;\r\n}\r\n\r\n.mui-pull\r\n{\r\n    font-weight: bold;\r\n\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 10px;\r\n    left: 0;\r\n\r\n    text-align: center;\r\n\r\n    color: #777;\r\n}\r\n\r\n.mui-pull-loading\r\n{\r\n    margin-right: 10px;\r\n\r\n    -webkit-transition: -webkit-transform .4s;\r\n            transition:         transform .4s;\r\n    -webkit-transition-duration: 400ms;\r\n            transition-duration: 400ms;\r\n    vertical-align: middle;\r\n}\r\n\r\n.mui-pull-loading.mui-reverse\r\n{\r\n    -webkit-transform: rotate(180deg) translateZ(0);\r\n            transform: rotate(180deg) translateZ(0);\r\n}\r\n\r\n.mui-pull-caption\r\n{\r\n    font-size: 15px;\r\n    line-height: 24px;\r\n\r\n    position: relative;\r\n\r\n    display: inline-block;\r\n    overflow: visible;\r\n\r\n    margin-top: 0;\r\n\r\n    vertical-align: middle;\r\n}\r\n.mui-pull-caption span\r\n{\r\n    display: none;\r\n}\r\n.mui-pull-caption span.mui-in\r\n{\r\n    display: inline;\r\n}\r\n\r\n.mui-toast-container\r\n{\r\n    line-height: 17px;\r\n\r\n    position: fixed;\r\n    z-index: 9999;\r\n    bottom: 50px;\r\n    left: 50%;\r\n\r\n    -webkit-transition: opacity .3s;\r\n            transition: opacity .3s;\r\n    -webkit-transform: translate(-50%, 0);\r\n            transform: translate(-50%, 0);\r\n\r\n    opacity: 0;\r\n}\r\n.mui-toast-container.mui-active\r\n{\r\n    opacity: .9;\r\n}\r\n\r\n.mui-toast-message\r\n{\r\n    font-size: 14px;\r\n\r\n    padding: 10px 25px;\r\n\r\n    text-align: center;\r\n\r\n    color: #fff;\r\n    border-radius: 6px;\r\n    background-color: #323232;\r\n}\r\n\r\n.mui-numbox\r\n{\r\n    position: relative;\r\n\r\n    display: inline-block;\r\n    overflow: hidden;\r\n\r\n    width: 120px;\r\n    height: 35px;\r\n    padding: 0 40px 0 40px;\r\n\r\n    vertical-align: top;\r\n    vertical-align: middle;\r\n\r\n    border: solid 1px #bbb;\r\n    border-radius: 3px;\r\n    background-color: #efeff4;\r\n}\r\n.mui-numbox [class*=numbox-btn], .mui-numbox [class*=btn-numbox]\r\n{\r\n    font-size: 18px;\r\n    font-weight: normal;\r\n    line-height: 100%;\r\n\r\n    position: absolute;\r\n    top: 0;\r\n\r\n    overflow: hidden;\r\n\r\n    width: 40px;\r\n    height: 100%;\r\n    padding: 0;\r\n\r\n    color: #555;\r\n    border: none;\r\n    border-radius: 0;\r\n    background-color: #f9f9f9;\r\n}\r\n.mui-numbox [class*=numbox-btn]:active, .mui-numbox [class*=btn-numbox]:active\r\n{\r\n    background-color: #ccc;\r\n}\r\n.mui-numbox [class*=numbox-btn][disabled], .mui-numbox [class*=btn-numbox][disabled]\r\n{\r\n    color: #c0c0c0;\r\n}\r\n.mui-numbox .mui-numbox-btn-plus, .mui-numbox .mui-btn-numbox-plus\r\n{\r\n    right: 0;\r\n\r\n    border-top-right-radius: 3px;\r\n    border-bottom-right-radius: 3px;\r\n}\r\n.mui-numbox .mui-numbox-btn-minus, .mui-numbox .mui-btn-numbox-minus\r\n{\r\n    left: 0;\r\n\r\n    border-top-left-radius: 3px;\r\n    border-bottom-left-radius: 3px;\r\n}\r\n.mui-numbox .mui-numbox-input, .mui-numbox .mui-input-numbox\r\n{\r\n    display: inline-block;\r\n    overflow: hidden;\r\n\r\n    width: 100% !important;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0 3px !important;\r\n\r\n    text-align: center;\r\n    text-overflow: ellipsis;\r\n    word-break: normal;\r\n\r\n    border: none !important;\r\n    border-right: solid 1px #ccc !important;\r\n    border-left: solid 1px #ccc !important;\r\n    border-radius: 0 !important;\r\n}\r\n\r\n.mui-input-row .mui-numbox\r\n{\r\n    float: right;\r\n\r\n    margin: 2px 8px;\r\n}\r\n\r\n@font-face {\r\n    font-family: Muiicons;\r\n    font-weight: normal;\r\n    font-style: normal;\r\n\r\n    src: url(" + __webpack_require__(38) + ") format('truetype');\r\n}\r\n.mui-icon\r\n{\r\n    font-family: Muiicons;\r\n    font-size: 24px;\r\n    font-weight: normal;\r\n    font-style: normal;\r\n    line-height: 1;\r\n\r\n    display: inline-block;\r\n\r\n    text-decoration: none;\r\n\r\n    -webkit-font-smoothing: antialiased;\r\n}\r\n.mui-icon.mui-active\r\n{\r\n    color: #007aff;\r\n}\r\n.mui-icon.mui-right:before\r\n{\r\n    float: right;\r\n\r\n    padding-left: .2em;\r\n}\r\n\r\n.mui-icon-contact:before\r\n{\r\n    content: '\\E100';\r\n}\r\n\r\n.mui-icon-person:before\r\n{\r\n    content: '\\E101';\r\n}\r\n\r\n.mui-icon-personadd:before\r\n{\r\n    content: '\\E102';\r\n}\r\n\r\n.mui-icon-contact-filled:before\r\n{\r\n    content: '\\E130';\r\n}\r\n\r\n.mui-icon-person-filled:before\r\n{\r\n    content: '\\E131';\r\n}\r\n\r\n.mui-icon-personadd-filled:before\r\n{\r\n    content: '\\E132';\r\n}\r\n\r\n.mui-icon-phone:before\r\n{\r\n    content: '\\E200';\r\n}\r\n\r\n.mui-icon-email:before\r\n{\r\n    content: '\\E201';\r\n}\r\n\r\n.mui-icon-chatbubble:before\r\n{\r\n    content: '\\E202';\r\n}\r\n\r\n.mui-icon-chatboxes:before\r\n{\r\n    content: '\\E203';\r\n}\r\n\r\n.mui-icon-phone-filled:before\r\n{\r\n    content: '\\E230';\r\n}\r\n\r\n.mui-icon-email-filled:before\r\n{\r\n    content: '\\E231';\r\n}\r\n\r\n.mui-icon-chatbubble-filled:before\r\n{\r\n    content: '\\E232';\r\n}\r\n\r\n.mui-icon-chatboxes-filled:before\r\n{\r\n    content: '\\E233';\r\n}\r\n\r\n.mui-icon-weibo:before\r\n{\r\n    content: '\\E260';\r\n}\r\n\r\n.mui-icon-weixin:before\r\n{\r\n    content: '\\E261';\r\n}\r\n\r\n.mui-icon-pengyouquan:before\r\n{\r\n    content: '\\E262';\r\n}\r\n\r\n.mui-icon-chat:before\r\n{\r\n    content: '\\E263';\r\n}\r\n\r\n.mui-icon-qq:before\r\n{\r\n    content: '\\E264';\r\n}\r\n\r\n.mui-icon-videocam:before\r\n{\r\n    content: '\\E300';\r\n}\r\n\r\n.mui-icon-camera:before\r\n{\r\n    content: '\\E301';\r\n}\r\n\r\n.mui-icon-mic:before\r\n{\r\n    content: '\\E302';\r\n}\r\n\r\n.mui-icon-location:before\r\n{\r\n    content: '\\E303';\r\n}\r\n\r\n.mui-icon-mic-filled:before, .mui-icon-speech:before\r\n{\r\n    content: '\\E332';\r\n}\r\n\r\n.mui-icon-location-filled:before\r\n{\r\n    content: '\\E333';\r\n}\r\n\r\n.mui-icon-micoff:before\r\n{\r\n    content: '\\E360';\r\n}\r\n\r\n.mui-icon-image:before\r\n{\r\n    content: '\\E363';\r\n}\r\n\r\n.mui-icon-map:before\r\n{\r\n    content: '\\E364';\r\n}\r\n\r\n.mui-icon-compose:before\r\n{\r\n    content: '\\E400';\r\n}\r\n\r\n.mui-icon-trash:before\r\n{\r\n    content: '\\E401';\r\n}\r\n\r\n.mui-icon-upload:before\r\n{\r\n    content: '\\E402';\r\n}\r\n\r\n.mui-icon-download:before\r\n{\r\n    content: '\\E403';\r\n}\r\n\r\n.mui-icon-close:before\r\n{\r\n    content: '\\E404';\r\n}\r\n\r\n.mui-icon-redo:before\r\n{\r\n    content: '\\E405';\r\n}\r\n\r\n.mui-icon-undo:before\r\n{\r\n    content: '\\E406';\r\n}\r\n\r\n.mui-icon-refresh:before\r\n{\r\n    content: '\\E407';\r\n}\r\n\r\n.mui-icon-star:before\r\n{\r\n    content: '\\E408';\r\n}\r\n\r\n.mui-icon-plus:before\r\n{\r\n    content: '\\E409';\r\n}\r\n\r\n.mui-icon-minus:before\r\n{\r\n    content: '\\E410';\r\n}\r\n\r\n.mui-icon-circle:before, .mui-icon-checkbox:before\r\n{\r\n    content: '\\E411';\r\n}\r\n\r\n.mui-icon-close-filled:before, .mui-icon-clear:before\r\n{\r\n    content: '\\E434';\r\n}\r\n\r\n.mui-icon-refresh-filled:before\r\n{\r\n    content: '\\E437';\r\n}\r\n\r\n.mui-icon-star-filled:before\r\n{\r\n    content: '\\E438';\r\n}\r\n\r\n.mui-icon-plus-filled:before\r\n{\r\n    content: '\\E439';\r\n}\r\n\r\n.mui-icon-minus-filled:before\r\n{\r\n    content: '\\E440';\r\n}\r\n\r\n.mui-icon-circle-filled:before\r\n{\r\n    content: '\\E441';\r\n}\r\n\r\n.mui-icon-checkbox-filled:before\r\n{\r\n    content: '\\E442';\r\n}\r\n\r\n.mui-icon-closeempty:before\r\n{\r\n    content: '\\E460';\r\n}\r\n\r\n.mui-icon-refreshempty:before\r\n{\r\n    content: '\\E461';\r\n}\r\n\r\n.mui-icon-reload:before\r\n{\r\n    content: '\\E462';\r\n}\r\n\r\n.mui-icon-starhalf:before\r\n{\r\n    content: '\\E463';\r\n}\r\n\r\n.mui-icon-spinner:before\r\n{\r\n    content: '\\E464';\r\n}\r\n\r\n.mui-icon-spinner-cycle:before\r\n{\r\n    content: '\\E465';\r\n}\r\n\r\n.mui-icon-search:before\r\n{\r\n    content: '\\E466';\r\n}\r\n\r\n.mui-icon-plusempty:before\r\n{\r\n    content: '\\E468';\r\n}\r\n\r\n.mui-icon-forward:before\r\n{\r\n    content: '\\E470';\r\n}\r\n\r\n.mui-icon-back:before, .mui-icon-left-nav:before\r\n{\r\n    content: '\\E471';\r\n}\r\n\r\n.mui-icon-checkmarkempty:before\r\n{\r\n    content: '\\E472';\r\n}\r\n\r\n.mui-icon-home:before\r\n{\r\n    content: '\\E500';\r\n}\r\n\r\n.mui-icon-navigate:before\r\n{\r\n    content: '\\E501';\r\n}\r\n\r\n.mui-icon-gear:before\r\n{\r\n    content: '\\E502';\r\n}\r\n\r\n.mui-icon-paperplane:before\r\n{\r\n    content: '\\E503';\r\n}\r\n\r\n.mui-icon-info:before\r\n{\r\n    content: '\\E504';\r\n}\r\n\r\n.mui-icon-help:before\r\n{\r\n    content: '\\E505';\r\n}\r\n\r\n.mui-icon-locked:before\r\n{\r\n    content: '\\E506';\r\n}\r\n\r\n.mui-icon-more:before\r\n{\r\n    content: '\\E507';\r\n}\r\n\r\n.mui-icon-flag:before\r\n{\r\n    content: '\\E508';\r\n}\r\n\r\n.mui-icon-home-filled:before\r\n{\r\n    content: '\\E530';\r\n}\r\n\r\n.mui-icon-gear-filled:before\r\n{\r\n    content: '\\E532';\r\n}\r\n\r\n.mui-icon-info-filled:before\r\n{\r\n    content: '\\E534';\r\n}\r\n\r\n.mui-icon-help-filled:before\r\n{\r\n    content: '\\E535';\r\n}\r\n\r\n.mui-icon-more-filled:before\r\n{\r\n    content: '\\E537';\r\n}\r\n\r\n.mui-icon-settings:before\r\n{\r\n    content: '\\E560';\r\n}\r\n\r\n.mui-icon-list:before\r\n{\r\n    content: '\\E562';\r\n}\r\n\r\n.mui-icon-bars:before\r\n{\r\n    content: '\\E563';\r\n}\r\n\r\n.mui-icon-loop:before\r\n{\r\n    content: '\\E565';\r\n}\r\n\r\n.mui-icon-paperclip:before\r\n{\r\n    content: '\\E567';\r\n}\r\n\r\n.mui-icon-eye:before\r\n{\r\n    content: '\\E568';\r\n}\r\n\r\n.mui-icon-arrowup:before\r\n{\r\n    content: '\\E580';\r\n}\r\n\r\n.mui-icon-arrowdown:before\r\n{\r\n    content: '\\E581';\r\n}\r\n\r\n.mui-icon-arrowleft:before\r\n{\r\n    content: '\\E582';\r\n}\r\n\r\n.mui-icon-arrowright:before\r\n{\r\n    content: '\\E583';\r\n}\r\n\r\n.mui-icon-arrowthinup:before\r\n{\r\n    content: '\\E584';\r\n}\r\n\r\n.mui-icon-arrowthindown:before\r\n{\r\n    content: '\\E585';\r\n}\r\n\r\n.mui-icon-arrowthinleft:before\r\n{\r\n    content: '\\E586';\r\n}\r\n\r\n.mui-icon-arrowthinright:before\r\n{\r\n    content: '\\E587';\r\n}\r\n\r\n.mui-icon-pulldown:before\r\n{\r\n    content: '\\E588';\r\n}\r\n\r\n.mui-fullscreen\r\n{\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n}\r\n.mui-fullscreen.mui-slider .mui-slider-group\r\n{\r\n    height: 100%;\r\n}\r\n.mui-fullscreen .mui-segmented-control ~ .mui-slider-group\r\n{\r\n    position: absolute;\r\n    top: 40px;\r\n    bottom: 0;\r\n\r\n    width: 100%;\r\n    height: auto;\r\n}\r\n.mui-fullscreen.mui-slider .mui-slider-item > a\r\n{\r\n    top: 50%;\r\n\r\n    -webkit-transform: translateY(-50%);\r\n            transform: translateY(-50%);\r\n}\r\n.mui-fullscreen .mui-off-canvas-wrap .mui-slider-item > a\r\n{\r\n    top: auto;\r\n\r\n    -webkit-transform: none;\r\n            transform: none;\r\n}\r\n\r\n.mui-bar-nav ~ .mui-content .mui-slider.mui-fullscreen\r\n{\r\n    top: 44px;\r\n}\r\n\r\n.mui-bar-tab ~ .mui-content .mui-slider.mui-fullscreen .mui-segmented-control ~ .mui-slider-group\r\n{\r\n    bottom: 50px;\r\n}\r\n\r\n.mui-android.mui-android-4-0 input:focus,\r\n.mui-android.mui-android-4-0 textarea:focus\r\n{\r\n    -webkit-user-modify: inherit;\r\n}\r\n\r\n.mui-android.mui-android-4-2 input,\r\n.mui-android.mui-android-4-2 textarea, .mui-android.mui-android-4-3 input,\r\n.mui-android.mui-android-4-3 textarea\r\n{\r\n    -webkit-user-select: text;\r\n}\r\n\r\n.mui-ios .mui-table-view-cell\r\n{\r\n    -webkit-transform-style: preserve-3d;\r\n            transform-style: preserve-3d;\r\n}\r\n\r\n.mui-plus-visible, .mui-wechat-visible\r\n{\r\n    display: none !important;\r\n}\r\n\r\n.mui-plus-hidden, .mui-wechat-hidden\r\n{\r\n    display: block !important;\r\n}\r\n\r\n.mui-tab-item.mui-plus-hidden, .mui-tab-item.mui-wechat-hidden\r\n{\r\n    display: table-cell !important;\r\n}\r\n\r\n.mui-plus .mui-plus-visible, .mui-wechat .mui-wechat-visible\r\n{\r\n    display: block !important;\r\n}\r\n\r\n.mui-plus .mui-tab-item.mui-plus-visible, .mui-wechat .mui-tab-item.mui-wechat-visible\r\n{\r\n    display: table-cell !important;\r\n}\r\n\r\n.mui-plus .mui-plus-hidden, .mui-wechat .mui-wechat-hidden\r\n{\r\n    display: none !important;\r\n}\r\n\r\n.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-nav\r\n{\r\n    height: 64px;\r\n    padding-top: 20px;\r\n}\r\n.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-nav ~ .mui-content\r\n{\r\n    padding-top: 64px;\r\n}\r\n.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-nav ~ .mui-content .mui-pull-top-pocket\r\n{\r\n    top: 64px;\r\n}\r\n.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-header-secondary\r\n{\r\n    top: 64px;\r\n}\r\n.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-header-secondary ~ .mui-content\r\n{\r\n    padding-top: 94px;\r\n}\r\n\r\n.mui-iframe-wrapper\r\n{\r\n    position: absolute;\r\n    right: 0;\r\n    left: 0;\r\n\r\n    -webkit-overflow-scrolling: touch;\r\n}\r\n.mui-iframe-wrapper iframe\r\n{\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n    border: 0;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\np {\n\ttext-indent: 22px;\n}\nspan.mui-icon {\n\tfont-size: 14px;\n\tcolor: #007aff;\n\tmargin-left: -15px;\n\tpadding-right: 10px;\n}\n#info {\n\tpadding: 20px 10px;\n}\n/*.des {\n\t\t\tmargin: .5em 0;\n\t\t}\n\t\t.des>li {\n\t\t\tfont-size: 14px;\n\t\t\tcolor: #8f8f94;\n\t\t}*/\n", "", {"version":3,"sources":["C:/wamp64/www/Vue/Vue$webpack7/components/mui/mui2.vue?c8dc6b8a"],"names":[],"mappings":";AAwHA;CACA,kBAAA;CACA;AAEA;CACA,gBAAA;CACA,eAAA;CACA,mBAAA;CACA,oBAAA;CACA;AAEA;CACA,mBAAA;CACA;AACA;;;;;;KAMA","file":"mui2.vue","sourcesContent":["<template>\r\n\t<div>\r\n\t\t<header class=\"mui-bar mui-bar-nav\">\r\n\t\t\t<a class=\"mui-action-back mui-icon mui-icon-left-nav mui-pull-left\"></a>\r\n\t\t\t<h1 class=\"mui-title\">H5模式actionsheet</h1>\r\n\t\t</header>\r\n\t\t<nav class=\"mui-bar mui-bar-tab\">\r\n\t\t\t<a class=\"mui-tab-item\" href=\"#delete\">\r\n\t\t\t\t<span class=\"mui-icon mui-icon-trash\"></span>\r\n\t\t\t</a>\r\n\t\t\t<a class=\"mui-tab-item\" href=\"#\">\r\n\t\t\t</a>\r\n\t\t\t<a class=\"mui-tab-item\" href=\"#\">\r\n\t\t\t</a>\r\n\t\t\t<a class=\"mui-tab-item\" href=\"#forward\">\r\n\t\t\t\t<span class=\"mui-icon mui-icon-undo\"></span>\r\n\t\t\t</a>\r\n\t\t</nav>\r\n\t\t<div class=\"mui-content\">\r\n\t\t\t<div class=\"mui-content-padded\">\r\n\t\t\t\t<p>actionsheet一般从底部弹出，显示一系列可选择的操作按钮，供用户选择； actionSheet可从任意位置触发， 点击本页面左下角\r\n\t\t\t\t\t<span class=\"mui-icon mui-icon-trash\"></span>会弹出删除信息确认框； 点击本页面右下角\r\n\t\t\t\t\t<span class=\"mui-icon mui-icon-undo\"></span>会弹出转发确认框； 你也可点击如下按钮，打开照片选择框：\r\n\t\t\t\t</p>\r\n\t\t\t\t<p>\r\n\t\t\t\t\t<a href=\"#picture\" class=\"mui-btn mui-btn-primary mui-btn-block mui-btn-outlined\" style=\"padding: 5px 20px;\">打开actionsheet</a>\r\n\t\t\t\t</p>\r\n\t\t\t\t<p>本页面为H5模式的actionsheet演示示例，该模式具有如下优点：</p>\r\n\t\t\t\t<ul class=\"des\">\r\n\t\t\t\t\t<li>可通过css自由定制展现样式</li>\r\n\t\t\t\t</ul>\r\n\r\n\t\t\t\t<p>另一方面，H5模式的actionsheet也具备如下缺点：</p>\r\n\t\t\t\t<ul class=\"hm-description\">\r\n\t\t\t\t\t<li>不支持覆盖顶部状态栏</li>\r\n\t\t\t\t\t<li>不支持跨webview的遮罩</li>\r\n\t\t\t\t\t<li>在有map等原生组件时，容易被遮挡</li>\r\n\t\t\t\t</ul>\r\n\t\t\t\t<p id=\"info\"></p>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div id=\"delete\" class=\"mui-popover mui-popover-action mui-popover-bottom\">\r\n\t\t\t<ul class=\"mui-table-view\">\r\n\t\t\t\t<li class=\"mui-table-view-cell\">\r\n\t\t\t\t\t<a href=\"#\" style=\"color: #FF3B30;\">删除信息</a>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t\t<ul class=\"mui-table-view\">\r\n\t\t\t\t<li class=\"mui-table-view-cell\">\r\n\t\t\t\t\t<a href=\"#delete\"><b>取消</b></a>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t\t<div id=\"forward\" class=\"mui-popover mui-popover-action mui-popover-bottom\">\r\n\t\t\t<ul class=\"mui-table-view\">\r\n\t\t\t\t<li class=\"mui-table-view-cell\">\r\n\t\t\t\t\t<a href=\"#\">回复</a>\r\n\t\t\t\t</li>\r\n\t\t\t\t<li class=\"mui-table-view-cell\">\r\n\t\t\t\t\t<a href=\"#\">转发</a>\r\n\t\t\t\t</li>\r\n\t\t\t\t<li class=\"mui-table-view-cell\">\r\n\t\t\t\t\t<a href=\"#\">打印</a>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t\t<ul class=\"mui-table-view\">\r\n\t\t\t\t<li class=\"mui-table-view-cell\">\r\n\t\t\t\t\t<a href=\"#forward\"><b>取消</b></a>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t\t<div id=\"picture\" class=\"mui-popover mui-popover-action mui-popover-bottom\">\r\n\t\t\t<ul class=\"mui-table-view\">\r\n\t\t\t\t<li class=\"mui-table-view-cell\">\r\n\t\t\t\t\t<a href=\"#\">拍照或录像</a>\r\n\t\t\t\t</li>\r\n\t\t\t\t<li class=\"mui-table-view-cell\">\r\n\t\t\t\t\t<a href=\"#\">选取现有的</a>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t\t<ul class=\"mui-table-view\">\r\n\t\t\t\t<li class=\"mui-table-view-cell\">\r\n\t\t\t\t\t<a href=\"#picture\"><b>取消</b></a>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t</div>\r\n</template>\r\n<script>\r\n\texport default {\r\n\t\tmounted() {\r\n\t\t\tmui.init({\r\n\t\t\t\tswipeBack: true //启用右滑关闭功能\r\n\t\t\t});\r\n\t\t\tmui('body').on('shown', '.mui-popover', function(e) {\r\n\t\t\t\t//console.log('shown', e.detail.id);//detail为当前popover元素\r\n\t\t\t});\r\n\t\t\tmui('body').on('hidden', '.mui-popover', function(e) {\r\n\t\t\t\t//console.log('hidden', e.detail.id);//detail为当前popover元素\r\n\t\t\t});\r\n\t\t\tvar info = document.getElementById(\"info\");\r\n\t\t\tmui('body').on('tap', '.mui-popover-action li>a', function() {\r\n\t\t\t\tvar a = this,\r\n\t\t\t\t\tparent;\r\n\t\t\t\t//根据点击按钮，反推当前是哪个actionsheet\r\n\t\t\t\tfor(parent = a.parentNode; parent != document.body; parent = parent.parentNode) {\r\n\t\t\t\t\tif(parent.classList.contains('mui-popover-action')) {\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t\t//关闭actionsheet\r\n\t\t\t\tmui('#' + parent.id).popover('toggle');\r\n\t\t\t\tinfo.innerHTML = \"你刚点击了\\\"\" + a.innerHTML + \"\\\"按钮\";\r\n\t\t\t})\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style>\r\n\tp {\r\n\t\ttext-indent: 22px;\r\n\t}\r\n\t\r\n\tspan.mui-icon {\r\n\t\tfont-size: 14px;\r\n\t\tcolor: #007aff;\r\n\t\tmargin-left: -15px;\r\n\t\tpadding-right: 10px;\r\n\t}\r\n\t\r\n\t#info {\r\n\t\tpadding: 20px 10px;\r\n\t}\r\n\t/*.des {\r\n\t\t\t\tmargin: .5em 0;\r\n\t\t\t}\r\n\t\t\t.des>li {\r\n\t\t\t\tfont-size: 14px;\r\n\t\t\t\tcolor: #8f8f94;\r\n\t\t\t}*/\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\nhtml[data-v-2daa5d42],\nbody[data-v-2daa5d42] {\n  background-color: #efeff4;\n}\n#offCanvasWrapper[data-v-2daa5d42] {\n  height: 100%;\n}\np[data-v-2daa5d42] {\n  text-indent: 22px;\n}\nspan.mui-icon[data-v-2daa5d42] {\n  font-size: 14px;\n  color: #007aff;\n  margin-left: -15px;\n  padding-right: 10px;\n}\n.mui-off-canvas-left[data-v-2daa5d42] {\n  color: #fff;\n}\n.title[data-v-2daa5d42] {\n  margin: 35px 15px 10px;\n}\n.title + .content[data-v-2daa5d42] {\n  margin: 10px 15px 35px;\n  color: #bbb;\n  text-indent: 1em;\n  font-size: 14px;\n  line-height: 24px;\n}\ninput[data-v-2daa5d42] {\n  color: #000;\n}\n", "", {"version":3,"sources":["C:/wamp64/www/Vue/Vue$webpack7/components/index.vue"],"names":[],"mappings":";AAAA;;EAEE,0BAA0B;CAAE;AAE9B;EACE,aAAa;CAAE;AAEjB;EACE,kBAAkB;CAAE;AAEtB;EACE,gBAAgB;EAChB,eAAe;EACf,mBAAmB;EACnB,oBAAoB;CAAE;AAExB;EACE,YAAY;CAAE;AAEhB;EACE,uBAAuB;CAAE;AAE3B;EACE,uBAAuB;EACvB,YAAY;EACZ,iBAAiB;EACjB,gBAAgB;EAChB,kBAAkB;CAAE;AAEtB;EACE,YAAY;CAAE","file":"index.vue","sourcesContent":["html,\nbody {\n  background-color: #efeff4; }\n\n#offCanvasWrapper {\n  height: 100%; }\n\np {\n  text-indent: 22px; }\n\nspan.mui-icon {\n  font-size: 14px;\n  color: #007aff;\n  margin-left: -15px;\n  padding-right: 10px; }\n\n.mui-off-canvas-left {\n  color: #fff; }\n\n.title {\n  margin: 35px 15px 10px; }\n\n.title + .content {\n  margin: 10px 15px 35px;\n  color: #bbb;\n  text-indent: 1em;\n  font-size: 14px;\n  line-height: 24px; }\n\ninput {\n  color: #000; }\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n#p[data-v-59982a1f] {\n  font-size: 50px;\n  background-color: #0000CC;\n}\n", "", {"version":3,"sources":["C:/wamp64/www/Vue/Vue$webpack7/components/home.vue"],"names":[],"mappings":";AAAA;EACE,gBAAgB;EAChB,0BAA0B;CAC3B","file":"home.vue","sourcesContent":["#p {\n  font-size: 50px;\n  background-color: #0000CC;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"weui.vue","sourceRoot":""}]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"swiper.vue","sourceRoot":""}]);

// exports


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.mui-bar-nav~ .mui-content .mui-pull-top-pocket {\n\ttop: 0px\n}\n", "", {"version":3,"sources":["C:/wamp64/www/Vue/Vue$webpack7/components/pullrefresh.vue?292961d6"],"names":[],"mappings":";AAgEA;CACA,QAAA;CACA","file":"pullrefresh.vue","sourcesContent":["<template>\r\n\t<!--下拉刷新容器-->\r\n\t<div id=\"refreshContainer\" class=\"mui-content mui-scroll-wrapper\" style=\"height: 100%;top:244px\">\r\n\t\t<div class=\"mui-scroll\">\r\n\t\t\t<ul class=\"mui-table-view mui-table-view-chevron\">\r\n\t\t\t\t<li class=\"mui-table-view-cell mui-media\" v-for=\"topic in topics\">\r\n\t\t\t\t\t<router-link :to=\"{ path: '/detail'}\">\r\n\t\t\t\t\t\t<img class=\"mui-media-object mui-pull-left\" :src=\"src\">\r\n\t\t\t\t\t\t<div class=\"mui-media-body\">\r\n\t\t\t\t\t\t\t<p class='mui-ellipsis'>{{topic.title}}</p>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</router-link>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t</div>\r\n</template>\r\n<script>\r\n\texport default {\r\n\t\tdata() {\r\n\t\t\t\treturn {\r\n\t\t\t\t\tsrc: require(\"../images/laoxie.jpg\"),\r\n\t\t\t\t\ttopics:\"\"\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\tmethods: {\r\n\t\t\t\tlinkTo(page) {\r\n\t\t\t\t\tconsole.log(page)\r\n\t\t\t\t\twindow.location.href = \"#/detail\"\r\n\t\t\t\t},\r\n\t\t\t\tgetData(){\r\n\t\t\t\t\tvar self = this;\r\n\t\t\t\t\t$.ajax({\r\n\t\t\t\t\t\turl:\"https://cnodejs.org/api/v1/topics\",\r\n\t\t\t\t\t\ttype:\"GET\",\r\n\t\t\t\t\t\tsuccess(data){\r\n\t\t\t\t\t\t\tconsole.log(data)\r\n\t\t\t\t\t\t\tself.topics = data.data\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t})\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\tmounted() {\r\n\t\t\t\tthis.getData();\r\n\t\t\t\tmui.init({\r\n\t\t\t\t\tpullRefresh: {\r\n\t\t\t\t\t\tcontainer: \"#refreshContainer\", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等\r\n\t\t\t\t\t\tdown: {\r\n\t\t\t\t\t\t\theight: 50, //可选,默认50.触发下拉刷新拖动距离,\r\n\t\t\t\t\t\t\tauto: true, //可选,默认false.自动下拉刷新一次\r\n\t\t\t\t\t\t\tcontentdown: \"下拉可以刷新\", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容\r\n\t\t\t\t\t\t\tcontentover: \"释放立即刷新\", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容\r\n\t\t\t\t\t\t\tcontentrefresh: \"正在刷新...\", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容\r\n\t\t\t\t\t\t\tcallback: function() {\r\n\t\t\t\t\t\t\t\t\tmui('#refreshContainer').pullRefresh().endPulldownToRefresh();\r\n\t\t\t\t\t\t\t\t\tconsole.log(\"hello\")\r\n\t\t\t\t\t\t\t\t} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t}\r\n\t\t\t\t});\r\n\t\t\t}\r\n\t}\r\n</script>\r\n<style>\r\n\t.mui-bar-nav~ .mui-content .mui-pull-top-pocket {\r\n\t\ttop: 0px\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "8820b7f6582a3c45b7527ae6b183dd2f.ttf";

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "<p>123<span>456</span><span>789</span></p>";

/***/ }),
/* 40 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(42);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 42 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(62)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(28),
  /* template */
  __webpack_require__(54),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\pullrefresh.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] pullrefresh.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b4c38534", Component.options)
  } else {
    hotAPI.reload("data-v-b4c38534", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(61)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(29),
  /* template */
  __webpack_require__(52),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\wamp64\\www\\Vue\\Vue$webpack7\\components\\swiper.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] swiper.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-79637f38", Component.options)
  } else {
    hotAPI.reload("data-v-79637f38", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mui-content"
  }, [_c('div', {
    domProps: {
      "innerHTML": _vm._s(_vm.topic)
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1ff45a91", module.exports)
  }
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('header', {
    staticClass: "mui-bar mui-bar-nav"
  }, [_c('a', {
    staticClass: "mui-action-back mui-icon mui-icon-left-nav mui-pull-left"
  }), _vm._v(" "), _c('h1', {
    staticClass: "mui-title"
  }, [_vm._v("H5模式actionsheet")])]), _vm._v(" "), _c('nav', {
    staticClass: "mui-bar mui-bar-tab"
  }, [_c('a', {
    staticClass: "mui-tab-item",
    attrs: {
      "href": "#delete"
    }
  }, [_c('span', {
    staticClass: "mui-icon mui-icon-trash"
  })]), _vm._v(" "), _c('a', {
    staticClass: "mui-tab-item",
    attrs: {
      "href": "#"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "mui-tab-item",
    attrs: {
      "href": "#"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "mui-tab-item",
    attrs: {
      "href": "#forward"
    }
  }, [_c('span', {
    staticClass: "mui-icon mui-icon-undo"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-content"
  }, [_c('div', {
    staticClass: "mui-content-padded"
  }, [_c('p', [_vm._v("actionsheet一般从底部弹出，显示一系列可选择的操作按钮，供用户选择； actionSheet可从任意位置触发， 点击本页面左下角\n\t\t\t\t"), _c('span', {
    staticClass: "mui-icon mui-icon-trash"
  }), _vm._v("会弹出删除信息确认框； 点击本页面右下角\n\t\t\t\t"), _c('span', {
    staticClass: "mui-icon mui-icon-undo"
  }), _vm._v("会弹出转发确认框； 你也可点击如下按钮，打开照片选择框：\n\t\t\t")]), _vm._v(" "), _c('p', [_c('a', {
    staticClass: "mui-btn mui-btn-primary mui-btn-block mui-btn-outlined",
    staticStyle: {
      "padding": "5px 20px"
    },
    attrs: {
      "href": "#picture"
    }
  }, [_vm._v("打开actionsheet")])]), _vm._v(" "), _c('p', [_vm._v("本页面为H5模式的actionsheet演示示例，该模式具有如下优点：")]), _vm._v(" "), _c('ul', {
    staticClass: "des"
  }, [_c('li', [_vm._v("可通过css自由定制展现样式")])]), _vm._v(" "), _c('p', [_vm._v("另一方面，H5模式的actionsheet也具备如下缺点：")]), _vm._v(" "), _c('ul', {
    staticClass: "hm-description"
  }, [_c('li', [_vm._v("不支持覆盖顶部状态栏")]), _vm._v(" "), _c('li', [_vm._v("不支持跨webview的遮罩")]), _vm._v(" "), _c('li', [_vm._v("在有map等原生组件时，容易被遮挡")])]), _vm._v(" "), _c('p', {
    attrs: {
      "id": "info"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-popover mui-popover-action mui-popover-bottom",
    attrs: {
      "id": "delete"
    }
  }, [_c('ul', {
    staticClass: "mui-table-view"
  }, [_c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    staticStyle: {
      "color": "#FF3B30"
    },
    attrs: {
      "href": "#"
    }
  }, [_vm._v("删除信息")])])]), _vm._v(" "), _c('ul', {
    staticClass: "mui-table-view"
  }, [_c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    attrs: {
      "href": "#delete"
    }
  }, [_c('b', [_vm._v("取消")])])])])]), _vm._v(" "), _c('div', {
    staticClass: "mui-popover mui-popover-action mui-popover-bottom",
    attrs: {
      "id": "forward"
    }
  }, [_c('ul', {
    staticClass: "mui-table-view"
  }, [_c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_vm._v("回复")])]), _vm._v(" "), _c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_vm._v("转发")])]), _vm._v(" "), _c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_vm._v("打印")])])]), _vm._v(" "), _c('ul', {
    staticClass: "mui-table-view"
  }, [_c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    attrs: {
      "href": "#forward"
    }
  }, [_c('b', [_vm._v("取消")])])])])]), _vm._v(" "), _c('div', {
    staticClass: "mui-popover mui-popover-action mui-popover-bottom",
    attrs: {
      "id": "picture"
    }
  }, [_c('ul', {
    staticClass: "mui-table-view"
  }, [_c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_vm._v("拍照或录像")])]), _vm._v(" "), _c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_vm._v("选取现有的")])])]), _vm._v(" "), _c('ul', {
    staticClass: "mui-table-view"
  }, [_c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    attrs: {
      "href": "#picture"
    }
  }, [_c('b', [_vm._v("取消")])])])])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-208e2942", module.exports)
  }
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.article),
      expression: "article"
    }],
    domProps: {
      "value": (_vm.article)
    },
    on: {
      "keyup": _vm.setTitle,
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.article = $event.target.value
      }
    }
  }), _vm._v(" "), _c('article', {
    staticClass: "weui-article"
  }, [_c('h1', [_vm._v("大标题")]), _vm._v(" "), _c('section', [_c('h2', {
    staticClass: "title"
  }, [_vm._v("章标题")]), _vm._v(" "), _c('section', [_c('h3', [_vm._v("1.1 节标题")]), _vm._v(" "), _c('div', {
    domProps: {
      "innerHTML": _vm._s(_vm.html)
    }
  }), _vm._v(" "), _c('p', [_vm._v("\n\t\t\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\t\t\t\t")]), _vm._v(" "), _c('p', [_c('img', {
    attrs: {
      "src": _vm.src,
      "alt": ""
    }
  })])]), _vm._v(" "), _vm._m(0)])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('h3', [_vm._v("1.2 节标题")]), _vm._v(" "), _c('p', [_vm._v("\n\t\t\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\t\t\t\t")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-24d409cd", module.exports)
  }
}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mui-off-canvas-wrap mui-draggable",
    attrs: {
      "id": "offCanvasWrapper"
    }
  }, [_c('aside', {
    staticClass: "mui-off-canvas-left",
    attrs: {
      "id": "offCanvasSide"
    }
  }, [_c('div', {
    staticClass: "mui-scroll-wrapper",
    attrs: {
      "id": "offCanvasSideScroll"
    }
  }, [_c('div', {
    staticClass: "mui-scroll"
  }, [_c('div', {
    staticClass: "title"
  }, [_vm._v("侧滑导航")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_vm._v("\n\t\t\t\t\t1111111asdasdasd\n\t\t\t\t\t这11111是可拖动式侧滑菜单示例，你可以在这里放置任何内容；关闭侧滑菜单有多种方式： 1.在手机屏幕任意位置向左拖动(drag)；2.点击本侧滑菜单页之外的任意位置; 3.点击如下红色按钮\n\t\t\t\t\t"), _c('span', {
    staticClass: "android-only"
  }, [_vm._v("；4.Android手机按back键；5.Android手机按menu键\n\t\t\t\t\t\t")]), _vm._v("。\n\t\t\t\t\t"), _c('p', {
    staticStyle: {
      "margin": "10px 15px"
    }
  }, [_c('button', {
    staticClass: "mui-btn mui-btn-danger mui-btn-block",
    staticStyle: {
      "padding": "5px 20px"
    },
    attrs: {
      "id": "offCanvasHide",
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.offHide()
      }
    }
  }, [_vm._v("关闭侧滑菜单")])])]), _vm._v(" "), _c('div', {
    staticClass: "title",
    staticStyle: {
      "margin-bottom": "25px"
    }
  }, [_vm._v("侧滑列表示例")]), _vm._v(" "), _c('ul', {
    staticClass: "mui-table-view mui-table-view-chevron mui-table-view-inverted"
  }, [_c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('button', {
    staticClass: "mui-navigate-right",
    on: {
      "click": function($event) {
        _vm.linkTo(0)
      }
    }
  }, [_vm._v("主题")])]), _vm._v(" "), _c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('button', {
    staticClass: "mui-navigate-right",
    on: {
      "click": function($event) {
        _vm.linkTo(1)
      }
    }
  }, [_vm._v("收藏")])]), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm._m(2), _vm._v(" "), _vm._m(3)])])])]), _vm._v(" "), _c('div', {
    staticClass: "mui-inner-wrap"
  }, [_vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "mui-content mui-scroll-wrapper",
    attrs: {
      "id": "offCanvasContentScroll"
    }
  }, [_c('div', {
    staticClass: "mui-scroll",
    staticStyle: {
      "height": "100%"
    }
  }, [_c('router-view')], 1)]), _vm._v(" "), _c('div', {
    staticClass: "mui-off-canvas-backdrop"
  })])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    staticClass: "mui-navigate-right"
  }, [_vm._v("\n\t\t\t\t\t\t\tItem 3\n\t\t\t\t\t\t")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    staticClass: "mui-navigate-right"
  }, [_vm._v("\n\t\t\t\t\t\t\tItem 4\n\t\t\t\t\t\t")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    staticClass: "mui-navigate-right"
  }, [_vm._v("\n\t\t\t\t\t\t\tItem 5\n\t\t\t\t\t\t")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "mui-table-view-cell"
  }, [_c('a', {
    staticClass: "mui-navigate-right"
  }, [_vm._v("\n\t\t\t\t\t\t\tItem 6\n\t\t\t\t\t\t")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('header', {
    staticClass: "mui-bar mui-bar-nav"
  }, [_c('a', {
    staticClass: "mui-icon mui-action-menu mui-icon-bars mui-pull-left",
    attrs: {
      "href": "#offCanvasSide"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "mui-action-back mui-btn mui-btn-link mui-pull-right"
  }, [_vm._v("关闭")]), _vm._v(" "), _c('h1', {
    staticClass: "mui-title"
  }, [_vm._v("div模式右滑菜单")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2daa5d42", module.exports)
  }
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "weui-panel weui-panel_access"
  }, [_c('p', [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), _c('div', {
    staticClass: "weui-panel__hd"
  }, [_vm._v("图文组合列表")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "weui-panel__bd"
  }, [_c('a', {
    staticClass: "weui-media-box weui-media-box_appmsg",
    attrs: {
      "href": "javascript:void(0);"
    }
  }, [_c('div', {
    staticClass: "weui-media-box__hd"
  }, [_c('img', {
    staticClass: "weui-media-box__thumb",
    attrs: {
      "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==",
      "alt": ""
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "weui-media-box__bd"
  }, [_c('h4', {
    staticClass: "weui-media-box__title"
  }, [_vm._v("标题一")]), _vm._v(" "), _c('p', {
    staticClass: "weui-media-box__desc"
  }, [_vm._v("由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。")])])]), _vm._v(" "), _c('a', {
    staticClass: "weui-media-box weui-media-box_appmsg",
    attrs: {
      "href": "javascript:void(0);"
    }
  }, [_c('div', {
    staticClass: "weui-media-box__hd"
  }, [_c('img', {
    staticClass: "weui-media-box__thumb",
    attrs: {
      "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==",
      "alt": ""
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "weui-media-box__bd"
  }, [_c('h4', {
    staticClass: "weui-media-box__title"
  }, [_vm._v("标题二")]), _vm._v(" "), _c('p', {
    staticClass: "weui-media-box__desc"
  }, [_vm._v("由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。")])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "weui-panel__ft"
  }, [_c('a', {
    staticClass: "weui-cell weui-cell_access weui-cell_link",
    attrs: {
      "href": "javascript:void(0);"
    }
  }, [_c('div', {
    staticClass: "weui-cell__bd"
  }, [_vm._v("查看更多")]), _vm._v(" "), _c('span', {
    staticClass: "weui-cell__ft"
  })])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-486f755f", module.exports)
  }
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('p', {
    attrs: {
      "id": "p"
    }
  }, [_vm._v("第二页")]), _vm._v(" "), _c('xarticle'), _vm._v(" "), _c('xlist')], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-59982a1f", module.exports)
  }
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('xarticle'), _vm._v(" "), _c('xlist')], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-6caa9da2", module.exports)
  }
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "mui-slider",
    attrs: {
      "id": "slider"
    }
  }, [_c('div', {
    staticClass: "mui-slider-group mui-slider-loop"
  }, [_c('div', {
    staticClass: "mui-slider-item mui-slider-item-duplicate"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item mui-slider-item-duplicate"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])])]), _vm._v(" "), _vm._m(0)])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mui-slider-indicator"
  }, [_c('div', {
    staticClass: "mui-indicator mui-active"
  }), _vm._v(" "), _c('div', {
    staticClass: "mui-indicator"
  }), _vm._v(" "), _c('div', {
    staticClass: "mui-indicator"
  }), _vm._v(" "), _c('div', {
    staticClass: "mui-indicator"
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-79637f38", module.exports)
  }
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._v("\n\t2\n")])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-ac83a846", module.exports)
  }
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mui-content mui-scroll-wrapper",
    staticStyle: {
      "height": "100%",
      "top": "244px"
    },
    attrs: {
      "id": "refreshContainer"
    }
  }, [_c('div', {
    staticClass: "mui-scroll"
  }, [_c('ul', {
    staticClass: "mui-table-view mui-table-view-chevron"
  }, _vm._l((_vm.topics), function(topic) {
    return _c('li', {
      staticClass: "mui-table-view-cell mui-media"
    }, [_c('router-link', {
      attrs: {
        "to": {
          path: '/detail'
        }
      }
    }, [_c('img', {
      staticClass: "mui-media-object mui-pull-left",
      attrs: {
        "src": _vm.src
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "mui-media-body"
    }, [_c('p', {
      staticClass: "mui-ellipsis"
    }, [_vm._v(_vm._s(topic.title))])])])], 1)
  }))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-b4c38534", module.exports)
  }
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('swiper'), _vm._v(" "), _c('pullrefresh')], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-c0c3e57e", module.exports)
  }
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "mui-content"
  }, [_c('div', {
    staticClass: "mui-card"
  }, [_c('ul', {
    staticClass: "mui-table-view"
  }, [_vm._m(1), _vm._v(" "), _c('li', {
    staticClass: "mui-table-view-cell mui-collapse"
  }, [_c('a', {
    staticClass: "mui-navigate-right",
    attrs: {
      "href": "#"
    }
  }, [_vm._v("图片轮播")]), _vm._v(" "), _c('div', {
    staticClass: "mui-collapse-content"
  }, [_c('div', {
    staticClass: "mui-slider",
    attrs: {
      "id": "slider"
    }
  }, [_c('div', {
    staticClass: "mui-slider-group mui-slider-loop"
  }, [_c('div', {
    staticClass: "mui-slider-item mui-slider-item-duplicate"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "mui-slider-item mui-slider-item-duplicate"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.src
    }
  })])])]), _vm._v(" "), _vm._m(2)])])]), _vm._v(" "), _vm._m(3)])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('header', {
    staticClass: "mui-bar mui-bar-nav"
  }, [_c('a', {
    staticClass: "mui-action-back mui-icon mui-icon-left-nav mui-pull-left"
  }), _vm._v(" "), _c('h1', {
    staticClass: "mui-title"
  }, [_vm._v("折叠面板")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "mui-table-view-cell mui-collapse"
  }, [_c('a', {
    staticClass: "mui-navigate-right",
    attrs: {
      "href": "#"
    }
  }, [_vm._v("表单")]), _vm._v(" "), _c('div', {
    staticClass: "mui-collapse-content"
  }, [_c('form', {
    staticClass: "mui-input-group"
  }, [_c('div', {
    staticClass: "mui-input-row"
  }, [_c('label', [_vm._v("Input")]), _vm._v(" "), _c('input', {
    attrs: {
      "type": "text",
      "placeholder": "普通输入框"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "mui-input-row"
  }, [_c('label', [_vm._v("Input")]), _vm._v(" "), _c('input', {
    staticClass: "mui-input-clear",
    attrs: {
      "type": "text",
      "placeholder": "带清除按钮的输入框"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "mui-input-row mui-plus-visible"
  }, [_c('label', [_vm._v("Input")]), _vm._v(" "), _c('input', {
    staticClass: "mui-input-speech mui-input-clear",
    attrs: {
      "type": "text",
      "placeholder": "语音输入"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "mui-button-row"
  }, [_c('button', {
    staticClass: "mui-btn mui-btn-primary",
    attrs: {
      "type": "button",
      "onclick": "return false;"
    }
  }, [_vm._v("确认")]), _vm._v("  \n\t\t\t\t\t\t\t\t"), _c('button', {
    staticClass: "mui-btn mui-btn-primary",
    attrs: {
      "type": "button",
      "onclick": "return false;"
    }
  }, [_vm._v("取消")])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mui-slider-indicator"
  }, [_c('div', {
    staticClass: "mui-indicator mui-active"
  }), _vm._v(" "), _c('div', {
    staticClass: "mui-indicator"
  }), _vm._v(" "), _c('div', {
    staticClass: "mui-indicator"
  }), _vm._v(" "), _c('div', {
    staticClass: "mui-indicator"
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "mui-table-view-cell mui-collapse"
  }, [_c('a', {
    staticClass: "mui-navigate-right",
    attrs: {
      "href": "#"
    }
  }, [_vm._v("文字排版")]), _vm._v(" "), _c('div', {
    staticClass: "mui-collapse-content"
  }, [_c('h1', [_vm._v("h1. Heading")]), _vm._v(" "), _c('h2', [_vm._v("h2. Heading")]), _vm._v(" "), _c('h3', [_vm._v("h3. Heading")]), _vm._v(" "), _c('h4', [_vm._v("h4. Heading")]), _vm._v(" "), _c('h5', [_vm._v("h5. Heading")]), _vm._v(" "), _c('h6', [_vm._v("h6. Heading")]), _vm._v(" "), _c('p', [_vm._v("\n\t\t\t\t\t\t\tp. 目前最接近原生App效果的框架。\n\t\t\t\t\t\t")])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-c73feb3a", module.exports)
  }
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("6118b8ad", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-208e2942\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./mui2.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-208e2942\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./mui2.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("4527830e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2daa5d42\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_sass-loader@6.0.4@sass-loader/lib/loader.js!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2daa5d42\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_sass-loader@6.0.4@sass-loader/lib/loader.js!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("75366938", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-59982a1f\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_less-loader@4.0.3@less-loader/dist/index.js!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./home.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-59982a1f\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_less-loader@4.0.3@less-loader/dist/index.js!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./home.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("ad8e2636", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6caa9da2\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./weui.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6caa9da2\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./weui.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("73609f10", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-79637f38\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./swiper.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-79637f38\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./swiper.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("a1045d2e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b4c38534\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./pullrefresh.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.1@css-loader/index.js?sourceMap!../node_modules/_vue-loader@12.0.3@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b4c38534\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@12.0.3@vue-loader/lib/selector.js?type=styles&index=0!./pullrefresh.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 63 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 64 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map