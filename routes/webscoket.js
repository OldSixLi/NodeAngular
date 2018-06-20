/*
 * webscoket学习
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年4月20日11:06:17
 * @Last Modified by: 马少博
 * @Last Modified time:date
 */
var io = require('socket.io')();
var xssEscape = require('xss-escape');
var answer = require('../NodeCode/zhihu/answer');
var fileWatch = require('./watch');

console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
console.log("开始执行webscoket");
console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
io.on('connection', function(_socket) {
  var SOCKET = _socket;
  console.log(_socket.id + ': connection');
  // _socket.emit('mashaobo', "连接成功");
  // _socket.emit('ImgData', '\\images\\zhihu_Down\\你在哪一瞬间情绪爆发过\\336006091--0--6ce4_r.jpg');
  // _socket.emit('ImgData', '\\images\\zhihu_Down\\你在哪一瞬间情绪爆发过\\336006091--0--6ce4_r.jpg');
  // _socket.emit('ImgData', '\\images\\zhihu_Down\\你在哪一瞬间情绪爆发过\\336006091--0--6ce4_r.jpg');
  // _socket.emit('ImgData', '\\images\\zhihu_Down\\你在哪一瞬间情绪爆发过\\336006091--0--6ce4_r.jpg');
  // _socket.emit('ImgData', '\\images\\zhihu_Down\\你在哪一瞬间情绪爆发过\\336006091--0--6ce4_r.jpg');
  // _socket.emit('ImgData', '\\images\\zhihu_Down\\你在哪一瞬间情绪爆发过\\336006091--0--6ce4_r.jpg');
  //测试前台向后台传输数据
  _socket.on('mashaobotest', function(_nickname) {
    console.log('获取从前台传输的数据：' + _nickname + '***********************');
  });

  _socket.on('test', function(_nickname) {
    console.log(_nickname + _nickname + _nickname);
    // setTimeout(() => {
    // SOCKET.emit('reply', '你们好');
    // }, 2000);
  });


  // _socket.on('FileWatch', function(_nickname) {
  //   try {
  //     fileWatch.watch(_socket, _nickname);
  //   } catch (error) {}
  // });

  _socket.on('SpiderBegin', function(questionId) {
    try {

      answer.getAnswer(questionId, _socket);
    } catch (error) {
      console.log(error);
    }
  });
});

exports.listen = function(_server) {
  return io.listen(_server);
};