const {MongoClient}= require('mongodb')

let dbconnection
function connecttodb(callback){
    MongoClient.connect('mongodb+srv://veerakumar:2003@expensetracker.e8yrl7g.mongodb.net/Expensetracker?retryWrites=true&w=majority').then(function(client){
        dbconnection = client.db()
        callback()
    }).catch(function(error){
        callback(error)
    })
}

function getdb(){
return dbconnection
}

module.exports = {connecttodb,getdb}