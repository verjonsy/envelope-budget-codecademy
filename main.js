const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//array of objects
let envelopesObj = [
    {
        ID: 1,
        title: "Entertainment",
        budget: 100

    },
    {
        ID: 2,
        title: "Utilities",
        budget: 200
       
    },
    {
        ID: 3,
        title: "Food",
        budget: 300

    }
]
//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json())

//testing connection
app.get('/', (req, res) => {
    res.send('App is working!')
});

//enpoints
//get all envelopes
app.get('/envelopes', (req, res, next) => {
    let jsonString = JSON.stringify(envelopesObj);
    res.status(200).send(`Get envelopes OK! ${jsonString}`)
})

//add envelops
app.post('/envelopes', (req,res,next) => {
    //request query to add new 
    let reqObj = {}
    reqObj["ID"] = req.query.ID;
    reqObj["title"]= req.query.title;
    reqObj["budget"]= req.query.budget;
    
    //envelopesObj.push({"ID": reqId, "title": reqTitle, "budget": reqBudget})
    envelopesObj.push(reqObj)
    let jsonString = JSON.stringify(envelopesObj);
    res.send(`envelope created! ${jsonString}`)
})

//get specific envelop
app.get('/envelopes/:ID', (req, res, next) =>{
    let selectedID = req.params.ID;
    let selectedObject = {};
    //finding ID in array
    for(let i = 0; i < envelopesObj.length; i++){
        if (envelopesObj[i]["ID"] == selectedID){
            selectedObject = envelopesObj[i];
        }
    }
    try{
        if(JSON.stringify(selectedObject) != '{}'){
            res.send(`Object selected: ${JSON.stringify(selectedObject)}`);
        }else{
            throw new Error(e)
        }
    }catch(e){
        res.status(404).send(`ID ${selectedID} not found`)
    }
})

//modify envelops
app.put('/envelopes/:ID', (req, res, next) =>{
    let selectedID = req.params.ID;
    let selectedObject = {};
    //finding ID in array
    for(let i = 0; i < envelopesObj.length; i++){
        if (envelopesObj[i]["ID"] == selectedID){
            selectedObject = envelopesObj[i];
        }
    }
    try{
        if(JSON.stringify(selectedObject) != '{}'){
            if(req.query.budget){
                selectedObject["budget"] =  req.query.budget;
            }
            if(req.query.title){
                selectedObject["title"] =  req.query.title;
            }
            res.send(`Object updated: ${JSON.stringify(selectedObject)}`);
        }else{
            throw new Error(e)
        }
    }catch(e){
        res.status(404).send(`ID ${selectedID} not found`)
    }
})

//subtract from envelope budget
app.post('/envelopes/budget/:ID', (req, res, next) =>{
    let selectedID = req.params.ID;
    let moneySpent = req.query.spend;
    let selectedObject = {};
    //finding ID in array
    for(let i = 0; i < envelopesObj.length; i++){
        if (envelopesObj[i]["ID"] == selectedID){
            selectedObject = envelopesObj[i];
        }
    }
    try{
        if(JSON.stringify(selectedObject) != '{}'){

            if(selectedObject["budget"] >= moneySpent){
                selectedObject["budget"] -= moneySpent;
            }else if(moneySpent == null){
                throw new Error("'spend' amount is not specified")
            }else{
                throw new Error("budget is overlimit")
            }
            
            res.send(`Object selected: ${JSON.stringify(selectedObject)}`);
        }else{
            throw new Error(`ID ${selectedID} not found.`)
        }
    }catch(e){
        res.status(404).send(`${e}`)
    }
})

//delete envelopes (with high order filter function e.g for(filter))
    app.delete('/envelopes/:ID', (req,res,next) => {
        try{
            //remove by filter, excluding selected object
            let envelopeRemain = envelopesObj.filter((envelope) => {
                return String(envelope.ID) != req.params.ID
            })
            // assign global array to filtered result
            envelopesObj = envelopeRemain;
            res.send(`Obj removed. Remain: ${JSON.stringify(envelopeRemain)}, requested delete ID ${req.params.ID}`)
            
            
        }catch(e){
            res.status(404).send(`something went wrong at deletion`)
        }
        
        
    })
//server listen
app.listen(port, () => {
    console.log(`app is listening on ${port}`)
});


