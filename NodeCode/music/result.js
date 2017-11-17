/**
 * 读取数据库中存储的音乐ID,完以后查询评论量大于10000的  再重新存进另外一个表(highCommentSong)
 * @returns
 */

var nodegrass = require('nodegrass');
var cheerio = require('cheerio');
var https = require("https");
var fs = require("fs");
var mysql = require('mysql');
var Q = require('q');
var path = require('path');
var io = require('socket.io')();
var xssEscape = require('xss-escape');
var DbHelper = require('F:/PersonCodes/NodeAngular项目/NodeCode/zhihu/mysql.js');
var async = require('async');
var clc = require('cli-color');


// var idlist = [423849475, 493285602, 33211676, 29947420, 28263911, 27901832, 185904, 167876, 169185, 25906124, 63650, 474567580, 439915614, 25706282, 461083054, 461347998, 32922450, 208902, 30431376, 423228325, 499274178, 29722263, 30953009, 34229234, 27759600, 472045959, 27552544, 41629793, 503207093, 4341314, 30394891, 29774609, 35847388, 37653063, 16426514, 66842, 175072, 381433, 26524510, 25718007, 308353, 501133611, 26060065, 26199445, 2001320, 185868, 368727, 438801442, 36308916, 2866921, 41500546, 29750825, 29717271, 29460377, 1696373, 31654455, 3935139, 27406244, 2529472, 4017240, 415792881, 28949843, 1217823, 3986017, 2526613, 27955658, 29761121, 413812448, 483671599, 186001, 487190408, 468517654, 466122271, 440353010, 468513829, 412902689, 27808044, 413074398, 35403523, 29814898, 65538, 185809, 5240550, 185709, 35528482, 437859519, 29431066, 428095913, 27955654, 186139, 432506809, 431357712, 27890306, 489506275, 29534449, 30064263, 30854966, 33937527, 5253801, 1934649, 4386589, 1210496, 18161816, 17194024]
// var indexNum = 0;
// for (var index = 0; index < idlist.length; index++) {
//   var element = idlist[index];
//   (function(element, index) {
//     setTimeout(function() {
//       tolist(element, index)
//     }, index * 1000);
//   })(element, index)
// }
console.log(clc.yellowBright.bgMagentaBright('Text in red'));

function tolist(element, index) {
  console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
  console.log(element + ';;' + index);
  console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
}