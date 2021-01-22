const puppeteer = require('puppeteer');    

const clientPages = {
    'master-client' : `file://${__dirname}/../webrtc/master-client.html`
};


class foxqlNode {

    browser;
    pages = {};

    browserOptions = {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    };

    constructor({browserOptions})
    {
        if(browserOptions !== undefined) {
            this.browserOptions = browserOptions;  
        }
          
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

        this.pages[pageName] = page;
    }



}



module.exports = foxqlNode;