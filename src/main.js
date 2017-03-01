require('./main.scss')
import Router from 'alpine-router/dist/es6/router';

const router = new Router([
    {
        path: '/',
        template: `<h1>Root</h1>`
    },
    {
        path: 'parent',
        template: `<h1>Parent</h1><router-outlet></router-outlet>`,
        children: [
            {
                path: 'child',
                template: `<h2>Child</h2>`
            }
        ]
    },
    {
        path: 'external',
        templateUrl: 'templates/example.html'
    }
]);

let navElements = {
    root: document.getElementById('demo-root'),
    parent: document.getElementById('demo-parent'),
    child: document.getElementById('demo-child'),
    external: document.getElementById('demo-external')
}

navElements.root.addEventListener('click', () => router.navigate('/'))
navElements.parent.addEventListener('click', () => router.navigate('parent'))
navElements.child.addEventListener('click', () => router.navigate('parent/child'))
navElements.external.addEventListener('click', () => router.navigate('external'))