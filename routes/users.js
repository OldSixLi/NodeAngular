/*
 * users分类下请求处理(Node文件)
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年4月10日15:09:26
 * @Last Modified by: 马少博
 * @Last Modified time:2017年4月13日10:09:32
 */
var express = require('express');
var qiniu = require('qiniu'); //七牛云
var url = require('url');
var bodyParser = require("body-parser");
var DBhelper = require('../mysql/sql.js');
var multiparty = require('multiparty');
var util = require('util');
var path = require('path');
//Express框架相关部分
var app = express();
var router = express.Router();
var fs = require("fs");
var Q = require('promise');

// router.use(bodyParser.urlencoded({ extended: false }));
//NOTE:在接收POST数据时,因为URL中并不存在参数,需要使用此方法转化数据,获取参数
app.use(bodyParser.json({ limit: '1mb', uploadDir: "../image" })); //body-parser 解析json格式数据
// app.use(express.bodyParser({}));
app.use(bodyParser.urlencoded({ //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));

　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
// 　　　◆◆　　　◆◆　　　　　　　　　　　　　　　　　　　　　　◆◆◆　　　　　　　　◆◆　◆　　　　
// 　　　◆◆◆　　◆◆　　　◆◆　◆◆◆◆◆◆◆◆◆　◆◆◆◆◆◆◆◆◆◆◆　　　　　　◆◆◆◆◆　　　
// 　　　◆◆◆◆◆◆◆　　　◆◆◆◆◆◆◆◆◆　◆◆　　　◆◆　　◆◆◆　　　◆◆◆◆◆◆◆◆◆◆◆◆　
// 　　◆◆◆　◆◆◆◆◆　　　　◆◆　◆◆◆◆◆◆◆　　　　　◆◆◆◆◆◆◆　　　　　　◆◆　　　　　　
// 　　◆◆◆◆◆◆◆◆◆◆　　　◆◆　◆◆◆◆　◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　◆◆◆　◆◆　◆◆◆　　
// 　◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　◆◆　　◆◆　◆◆◆◆◆◆◆　　◆◆◆◆◆◆◆◆◆◆　　
// 　◆◆◆◆◆◆　◆◆　　　　　◆◆　◆◆◆◆◆◆　　　◆◆　◆◆　　◆◆◆　　　　　◆◆◆◆◆　　　　
// 　　　　◆◆◆　◆◆　　　　　◆◆　　　◆◆　　　　　◆◆　◆◆◆◆◆◆◆　　　　◆◆◆◆◆◆　　　　
// 　　　　◆◆◆　◆◆　　　　　◆◆◆◆◆◆◆◆◆◆　　◆◆◆◆◆◆◆◆◆◆　　◆◆◆　◆◆◆◆◆　　　
// 　　◆◆◆◆◆◆◆　　　　◆◆◆◆　　　◆◆　　　　　◆◆◆◆◆　　◆◆◆　◆◆◆　　◆◆　◆◆◆◆　
// 　◆◆◆　　　◆◆◆◆◆◆　　　　◆◆◆◆◆◆◆◆◆　　　　◆◆　　◆◆◆　　　　◆◆◆◆　　　　　　
/* 获取用户请求,进行相关处理 */
router.get('/', function(req, res, next) {
  res.send('此接口不返回任何有效信息!');
});

//请求的是/users/users接口才会访问到此处
router.get('/users', function(req, res, next) {
  var absolutePath = path.resolve(__dirname, '../public/JSON/userlist.json');
  var data = fs.readFileSync(absolutePath, "utf-8");
  //控制延时返回数据
  var obj = JSON.parse(data);
  setTimeout(function() {
    res.json(obj);
  }, 0);
});

// /users/name地址
router.get('/name', function(req, res, next) {
  res.send("马三立老师");
});

// 获取某个用户的具体信息
router.get('/userinfo', function(req, res, next) {
  //获取参数,并将参数转化为对象
  var params = url.parse(req.url, true).query;
  var returnObj = {};
  returnObj.dataSuccess = false;
  if (!params.id) {
    //参数不存在
    returnObj.errorMessage = "未提供用户参数,获取不到数据";
    res.json(returnObj);
  } else {
    //参数存在,请求查询数据库
    var id = params.id;
    var result = DBhelper.getDS(id, function(result) {
      if (result) {
        //查询成功
        returnObj.dataSuccess = true;
        returnObj.data = result;
        res.json(returnObj);
      } else {
        //查询失败处理操作
        returnObj.errorMessage = '没数据' + new Date().getSeconds();
        res.json(returnObj);
      }
    });
  }
});

// 　◆◆◆◆◆◆　　　◆◆◆◆◆　　　◆◆◆◆◆◆　◆◆◆◆◆◆◆◆　
// 　◆◆◆　◆◆◆　◆◆◆　◆◆◆　　◆◆◆◆◆◆◆　　　◆◆◆　　　
// 　◆◆◆　　◆◆◆◆◆◆　　◆◆◆◆◆◆　　◆◆◆　　　◆◆◆　　　
// 　◆◆◆　　◆◆◆◆◆◆　　◆◆◆◆◆◆　　　　　　　　◆◆◆　　　
// 　◆◆◆　　◆◆◆◆◆◆　　◆◆◆　◆◆◆◆　　　　　　◆◆◆　　　
// 　◆◆◆◆◆◆◆　◆◆◆　　◆◆◆　　　◆◆◆◆　　　　◆◆◆　　　
// 　◆◆◆◆　　　　◆◆◆　　◆◆◆　　　　◆◆◆◆　　　◆◆◆　　　
// 　◆◆◆　　　　　◆◆◆　　◆◆◆◆◆◆　　◆◆◆　　　◆◆◆　　　
// 　◆◆◆　　　　　◆◆◆　　◆◆◆◆◆◆　　◆◆◆　　　◆◆◆　　　
// 　◆◆◆　　　　　◆◆◆◆◆◆◆　◆◆◆◆◆◆◆◆　　　◆◆◆　　　
// 　◆◆◆　　　　　　　◆◆◆◆　　　　◆◆◆◆　　　　　◆◆◆　　　
// POST新增用户信息

router.post('/infoAdd', function(req, res, next) {

  try {
    //NOTE:这个地方的data.body特别傻,不能直接输出,否则就报错.哪怕你输出一个object我都不会怪你
    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓就是这个错误↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    // BUG:Cannot convert object to primitive value
    // at F:\PersonCodes\ListPage\routes\users.js:172:25
    // at Layer.handle [as handle_request] (F:\PersonCodes\ListPage\node_modules\express\lib\router\layer.js:95:5)
    // at next (F:\PersonCodes\ListPage\node_modules\express\lib\router\route.js:131:13)
    // at Route.dispatch (F:\PersonCodes\ListPage\node_modules\express\lib\router\route.js:112:3)
    // at Layer.handle [as handle_request] (F:\PersonCodes\ListPage\node_modules\express\lib\router\layer.js:95:5)
    // at F:\PersonCodes\ListPage\node_modules\express\lib\router\index.js:277:22
    // at Function.process_params (F:\PersonCodes\ListPage\node_modules\express\lib\router\index.js:330:12)
    // at next (F:\PersonCodes\ListPage\node_modules\express\lib\router\index.js:271:10)
    // at Function.handle (F:\PersonCodes\ListPage\node_modules\express\lib\router\index.js:176:3)
    // at router (F:\PersonCodes\ListPage\node_modules\express\lib\router\index.js:46:12)
    //NOTE:以后还是得多细心啊,又特么浪费一个多小时(就为了console一哈)
    //表单类型为普通类型,没有涉及到文件上传的操作
    console.log("POST:" + JSON.stringify(req.body));
    var postData = req.body; //获取到用户上传的数据
    var model = {
      name: postData.name,
      gender: postData.gender,
      age: postData.age,
      iconUrl: postData.iconUrls
    }


    // 数据库添加操作
    DBhelper.addModel(model, function(issuccess) { //返回T/F,是否插入数据成功
      var obj = {
        success: issuccess,
        message: issuccess ? "保存成功" : "保存失败"
      }
      res.json(obj);
    });

  } catch (err) {
    console.log(err);
  }
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
router.post('/add', function(req, res, next) {
  try {
    var absolutePath = path.resolve(__dirname, '../public/images/upload/');
    //设置表单文件上传的解析路径
    var form = new multiparty.Form({ uploadDir: absolutePath });
    form.parse(req, function(err, fields, files) {
      var filesTmp = JSON.stringify(files, null, 2);
      if (err) {
        console.log('parse error: ' + err);
      } else {
        console.log('上传路径为: ' + filesTmp);
        console.log("当前数据为:" + JSON.stringify(fields));
        var inputFile = files.iconUrl[0];
        var uploadedPath = inputFile.path;
        //进行判断是否为空
        if (path.extname(uploadedPath)) {
          //再次将绝对路径转化为public下的相对路径：截取public后的内容
          uploadedPath = uploadedPath.substr(inputFile.path.indexOf('public') + 6);
        } else {
          console.log("当前为空的路径为：" + uploadedPath);
          uploadedPath = "";
        }

        //TODO 这插件，在不上传文件的时候也会生成表一个没有后缀的0字节的文件，所以需要处理文件，校验一下是否为空并且后缀名是否存在
        // var dstPath = '../public/images/upload/' + inputFile.originalFilename;
        //BUG:按理说当前originalFilename应该为新生成的唯一名称,uploadedPath为上传的表单中的文件名
        // 但是在console中查看数据时:两者结果相反,有时间仔细查阅资料解决此疑问

        //重命名为真实文件名
        //重命名操作
        // fs.rename(dstPath, uploadedPath, function(err) {
        //   if (err) {
        //     console.log('rename error: ' + err);
        //   } else {
        //     console.log('rename ok');
        //   }
        // });
        //TODO 校验有后缀名并且字节不为空


        //添加的Model
        var model = {
          name: fields.name[0],
          gender: fields.gender[0],
          age: fields.age[0],
          iconUrl: uploadedPath //TODO: 后期可能处理下,去掉../public
        }

        // 数据库添加操作
        DBhelper.addModel(model, function(issuccess) { //返回T/F,是否插入数据成功
          var obj = {
            success: issuccess,
            message: issuccess ? "保存成功" : "保存失败"
          }
          res.json(obj);
        });
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