const request = require('../core/request.js')


exports.load = async (repo)=>{
    const body = await request.getJson(repo);

    let list = [];

    body.forEach( item => {
        item.currentDepth = 0;
        list.push(item);
    });

    return list;

}