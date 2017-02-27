/**
 * Interface for route data
 */
export interface Route {
  path: string;
  template?: string;
  templateUrl?: string;
  children?: Route[];
}

/**
 * Client-side router for single page applications
 */
export default class Router {
  private _routes: Route[] = [];

  constructor(routes: Route[]) {

    if (Array.isArray(routes)) {
      for (let route of routes) {
        this._routes.push(route);
      }
    } else {
      console.error('Router was not created. Did you enter an array of objects in the following format [{ path: "example", template: "<h1>Example</h1>"}]?')
    }
  }

  get routes(): Route[] {
    return this._routes;
  }

  /**
   * Get tokens from a path
   * 
   * @param path  Path to get tokens from
   * @returns     List of tokens from path
   */
  getPathTokens(path: string): string[] {
    let tokens = path.split('/');

    if (tokens[0] === '' && tokens[1] === '') {
      let token = path;
      tokens = [''];
    }
    
    return tokens;
  }

  /**
   * Sanitize path and remove # and / from the beginning
   * 
   * @param path  Path to sanitize
   * @return      Sanitized path
   */
  private sanitizePath(path: string): string {
    if (path.charAt(0) === '#') {
        path = path.slice(1, path.length);
    }

    if (path.charAt(0) === '/' && path !== '/') {
        path = path.slice(1, path.length);;
    }

    return path;
   }

  /**
   * Navigate to new path
   * 
   * @param path Path to navigate to.
   * @returns Success of navigation.
   */
  public navigate(url: string): boolean {

    url = this.sanitizePath(url);

    // Get url tokens
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


    return false;
  }

  /**
   * Match and return routes
   * 
   * @param routes Routes to match
   * @param urlTokens URL Tokens
   * @param urlMap URL Map
   * @param routeHistory Route History
   */
  private _getRoutes(routes: Route[], urlTokens: string[], urlMap: Map<string, boolean>, routeHistory?: Route[]): Route[] {
    routeHistory = routeHistory || [];

    // iterate through routes
    for (let route of routes) {
      // get route path tokens
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

  private _compareTokens(routeTokens: string[], urlTokens: string[], urlMap: Map<string, boolean>) {
    // for loop to count number of seen tokens
    let seen = 0;
    for (let token of urlTokens) {
      if (urlMap.get(token)) { seen++;}
    }

    if (seen > 0) {
      urlTokens = urlTokens.slice(seen, routeTokens.length + 1);
    }

    // compare route tokens with url tokens
    for (let it = 0; it < urlTokens.length; it++) {
      const route = routeTokens[it];
      const url = urlTokens[it];

      if (!urlMap.get(url)) {
        if (route === undefined) { return urlMap; }

        if (route === url) {
          urlMap.set(url, true);
        }
      }
    }

    return urlMap;
  }


  /**
   * Gets consecutive token match count
   * 
   * @param tokenMap  Map of tokens
   * @return          Consecutive match count
   */
  private _countConsecutiveTokens(tokenMap: Map<string, boolean>) {
    let count = 0;
    let isLastTokenAMatch = true;

    for (let token of tokenMap) {
      if (token[1] && isLastTokenAMatch) {
        count++;
      } else {
        return count;
      }
    }

    return count;
  }

  /**
   * Changes url in address bar after the domain name
   * 
   * @param path  Path to change url to
   */
  private _changeBrowserUrl(path: string) {
    let finalPath = this._getAndAppendBaseHref(path);
    history.pushState('', path, finalPath);
  }

  /**
   * Gets and appends the base href value if it exists
   * 
   * @param url       URL for route
   * @return          modified url adjusted for base tag if it exists
   */
  private _getAndAppendBaseHref(path: string) {
    if (path === '/') { path = '' }
    let baseHref = this._baseHrefValue;

    if (baseHref && baseHref !== '/') {
      return baseHref + path;
    }

    if (baseHref && baseHref === '/') {
      return path;
    }

    return '#/' + path;
  }

  /**
   * Get value of of the href attribute in the base tag if it exists
   * 
   * @returns Value of href attributes
   */
  private get _baseHrefValue(): string {
    let baseElement: HTMLElement = document.getElementsByTagName('base')[0];
    let baseHref: string;

    if (baseElement) {
      return baseElement
        .attributes
        .getNamedItem('href')
        .value;
    }
  }

  /**
   * Get the matched routes and add the templates to the DOM
   * 
   * @param routes    Matched routes
   */
  private _addTemplatesToDom(routes: Route[]): void {
    for (let it = 0; it < routes.length; it++) {
      const outlets = document.getElementsByTagName('router-outlet');

      outlets[it].innerHTML = routes[it].template;
    }
  }

}