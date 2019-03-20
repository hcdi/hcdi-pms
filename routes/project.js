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



module.exports = router