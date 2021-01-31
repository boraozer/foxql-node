'use-strict';

const puppeteer = require('puppeteer');    
const crawler = require('./crawler.js');

const clientPages = {
    'master-client' : `file://${__dirname}/../webrtc/master-client.html`
};

class foxqlNode {

    browser;
    pages = {};

    browserOptions = {
        defaultViewport: null,
        args: [
            "--no-sandbox",
            "--single-process"
        ],
        ignoreDefaultArgs: ['--disable-extensions']
    };

    crawler;

    constructor({browserOptions, crawlerOptions})
    {
        if(browserOptions !== undefined) {
            this.browserOptions = browserOptions;  
        }

        this.crawler = new crawler(crawlerOptions);
          
    }

    async open(pages)
    {
        this.browser =  await puppeteer.launch(this.browserOptions);

        pages.forEach( async pageName => {
            if(clientPages[pageName] !== undefined) {
                await this.openPage(pageName)
            }
        });
        
    }

    async openPage(pageName)
    {
        const pagePath = clientPages[pageName];

        const page = await this.browser.newPage();   
        await page.goto(pagePath)

        page.on('console', consoleObj => console.log(consoleObj.text()));

        this.pages[pageName] = page;
    }



}



module.exports = foxqlNode;