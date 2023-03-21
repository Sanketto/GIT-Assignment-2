const router = require('express').Router();
const jwt = require("jsonwebtoken");
const { Schema } = require('mongoose');
const Blog = require('../models/User')
const PRIVATE_KEY = 'RANDOMIZER'

// Your routing code goes here

router.post('/register', (req, res)=>{
    const {name, email, password} = req.body;
    Blog.create({
        name: name,
        email: email,
        password: password
    },(err, newBlog)=>{
        if(err) console.log(err);
        else {
            newBlog.save();
            res.json({status: 'success',
                result: newBlog
            })
        }
    })
    
})

router.post('/login', (req,res,next)=>{
    const {email, password} = req.body
    Blog.findOne({email: email,password: password}, (err, authUsr)=>{
        if(err) {
            console.log(err);
            return
        }
        const token = jwt.sign(
            {email: email},
            PRIVATE_KEY
            )
            next();
        res.send({
            status: 'Sucess',
            token: token
        })

    })
})

router.post('/posts', (req,res,next)=>{
    const token = req.headers.authorization;
    const {title, comment, image} = req.body
    const decodedToken = jwt.verify(token, PRIVATE_KEY);
    const email = decodedToken.email;
    Blog.findOne({email: email},(err,authUsr)=>{
        if(err){
            console.log(err);
            return
        }
        const post={
            title: title,
            comment: comment,
            image: image
        }
        authUsr.post = [...authUsr.post, post]
        authUsr.save()
        res.send({
            status: "Post created",
            body: authUsr.post
        })
    })
})

// router.put('/blog/:topic',(req, res)=>{
//     const {description, posted_at, posted_by} = req.body;
//     Blog.findOneAndUpdate({topic: req.params.topic},
//         {
//             description: description,
//             posted_at: posted_at,
//             posted_by: posted_by
//         },{returnOriginal: false},(err, updBlog)=>{
//             if(err) {
//                 console.log(err);
//             return
//         }
            
//             res.send({
//                 status: (updBlog)?'success' : 'failed',
//                 result: (updBlog)?updBlog : 'not found'
//             })})
// })

// router.delete('/blog/:topic',(req, res)=>{
//     const {topic} = req.params;
//     Blog.findOneAndDelete({topic: topic},(err, deletedBlog)=>{
//         if(err) console.log(err);
//         else{
//             res.send({
//                 status: (deletedBlog)? 'success' : 'failed',
//                 result: (deletedBlog)? deletedBlog : 'not found'
//             })
//         }
//     })
// })


module.exports = router;