var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

require('../schemas/loginschema')

const loginModel = mongoose.model('logininfo')

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.query.name)
  console.log(req.session)
  if (req.session.name) {
    res.render('index', { name: req.session.name });

  } else {
    res.render('index')
  }
});


router.get('/about', function (req, res, next) {
  res.render('about');
});


router.get('/contact', function (req, res, next) {
  res.render('contact');
});

router.get('/gallery', function (req, res, next) {
  res.render('gallery');
});


router.get('/upload', function (req, res, next) {
  res.render('userin');
});




router.get('/signin', function (req, res, next) {
  res.render('login');
});


router.get('/list', (req, res) => {
  res.render('list')
})

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  console.log("signup called")
  let userExist = await loginModel.findOne({ email: req.body.email })
  if (userExist) {
    res.send({ message: "email already exist" });
    console.log("email already exists")
  } else {
    const newModel = new loginModel()
    newModel.name = req.body.name
    newModel.email = req.body.email
    newModel.password = req.body.password
    await newModel.save().then((response) => {
      console.log("login info inserted")
      res.send({ message: "user created" })

    })


  }

})


router.post('/signin', async (req, res) => {
  console.log("sign in api called")
  let userExist = await loginModel.findOne({ email: req.body.email })
  if (userExist) {
    if (userExist.password == req.body.password) {
      req.session.name = userExist.name
      req.session.userID = userExist._id
      res.send({ message: "user loggedin", name: userExist.name })
      console.log("logged in")
    } else {
      res.send({ message: "password error" })
      console.log("password error")
    }
  } else {
    res.send({ message: "email not registerd" })
    console.log("email not registerd")
  }
  console.log(req.session)
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send({ message: "error in logout" })
    }
    else {
      res.render('index')
    }
  })
})



module.exports = router;
