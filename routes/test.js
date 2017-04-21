var scoket = require('./webscoket');
var path = require('path');
var filePath = '../public/images/zhihu_Down/awewa-好的' + '？';
var absolute = path.resolve(__dirname, filePath) + '\\';
console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
console.log(absolute);
console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");

// for (var i = 0; i < 10; i++) {
//   (function(i) {
//     setTimeout(function() {
//       scoket.send(i + '试试数据<br/>');
//     }, i * 0);
//   })(i);
// }

function test() {

}

exports.testr = test;