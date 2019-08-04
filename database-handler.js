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

exports.getAllDates = function(callback) {
  db.query("SELECT date FROM dates", (err, result) => {
    if(err) callback(err, null);
    var dates = [];
    var date_names = [];
    var parsed_dates = [];
    for(i = 0; i < result.length; i++) {
      dates[i] = result[i].date;
      var sub = result[i].date.split("_");
      parsed_dates[i] = {day: parseInt(sub[0]), month: parseInt(sub[1]), year: parseInt(sub[2]), isDone: false, index: i}
      var date = new Date(parseInt(sub[2]), parseInt(sub[1]-1), parseInt(sub[0]));
      date_names[i] = date.toDateString();
    }

    var new_dates = [];
    var i = 0;

    while(true) {
      var currentLowest;
      for(j = 0; j < parsed_dates.length; j++) {
        if(!parsed_dates[j].isDone) {
          currentLowest = parsed_dates[j];
          break;
        }
      }
      for(j = 0; j < parsed_dates.length; j++) {
        if(!parsed_dates[j].isDone) {
          if(parsed_dates[j].year < currentLowest.year) currentLowest = parsed_dates[j];
          else if(parsed_dates[j].year == currentLowest.year) {
            if(parsed_dates[j].month < currentLowest.month) currentLowest = parsed_dates[j];
            else if(parsed_dates[j].month == currentLowest.month) {
              if(parsed_dates[j].day < currentLowest.day) currentLowest = parsed_dates[j];
            }
          }
        }
      }
      new_dates[i] = {
        date: dates[currentLowest.index],
        date_name: date_names[currentLowest.index],
      };
      currentLowest.isDone = true;
      i++;
      if(i >= dates.length) break;
    }

    callback(null, new_dates);
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
