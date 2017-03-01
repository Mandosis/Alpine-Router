export default class Router {
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
            window.fetch(url)
                .then((response) => response.text())
                .then((body) => resolve(body))
                .catch((error) => reject(error));
        });
    }
}
//# sourceMappingURL=router.js.map