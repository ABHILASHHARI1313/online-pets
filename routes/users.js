var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

require('../schemas/petSchema')

const loginModel = mongoose.model('logininfo')
const petModel = mongoose.model('petdetails')


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
      res.redirect('/')
    }
  })
})


router.post('/uploadpet', async (req, res) => {
  console.log("upload pet api called")

  const image1 = req.files.image1
  const image2 = req.files.image2
  const image3 = req.files.image3

  const timestamp = Date.now();

  image1.mv('./public/petimages/' + req.session.userID + timestamp + "(1).jpg")
  image2.mv('./public/petimages/' + req.session.userID + timestamp + "(2).jpg")
  image3.mv('./public/petimages/' + req.session.userID + timestamp + "(3).jpg")

  const data = req.body
  data.userID = req.session.userID
  data.image1 = `${req.session.userID}${timestamp}(1).jpg`
  data.image2 = `${req.session.userID}${timestamp}(2).jpg`
  data.image3 = `${req.session.userID}${timestamp}(3).jpg`

  try {
    const newModel = new petModel(data)
    console.log(newModel)
    await newModel.save()
  } catch (error) {
    console.log("error in uploading pet",error)
  }

 

  res.redirect(`/list?category=${req.body.category}`)

})




module.exports = router;
