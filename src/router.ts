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
    const pathTokens = this.getPathTokens(path);

    if (pathTokens[0] === '#') {
      pathTokens.splice(0);
    }

    for (let route of this._routes) {
      const routeTokens = this.getPathTokens(route.path);

      let tokenMap = this._compareTokens(routeTokens, pathTokens);
      let consecutiveCount = this._getConsecutiveTokenMatchCount(tokenMap);
      
      let fullPathMatch = (consecutiveCount === tokenMap.size);
      let partialMatch = (consecutiveCount < tokenMap.size);

      if (fullPathMatch) {
        // Full path match
        this._changeBrowserUrl(route.path);
        // Update router-outlet
        // this._addTemplateToDom(route.template);
        return true;
      } else if (partialMatch) {
        // Partial path match. Check for child routes
      } else {
        // No match. Check for wild card or throw error
        return false;
      }
      
    }
    
    return false;
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
    let baseHref = this._baseHrefValue;

    if (baseHref && baseHref !== '/') {
      return baseHref + path;
    }

    if (baseHref&& baseHref === '/') {
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