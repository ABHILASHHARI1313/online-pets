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

function verifylogin(req, res, next) {
  if (!req.session.userID) {
    res.redirect('/signin')
  }
  next()
}


router.get('/about', function (req, res, next) {
  res.render('about', { name: req.session.name });
  console.log(req.session)
});


router.get('/contact', function (req, res, next) {
  res.render('contact', { name: req.session.name });
});

router.get('/gallery', function (req, res, next) {
  res.render('gallery', { name: req.session.name });
});


router.get('/upload', verifylogin, function (req, res, next) {
  res.render('userin', { name: req.session.name });
});




router.get('/signin', function (req, res, next) {
  res.render('login');
});


router.get('/list', verifylogin, async (req, res) => {
  const allData = await (await fetch("https://node-js-restapi-pet.onrender.com/",)).json()
  console.log(req.query.category)
  var filterdData = []
  if (req.query.category == undefined) {
    console.log("enterd into undefined")
    console.log(allData)
    filterdData = allData.filter((obj => { return obj.category == 'cat' }))
  } else {
    filterdData = allData.filter((obj => { return obj.category == req.query.category }))
  }
  const object = {}
  object[req.query.category ? req.query.category : 'cat'] = true
  object.data = filterdData
  object.name = req.session.name
  console.log(object)

  res.render('list', object)
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


router.post('/uploadpet', async (req, res) => {
  console.log("upload pet api called")

  const controller = new AbortController();



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
  data.dataId = `${req.session.userID}${timestamp}`

  try {
    const result = await fetch(`https://node-js-restapi-pet.onrender.com/upload/${req.session.userID}${timestamp}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }, { signal: controller.signal })
  } catch (error) {
    console.log(error)
  }

  const timeoutId = setTimeout(() => {
    // Abort the Fetch request
    controller.abort();
  }, 3000);

  clearTimeout(timeoutId)

  res.redirect(`list?category=${req.body.category}`)

})


router.get('/details',async(req,res)=>{
  const dataId = req.query.dataId
  const allData = await (await fetch("https://node-js-restapi-pet.onrender.com/",)).json()
  console.log(req.query.dataId)
 
  const filterdData = allData.filter((obj => { return obj.dataId == dataId }))
  console.log(filterdData[0])
  
  
  res.render('details',{data:filterdData[0]})

})



module.exports = router;


