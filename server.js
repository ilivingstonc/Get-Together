require('dotenv').config();
const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session        = require('express-session');

//database check
require('./db/db');

app.use(session({
    secret: "this is a random secret string", // is the key that opens up our session
    // which is always stored on the server
    resave: false, // only save our session when we add/or mutate
    // a property
    saveUninitialized: false // only save the cookie when
    // we add a property to it, When the user logs in or registers
    // we only really want to add stuff to our session after user
    // logs in or registers to comply with the law
  }));

  //middleware
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

//controllers check
const groupsController = require('./controllers/groups.js');
app.use('/groups', groupsController);

const listsController = require('./controllers/lists.js');
app.use('/lists', listsController);

const usersController = require('./controllers/users.js');
app.use('/auth', usersController);

const recipesController = require('./controllers/recipes.js');
app.use('/recipes', recipesController);

const picsController = require('./controllers/pics.js');
app.use('/pics', picsController);


// home page
app.get('/', (req, res) => {
  console.log(req.session, 'home route')
  res.render('homeIndex.ejs', {
    username:req.session.username,
    message: req.session.message,
    logged: req.session.logged
  })
});




app.listen(process.env.PORT, () => {
    console.log('server listening on port', 3000);
  });
