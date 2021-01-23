const node = require('./src/core/browser.js');

const Node = new node({
    browserOptions : {
        headless : true
    }
});

Node.open([
    'master-client'
]);