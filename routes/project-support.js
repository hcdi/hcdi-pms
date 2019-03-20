const express = require('express')
const router = express.Router()
const ps= require('../model/project-support')

router.get('/',async (req,res,next)=>{
	if(req.query.action){
		if(req.query.action == 'new'){
			res.render('project-support-new')
		}else if(req.query.action == 'edit'){

		}
	}else{
		ps.find({}).sort({timeStamp: 'desc'}).select('_id name place personincharge').exec((err,ps)=>{
			if(err){
				res.send('error occured' + JSON.stringify(err))
			}else{
				res.render('project-support',{title:'project Support',projectSupport:ps})	
			}
		})
			
	}
})

router.post('/new',(req,res,next)=>{
	const body = req.body
	body.user = req.session.user
	if(body !== null){
		//save in db
		console.log(JSON.stringify(body))
		ps.create(body,function(err,projsupp){
			if(err){
				res.send('error')
			}else{
				console.log('inserted data'+projsupp)
				res.redirect('/projectSupport')
			}
		})
	}
	
})

router.get('/delete/:id',(req,res,next)=>{
	const id = req.params.id
	ps.findByIdAndRemove(id, (err, projSupport) => {
	    if(err){
			res.send(err)
		}else{
			res.redirect('/projectSupport')
		}
	});
})



module.exports = router