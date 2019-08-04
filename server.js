const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
global.database = require('./database-handler.js');
const authentication = require('./authentication-manager.js');
const app = express();
const port = 3000;
const public = __dirname + "/public";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('hbs', handlebars());
app.set('view engine', 'hbs');
app.use(cookieParser());
app.use(session({
  secret: 'gdasgfg',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));

app.get('/logo', (req, res) => res.sendFile(public + '/logo.jpg'));
app.get('/cancel_img', (req, res) => res.sendFile(public + '/close.png'));
app.get('/check_img', (req, res) => res.sendFile(public + '/check.png'));
app.get('/trash_img', (req, res) => res.sendFile(public + '/trash.png'));

app.get('/', (req, res) => {
  if(!req.session.isAuthenticated) res.redirect('/login');
  else {
    database.getUserData(req.session.user_id, (err, result) => {
      database.getAllUserData((err1, result1) => {
        database.getAllAuthenticationKeys((err, result2) => {
          res.render('main', {layout: 'index', firstname: req.session.user_firstname, filled: result.filled == 0, admin: result.admin == 1, users: result1, authentication_keys: result2 });
        });
      });
    });
  }
});

app.get('/admin/makeadmin/:id', (req, res) => {
  if(req.session.isAuthenticated && req.session.user_admin) database.makeadmin(req.params.id, (result) => console.log("Successfully made user admin."));
  res.redirect('/');
});

app.get('/admin/makeuser/:id', (req, res) => {
  if(req.session.isAuthenticated && req.session.user_admin) database.makeuser(req.params.id, (result) => {
    console.log("Successfully made admin user.")
    database.getUserData(req.session.user_id, (err, result1) => {
      console.log(result1);
      authentication.serializeUser(req.session, {id: result1.id, firstname: result1.firstname, lastname: result1.lastname, admin: result1.admin});
      res.redirect('/');
    });
  });
});

app.get('/admin/deleteuser/:id', (req, res) => {
  if(req.session.isAuthenticated && req.session.user_admin) database.deleteuser(req.params.id, (result) => {
    console.log("Successfully deleted user.")
    if(req.session.user_id == req.params.id) authentication.unserializeUser(req.session);
    res.redirect('/');
  });
});

app.get('/admin/deleteAuthKey/:key', (req, res) => {
  if(req.session.isAuthenticated && req.session.user_admin) database.deleteauthkey(req.params.key, (result) => console.log("Deleted authentication key: " + req.params.key));
  res.redirect('/');
});

app.get('/admin/addAuthKey', (req, res) => {
  if(req.session.isAuthenticated && req.session.user_admin) database.addauthkey((result) => console.log("Added new authentication key"));
  res.redirect('/');
});

app.get('/login', (req, res) => {
  if(req.session.isAuthenticated) res.redirect('/');
  else res.render('login', { layout: 'login', warning: req.session.warning});
  req.session.warning = null;
});

app.get('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.user_id = null;
  res.redirect('/');
})

app.get('/register', (req, res) => res.redirect('/register/0'));

app.get('/register/:auth_key', (req, res) => {
  var authkey = req.params.auth_key == "0" ? null : req.params.auth_key;
  if(req.session.isAuthenticated) res.redirect('/');
  else res.render('login', { layout: 'register', auth_key: authkey, warning: req.session.warning});
  req.session.warning = null;
});

app.post('/register/:auth_key', authentication.authenticateRegister)
app.post('/register', authentication.authenticateRegister)

app.post('/login', authentication.authenticateLogin);

app.post('/givein', (req, res) => {
  if(!req.session.isAuthenticated) res.redirect('/');
  else {
    var body = Object.entries(req.body);

    var available_dates = [];
    for(i = 1; i < body.length; i++) {
      if(body[i][1] == 'true') available_dates.push(body[i][0]);
    }

    database.handinDates(body, req.session.user_id, (err) => {
      if(err) {
        console.error(err);
        req.session.warning = 'Something went wrong, you might want to try again later.';
        res.redirect('/givein');
      } else {
        res.redirect('/');
      }
    });
  }
});

app.get('/givein', (req, res) => {
  if(!req.session.isAuthenticated) {
    req.session.warning = 'You must first be logged in.';
    res.redirect('/');
  } else {
    database.getAllDates((err, result) => {
      dates = JSON.stringify(result);
      res.render("login", {layout:'givein', dates:result});
    });
  }
});

app.use('/css', express.static('css'));

app.listen(port, () => console.log(`App listening on port ${port}`));
