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
    console.log(typeof (data))
  }

  // console.log(data)
  const object = {}
  object[req.query.category ? req.query.category : 'cat'] = true
  object.data = data
  object.name = req.session.name

  object.name = req.session.name

  res.render('list', object)
})



router.get('/details',verifylogin, async (req, res) => {
  var data;

  try {
    data = await petModel.findOne({ _id: req.query.dataID }).lean()
    //console.log(data)

  } catch (error) {
    console.log("error in retreving pet data", error)
  }

  var rated=false
  var rate;
  const ratingArray = data.ratingValues

  ratingArray.map((obj)=>{
    if(obj.userID==req.session.userID){
      rated = true
      rate = obj.rate
      return
    }
  })

  

  res.render('details', { data, name: req.session.name, petID: data._id, rated, rate })

})

router.post('/ratepet', async (req, res) => {
  console.log("ratepet called")


  const Array = (await petModel.findOne({_id:req.body.petID})).ratingValues
  const noOfusers = Array.length 
  console.log("noOfusers is",noOfusers)

  var sum = 0
  for(var i=0;i<Array.length ;i++){
    sum +=parseInt(Array[i].rate)
  }

  console.log("sum is",sum)


  const newRating = (sum + parseInt(req.body.rate)) / (noOfusers + 1 )
  console.log("newRating is",newRating)

  try {
    await petModel.updateOne({ _id: req.body.petID }, {
      $push: {
        ratingValues: {
          userID:req.session.userID,
          name: req.session.name,
          rate: parseInt(req.body.rate),
        }
      },
      $set:{
        rating:newRating
      }
    })
  } catch (error) {
    console.log("error in rating",error)
  }
  res.send("rated")


})



module.exports = router;

//search
//listing page at home



