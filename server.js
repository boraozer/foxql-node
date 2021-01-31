const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
let documentList = [];

app.use(cors())

app.use(bodyParser.json());



app.post('/push', function (req, res) {
    documentList.push(req.body);
    return res.json({
        status : true
    });
})

app.get('/pop', function (req, res){
    const doc = documentList.pop();
    if(doc !== undefined) {
        return res.json(doc);
    }

    return res.json({
        status : false
    });
    
});


app.listen(1923, ()=>{
    console.log('running on 1923 port')
});