var express = require('express');
var qiniu = require('qiniu'); //七牛云
var url = require('url');
var bodyParser = require("body-parser");
var DBhelper = require('../mysql/sql.js');
//Express框架相关部分
var app = express();
var router = express.Router();
var fs = require("fs");

// router.use(bodyParser.urlencoded({ extended: false }));
//NOTE:在接收POST数据时,因为URL中并不存在参数,需要使用此方法转化数据,获取参数
app.use(bodyParser.json({ limit: '1mb' })); //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({ //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));


/* 获取用户请求,进行相关处理 */
router.get('/', function(req, res, next) {
  res.send('此接口不返回任何有效信息!');
});

//请求的是/users/users接口才会访问到此处
router.get('/users', function(req, res, next) {
  var data = fs.readFileSync("/PersonCodes/ListPage/public/JSON/userlist.json", "utf-8");
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

// 新增用户信息
router.get('/add', function(req, res, next) {
  var data = req;
  console.log("GET:" + req.url)
  res.send(data.url);
});　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
// 　●●●●●●　　　●●●●●　　　●●●●●●　●●●●●●●●　
// 　●●●　●●●　●●●　●●●　　●●●●●●●　　　●●●　　　
// 　●●●　　●●●●●●　　●●●●●●　　●●●　　　●●●　　　
// 　●●●　　●●●●●●　　●●●●●●　　　　　　　　●●●　　　
// 　●●●　　●●●●●●　　●●●　●●●●　　　　　　●●●　　　
// 　●●●●●●●　●●●　　●●●　　　●●●●　　　　●●●　　　
// 　●●●●　　　　●●●　　●●●　　　　●●●●　　　●●●　　　
// 　●●●　　　　　●●●　　●●●●●●　　●●●　　　●●●　　　
// 　●●●　　　　　●●●　　●●●●●●　　●●●　　　●●●　　　
// 　●●●　　　　　●●●●●●●　●●●●●●●●　　　●●●　　　
// 　●●●　　　　　　　●●●●　　　　●●●●　　　　　●●●　
// POST新增用户信息
router.post('/add', function(req, res, next) {

  try {
    //NOTE:这个地方的data.body特别傻,不能直接输出,否则就报错.哪怕你输出一个object我都不会怪你
    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓就是这个错误↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    // Cannot convert object to primitive value
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
    console.log("POST:" + JSON.stringify(req.body));
    var postData = req.body;
    var model = {
        name: postData.name,
        gender: postData.gender,
        age: postData.age,
        Regtime: postData.Regtime
      }
      //  addModel
    DBhelper.addModel(model);
  } catch (err) {
    console.log(err);
  }
});



// ************************************************************************ 
// 　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
// 　　　　　　●●●　　　　　　　　　　　　　　　●●●　　　　　　　　　　　　　　　　　　　　　　　
// 　　　　　　●●●　　　　　　　　　　　●●●　●●●　　　　　　　　　●●●●●●●●●●●●　　
// 　　　　　　●●●　　　　　　　　　　　●●●　●●●　　　　　　　　　　　　　　　　　　　　　　　
// 　　　　　　●●●　　　　　　　　　　　●●●●●●●●●●●●　　　　　　　　　　　　　　　　　　
// 　　　　　　●●●　　　●●●●　　　●●●　　●●●　　　　　　　　　　　　　　　　　　　　　　　
// 　　　　　　●●●●●●●●　　　　　●●●　　●●●　　　　　　　●●●●●●●●●●●●●●●　
// 　　　●●●●●●●　　　　　　　　●●●　　　●●●　　　　　　　●●●●●●●●●●●●●●●　
// 　●●●●●●●●　　　　　　　　　　　　　　　●●●　　　　　　　　　　　　●●●　　　　　　　　
// 　　　　　　●●●　　　　　　　　●●●●●●●●●●●●●●●●　　　　　●●●　　　　　　　　　
// 　　　　　　●●●　　　　　　　　　　　　　　　●●●　　　　　　　　　　　●●●　　●●●　　　　
// 　　　　　　●●●　　　　　　　　　　　　　　　●●●　　　　　　　　　　●●●　　　●●●●　　　
// 　　　　　　●●●　　　　●●●　　　　　　　　●●●　　　　　　　　　●●●　　　　　●●●　　　
// 　　　　　　●●●　　　　●●●　　　　　　　　●●●　　　　　　　　●●●●●●●●●●●●●　　
// 　　　　　　●●●●●●●●●●　　　　　　　　●●●　　　　　　　　　●●●●　　　　　　●●●　
// 　　　　　　　　　　　　　　　　　　　　　　　　●●●　　　　　　　　　　　　　　　　　　　　　　　
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