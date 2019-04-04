const express = require('express')
const router = express.Router()
var model= require('../model/project-holder')
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../hcdi-pms/public/img')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})
var upload = multer({ storage: storage })


router.get('/',async (req,res,next)=>{
	if(req.query.action && req.query.action == 'editform' && req.query.id){
		model.findById(req.query.id, (err, data) => {
		    if(err){
				res.send('error occured' + JSON.stringify(err))
			}else{
				res.render('projectholder-edit',{title:'Edit Project Holder', projectHolder:data, user:req.session.user})	
			}
		});
	}else if(req.query.psid){
		model.find({projectSupportId:req.query.psid}).sort({timeStamp: 'desc'}).exec((err,ph)=>{
			if(err){
				res.send('error occured' + JSON.stringify(err))
			}else{
				res.render('project-holder',{title:'project Holder', psid:req.query.psid, projectholder:ph, user:req.session.user})	
			}
		})		
	}
})

router.post('/new', upload.single('projectHolderImage'),(req,res,next)=>{
	const body = req.body
	body.user = req.session.user
	if(req.file && req.file.filename){
		body.image = req.file.filename
	}
	if(body !== null){
		//save in db
		model.create(body,function(err,projholder){
			if(err){
				res.send('error' + JSON.stringify(err))
			}else{
				res.redirect('/projectholder?psid='+body.projectSupportId)
			}
		})
	}
})

router.post('/edit/:id', upload.single('projectHolderImage'),(req,res,next)=>{
	const id = req.params.id
	const body = req.body
	body.user = req.session.user
	if(req.file && req.file.filename){
		body.image = req.file.filename
	}
	model.findByIdAndUpdate(id, body, (err, response)=>{
		if(err){
			res.send('Error <br>' + JSON.stringify(err))
		}else{
			return res.redirect('/projectholder?psid='+body.projectSupportId + '#' + id)
		}
	})
})

module.exports = router
