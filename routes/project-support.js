const express = require('express')
const router = express.Router()
const ps= require('../model/project-support')
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
		//send edit form
		ps.findById(req.query.id, (err, ps) => {
		    if(err){
				res.send('error occured' + JSON.stringify(err))
			}else{
				console.log(JSON.stringify(ps))
				res.render('projectSupport-Edit',{title:'Edit Project Support', projectSupport:ps, user:req.session.user})	
			}
		});
	}else{
		ps.find({}).sort({timeStamp: 'desc'}).exec((err,ps)=>{
			if(err){
				res.send('error occured' + JSON.stringify(err))
			}else{
				res.render('project-support',{title:'project Support',projectSupport:ps, user:req.session.user})	
			}
		})
			
	}
})

router.post('/new', upload.single('projectSupportImage'),(req,res,next)=>{
	const body = req.body
	body.user = req.session.user
	body.image = req.file.filename
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

router.post('/edit/:id', upload.single('projectSupportImage'),(req,res,next)=>{
	const id = req.params.id
	const body = req.body
	body.user = req.session.user
	body.image = req.file.filename
	ps.findByIdAndUpdate(id, body, (err, response)=>{
		return res.redirect('/projectSupport' + '#' + id)
	})
})



module.exports = router