var mysql = require('mysql');
//createPool , createConnection
// var connection = mysql.createPool({
//   host: "carrylush.cfxruyst3ewx.ap-south-1.rds.amazonaws.com",
//   port: '3306',
//   user: "carrylush",
//   password: "carrylush",
//   database : "carrylush",
//   debug: false,
//   multipleStatements: true
// });

// local database start here
var connection = mysql.createPool({
  host: "localhost",
  port: '3306',
  user: "root",
  password: "",
  database : "carrylush",
  debug: false,
  multipleStatements: true
});




exports.connection = connection;

// Access Key ID:
// AKIAJIWMRQWASW4JTVDQ
// Secret Access Key:
// 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

//URL:
//http://carrylush-env.wnzrgumnmj.ap-southeast-1.elasticbeanstalk.com/
