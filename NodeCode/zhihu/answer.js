/**
 * 获取知乎某个问题下的答案
 * @马少博(1030809514@qq.com)
 * @date    2016-07-05 10:38:20
 * @version 1.1.5
 */


//#region   模块引入与变量声明 
var nodegrass = require('nodegrass');
var cheerio = require('cheerio');
var https = require("https");
var fs = require("fs");
var mysql = require('mysql');
var Q = require('q');
var path = require('path');
var io = require('socket.io')();
var xssEscape = require('xss-escape');

//变量声明
var dianzan_MinCount = 0;
var errorMessage = ""; //错误信息记录
var downloadindexnum = 0; //下载图片数量
var lianxu_Count = 0; //连续没数据

//#endregion 

//#region创建当天的文件夹
// var imageFile = './public/images/zhihu_Down';
// if (!fs.existsSync(imageFile)) {
//   fs.mkdirSync(imageFile, 0777); //创建目录
//   console.log(imageFile + '文件夹已成功创建！');
// }
// var date_file = imageFile + "/" + getNowFormatDate('date');
// if (!fs.existsSync(date_file)) {
//   fs.mkdirSync(date_file, 0777); //创建目录
//   console.log(date_file + '文件夹已成功创建！');
// }
//#endregion

//#region 获取点赞数
function start(queObj) {
  var questionIdName = ""; //每个问题创建一个唯一的标识显示在输出窗口里
  var questionUrls; //当前问题的链接
  var questionId; //获取问题的ID
  if (!queObj.question_url) {
    return;
  } else {
    questionUrls = queObj.question_url;
    dianzan_MinCount = queObj.dianzan_MinCount;
    questionId = questionUrls.substr(questionUrls.lastIndexOf('/') + 1);
  }

  //验证当前问题是否已经遍历过的回调函数
  mysql.finds(questionId, function(data) {
    switch (data) {
      case 0:
        nodegrass.get(questionUrls, function(data, status, headers) {
          var $ = cheerio.load(data);
          //只获取中文字符
          var anstitle = stripscript($(data).find('title').text().trim());
          console.log('【问题】：' + questionId + '—' + anstitle.substr(0, anstitle.length - 2) + '？' + '已开始加入获取答案队列中！');
          //返回答案数
          var answer = $(data).find('#zh-question-answer-num').text();
          var ansCount = parseInt((answer.substr(0, answer.length - 4)));
          //在遍历问题下的答案时，优质答案一般不会超过20页，后期答案不再进行遍历
          if (ansCount > 200) {
            ansCount = 200;
          }
          // CircleGetAnswer(ansCount, questionId, anstitle);
        });
        break;
      default:
        console.log('当前问题已遍历过，不再遍历当前问题：' + questionId);
        break;
    }
  });
}
//#endregion 
// CircleGetAnswer(10, 24463692, "测试");


function stripscript(s) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

/**
 * 获取单个问题
 * 
 * @param {any} questionId 
 * @param {any} _socket 
 */
function GetSingleQuestion(questionId, _socket) {
  nodegrass.get('https://www.zhihu.com/question/' + questionId, function(data, status, headers) {
    var $ = cheerio.load(data);
    //只获取中文字符
    var anstitle = $(data).find('title').text().trim().replace(/[^\u4e00-\u9fa5]/gi, "");
    console.log('【问题】：' + questionId + '—' + anstitle.substr(0, anstitle.length - 2) + '？' + '已开始加入获取答案队列中！');
    //返回答案数
    var ansCount = getNum($(data).find('.List-headerText').text());
    //在遍历问题下的答案时，优质答案一般不会超过20页，后期答案不再进行遍历
    if (ansCount > 500) {
      ansCount = 500;
    }
    var filePath = path.resolve(__dirname, '../../public/images/zhihu_Down/' + questionId);
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, 0777); //创建目录
      console.log(filePath + '文件夹已成功创建！');
    }
    CircleGetAnswer(ansCount, questionId, anstitle, _socket);
  });
}

//获取纯字符串
function getNum(text) {
  var value = text.replace(/[^0-9]/ig, "");
  return value;
}




//#region 根据答案总数，循环获取答案
/**
 * 
 * @param {any} answercount 遍历的答案数量
 * @param {any} questionId 问题ID
 * @param {any} anstitle 问题名称
 */
function CircleGetAnswer(answercount, questionId, anstitle, scoket) {

  var filePath = path.resolve(__dirname, '../../public/images/zhihu_Down/' + questionId);

  //因为NodeJs是异步执行的，所以另起函数的话会导致获取不到ans，因为此时异步请求还没有相应
  //所以当前函数必须在上一个函数中被调用
  for (var jsonindex = 0; jsonindex < answercount / 10 + 1; jsonindex++) {
    (function(jsonindex) {
      getAnswer(jsonindex, questionId, anstitle)
        //NOTE:这个地方的结果是return 的，否则promise怎么返回/(ㄒoㄒ)/~~
        .then(function(data) { return parseResult(data, anstitle); })
        .then(function(data) {
          for (var j = 0; j < data.length; j++) {
            (function(j) {
              var element = data[j];
              setTimeout(function() {
                var absolute = path.resolve(__dirname, filePath) + '\\';
                startDownloadTask(scoket, element.url, absolute + element.answerid + '--' + element.imgindex + '--' + element.imgName.substr(-13), element.anstitle);
              }, 3000 * j);
            })(j);
          }
        });
    })(jsonindex);
  };

}
var imgIndexNew = 0;

//处理请求
function parseResult(data, anstitle) {
  var deferred = Q.defer();
  try {
    var obj = JSON.parse(data);
    var $ = cheerio.load(data);
    //遍历JSON操作
    if (obj.msg.length > 0) {
      var arr = obj.msg;
      // console.log($(arr[0]).find('.zm-editable-content').html());
      //#region 遍历每个答案的数据，进行对比赞数与下载 
      console.log(obj.msg.length);
      var imgArr = [];
      for (var i = 0; i < obj.msg.length; i++) {
        //获取每个答案点赞数
        var dianzan_Count = $(arr[i]).find('.count').text();
        //判断点赞数大于条件点赞数
        if (dianzan_Count >= dianzan_MinCount) {
          lianxu_Count = 0;
          //答案ID
          // $(document).find("noscript").remove().end().find("img")
          var answerid = $(arr[i]).find('.zm-item-rich-text').attr('data-entry-url');
          answerid = answerid.substr(answerid.lastIndexOf('/') + 1);
          //遍历输出
          console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
          console.log("点赞数：" + dianzan_Count + "|图片数量：" + $(arr[i]).find('.zm-editable-content').find('img').length);
          console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
          var $content = $(arr[i]).find('.zm-editable-content');
          $content.find("noscript").remove().end().find('img')
            .each(function(imgindex) {
              var url = $(this).attr('data-original');
              console.log(url);
              if (url == "//zhstatic.zhihu.com/assets/zhihu/ztext/whitedot.jpg") {
                return false; //空图片不处理
              }
              if (url != null && url != "") {
                if (url.indexOf('https')) {
                  url = "http" + url.substr(5);
                }
              } else {
                return false;
              }
              var imgName = path.basename(url);
              imgIndexNew += 1;
              //每张图片的相关信息
              var data = {
                answerid: answerid,
                imgindex: imgindex,
                imgName: imgName,
                anstitle: anstitle,
                url: url
              }
              imgArr.push(data);
            });
        } else {
          //如果连续100个答案都不符合条件
          lianxu_Count += 1;
          if (lianxu_Count > 100) {
            console.log("连续读取100条记录不符合点赞数！ (｡•ˇ‸ˇ•｡)  \r\n");
            lianxu_Count = 0;
          }
        }
      };

      // NOTE:注意了，一定是deferred.resolve,不是return deferred.resolve，啥玩意啊~！差点以为运行不了
      deferred.resolve(imgArr);
    } else {
      deferred.reject("未获取到数据");
    };
  } catch (e) {
    console.log(e + '转化JSON 失败');
    return;
  }
  return deferred.promise;
}


//#region 具体的事物操作
/**
 * 获取问题，答案JSON 函数，每次获取十条答案
 * @param {页面Index} index
 * @param {问题ID} questionId
 * @param {问题答案} anstitle
 * @returns {}
 */
function getAnswer(index, questionId, anstitle) {
  //URL地址
  var posturl = 'https://www.zhihu.com/node/QuestionAnswerListV2' +
    '?method=next&params={"url_token":' + questionId +
    ',"pagesize":10,"offset":' + index * 10 + '}';
  var deferred = Q.defer();
  try {
    nodegrass.post(
      posturl, //请求地址
      function(data, status, headers) {
        deferred.resolve(data);
      });
  } catch (e) {
    deferred.reject(e);
  }
  return deferred.promise;
}

function getHttpReqCallback(imgSrc, dirName, anstitle, scoket) {
  var callback = function(res) {
    var fileBuff = [];
    res.on('data', function(chunk) {
      var buffer = new Buffer(chunk);
      fileBuff.push(buffer);
    });
    res.on('end', function() {
      var totalBuff = Buffer.concat(fileBuff);
      fs.appendFile(dirName, totalBuff, function(err) {
        if (err) {
          console.log('路径：' + imgSrc + '获取答案出错' + err);
        } else {
          downloadindexnum += 1;
          console.log(downloadindexnum + anstitle + '：||' + dirName + '||' + imgSrc + '||download success！');
          //接口返回(图片下载成功后，输出此结果显示到前台项目中)
          scoket.emit('ImgData', dirName.substr(dirName.indexOf('public') + 6));
        }
      });
    });
  };
  return callback;
}

var startDownloadTask = function(scoket, imgSrc, dirName, anstitle) {
  if (imgSrc.indexOf('http') !== -1) { //判断是否包含完整的地址路径
    //回调
    var req = https.request(imgSrc, getHttpReqCallback(imgSrc, dirName, anstitle, scoket));
    //报错
    req.on('error', function(e) {});
    //超时
    req.setTimeout(20 * 1000, function() {
      console.log("请求 " + imgSrc + " 超时, 结束当前请求！/(ㄒoㄒ)/~~");
      fs.appendFile(dirName.substr(0, dirName.lastIndexOf('/')) + '/错误日志.txt', '请求超时：' + imgSrc + '\r\n');
      req.abort();
    })
    req.end();
  };
}

/**
 * 获取当天日期
 * @param {规定只返回日期还是返回日期时间} dates
 * @returns {}
 */
function getNowFormatDate(dates) {
  var date = new Date(),
    seperator1 = "-",
    seperator2 = ":",
    month = date.getMonth() + 1,
    strDate = date.getDate();

  if (month >= 1 && month <= 9)
    month = "0" + month;

  if (strDate >= 0 && strDate <= 9)
    strDate = "0" + strDate;
  //返回当前的日期（时间）
  var currentdate = dates !== 'date' ? date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds() : date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

exports.getAnswer = GetSingleQuestion;