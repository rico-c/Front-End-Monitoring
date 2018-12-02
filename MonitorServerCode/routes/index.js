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
  res.render('index', { title: 'Rico前端监控接口' });
});

router.get('/errMonitor', function (req, res, next) {
  let now = new Date().getTime();
  let [type, msg, vueData, fromUrl, loginInfo, ua, apiParams] = [
    req.query.type ? req.query.type[0] : '',
    req.query.msg ? req.query.msg[0] : '',
    req.query.vueData ? req.query.vueData[0] : '',
    req.query.fromUrl ? req.query.fromUrl[0] : '',
    req.query.loginInfo ? req.query.loginInfo[0] : '',
    req.query.ua ? req.query.ua[0] : '',
    req.query.apiParams ? req.query.apiParams[0] : '',
  ]
  let sql = "INSERT INTO `errlist` (type,msg,vueData,errUrl,loginInfo,ua,apiParams,errTime) VALUES ('" + type + "', '" + msg + "', '" + vueData + "', '" + fromUrl + "', '" + loginInfo + "', '" + ua + "', '" + apiParams + "'," + now + ");"
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
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});

module.exports = router;