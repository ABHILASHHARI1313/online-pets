var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose  = require('mongoose')
var session = require('express-session')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var fileupload = require('express-fileupload') 
app.use(fileupload())

const {engine} = require('express-handlebars')



app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: false, // Optional: Specify a default layout file
  partialsDir: __dirname + '/views/partials' // Path to your partials directory
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(cookieParser());

app.use(session({secret:'key',cookie:{maxAge:600000,},resave:false,saveUninitialized:true}))

app.use('/', indexRouter);
app.use('/user', usersRouter);

require('./schemas/loginschema') 
require('./schemas/petSchema')

const uri = 'mongodb+srv://petshop:jaaah123@cluster0.ompobnq.mongodb.net/petshop?retryWrites=true&w=majority'
const PORT = process.env.PORT || 3000

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', function () {
  console.log('Connected to MongoDB database!');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
})

const loginModel = mongoose.model('logininfo')
const petModel = mongoose.model('petdetails')


module.exports = app;  
