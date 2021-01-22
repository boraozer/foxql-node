const node = require('./src/core/browser.js');

const Node = new node({
    browserOptions : {
        headless : false
    }
});

Node.open([
    'master-client'
]);