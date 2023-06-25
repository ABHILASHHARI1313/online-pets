var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

require('../schemas/loginschema')

require('../schemas/petSchema')

const petModel = mongoose.model('petdetails')

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


router.get('/list', async (req, res) => {

 // console.log(allData)
  //console.log(allData)
  // console.log(req.query.category)
  var filterdData = []
  var data;
  if (req.query.category == undefined) {
    console.log("enterd into undefined")
    // console.log(allData)
    data = await petModel.find({ category: 'cat' }).lean()
  } else {
    console.log("specific category")
    data = await petModel.find({ category: req.query.category }).lean()
    console.log(typeof(data))
  }

 // console.log(data)
  const object = {}
  object[req.query.category ? req.query.category : 'cat'] = true

  object.name = req.session.name
  //console.log(object)

  const filterdData1 = [{
    name: 'Prescott Strong',
    userID: '64473d18d63836014ec02e44',
    category: 'cat',
    image1: '64473d18d63836014ec02e441687674076645(1).jpg',
    image2: '64473d18d63836014ec02e441687674076645(2).jpg',
    image3: '64473d18d63836014ec02e441687674076645(3).jpg',
    price: 418,
    phone: '1234567890',
    description: 'Irure dolores elit ',
    rating: [],
    __v: 0
  },
  {
    name: 'pussy cat',
    userID: '64473d18d63836014ec02e44',
    category: 'cat',
    image1: '64473d18d63836014ec02e441687674076645(1).jpg',
    image2: '64473d18d63836014ec02e441687674076645(2).jpg',
    image3: '64473d18d63836014ec02e441687674076645(3).jpg',
    price: 418,
    phone: '1234567890',
    description: 'Irure dolores elit ',
    rating: [],
    __v: 0
  }]

  //console.log(filterdData)
  //console.log(filterdData1)

  res.render('list', { cat: true, data, name: req.session.name })
})



router.get('/details', async (req, res) => {
  const dataId = req.query.dataId
  const allData = await (await fetch("https://node-js-restapi-pet.onrender.com/",)).json()
  console.log(req.query.dataId)

  const filterdData = allData.filter((obj => { return obj.dataId == dataId }))
  console.log(filterdData[0])


  res.render('details', { data: allData, name: req.session.name })

})



module.exports = router;

//search
//listing page at home



