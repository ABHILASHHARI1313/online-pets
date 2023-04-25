var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose  = require('mongoose')
var session = require('express-session')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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
app.use('/users', usersRouter);

require('./schemas/loginschema') 

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


module.exports = app;  
