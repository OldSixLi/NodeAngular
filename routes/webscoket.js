/*
 * webscoket学习
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年4月20日11:06:17
 * @Last Modified by: 马少博
 * @Last Modified time:date
 */
var io = require('socket.io')();

var xssEscape = require('xss-escape');

var nickname_list = [];

function RemoveNickname(_nickname) {
  for (var i = 0; i < nickname_list.length; i++) {
    if (nickname_list[i] == _nickname)
      nickname_list.splice(i, 1);
  }
}
io.on('connection', function(_socket) {
  console.log(_socket.id + ': connection');
  _socket.emit('mashaobo', "连接成功");


  //测试前台向后台传输数据
  _socket.on('mashaobotest', function(_nickname) {
    console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
    console.log(_nickname);
    console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
  });
  // C:\Users\Administrator\Desktop\桌面文档\聊天室\public\img\qqface\1.gif

  //   for (var i = 0; i < 1000; i++) {
  //     (function(i) {
  //       setTimeout(function() {
  //         _socket.emit('ImgData', '../img/qqface/' + (i % 100 + 1) + '.gif');
  //       }, i * 100);
  //     })(i);
  //   }
  _socket.emit('ImgData', '../img/qqface/1.gif');
});

function sendData(data) {
  io.on('connection', function(_socket) {
    _socket.emit('ImgData', data);
  });
}

exports.send = function(data) {
  console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
  console.log(data);
  console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
  return sendData(data);
};

exports.listen = function(_server) {
  return io.listen(_server);
};