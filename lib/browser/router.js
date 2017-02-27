var Router =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	__webpack_require__.p = "D:\\Chris\\Workspace\\alpine\\router";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = function () {
    function Router(routes) {
        _classCallCheck(this, Router);

        this._routes = [];
        if (Array.isArray(routes)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var route = _step.value;

                    this._routes.push(route);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else {
            console.error('Router was not created. Did you enter an array of objects in the following format [{ path: "example", template: "<h1>Example</h1>"}]?');
        }
    }

    _createClass(Router, [{
        key: 'getPathTokens',
        value: function getPathTokens(path) {
            var tokens = path.split('/');
            if (tokens[0] === '' && tokens[1] === '') {
                var token = path;
                tokens = [''];
            }
            return tokens;
        }
    }, {
        key: 'sanitizePath',
        value: function sanitizePath(path) {
            if (path.charAt(0) === '#') {
                path = path.slice(1, path.length);
            }
            if (path.charAt(0) === '/' && path !== '/') {
                path = path.slice(1, path.length);
                ;
            }
            return path;
        }
    }, {
        key: 'navigate',
        value: function navigate(url) {
            url = this.sanitizePath(url);
            var urlTokens = this.getPathTokens(url);
            var urlMap = new Map();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = urlTokens[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var token = _step2.value;

                    urlMap.set(token, false);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var result = this._getRoutes(this._routes, urlTokens, urlMap);
            if (result.length > 0) {
                this._changeBrowserUrl(url);
                this._addTemplatesToDom(result);
                return true;
            }
            return false;
        }
    }, {
        key: '_getRoutes',
        value: function _getRoutes(routes, urlTokens, urlMap, routeHistory) {
            routeHistory = routeHistory || [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = routes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var route = _step3.value;

                    var routeTokens = this.getPathTokens(route.path);
                    urlMap = this._compareTokens(routeTokens, urlTokens, urlMap);
                    var consecutiveCount = this._countConsecutiveTokens(urlMap);
                    var isFullPathMatch = consecutiveCount === urlMap.size;
                    var isPartialMatch = consecutiveCount < urlMap.size && consecutiveCount !== 0;
                    if (isFullPathMatch) {
                        routeHistory.push(route);
                        return routeHistory;
                    }
                    if (isPartialMatch && route.children) {
                        routeHistory.push(route);
                        return this._getRoutes(route.children, urlTokens, urlMap, routeHistory);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return [];
        }
    }, {
        key: '_compareTokens',
        value: function _compareTokens(routeTokens, urlTokens, urlMap) {
            var seen = 0;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = urlTokens[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var token = _step4.value;

                    if (urlMap.get(token)) {
                        seen++;
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            if (seen > 0) {
                urlTokens = urlTokens.slice(seen, routeTokens.length + 1);
            }
            for (var it = 0; it < urlTokens.length; it++) {
                var route = routeTokens[it];
                var url = urlTokens[it];
                if (!urlMap.get(url)) {
                    if (route === undefined) {
                        return urlMap;
                    }
                    if (route === url) {
                        urlMap.set(url, true);
                    }
                }
            }
            return urlMap;
        }
    }, {
        key: '_countConsecutiveTokens',
        value: function _countConsecutiveTokens(tokenMap) {
            var count = 0;
            var isLastTokenAMatch = true;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = tokenMap[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var token = _step5.value;

                    if (token[1] && isLastTokenAMatch) {
                        count++;
                    } else {
                        return count;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return count;
        }
    }, {
        key: '_changeBrowserUrl',
        value: function _changeBrowserUrl(path) {
            var finalPath = this._getAndAppendBaseHref(path);
            history.pushState('', path, finalPath);
        }
    }, {
        key: '_getAndAppendBaseHref',
        value: function _getAndAppendBaseHref(path) {
            if (path === '/') {
                path = '';
            }
            var baseHref = this._baseHrefValue;
            if (baseHref && baseHref !== '/') {
                return baseHref + path;
            }
            if (baseHref && baseHref === '/') {
                return path;
            }
            return '#/' + path;
        }
    }, {
        key: '_addTemplatesToDom',
        value: function _addTemplatesToDom(routes) {
            for (var it = 0; it < routes.length; it++) {
                var outlets = document.getElementsByTagName('router-outlet');
                outlets[it].innerHTML = routes[it].template;
            }
        }
    }, {
        key: 'routes',
        get: function get() {
            return this._routes;
        }
    }, {
        key: '_baseHrefValue',
        get: function get() {
            var baseElement = document.getElementsByTagName('base')[0];
            var baseHref = void 0;
            if (baseElement) {
                return baseElement.attributes.getNamedItem('href').value;
            }
        }
    }]);

    return Router;
}();

exports.default = Router;

/***/ })
/******/ ]);
//# sourceMappingURL=router.js.map