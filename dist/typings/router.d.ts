export interface Route {
    path: string;
    template?: string;
    templateUrl?: string;
    children?: Route[];
}
export default class Router {
    private _routes;
    constructor(routes: Route[]);
    readonly routes: Route[];
    getPathTokens(path: string): string[];
    private sanitizePath(path);
    navigate(url: string): boolean;
    private _getRoutes(routes, urlTokens, urlMap, routeHistory?);
    private _compareTokens(routeTokens, urlTokens, urlMap);
    private _countConsecutiveTokens(tokenMap);
    private _getWindowUrlAndNavigate();
    private _changeBrowserUrl(path);
    private _getAndAppendBaseHref(path);
    private readonly _baseHrefValue;
    private _addTemplatesToDom(routes);
    private _getRemoteTemplate(url);
}
