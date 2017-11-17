/**
 * 网易云音乐爬虫
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

var SPIDERINDEX = 1; //抓取到的数量
var PAYLISTINDEX = 0; //可用的歌单
var PAYLISTARR = [];
// getlist(1)


// async.mapLimit([1, 2, 3, 4, 5], 2, function(item, callback) {
//   setTimeout(function() {
//     clog(item, callback)
//   }, 1000);
// }, function(err, results) {
//   console.log("mapLimit:" + results);
// })
// var cindex = 1;

// function clog(item, callback) {
//   setTimeout(function() {
//     console.log(item);
//     var num = radomNum(100, 150);
//     for (var index = 0; index < 1000; index++) {
//       console.log(cindex + ":" + item + "...." + num);
//       cindex += 1;
//     }
//     callback(null, 'success')
//   }, 1000);

// }

/**
 * 生成随机数（不包含起止点）
 * 
 * @param {any} start 起点
 * @param {any} end 终点
 */
function radomNum(start, end) {
  end = start > end ? [start, start = end][0] : end; //保证End最大  
  return parseInt(Math.random() * (end - start) + start + 1);
}

function getlist(num) {
  nodegrass.get('http://music.163.com/discover/playlist/?order=hot&cat=%E5%85%A8%E9%83%A8&limit=35&offset=' + num * 35, function(data, status, headers) {
    // console.log(data);
    var $ = cheerio.load(data);

    var resultArr = $("#m-disc-pl-c #m-pl-container").find("li");
    if (resultArr.length > 0) {
      $("#m-disc-pl-c #m-pl-container").find("li").each(function(i, item) {
        var collectCount = $(this).find('.nb').text();
        var tenThousandNum = 0;
        if (collectCount.indexOf('万') > 0) {
          tenThousandNum = collectCount.split('万')[0] > 50 ? collectCount.split('万')[0] : 0;
        }
        if (tenThousandNum > 0) {
          console.log(tenThousandNum + "万");
          var listHref = "http://localhost:9999/playlist" + $(this).find(".u-cover .msk").attr("href").replace('playlist', 'detail');

          var playListObj = {
            name: "",
            collectCount: "",
            imgSrc: "",
            href: ""
          }
          var paylistUrl = $(this).find(".u-cover .msk").attr("href");
          playListObj.name = $(this).find(".u-cover .msk").attr("title").trim().replace(/[&\|\\\*^%$#@\-]/g, "");
          playListObj.collectCount = tenThousandNum;
          playListObj.imgSrc = $(this).find("img.j-flag").attr("src");
          playListObj.href = paylistUrl;
          playListObj.playId = paylistUrl.split('id=')[1];
          DbHelper.listAdd(playListObj); //数据库添加 
          //插入相关的列表数组
          PAYLISTARR.push(listHref);
        }
      });

      setTimeout(function() {
        num += 1;
        console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        console.log("第" + num + "页面");
        console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
        getlist(num);
      }, 1000)

    } else {
      console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
      console.log(PAYLISTARR.length);
      console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
      beginMusic(5);
    }
  });
}

/**
 * 开始收藏
 * 
 * @param {any} num  每次下载多少
 */
function beginMusic(asyncNum) {
  async.mapLimit(PAYLISTARR, asyncNum, function(href, callback) {
    setTimeout(function() {
      getPlayList(href + "&timestamp=" + new Date().getTime(), callback);
    }, 10000);
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      // console.log(result);<=会输出一个有2万多个“successful”字符串的数组
      console.log("全部已下载完毕！");
    }
  });
}

/**获取歌单详情
 * 
 * 
 * @param {any} href 
 * @param {any} callback 
 */
function getPlayList(href, callback) {
  var playid = href.split("?id=")[1];
  setTimeout(function() {
    nodegrass.get(href, function(data) {
      if (data && JSON.parse(data)) {
        var payListJson = JSON.parse(data);
        //存储歌曲信息进music表
        for (var songIndex = 0; songIndex < payListJson.privileges.length; songIndex++) {
          var element = payListJson.privileges[songIndex];
          var model = { id: element.id, collectid: playid, name: "", comment: "" }
          DbHelper.musicAdd(model); //数据库添加 
          console.log(payListJson.playlist.name + "第" + SPIDERINDEX + "首:" + element.id);
          SPIDERINDEX++;
        }
        callback(null, "successful !");
      } else {
        console.log("请求失败...");
      }
    });
  }, 1000);

}
getMusicList(1, 1000);
var MUSICLIST = [];

function getMusicList(pageIndex, pageNum) {
  DbHelper.getMusicList(pageIndex, pageNum, function(result) {
    if (result && result.length) {
      //如果返回结果
      for (var m = 0; m < result.length; m++) {
        var element = result[m];
        MUSICLIST.push(element);
      }
      console.log(pageIndex + "页面");
      setTimeout(function() {
        pageIndex++;
        getMusicList(pageIndex, 1000);
      }, 500);
    } else {
      //进行请求操作
      getMusic(3);
    }
  })
}

function getMusic(asyncNum) {
  console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
  console.log("开始进行请求");
  console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
  async.mapLimit(MUSICLIST, asyncNum, function(item, callback) {
    setTimeout(function() {
      getSingleMusicComment(item, callback);
    }, 1000);
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("全部已下载完毕！");
    }
  });
}
/**
 * 获取单个歌曲的评论量
 * 
 * @param {any} item 
 * @param {any} callback 
 */
function getSingleMusicComment(item, callback) {
  var musicId = item.mid; //歌曲ID
  var id = item.id; //主键
  console.log(musicId);
  setTimeout(function() {
    nodegrass.get("http://localhost:9999/comment/music?id=" + musicId + '&limit=1&offset=2', function(data) {
      item.total = JSON.parse(data).total || 0;
      DbHelper.updateMusic(item)
      callback(null, 'success');
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
      callback(null, 'success');
    })
  }, 1000);
}
// DbHelper.getHighQualityMusicList(function(result) {
//   if (result) {
//     console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
//     console.log(result.length);
//     console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
//     var list = [];
//     for (var index = 0; index < result.length; index++) {
//       var element = result[index];
//       list.push(element.mid);
//     }
//     console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
//     console.log(list.join(','));
//     console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
//   }
// });


// nodegrass.get("http://localhost:9999/login/cellphone?phone=18222603560&password=ma18222603560", function(data) {
//   if (data) {
//     var jsondata = JSON.parse(data);
//     console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
//     console.log(jsondata.profile.signature);
//     console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
//   }
// });

// nodegrass.get("http://localhost:9999/playlist/tracks?op=add&pid=909675332&tracks=208889", function(data) {
//   if (data) {
//     var jsondata = JSON.parse(data);
//     console.log(data)
//     console.log(jsondata.count);
//   }
// });