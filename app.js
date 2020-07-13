const express = require('express');
const app = express();
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const PORT = process.env.PORT || 3000;
const exphbs = require('express-handlebars');
const db = require('./models');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');
const methodOverride = require('method-override');

app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require('./config/handlebars-helper')
  })
);
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use('/upload', express.static(__dirname + '/upload'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.user = req.user;
  next();
});

require('./routes')(app);

app.listen(PORT, () => {
  //db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});
