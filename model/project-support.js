var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ProjectSupportSchema = new Schema({
  name:String,
  place:String,
  personincharge:String,
  address1:String,
  address2:String,
  phone:String,
  email:String,
  image:String,
  timeStamp:{type:Date,default:Date.now},
  user:String,
  ProjectHolders: [{ type: Schema.Types.ObjectId, ref: 'ProjectHolder' }]
})
module.exports = mongoose.model('ProjectSupport',ProjectSupportSchema)