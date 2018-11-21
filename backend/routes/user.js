const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


router.post('/signup', (req,res,next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
    });
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'User created',
          result: result
        });
      }).catch(err => {
        res.status(500).json({
          error: {
            message: 'Invalid authentication credentials',
          }
        });
      });
  });
});

router.post('/login',(req, res, next) => {
  let fetcheduser;
  User.findOne({ email: req.body.email}).then(user => {
      if(!user){
        return res.status(401).json({
            message:'Authentication Failed'
        });
      }
      fetcheduser = user;
      return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if(!result){
      return res.status(401).json({
        message: 'Auth Failed'
      })
    }
    const token = jwt.sign({ email: fetcheduser.email, userId: fetcheduser._id},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetcheduser._id
        })
  }).catch(err => {
    return res.status(401).json({
      error: {
        message:'Invalid Authentication Credinatials'
      }
    });
  });
});

module.exports = router;
