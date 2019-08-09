const mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "roostermaker_ege"
});

db.connect((err) => {
  if(err) {
    console.log('Can\'t connect to the SQL database.');
    console.log(err);
  }
  console.log("Connected to MySQL...");
});

exports.getAllAvailabilities = function(callback) {
  db.query("SELECT *, DATE_FORMAT(STR_TO_DATE(date, '%d_%m_%Y'), '%e %M %Y') AS date_name FROM dates ORDER BY STR_TO_DATE(date, '%d_%m_%Y');", (err, result) => {
    var users = [];

    for(i = 0; i < result.length; i++) {
      result[i].sing_leaders = JSON.parse(result[i].sing_leaders);
      for(j = 0; j < result[i].sing_leaders.length; j++) { result[i].sing_leaders[j] = parseInt(result[i].sing_leaders[j]); }
      result[i].singers = JSON.parse(result[i].singers);
      for(j = 0; j < result[i].singers.length; j++) { result[i].singers[j] = parseInt(result[i].singers[j]); }
      result[i].guitarists = JSON.parse(result[i].guitarists);
      for(j = 0; j < result[i].guitarists.length; j++) { result[i].guitarists[j] = parseInt(result[i].guitarists[j]); }
      result[i].bass_guitarists = JSON.parse(result[i].bass_guitarists);
      for(j = 0; j < result[i].bass_guitarists.length; j++) { result[i].bass_guitarists[j] = parseInt(result[i].bass_guitarists[j]); }
      result[i].pianists = JSON.parse(result[i].pianists);
      for(j = 0; j < result[i].pianists.length; j++) { result[i].pianists[j] = parseInt(result[i].pianists[j]); }
      result[i].drummers = JSON.parse(result[i].drummers);
      for(j = 0; j < result[i].drummers.length; j++) { result[i].drummers[j] = parseInt(result[i].drummers[j]); }
      result[i].elec_guitarists = JSON.parse(result[i].elec_guitarists);
      for(j = 0; j < result[i].elec_guitarists.length; j++) { result[i].elec_guitarists[j] = parseInt(result[i].elec_guitarists[j]); }
      result[i].sounds = JSON.parse(result[i].sounds);
      for(j = 0; j < result[i].sounds.length; j++) { result[i].sounds[j] = parseInt(result[i].sounds[j]); }
      result[i].beamers = JSON.parse(result[i].beamers);
      for(j = 0; j < result[i].beamers.length; j++) { result[i].beamers[j] = parseInt(result[i].beamers[j]); }
    }

    exports.getAllUserData((error, userData) => {
      if(error) return;
      for(i = 0; i < userData.length; i++) {
        users[userData[i].id] = {
          id: userData[i].id,
          firstname: userData[i].firstname,
          lastname: userData[i].lastname,
          email: userData[i].email
        }
      }

      callback(err, result, users);
    });
  });
}

exports.getAllDates = function(callback) {
  db.query(" SELECT date, DATE_FORMAT(STR_TO_DATE(date, '%d_%m_%Y'), '%W %M %e %Y') AS date_name FROM dates ORDER BY STR_TO_DATE(date, '%d_%m_%Y');", (err, result) => {
    if(err) callback(err, null);
    var dates = [];
    for(i = 0; i < result.length; i++) {
      dates[i] = {
        date: result[i].date,
        date_name: result[i].date_name,
      }
    }
    callback(null, dates);
  });
}

exports.getUser = function(email, password, loginSucceeded, loginFailed) {
  db.query("CALL doesUserExist(?);", [email], (err, result) => {
    if(err) return loginFailed(err, 'An error occured while logging in.');
    if(result[0].length == 0) return loginFailed(null, 'That email does not exist.');
    db.query("CALL login(?, ?);", [result[0][0].id, password], (err1, result1) => {
      if(err1) return loginFailed(err1, 'An error occured while logging in.');
      if(result1[0].length == 0) return loginFailed(null, 'Password incorrect, please try again.');
      loginSucceeded(result1[0][0].id, result1[0][0].firstname, result1[0][0].lastname, result1[0][0].admin);
    });
  });
}

exports.getUserData = function(user_id, callback) {
  db.query("SELECT id, firstname, lastname, email, admin, filled FROM users WHERE id=?;", [user_id], (err, result) => {
    if(err) return callback(err, null);
    callback(null, result[0]);
  });
}

exports.getAllUserData = function(callback) {
  db.query("SELECT id, firstname, lastname, email, admin, filled FROM users;", (err, result) => {
    if(err) return callback(err, null);
    callback(null, result);
  });
}

exports.getAllAuthenticationKeys = function(callback) {
  db.query("SELECT authenticate_key FROM authentication ORDER BY id;", (err, result) => {
    if(err) return callback(err, null);
    callback(null, result);
  });
}

exports.registerUser = function(authenticate_key, firstname, lastname, email, password, jobs, callback) {
  db.query("CALL doesUserExist(?);", [email], (err1, result1) => {
    if(err1) return callback(err, 'Something went wrong. Please try again.', false);
    if(result1[0].length > 0) return callback(null, 'This email address is already taken.', false);
    db.query("SELECT id FROM authentication WHERE authenticate_key=?;", [authenticate_key], (err, result3) => {
      if(err) return callback(err, 'Something went wrong. Please try again.', false);
      if(result3.length == 0) return callback(null, 'That register key is not valid. Please try again and check if you have spelled it correct.', false);
      db.query("DELETE FROM authentication WHERE id=?", [result3[0].id], (err, result4) => {if(err)console.error('Something went wrong while deleting authentication key:\n' + err)});
      db.query("CALL register(?, ?, ?, ?);", [firstname, lastname, email, password], (err, result) => {
        if(err) return callback(err, 'Something went wrong. Please try again.', false);
        db.query("CALL registerJob(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [result[0][0].id, jobs[0], jobs[1], jobs[2], jobs[3], jobs[4], jobs[5], jobs[6], jobs[7], jobs[8]], (err2, result2) => {
          if(err2) return callback(err2, 'Something went wrong. Please try again.', false);
          callback(null, 'You can now log in.', true);
        });
      });
    });
  });
}

exports.handinDates = function(dates, user_id, callback) {
  var dates_json = JSON.stringify(dates);
  console.log(dates_json);
  db.query("CALL handin_dates(?, ?)", [dates_json, user_id], (err, result) => {
    if(err) return callback(err);
    callback(null);
  });
}

exports.makeadmin = function(user_id, callback) {
  db.query("UPDATE users SET admin=1 WHERE id=?;", [user_id], (err, result) => {
    if(err) console.error('Error while making someone admin:\n' + err);
    callback(result);
  });
}

exports.makeuser = function(user_id, callback) {
  db.query("UPDATE users SET admin=0 WHERE id=?;", [user_id], (err, result) => {
    if(err) console.error('Error while making someone user:\n' + err);
    callback(result);
  });
}

exports.deleteuser = function(user_id, callback) {
  db.query("CALL delete_user(?);", [user_id], (err, result) => {
    if(err) console.error('Error while trying to delete someone:\n' + err);
    callback(result);
  });
}

exports.deleteauthkey = function(key, callback) {
  db.query("DELETE FROM authentication WHERE authenticate_key=?", [key], (err, result) => {
    if(err) console.error('Error while trying to delete authentication key:\n' + err);
    callback(result);
  });
}

exports.addauthkey = function(callback) {
  db.query("INSERT INTO authentication VALUES ();", (err, result) => {
    if(err) console.error('Error while trying to add authentication key:\n' + err);
    callback(result);
  });
}
