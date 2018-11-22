const Post = require('../models/post');


exports.createPost = (req,res,next)=>{
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath : url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
    message: 'Post added Succesfully',
    post :{
      ...createdPost,
      id: createdPost._id
    }
  });
  }).catch(error => {
    res.status(500).json({
      error : {
        message: 'Creating post failed!'
      }
    })
  });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({ error: {message: "Update successful!" }});
    }else {
      res.status(401).json({ error: {message: "Not authorized!"}});
    }
  }).catch(error => {
    res.status(500).json({
      error: {
        message:'Could not update post!'
      }
    })
  });
}

exports.fetchPosts = (req,res,next) =>{
  const pageSize = +req.query.pagesize; //+sign converts into numbers default returns string
  const currentPage = +req.query.page;
  const postQuery = Post.find()
  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.find()
  .then(documents => {
      fetchedPosts = documents;
      return Post.count();
  })
  .then(count => {
      res.status(200).json({
      message : 'Post Fetched Sucessfully',
      posts:fetchedPosts,
      maxPosts: count
      });
  }).catch(error => {
    res.status(500).json({
      error: {
        message: 'Fetching Post Failed'
      }
    })
  });
}

exports.fetchPostById = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message : 'Post not Found'});
    }
  }).catch(error => {
    res.status(500).json({
      error: {
        message: 'Fetching Post Failed'
      }
    })
  });
}

exports.deletePost = (req , res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if (result.n > 0) {
      res.status(200).json({message : 'Post Deleted!'});
    }else{
      res.status(401).json({message : 'Post Deleting Failed!'});
    }
  }).catch(error => {
    res.status(500).json({
      error : {
        message: 'Deleting Post Failed'
      }
    })
  });;
}
