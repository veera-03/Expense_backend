const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {connecttodb, getdb} = require('./dbconnection.cjs')
const app = express()
const{ObjectId} = require('mongodb')
app.use(bodyParser.json())
app.use(cors())

// Importing the required functions from dbConnection.cjs
//  function first(secondcall){
// app.get('/', function(request, response) {
//     response.send('working fine...')
   let db
connecttodb(function(error){
if(error){
    console.log('could not connect database')
}
else{
    const port = process.env.PORT || 8000
    app.listen(port)
    db = getdb()
    console.log(`running in the port ${8000}`)
}
})

app.post('/add-entry',function(request, response){
    db.collection('Expensesdata').insertOne(request.body).then(function(){
        response.status(201).json({
            "Status":"Entry added successfully"
        })
    }).catch(function(){
        response.status(500).json({
            "Status": "Entry not added"
        })
    })
})

 
app.get('/findentries',function(request, response){
    const entries = []
    db.collection('Expensesdata').find()
    
    .forEach(entry => entries.push(entry))
    .then(function(){
        response.status(200).json(entries)
    }).catch(function(){
        response.status(500).json({
            "status": "could not fetch data"
        })
    })

})

// app.delete('/deleteentry', function(request, response) {
//     // if(ObjectId.isValid(request.query.id)) {
//         db.collection('Expensesdata').deleteOne({
//             _id : new ObjectId('65c0b6ef3ce19d5c9772557f')
//         }).then(function() {
//             response.status(200).json({
//                 "status" : "Entry successfully deleted"
//             })
//         }).catch(function() {
//             response.status(500).json({
//                 "status" : "Entry not deleted"
//             })
//         })

app.delete('/deleteentry', function(request, response) {
    if(ObjectId.isValid(request.query.id)) {
        db.collection('Expensesdata').deleteOne({
            _id : new ObjectId(request.query.id)
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})
app.patch('/update-entry/:id', function(request, response) {
    if(ObjectId.isValid(request.params.id)) {
        db.collection('ExpensesData').updateOne(
            { _id : new ObjectId(request.params.id) }, // identifier : selecting the document which we are going to update
            { $set : request.body } // The data to be updated
        ).then(function() {
            response.status(200).json({
                "status" : "Entry updated successfully"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Unsuccessful on updating the entry"
            })
        })
    } else {
        response.status(500).json({
            "status" : "give valid Objectid (ObjectId not valid)"
        })
    }
})