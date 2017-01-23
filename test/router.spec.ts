import test from 'ava';
import {default as Router, Route} from '../src/router';

let router: Router;
let routes: Route[] = [
  {
    path: '/',
    template: `<h1>Hello World!</h1>`
  },
  {
    path: 'home',
    template: `<h1>Home</h1>`
  },
  {
    path: 'foo/bar',
    template: `<h1>Foo Bar</h1>`
  }
];

test.before(t => {
  router = new Router(routes)
});

test('create and set routes', t => {
  if (router) {
    return t.deepEqual(router.routes, routes, 'Routes not set properly');
  } 
  
  t.fail('Router creation failed');
});

test('get route path with empty string', (t) => {
  let path = '';
  let expected = [''];
  let result = router.getPathTokens(path);

  t.deepEqual(result, expected, 'Tokens do not match expectations');
});

test('get route path containing only /', (t) => {
  let path = router.routes[0].path;
  let expected = [''];
  let result = router.getPathTokens(path);

  t.deepEqual(result, expected, 'Tokens do not match expectations');
});

test('get route path with a single token', (t) => {
  let path = router.routes[1].path;
  let expected = ['home'];
  let result = router.getPathTokens(path);

  t.deepEqual(result, expected, 'Tokens do not match expectations');
});

test('get route path with multiple tokens', (t) => {
  let path = router.routes[2].path;
  let expected = ['foo', 'bar'];
  let result = router.getPathTokens(path);

  t.deepEqual(result, expected, 'Tokens do not match expectations');
});

test('match top level path', (t) => {
  t.true(router.navigate(router.routes[0].path), 'Path not matched');
});

test('match child route', (t) => {
  t.skip;
});

test('match wild card', (t) => {
  t.skip;
});

test('update url', (t) => {
  let path = router.routes[1].path;
  router.navigate(router.routes[1].path);

  t.deepEqual(location.hash, '#/' + path, 'Url not updated properly');
})