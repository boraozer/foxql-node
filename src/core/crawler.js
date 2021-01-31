const domainList = require('../utils/domainList.js');
const request = require('./request.js');
const cheerio = require('cheerio');

class crawler {

    queue = [];

    domainList = [];

    maxDepth = 2;

    perRequestWaitTime = 1000;

    constructor({domainListRepo, refreshDomainInterval, maxDepth, perRequestWaitTime})
    {
        this.maxDepth = maxDepth || 2;
        this.perRequestWaitTime = perRequestWaitTime || 2;

        this.domainList = domainList.load(domainListRepo);
        setInterval(()=>{
            this.domainList = domainList.load(domainListRepo);
            console.log('Domain listesi yenileniyor...')
        }, refreshDomainInterval || (1000 * 60) * 10);
    }

    async startCrawling()
    {
        const queueInterval = setInterval(async ()=>{
            const domainList = await this.domainList;
            if(domainList.length <= 0) {
                console.log("Domain listesi şuanda boş.")
                return;
            }

            this.domainListProcess(domainList)
            clearInterval(queueInterval)
        }, 1000);


        setInterval(async ()=>{
            if(this.queue.length <= 0){
                return false;
            }

            const uri = this.queue.pop();
            const html = await request.getHtml(uri);
            
            const document = this.generateDocument(html, uri);

            if(document) {
                await request.post('http://127.0.0.1:1923/push', document);
            }
            

        }, this.perRequestWaitTime);


    }

    async domainListProcess(domainList)
    {
        const domain = domainList.pop();
        
        const html = await request.getHtml(domain.url);
        this.queue.push(domain.url);
        this.extractLinks(html);

        if(domainList.length > 0) {
            this.domainListProcess(domainList)
        }
    }

    extractLinks(body)
    {
        let self = this;
        try {
            const $ = cheerio.load(body);
            let links = $('a'); //jquery get all hyperlinks
            $(links).each(function(i, link){
                let pageUrl = $(link).attr('href');
                if(typeof pageUrl != 'string') {
                    pageUrl = '';
                }
                if(pageUrl.indexOf('http') > -1){
                    self.queue.push(pageUrl);
                }
            });   
        }catch(e)
        {
            console.log('extractLinks parse error.')
            return false
        }
    }




    generateDocument(body, uri)
    {
        try {
            const $ = cheerio.load(body);
            const title = $('title').text() || '';

            if(title == '') {
                return false;
            }

            const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';

            return {
                title : title,
                url : uri,
                description : description,
                domain : this.extractDomain(uri)

            };
        }catch(e)
        {
            return false;
        }
    }

    extractDomain(url) {
        var result
        var match
        if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
            result = match[1]
            if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
                result = match[1]
            }
        }
        return result
    }





    



}




module.exports = crawler;