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
  },
  {
    path: 'parent',
    template: '<h1>Parent Route</h1><router-outlet></router-outlet>',
    children: [
      {
        path: 'child',
        template: '<h2>Child Route</h2>'
      }
    ]
  },
  {
    path: '*',
    template: '<h1>404</h1>'
  }
];

test.before(t => {
  document.body.innerHTML = '<router-outlet></router-outlet>'
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

test('get tokens from path with multiple slugs', (t) => {
  let path = router.routes[2].path;
  let expected = ['foo', 'bar'];
  let result = router.getPathTokens(path);

  t.deepEqual(result, expected, 'Tokens do not match expectations');
});

test('match route containing only /', (t) => {
  t.true(router.navigate(router.routes[0].path), 'Path containing only / not matched');
});

test('match route containing only one slug', (t) => {
  t.true(router.navigate(router.routes[1].path), 'Path not matched');
});

test('match route containing multiple slugs', (t) => {
  t.true(router.navigate(router.routes[2].path), 'Path with multiple slugs not matched');
});

test('match child route', (t) => {
  t.true(router.navigate(router.routes[3].path + '/' + router.routes[3].children[0].path))
})

test.skip('match wild card', (t) => {
  t.true(router.navigate('thatsNoMoon'));
});

test('update url without base href', (t) => {
  let path = router.routes[1].path;
  let expectedPath = '#/' + path;
  router.navigate(router.routes[1].path);

  t.deepEqual(location.hash, expectedPath, 'Url not updated properly without base href');
});