/*
 * 监听文件变化
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年4月27日17:19:59
 * @Last Modified by: 马少博
 * @Last Modified time:2017年4月27日17:20:02
 */


var fs = require('fs');
var path = require('path');
var timestamp = 0;

function watch(scoket, file) {
  var filePath = path.resolve(__dirname, '../public/' + file);
  fs.watch(filePath, function(event, filename) {
    console.log(getNowFormatDate() + ' 事件类型: ' + event);
    var currentTime = getNowFormatDate();
    if (filename) {
      console.log('文件发生变化: ' + filename);
      // Date.parse(new Date())
      // if (timestamp != currentTime) {
      timestamp = currentTime;
      scoket.emit('FileChange', filename);
      // }

    } else {
      console.log('filename not provided');
    }
  });
}

/**
 * 获取当前系统时间
 * 
 * @returns 自定义时间格式
 */
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    " " + date.getHours() + seperator2 + date.getMinutes() +
    seperator2 + date.getSeconds();
  return currentdate;
}

exports.watch = watch;