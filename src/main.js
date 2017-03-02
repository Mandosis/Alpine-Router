require('./main.scss')

import Router from 'alpine-router';

const router = new Router([
    {
        path: '/',
        template: `<h1>Hello!</h1><p>Use the buttons above to change routes!</p>`
    },
    {
        path: 'parent',
        template: `<h1>Parent Route</h1><p>Child routes will be rendered below!</p><router-outlet></router-outlet>`,
        children: [
            {
                path: 'child',
                template: `<h2>Child Route</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque egestas iaculis leo quis viverra. Duis sodales nulla sem, vitae congue sapien luctus eget. Sed feugiat aliquam dapibus. Cras elementum, leo sed laoreet pulvinar, nunc nulla auctor lectus, in blandit est mauris ut sem. Sed a nibh urna. Etiam eget aliquam augue. Nunc id ornare justo, in finibus nibh. Nunc mattis, metus nec volutpat tempus, nisl sem sodales dolor, nec tincidunt ipsum mauris nec ex.</p>`
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