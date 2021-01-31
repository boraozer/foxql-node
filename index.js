const node = require('./src/core/browser.js');

const Node = new node({
    crawlerOptions : {
        refreshDomainInterval : (1000 * 60) * 5,
        domainListRepo : 'https://raw.githubusercontent.com/boraozer/foxql-domain-whitelist/master/domain-list.json',
        maxDepth : 1,
        perRequestWaitTime : 1000
    }
});

Node.open([
    'master-client'
]);

Node.crawler.startCrawling();
