const express = require('express')
const router = express.Router()
var model= require('../model/project-holder')
var projSupportModel = require('../model/project-support')
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
				res.render('project-holder',{title:'project Holder', psid:req.query.psid, psname:req.query.psname, projectholder:ph, user:req.session.user})	
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
				res.status(500).send('error' + JSON.stringify(err))
			}else{
				projSupportModel.update(
					{_id:body.projectSupportId},
					{$addToSet:{ProjectHolders:projholder._id}},
					function(err,projSupport){
						if(err){
							res.status(500).send('error could not add item to project Support')
						}else{
							res.redirect('/projectholder?psid='+body.projectSupportId)
						}
				})
				// res.redirect('/projectholder?psid='+body.projectSupportId)
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

// db.projectsupports.update(
//     {_id : ObjectId("5ccabf1d1fec03154898b32f") },
//     { $pull: { ProjectHolders: ObjectId("5ccabf551fec03154898b331") } }
// )

module.exports = router
