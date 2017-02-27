# Router
[![CircleCI](https://circleci.com/gh/Mandosis/router.svg?style=svg)](https://circleci.com/gh/Mandosis/router)

A no dependancy client-side router featuring child routes.

# Instructions

Create a new router in your JavaScript file

```javascript
import Router from 'router';

const router = new Router([
  {
    path: '/',
    template: `<h1>Hello World!</h1>`
  }
]);
```

In your html file add the outlet
```html
<router-outlet></router-outlet>
```

To change routes use the navigate function
```javascript
router.navigate('/');
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
