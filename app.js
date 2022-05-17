//jshint esversion:12

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// =====================================================

mongoose.connect("mongodb://localhost:27017/webPost",{useNewUrlParser: true});
const postSchema = mongoose.Schema({
  author:String,
  title : String,
  postD : String
})
const post = mongoose.model("Post",postSchema);
const post1 = new post({
  author:"Utkristi Web",
  title :"Welcome to Utkristi.io",
  postD:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus saepe eaque omnis magni quis eius, totam deleniti tempore quibusdam impedit magnam explicabo quae soluta id dolorem culpa sint hic repellat ut ratione quam veritatis possimus? Aut sunt aspernatur perspiciatis atque molestias ex id, ducimus dignissimos dicta voluptate dolores culpa eligendi!"
});

post.count((err,count)=>{
  if(!err && count===0){
    post1.save();
  }
});


// ==================================================

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// ==================================================

var posts = [];

app.get('/',(req,res)=>{
  //  res.render('home',{homecontent:homeStartingContent , posts:posts})
    post.find({},(err,postR)=>{
    res.render('home',{
      homecontent:homeStartingContent , 
      posts:postR
    })
  })
})
// app.post('/',(req,res)=>{
  
// })
app.get('/about',(req,res)=>{
  res.render('about',{about:aboutContent})
})
app.get('/contact',(req,res)=>{
  res.render('contact',{contact:contactContent})
})
app.get('/compose',(req,res)=>{
 res.render('compose');
});
app.post('/compose',(req,res)=>{
  var post_Author = req.body.postAuthor;
  var post_Title = req.body.postTitle;
  var post_Content = req.body.postContent;
  if(post_Title!="" && post_Content!=""){
    // const postContent = {
    //    Title : post_Title ,
    //   Content : post_Content
    // }
    const postContent = new post({ 
          author:post_Author,
          title :post_Title,
          postD :post_Content
        })
    postContent.save();
    }
    res.redirect('/');
})

// render each blog post using **Express Route Parameters**
app.get('/posts/:postID',(req,res)=>{
  // const reqTitle = _.lowerCase(req.params.postName);
  const reqID = req.params.postID;

  // posts.forEach(function(post){
  //   const storeTitle = _.lowerCase(post.Title);

  //   if(storeTitle === reqTitle){
  //     res.render('post',
  //      { title : post.Title ,
  //        content : post.Content
  //       }
  //       )
  //   }
  // })
  post.findOne({_id:reqID},(err,postC)=>{
   if(!err){ res.render('post',{title : postC.title , content : postC.postD , author : postC.author});}
   else{
     res.render('error');
   }
  })
console.log(reqID);
})
app.get('/posts',(req,res)=>{
  res.redirect('/');
})
app.get('/posts/:NavT',(req,res)=>{
  console.log( _.lowerCase(req.params.NavT));
  // res.redirect('/'+ _.lowerCase(req.params.NavT));
})
app.listen(3000,()=>{
  console.log("Running on Port:3000");
})