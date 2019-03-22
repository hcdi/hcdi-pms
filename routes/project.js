const express = require('express')
const router = express.Router()
var project= require('../model/project')
// let phcache = require('../lib/project-holder')
// let projcache = require('../lib/project')

router.get('/',(req,res,next)=>{
	// if(req.query.action){
	// 	if(req.query.action == 'new'){
	// 		res.render('project-new', {phc:phcache.phCacheArray})
	// 	}else if(req.query.action == 'edit'){

	// 	}
	// }else{
	// 	res.render('project',{title:'project',project:projcache.prCacheArray})
	// }
	if(req.query.phid){
		project.find({projectHolderId:req.query.phid}).sort({timeStamp: 'desc'}).exec((err,pr)=>{
			if(err){
				res.send('error occured' + JSON.stringify(err))
			}else{
				res.render('project',{title:'project', phid:req.query.phid, project:pr, user:req.session.user})	
			}
		})		
	}
	else if(req.query.action && req.query.action == 'editform' && req.query.id){
		//send edit form
		project.findById(req.query.id, (err, pr) => {
		    if(err){
				res.send('error occured' + JSON.stringify(err))
			}else{
				console.log(JSON.stringify(pr))
				res.render('project-edit',{title:'Edit Project Details', project:pr, user:req.session.user})	
			}
		});
	}	
})

router.post('/new',(req,res,next)=>{
	const body = req.body
	body.user = req.session.user
	if(body !== null){
		//save in db
		console.log(req.route+JSON.stringify(body))
		project.create(body,function(err,proj){
			if(err){
				res.send(JSON.stringify(err))
			}else{
				console.log('inserted data'+proj)
				res.redirect('/project?phid='+body.projectHolderId)
			}
		})
	}
})

router.post('/edit/:id',(req,res,next)=>{
	const id = req.params.id
	const body = req.body	
	project.findByIdAndUpdate(id, body, (err, response)=>{
		res.redirect('/project?phid='+ body.projectHolderId + '#' + id)
	})
})

module.exports = router