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
  console.log(req.query);
  let sql = "INSERT INTO `errlist` (msg,vueData,fromUrl,loginInfo,ua) VALUES ('" + req.query.msg[0] + "', '" + req.query.vueData[0] + "', '" + req.query.from[0] + "', '" + req.query.loginInfo[0] + "', '" + req.query.ua[0] + "');"
  connection.query(sql)
});

module.exports = router;
