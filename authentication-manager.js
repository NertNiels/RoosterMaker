var auth_email = 'drummerniels@hotmail.nl';
var auth_password = 'ja';

exports.authenticateLogin = function(req, res) {
  var body = Object.entries(req.body);
  var email = body[0][1];
  var password = body[1][1];
  database.getUser(email, password, (id, firstname, lastname, admin) => {
    return done(req, res, null, {id: id, firstname: firstname, lastname: lastname, admin: admin}, 'Login succeeded...', '/');
  }, (err, message) => {
    if(err) done(req, res, err, false, message, '/login');
    return done(req, res, null, false, message, '/login');
  });
}

exports.authenticateRegister = function(req, res) {
  var body = Object.entries(req.body);

  var auth_key = req.params.auth_key ? req.params.auth_key : "0";

  var authenticate_key = body[0][1];
  var firstname = body[1][1];
  var lastname = body[2][1];
  var email = body[3][1];
  var password = body[4][1];
  var password2 = body[5][1];

  var jobs_form = [];
  try {
    jobs_form = body[6][1];
  } catch(err) {

  }

  var jobs = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  if(jobs_form.includes("sing_leader")) jobs[0] = 1;
  if(jobs_form.includes("singer")) jobs[1] = 1;
  if(jobs_form.includes("guitarist")) jobs[2] = 1;
  if(jobs_form.includes("bass_guitarist")) jobs[3] = 1;
  if(jobs_form.includes("pianist")) jobs[4] = 1;
  if(jobs_form.includes("drummer")) jobs[5] = 1;
  if(jobs_form.includes("elec_guitarist")) jobs[6] = 1;
  if(jobs_form.includes("sound")) jobs[7] = 1;
  if(jobs_form.includes("beamer")) jobs[8] = 1;
  if(! authenticate_key || !firstname || !lastname || !email || !password || !password2) {
    return done(req, res, null, false, 'All required fields (*) must be filled in.', '/register/'+auth_key);
  }
  if(password !== password2) {
    return done(req, res, null, false, 'The passwords you typed do not match.', '/register/'+auth_key);
  }
  database.registerUser(authenticate_key, firstname, lastname, email, password, jobs, (err, message, succeeded) => {
    if(err) return done(req, res, err, false, message, '/register/'+auth_key);
    if(succeeded) {
      return done(req, res, null, false, message, '/');
    }
    else return done(req, res, null, false, message, '/register/'+auth_key);
  });
}

function done(req, res, err, user, message, redirect) {
  if(err) {
    console.error('An error occured while logging in:');
    console.error(err);
    req.session.warning = 'An error occured while logging in. Please try again later.'
    res.redirect(redirect);
  }
  if(user && !err) {
    serializeUser(req.session, user);
    req.session.warning = null;
    res.redirect(redirect);
  } else if (!err) {
    req.session.warning = message;
    res.redirect(redirect);
  }
}

var serializeUser = (session, user) => exports.serializeUser(session, user);
var unserializeUser = (session, user) => exports.unserializeUser(session, user);


exports.serializeUser = function(session, user) {
  session.user_id = user.id;
  session.user_firstname = user.firstname;
  session.user_lastname = user.lastname;
  session.user_admin = user.admin == 1;
  session.isAuthenticated = true;
}

exports.unserializeUser = function(session) {
  session.user_id = null;
  session.user_firstname = null;
  session.user_lastname = null;
  session.user_admin = null;
  session.isAuthenticated = false;
}
