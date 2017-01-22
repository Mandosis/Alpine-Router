import test from 'ava';
import {default as Router, Route} from '../src/router';

let router: Router;
let routes: Route[] = [
  {
    path: '/',
    template: `<h1>Hello World!</h1>`
  }
]
test.before(t => {
  router = new Router(routes)
});

test('create router', t => {
  if (router) {
    return t.deepEqual(router.routes, routes, 'route set');
  } 
  
  t.fail('Router creation failed');
});