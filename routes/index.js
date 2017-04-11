var express = require('express');
var qiniu = require('qiniu'); //七牛获取uptoken
var router = express.Router();

/* 主页地址的返回 */
router.get('/', function(req, res, next) {
  // res.render()就是将我们的数据填充到模板后展示出完整的页面。
  // res.render('index', { title: 'Express' });

  //跳转到某个页面
  res.redirect('/Doc/Angularjs/floors.html');
});



//获取七牛云Token接口
qiniu.conf.ACCESS_KEY = 'gfmlM2ZmBqZkpPZixYkPzb2zy-FbJv2mvR1KY3t_';
qiniu.conf.SECRET_KEY = '7ksC_gm9kaNmUHMaphcypwFK3nWzafwbxNKLxaNN';
router.get('/token', function(req, res, next) {

  var myUptoken = new qiniu.rs.PutPolicy('hes-upload');
  var token = myUptoken.token();
  res.header("Cache-Control", "max-age=0, private, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  if (token) {
    res.json({
      uptoken: token,
      // sava_key: currentKey
    });
  }
});
module.exports = router;