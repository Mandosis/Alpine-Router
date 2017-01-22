export interface Route {
  path: string;
  template?: string;
  templateUrl?: string;
  children?: Route[];
}

export default class Router {
  private _routes: Route[] = [];

  constructor(routes: Route[]) {
    for (let route of routes) {
      this._routes.push(route);
    }
  }

  get routes() {
    return this._routes;
  }
}