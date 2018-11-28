var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '0808',
  database: 'ErrMonitor'
});

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Rico' });
});
router.get('/errMonitor', function (req, res, next) {
  // console.log(req.query);
  connection.connect();
  connection.query('INSERT INTO `errlist` VALUES (1, "admin", "32", "admin", "32", "admin", "32");', function (err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0].solution);
  })
  connection.end()
});

module.exports = router;
