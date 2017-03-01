# Alpine Router
[![CircleCI](https://circleci.com/gh/Mandosis/Alpine-Router.svg?style=svg)](https://circleci.com/gh/Mandosis/Alpine-Router)

A client-side router with no dependencies featuring child routes and built with the ES2015 JavaScript feature set using TypeScript.

**Planned Features:**

- Wild Card Routes
- Parameters
- Protected Routes (Auth Guard)
- `routerLink` element attribute to navigate to the assigned route on click

# Instructions

## Install

```
npm i -s alpine-router
```

## Initialize Router

### ES2015+ or TypeScript
```javascript
import Router from 'alpine-router';

const router = new Router([
  {
    path: '/',
    template: `<h1>Hello World!</h1>`
  }
]);
```

### Browser Ready

Load the library using. For compatability with Internet Explorer or older browsers polyfills are required for `window.fetch` and the `Map` global object.

```html
<script src="dist/browser/router.js"></script>
```

Then initilize the router

```javascript
var router = new AlpineRouter.default([
  {
    path: '/',
    template: `<h1>Hello World!</h1>`
  }
]);
```

## Add Base Tag
If you wish to use hash urls (`index.html#/example`) instead or are loading from a file system instead of a server do not add the base tag.

```html
<base href="/" />
```

## Navigate

To change routes use the navigate function
```javascript
router.navigate('/');
```

## Child Routes

Child routes are nested inside a parent route using the `children` property. For the child route to load a `<router-outlet>` tag is required in the parents template.

```javascript
const router = new Router([
  {
    path: 'parent',
    template: `<h1>Parent</h1><router-outlet></router-outlet>`,
    children: [
      {
        path: 'child',
        template: `<h2>Child</h2>`
      }
    ]
  }
]);
```

## External Templates

To retrieve an external template, use `templateUrl` property instead of `template`.

```javascript
const router = new Router([
  {
    path: 'remote',
    templateUrl: 'partials/example.html'
  }
]);
```


# Development

Clone the repository and run `yarn`.

**Commands:**
- To build the project run `yarn run build`
- To watch files for changes and build run `yarn run watch`
- To run unit tests run `yarn run test`
- To run tests automatically run `yarn run test-watch` and in a new tab or window `yarn run ava-watch`

# License
MIT License

Copyright (c) 2017 Chris Rabuse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
