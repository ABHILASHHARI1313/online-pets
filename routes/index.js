var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

require('../schemas/loginschema')

const loginModel = mongoose.model('logininfo')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
}); 


router.get('/about', function (req, res, next) {
  res.render('about');
});

router.get('/signin', function (req, res, next) {
  res.render('signin');
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  console.log("signup called")
  let userExist = await loginModel.findOne({ email: req.body.email })
  if (userExist) {
    res.render('signup', { emailErr: 'Email already taken' });
  } else {
    const newModel = new loginModel()
    newModel.name = req.body.name
    newModel.email = req.body.email
    newModel.password = req.body.password
    try {
      await newModel.save().then((response) => {
        console.log("login info inserted", response)
        res.render('signin');
      })
    } catch (error) {
      console.log('error in inserting login info', error)
    }
  }
  console.log(req.body)

})


router.post('/signin', async (req, res) => {
  console.log("sign in api called")
  console.log(req.body)
  let userExist = await loginModel.findOne({ name: req.body.name })
  if (userExist) {
    console.log("User exist")
    if (userExist.password == req.body.password) {
      req.session.name=req.body.name
      req.session.userID=userExist._id
      res.render('index',{name:req.body.name});
     console.log("logged in")
    } else {
      res.render('signin',{ passErr: "password error" })
      console.log("pass err")
    }   
  } else {
    res.render('signin',{nameErr:'username not registerd'});
    console.log("user not registerd")
  }
})



module.exports = router;
