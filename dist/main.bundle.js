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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
class Router {
    constructor(routes) {
        this._routes = [];
        if (Array.isArray(routes)) {
            for (let route of routes) {
                this._routes.push(route);
            }
        }
        else {
            console.error('Router: Failed to create router.\nDid you enter an array of objects in the following format [{ path: "example", template: "<h1>Example</h1>"}]?');
        }
        this._getWindowUrlAndNavigate();
        window.onhashchange = () => {
            this._getWindowUrlAndNavigate();
        };
    }
    get routes() {
        return this._routes;
    }
    getPathTokens(path) {
        let tokens = path.split('/');
        if (tokens[0] === '' && tokens[1] === '') {
            let token = path;
            tokens = [''];
        }
        return tokens;
    }
    sanitizePath(path) {
        if (path.charAt(0) === '#') {
            path = path.slice(1, path.length);
        }
        if (path.charAt(0) === '/' && path !== '/') {
            path = path.slice(1, path.length);
            ;
        }
        return path;
    }
    navigate(url) {
        url = this.sanitizePath(url);
        let urlTokens = this.getPathTokens(url);
        let urlMap = new Map();
        for (let token of urlTokens) {
            urlMap.set(token, false);
        }
        let result = this._getRoutes(this._routes, urlTokens, urlMap);
        if (result.length > 0) {
            this._changeBrowserUrl(url);
            this._addTemplatesToDom(result);
            return true;
        }
        console.error(`Router: No route found for path '${url}'.`);
        return false;
    }
    _getRoutes(routes, urlTokens, urlMap, routeHistory) {
        routeHistory = routeHistory || [];
        for (let route of routes) {
            const routeTokens = this.getPathTokens(route.path);
            urlMap = this._compareTokens(routeTokens, urlTokens, urlMap);
            const consecutiveCount = this._countConsecutiveTokens(urlMap);
            const isFullPathMatch = (consecutiveCount === urlMap.size);
            const isPartialMatch = (consecutiveCount < urlMap.size && consecutiveCount !== 0);
            if (isFullPathMatch) {
                routeHistory.push(route);
                return routeHistory;
            }
            if (isPartialMatch && route.children) {
                routeHistory.push(route);
                return this._getRoutes(route.children, urlTokens, urlMap, routeHistory);
            }
        }
        return [];
    }
    _compareTokens(routeTokens, urlTokens, urlMap) {
        let seen = 0;
        for (let token of urlTokens) {
            if (urlMap.get(token)) {
                seen++;
            }
        }
        if (seen > 0) {
            urlTokens = urlTokens.slice(seen, routeTokens.length + 1);
        }
        for (let it = 0; it < urlTokens.length; it++) {
            const route = routeTokens[it];
            const url = urlTokens[it];
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
    _countConsecutiveTokens(tokenMap) {
        let count = 0;
        let isLastTokenAMatch = true;
        for (let token of tokenMap) {
            if (token[1] && isLastTokenAMatch) {
                count++;
            }
            else {
                return count;
            }
        }
        return count;
    }
    _getWindowUrlAndNavigate() {
        if (this._baseHrefValue) {
            let location = window.location.pathname;
            location = location.substring(this._baseHrefValue.length, location.length);
            return this.navigate(location);
        }
        this.navigate(window.location.hash);
    }
    _changeBrowserUrl(path) {
        let finalPath = this._getAndAppendBaseHref(path);
        history.pushState('', path, finalPath);
    }
    _getAndAppendBaseHref(path) {
        if (path === '/') {
            path = '';
        }
        let baseHref = this._baseHrefValue;
        if (baseHref && baseHref !== '/') {
            return baseHref + path;
        }
        if (baseHref && baseHref === '/') {
            return path;
        }
        return '#/' + path;
    }
    get _baseHrefValue() {
        let baseElement = document.getElementsByTagName('base')[0];
        let baseHref;
        if (baseElement) {
            return baseElement
                .attributes
                .getNamedItem('href')
                .value;
        }
    }
    _addTemplatesToDom(routes) {
        for (let it = 0; it < routes.length; it++) {
            const outlets = document.getElementsByTagName('router-outlet');
            if (!outlets[it]) {
                console.error('Router: router-outlet missing.');
            }
            if (routes[it].template) {
                outlets[it].innerHTML = routes[it].template;
            }
            else {
                this._getRemoteTemplate(routes[it].templateUrl)
                    .then((template) => {
                    outlets[it].innerHTML = template;
                })
                    .catch((err) => {
                    console.error(`Router: Failed to get template.\n${err}`);
                });
            }
        }
    }
    _getRemoteTemplate(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => response.text())
                .then((body) => resolve(body))
                .catch((error) => reject(error));
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = Router;

//# sourceMappingURL=router.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "main.bundle.css";

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _alpineRouter = __webpack_require__(0);

var _alpineRouter2 = _interopRequireDefault(_alpineRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(1);

var router = new _alpineRouter2.default([{
    path: '/',
    template: '<h1>Hello!</h1><p>Use the buttons above to change routes!</p>'
}, {
    path: 'parent',
    template: '<h1>Parent Route</h1><p>Child routes will be rendered below!</p><router-outlet></router-outlet>',
    children: [{
        path: 'child',
        template: '<h2>Child Route</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque egestas iaculis leo quis viverra. Duis sodales nulla sem, vitae congue sapien luctus eget. Sed feugiat aliquam dapibus. Cras elementum, leo sed laoreet pulvinar, nunc nulla auctor lectus, in blandit est mauris ut sem. Sed a nibh urna. Etiam eget aliquam augue. Nunc id ornare justo, in finibus nibh. Nunc mattis, metus nec volutpat tempus, nisl sem sodales dolor, nec tincidunt ipsum mauris nec ex.</p>'
    }]
}, {
    path: 'external',
    templateUrl: 'templates/example.html'
}]);

var navElements = {
    root: document.getElementById('demo-root'),
    parent: document.getElementById('demo-parent'),
    child: document.getElementById('demo-child'),
    external: document.getElementById('demo-external')
};

navElements.root.addEventListener('click', function () {
    return router.navigate('/');
});
navElements.parent.addEventListener('click', function () {
    return router.navigate('parent');
});
navElements.child.addEventListener('click', function () {
    return router.navigate('parent/child');
});
navElements.external.addEventListener('click', function () {
    return router.navigate('external');
});

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.map