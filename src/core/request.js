const fetch = require('node-fetch');



exports.getJson = async (url)=>{
    const request = await fetch(url);
    return await request.json()
}

exports.getHtml = async (url)=>{
    const request = await fetch(url);
    return await request.text()
}

exports.post = async(url, body) =>{
    await fetch(url, {
        method : 'POST',
        body : JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });

    return true;
}