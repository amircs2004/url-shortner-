const mongoose = require('mongoose')
const user = require('./user')
const UrlSchema = new mongoose.Schema({
    urlId : {
        type : String , 
        required : true , 
        unique : true 
    } ,
    longUrl : {
        type : String , 
        required : true , 
    } , 
    createdAt : {
        type : Date , 
        default : Date.now , 
        expires: 86400
    } , 
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    }
})
module.exports = mongoose.model('Url' ,UrlSchema  )