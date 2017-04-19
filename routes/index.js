var express = require('express');
var qiniu = require('qiniu'); //七牛获取uptoken
var router = express.Router();
var fs = require("fs");
var multiparty = require('multiparty');
var util = require('util');
var path = require('path');

console.log("当前组合的路径为：" + path.resolve(__dirname, '../public/images/upload/'));
// console.log(__filename);
/* 主页地址的返回 */
router.get('/', function(req, res, next) {
  //跳转到某个页面
  // res.redirect('/Doc/Angularjs/floors.html');
  res.render('index');
});

　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
// 　◆◆◆◆◆◆◆◆◆◆　◆◆◆◆◆◆◆　　　◆◆◆◆◆◆◆◆◆　　◆◆◆◆◆◆◆◆◆　
// 　◆◆◆◆◆◆◆◆◆◆　◆◆◆◆◆◆◆◆◆　◆◆◆◆◆◆◆◆◆　　◆◆◆◆◆◆◆◆◆　
// 　　　　　◆◆◆　　　　◆◆◆　　　◆◆◆　◆◆◆◆　　　　　　　◆◆◆　　　　　　　
// 　　　　　◆◆◆　　　　◆◆◆　　　◆◆◆　◆◆◆◆　　　　　　　◆◆◆　　　　　　　
// 　　　　　◆◆◆　　　　◆◆◆　　　◆◆◆　◆◆◆◆　　　　　　　◆◆◆　　　　　　　
// 　　　　　◆◆◆　　　　◆◆◆　　　◆◆◆　◆◆◆◆　　　　　　　◆◆◆　　　　　　　
// 　　　　　◆◆◆　　　　◆◆◆◆◆◆◆◆◆　◆◆◆◆◆◆◆◆◆　　◆◆◆◆◆◆◆◆　　
// 　　　　　◆◆◆　　　　◆◆◆◆◆◆◆　　　◆◆◆◆　　　　　　　◆◆◆　　　　　　　
// 　　　　　◆◆◆　　　　◆◆◆　◆◆◆　　　◆◆◆◆　　　　　　　◆◆◆　　　　　　　
// 　　　　　◆◆◆　　　　◆◆◆　◆◆◆◆　　◆◆◆◆　　　　　　　◆◆◆　　　　　　　
// 　　　　　◆◆◆　　　　◆◆◆　　◆◆◆　　◆◆◆◆　　　　　　　◆◆◆　　　　　　　
// 　　　　　◆◆◆　　　　◆◆◆　　◆◆◆◆　◆◆◆◆　　　　　　　◆◆◆　　　　　　　
// 　　　　　◆◆◆　　　　◆◆◆　　　◆◆◆　◆◆◆◆◆◆◆◆◆◆　◆◆◆◆◆◆◆◆◆　
// 　　　　　◆◆◆　　　　◆◆◆　　　◆◆◆◆◆◆◆◆◆◆◆◆◆◆　◆◆◆◆◆◆◆◆◆　
//zTree资源
router.all('/tree', function(req, res, next) {
  var data = fs.readFileSync("/PersonCodes/ListPage/public/JSON/tree.json", "utf-8");
  //控制延时返回数据
  var obj = JSON.parse(data);
  setTimeout(function() {
    res.json(obj);
  }, 0);
});

// 　　　　　◆◆　　　　　　　　　◆◆　　◆◆　　　　　　　　◆◆◆　　　　　　　◆◆　　◆◆　　　　　
// 　　　　　◆◆◆　　　　　　　◆◆◆◆◆◆◆　　　　　　　　◆◆　　　　　　　　◆◆◆　◆◆　　　　　
// 　　　　　　◆◆　　　　　　　◆◆◆◆◆◆◆　　　　　　　　◆◆　　　　　　　◆◆◆◆◆◆◆◆◆◆　　
// 　◆◆◆◆◆◆◆◆◆◆◆◆　◆◆◆◆◆◆◆◆◆◆◆　　　　　◆◆　　　　　　　◆◆◆　◆◆◆　　　　　
// 　　　◆◆◆　　◆◆　　　◆◆◆◆◆◆　◆◆　　　　　　　　◆◆◆◆◆◆◆　◆◆◆◆◆◆◆◆◆◆◆◆　
// 　　　　◆◆　◆◆◆　　　◆◆◆◆◆　　◆◆　　　　　　　　◆◆　　　　　　◆◆◆◆　◆◆　　　　　　
// 　　　　◆◆◆◆◆　　　　　　◆◆◆◆◆◆◆◆◆◆◆　　　　◆◆　　　　　　　◆◆◆　◆◆◆◆◆◆　　
// 　　　　　◆◆◆◆　　　　　　◆◆　　　◆◆　　　　　　　　◆◆　　　　　　　◆◆◆　◆　　◆◆◆　　
// 　　　　　◆◆◆　　　　　　　◆◆　　　◆◆　　　　　　　　◆◆　　　　　　　◆◆◆　◆◆　◆◆　　　
// 　　　　◆◆◆◆◆◆　　　　　◆◆　　　◆◆　　　　　　　　◆◆　　　　　　　◆◆◆　◆◆◆◆◆　　　
// 　◆◆◆◆　　　　◆◆◆◆　　◆◆　　　◆◆　　　　◆◆◆◆◆◆◆◆◆◆◆◆　◆◆◆　　　　◆◆◆　　
//文件上传
router.post('/upload', function(req, res, next) {
  try {
    //BUG 此处如果直接设置路径为："../public/images/upload/"，在程序第一次运行的时候，就会找不到上传的文件的路径，但是直接重启之后就会成功处理此路径，至今原因未知。为了更改BUG，将原来的相对路径转化为绝对路径，可以处理此问题（PS：应该是和Express的框架，public的 静态资源路径有关）
    //NOTE resolve方法用于路径组合，将相对路径转化为绝对路径，避免初次上传文件时找不到文件的BUG
    var absolutePath = path.resolve(__dirname, '../public/images/upload/');
    //设置表单文件上传的解析路径
    var form = new multiparty.Form({ uploadDir: absolutePath });
    //解析表单fields为普通数据，files为文件相关
    form.parse(req, function(err, fields, files) {
      var filesTmp = JSON.stringify(files, null, 2);
      if (err) {
        console.log('parse error: ' + err);
        //解析错误时返回信息
        var obj = {
          success: false,
          message: "解析错误！"
        }
        res.json(obj);
      } else {
        console.log('上传路径为: ' + filesTmp);　
        var inputFile = files.imageRes[0];
        var uploadedPath = inputFile.path;
        //再次将绝对路径转化为public下的相对路径：截取public后的内容
        uploadedPath = uploadedPath.substr(inputFile.path.indexOf('public') + 6);
        var obj = {
          success: true,
          message: uploadedPath
        }
        res.json(obj);
      }
    });

  } catch (err) {
    console.log(err);
  }
});　　　　　　　　　　　　　　　　　　　　　　　　　　

// 　　　　　　　　　　　　　　　　　　　◆◆　　　　　　　　　　　　　　　　　　
// 　　　　　◆◆　　　　　　　　　◆◆　◆◆　　　　　　◆◆◆◆◆◆◆◆◆　　　
// 　　　　　◆◆　　　　　　　　◆◆◆　◆◆　　　　　　　　　　　　　　　　　　
// 　　　　　◆◆　　　◆◆◆　　◆◆◆◆◆◆◆◆◆　　　　　　　　　　　　　　　
// 　　　　　◆◆◆◆◆◆　　　◆◆◆　　◆◆　　　　　◆◆◆◆◆◆◆◆◆◆◆◆　
// 　◆◆◆◆◆◆　　　　　　　◆◆　　　◆◆　　　　　　　　　◆◆　　　　　　　
// 　◆◆　　◆◆　　　　　　◆◆◆◆◆◆◆◆◆◆◆◆　　　　◆◆◆　　　　　　　
// 　　　　　◆◆　　　　　　　　　　　　◆◆　　　　　　　◆◆◆　◆◆◆　　　　
// 　　　　　◆◆　　　◆◆　　　　　　　◆◆　　　　　　　◆◆　　　◆◆◆　　　
// 　　　　　◆◆　　　◆◆◆　　　　　　◆◆　　　　　　◆◆◆◆◆◆◆◆◆◆　　
// 　　　　　◆◆◆◆◆◆◆　　　　　　　◆◆　　　　　　◆◆◆◆　　　　◆◆　　
// 　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　 
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