var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ProjectSchema = new Schema({
  name:String,
  projectHolderId: Schema.Types.ObjectId,
  location:String,
  projectDirector:String,
  directorPhone:String,
  directorEmail:String,
  coordicator:String,
  coordicatorPhone:String,
  coordicatorEmail:String,
  address1:String,
  socialWorker:String,
  socialWorkerPhone:String,
  socialWorkerEmail:String,
  quota:Number,
  numberOfChildren:Number,  
  timeStamp:{type:Date,default:Date.now},
  user:String
})
module.exports = mongoose.model('Project',ProjectSchema)