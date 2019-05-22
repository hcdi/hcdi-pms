const express = require('express')
const router = express.Router()
var model= require('../model/project')
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



//////////////////////////////////////////////////////////////////////////

router.get('/',(req,res,next)=>{
	if(req.query.phid){
		model.find({projectHolderId:req.query.phid}).sort({_id: 1}).exec((err,pr)=>{
			if(err){
				res.send('error occured' + JSON.stringify(err))
			}else{
				res.render('project',{title:'project', phid:req.query.phid, phname:req.query.phname, project:pr, user:req.session.user})	
			}
		})		
	}
	else if(req.query.action && req.query.action == 'editform' && req.query.id){
		//send edit form
		model.findById(req.query.id, (err, pr) => {
		    if(err){
				res.send('error occured' + JSON.stringify(err))
			}else{
				console.log(JSON.stringify(pr))
				res.render('project-edit',{title:'Edit Project Details', project:pr, user:req.session.user})	
			}
		});
	}	
})

router.post('/new',upload.single('projectImage'),(req,res,next)=>{
	const body = req.body
	body.user = req.session.user
	if(req.file && req.file.filename){
		body.image = req.file.filename
	}
	// console.log(JSON.stringify(body))
	if(body !== null){
		//save in db
		// console.log(req.route+JSON.stringify(body))
		model.create(body,function(err,proj){
			if(err){
				res.send(JSON.stringify(err))
			}else{
				// console.log('inserted data'+proj)
				res.redirect('/project?phid='+body.projectHolderId)
			}
		})
	}
})

router.post('/edit/:id', upload.single('projectImage'),(req,res,next)=>{
	const id = req.params.id
	const body = req.body
	body.user = req.session.user
	if(req.file && req.file.filename){
		body.image = req.file.filename
	}
	model.findByIdAndUpdate(id, body, (err, response)=>{
		res.redirect('/project?phid='+ body.projectHolderId + '#' + id)
	})
})

module.exports = router