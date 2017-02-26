export default class Router {
    constructor(routes) {
        this._routes = [];
        for (let route of routes) {
            this._routes.push(route);
        }
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
    navigate(path) {
        path = this.sanitizePath(path);
        const pathTokens = this.getPathTokens(path);
        let matchResult = this._getRoute(this.routes, pathTokens);
        let wildCardResult;
        if (!matchResult) {
            wildCardResult = this._getRoute(this.routes, ['*']);
        }
        if (matchResult || wildCardResult) {
            this._changeBrowserUrl(path);
            return true;
        }
        console.error(`Router: Unable to find route for '${path}'`);
        return false;
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
    _getRoute(routes, candidateTokens) {
        for (let route of routes) {
            const routeTokens = this.getPathTokens(route.path);
            const tokenMap = this._compareTokens(routeTokens, candidateTokens);
            const consecutiveCount = this._getConsecutiveTokenMatchCount(tokenMap);
            const isFullPathMatch = (consecutiveCount === tokenMap.size);
            const isPartialMatch = (consecutiveCount < tokenMap.size && consecutiveCount !== 0);
            if (isFullPathMatch) {
                return route;
            }
            if (isPartialMatch && route.children) {
                const remainingTokens = routeTokens.slice(consecutiveCount - 1, routeTokens.length);
                return this._getRoute(route.children, remainingTokens);
            }
        }
        return undefined;
    }
    _compareTokens(pathTokens, candidateTokens) {
        let tokenMap = new Map();
        for (let i = 0; i < pathTokens.length; i++) {
            const pathToken = pathTokens[i];
            const condidateToken = candidateTokens[i];
            const isMatch = (pathToken === condidateToken);
            tokenMap.set(pathToken, isMatch);
        }
        return tokenMap;
    }
    _getConsecutiveTokenMatchCount(tokenMap) {
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
}
//# sourceMappingURL=router.js.map