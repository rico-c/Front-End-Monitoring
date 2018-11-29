var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '0808',
  database: 'ErrMonitor'
});
connection.connect();

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Rico' });
});

router.get('/errMonitor', function (req, res, next) {
  let now = new Date().getTime();
  let sql = "INSERT INTO `errlist` (msg,vueData,fromUrl,loginInfo,ua,errTime) VALUES ('" + req.query.msg[0] + "', '" + req.query.vueData[0] + "', '" + req.query.from[0] + "', '" + req.query.loginInfo[0] + "', '" + req.query.ua[0] + "'," + now + ");"
  console.log(sql);
  connection.query(sql)
});

router.get('/api/realtime', function (req, res, next) {
  let unit = req.query.unit;
  let include = Number;
  switch (unit) {
    case '1min':
      include = 60000;
      break;
    case '5min':
      include = 300000;
      break;
    case '30min':
      include = 1800000;
      break;
    case '1h':
      include = 3600000;
      break;
    case '4h':
      include = 14400000;
      break;
    default:
      include = 14400000;
  }
  let timeArea = new Date().getTime() - include;
  let sql = "SELECT * FROM errlist WHERE errTime > " + timeArea;
  console.log(sql);
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
  });
});

module.exports = router;
