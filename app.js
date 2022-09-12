const express = require("express");
const bodyParser = require("body-parser");
const csv = require("csv-parser");
const fs = require("fs");
const app = express();
const results = [];
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'data.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'email', title: 'EMAIL'},
        {id: 'password', title: 'PASSWORD'}
    ]
});

 

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req, res){
    res.sendFile('views/index.html', {root: __dirname });
})

app.post("/save",function(req, res){
    let name = req.body.name;
    let email = req.body.email;
    let password1 = req.body.password1;
    let password2 = req.body.password2;
    if (password1 !== password2){
        res.send("<h1>password does not match</h1>")
    }
    const records = [
        {name: name,  email: email, password: password1}
    ];
    csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
        res.send("<h1>Successfully registered.</h1>")
    });
});

app.post("/check",function(req, res){
    fs.createReadStream('data.csv')
    .pipe(csv({}))
    .on("data", (data) => results.push(data))
    .on("end", () => {
        ;
        let userName = req.body.name;
        let password = req.body.password;
        if (results[0]['name'] == userName && results[0]['password'] == password){
            // console.log("Yes");
            res.sendFile('views/success.html', {root: __dirname });
        }else{
            // console.log("No");
            res.send("<h1>Please enter the correct password and username</h1>")
        }
    })

})



app.listen(3000, function(){
    console.log("This app is working on 3000");
});



 




