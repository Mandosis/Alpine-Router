/**
 * Interface for route data
 */
export interface Route {
  path: string;
  template?: string;
  templateUrl?: string;
  children?: Route[];
}

enum MatchStatus {
  full,
  partial,
  none
}

/**
 * Client-side router for single page applications
 */
export default class Router {
  private _routes: Route[] = [];

  constructor(routes: Route[]) {
    for (let route of routes) {
      this._routes.push(route);
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
   * Navigate to new path
   * 
   * @param path Path to navigate to.
   * @returns Success of navigation.
   */
  public navigate(path: string): boolean {

    path = this.sanitizePath(path);
    const pathTokens = this.getPathTokens(path);
    let matchResult = this._getRoute(this.routes, pathTokens);

    if (matchResult != undefined) {
      this._changeBrowserUrl(path);
      // render view
      return true;
    }

    
    return false;
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
   * Get matching route
   * 
   * @param routes            Route to match
   * @param candidateTokens   Tokens to match a route with
   */
  private _getRoute(routes: Route[], candidateTokens: string[]): Route {
    for (let route of routes) {
      const routeTokens = this.getPathTokens(route.path);
      const tokenMap = this._compareTokens(routeTokens, candidateTokens);
      const consecutiveCount = this._getConsecutiveTokenMatchCount(tokenMap);

      const isFullPathMatch = (consecutiveCount === tokenMap.size);
      const isPartialMatch = (consecutiveCount < tokenMap.size);

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

  /**
   * Compare tokens
   * 
   * @param pathTokens        Tokens to check against
   * @param candidateTokens   Candidate tokens
   * @returns                 Map of tokens with match status
   */
  private _compareTokens(pathTokens: string[], candidateTokens: string[]) {
    let tokenMap: Map<string, boolean> = new Map();

    for (let i = 0; i < pathTokens.length; i++) {
      const pathToken = pathTokens[i];
      const condidateToken = candidateTokens[i];

      const isMatch = (pathToken === condidateToken);

      tokenMap.set(pathToken, isMatch)
    }

    return tokenMap;
  }

  /**
   * Gets consecutive token match count
   * 
   * @param tokenMap  Map of tokens
   * @return          Consecutive match count
   */
  private _getConsecutiveTokenMatchCount(tokenMap: Map<string, boolean>) {
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
}