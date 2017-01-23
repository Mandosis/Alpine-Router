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
}